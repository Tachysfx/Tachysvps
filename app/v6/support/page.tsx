"use client"

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faEnvelope, faPhone, 
  faComments, faQuestionCircle, faClock, faHeart  
} from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify"
import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import { db } from '../../functions/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Array<{ id: string; title: string; content: string }>>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedArticles = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          const content = data.content || '';
          const lines = content.split('\n');
          const firstLine = lines[0].trim();
          
          if (firstLine.startsWith('*')) {
            const title = firstLine.slice(1).trim().split(' ').slice(0, 18).join(' ');
            return {
              id: doc.id,
              title,
              content: content.substring(content.indexOf('\n') + 1).trim()
            };
          }
          return null;
        })
        .filter(article => article !== null);

      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to fetch articles');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8 mb-5">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 py-12 px-4 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-gray-100 max-w-2xl mx-auto text-center text-lg">
          Search our knowledge base, submit a ticket, or contact our 24/7 support team
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-3xl mx-auto mb-12">
          <h4 className="text-xl font-semibold text-purple-600 mb-4">
            {filteredArticles.length > 0 ? 'Search Results' : `No results found for "${searchQuery}"`}
          </h4>
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/explore?post=${article.id}`}
                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-start">
                  <FontAwesomeIcon 
                    icon={faQuestionCircle} 
                    className="text-purple-500 mt-1 mr-3"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">{article.title}</h5>
                    <p className="text-gray-600">
                      {article.content.length > 150 
                        ? `${article.content.substring(0, 150)}...` 
                        : article.content}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Updated Contact Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
          <div className="mb-8">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Send Message
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              We typically respond within 10-30 Minutes
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          {/* Desktop View */}
          <div className="">
            <div className="d-flex justify-content-center mb-6 p-3 pb-0 text-purple-800 bg-purple-100 border-2 border-purple-800 rounded-2xl">
              <FontAwesomeIcon icon={faComments} className="text-2xl mr-2" />
              <h4 className="text-xl font-semibold">Contact Us</h4>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="text-purple-500 text-2xl mt-1 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">24/7 Support</h5>
                  <p className="text-gray-600 mb-1 mx-0">Our team is here to help you anytime</p>
                </div>
              </div>

              <div className="flex items-start">
                <FontAwesomeIcon icon={faEnvelope} className="text-purple-500 text-2xl mt-1 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Email Support</h5>
                  <Link href="mailto:support@tachysvps.com" className="text-purple-600 hover:text-purple-700">
                    support@tachysvps.com
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <FontAwesomeIcon icon={faPhone} className="text-purple-500 text-2xl mt-1 mr-3" />
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Phone Support</h5>
                  <p className="text-gray-600">+44 2890 ***</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl mt-6">
                <h5 className="font-medium text-purple-600 mb-2">Average Response Times</h5>
                <ul className="space-y-2 text-sm text-gray-600 pl-0">
                  <li>• Email Support: Within 5 mins</li>
                  <li>• Phone Support: Immediate</li>
                  <li>• Ticket System: Immediate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;