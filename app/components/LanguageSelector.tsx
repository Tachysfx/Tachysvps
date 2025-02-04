"use client"

import { useState, useEffect } from "react"
import Modal from "react-modal"
import { Languages, X, Globe } from 'lucide-react'

// Google Translate types
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: any, element: string): any;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}

// Set up Modal for Next.js
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const SUPPORTED_LANGUAGES = "en,en-GB,zh,hi,es,fr,ar,bn,ru,pt,ja,de,ko,it,pl,uk,ro,tr,pa,vi,ca,fa,mr,id,th,sw,he,hu,zh-TW,cs,el,sk,no,sr,hr,da,bs,ms,fi,sq"

// Modal styles
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px',
    width: '90%',
    padding: '0',
    border: 'none',
    borderRadius: '16px',
    backgroundColor: 'white',
  },
}

export default function LanguageSelector() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null
    let timeoutId: NodeJS.Timeout

    const initializeTranslate = () => {
      try {
        if (!isModalOpen) return

        // Cleanup existing elements
        const existingScript = document.querySelector('script[src*="translate.google.com"]')
        if (existingScript) {
          existingScript.remove()
        }

        const existingElement = document.getElementById('google_translate_element')
        if (existingElement) {
          existingElement.innerHTML = ''
        }

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
          try {
            if (!window.google?.translate?.TranslateElement) return

            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: SUPPORTED_LANGUAGES,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_element'
            )
          } catch (error) {
            console.error('Error initializing Google Translate:', error)
          }
        }

        // Create and add the script
        scriptElement = document.createElement('script')
        scriptElement.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        scriptElement.async = true
        document.body.appendChild(scriptElement)

      } catch (error) {
        console.error('Error in translation initialization:', error)
      }
    }

    timeoutId = setTimeout(initializeTranslate, 100)

    return () => {
      clearTimeout(timeoutId)
      
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {}
      }

      if (scriptElement?.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }

      // Cleanup Google Translate elements
      ['google_translate_element', '.goog-te-menu-frame', '.goog-te-banner-frame'].forEach(selector => {
        const element = typeof selector === 'string' 
          ? document.querySelector(selector)
          : document.getElementById(selector)
        if (element?.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [isModalOpen])

  return (
    <>
      {/* First Section - Visible on md and larger screens */}
      <div
        onClick={() => setIsModalOpen(true)} 
        className="nav-link d-flex align-items-center group d-none d-md-flex"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <Languages className="text-purple-600 w-5 h-5 me-3 group-hover:text-white" />
        <span className="me-2 cursor-pointer">Language</span>
      </div>
      
      {/* Second Section - Visible on smaller than md screens */}
      <div
        onClick={() => setIsModalOpen(true)} 
        className="nav-link d-flex align-items-center group d-md-none"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <Languages className="text-purple-600 w-8 h-7 me-3" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Language Selection Modal"
      >
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Globe className="text-purple-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Select Your Language</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-600">
                Choose your preferred language for a better experience on the platform
              </p>
              <div id="google_translate_element" className="mt-4 google-translate-container"></div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
} 