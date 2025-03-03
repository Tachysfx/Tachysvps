import {
  Home,
  Bell,
  Bot,
  Menu,
  Facebook,
  Twitter,
  Compass,
  MessageCircle // for WhatsApp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';



export default function Footer() {
  return (
    <>
        {/* Footer Section 1 */}
        <div id='footer1' className="bg-purple-800 text-light py-5">
            <footer className="container">
                <div className="row">
                    <div className="col-6 col-md-2 mb-4">
                        <h5 className='fw-bold mb-3'>Our Services</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link href="/" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Home</Link></li>
                            <li className="nav-item mb-2"><Link href="/plans/lite" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Plans & Pricing</Link></li>
                            <li className="nav-item mb-2"><Link href="/about" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Locations</Link></li>
                            <li className="nav-item mb-2"><Link href="/v6/account" className="nav-link text-light p-0 opacity-75 hover:opacity-100">My Account</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-2 mb-4">
                        <h5 className='fw-bold mb-3'>Client Menu</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link href="/market" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Algo Market</Link></li>
                            <li className="nav-item mb-2"><Link href="/partnership" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Partnerships</Link></li>
                            <li className="nav-item mb-2"><Link href="/v6/seller" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Seller</Link></li>
                            <li className="nav-item mb-2"><Link href="/contact-us" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-2 mb-4">
                        <h5 className='fw-bold mb-3'>Support/Help</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link href="/contact-us" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Support</Link></li>
                            <li className="nav-item mb-2"><Link href="/contact-us" className="nav-link text-light p-0 opacity-75 hover:opacity-100">Report Abuse</Link></li>
                            <li className="nav-item mb-2"><Link href="/#faq" className="nav-link text-light p-0 opacity-75 hover:opacity-100">FAQs</Link></li>
                            <li className="nav-item mb-2"><Link href="/about" className="nav-link text-light p-0 opacity-75 hover:opacity-100">About</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-5 offset-md-1 mb-4">
                        <form className="mb-4">
                            <h5 className='fw-bold mb-3'>Subscribe to our newsletter</h5>
                            <p className="text-light opacity-75">Get monthly exciting offers from us.</p>
                            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                <label className="visually-hidden">Email address</label>
                                <input id="newsletter1" type="email" className="form-control border-secondary" placeholder="Email address" />
                                <button className="btn btn-outline-light" type="button">Subscribe</button>
                            </div>
                        </form>
                        <div>
                            <h5 className='fw-bold mb-3'>Contact Us</h5>
                            <p className="text-light opacity-75">***, Northern Ireland, UK <br />
                            <Link className='text-light text-decoration-none hover:text-purple' href="mailto:support@tachysvps.com">support@tachysvps.com</Link></p>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between pt-4 mt-4 border-top border-secondary">
                    <div className="col-md-4 d-flex align-items-center">
                        <Link href="/" className="me-3 text-decoration-none">
                            <Image
                                src="/logo.png"
                                width={40}
                                height={40}
                                alt="Tachys VPS Logo"
                                className="d-block"
                            />
                        </Link>
                        <span className="text-light opacity-75">&copy; 2024 Tachys VPS, Inc</span>
                    </div>
                    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="ms-3"><Link href="" className="text-light opacity-75 hover:opacity-100"><Facebook size={24} /></Link></li>
                        <li className="ms-3"><Link href="" className="text-light opacity-75 hover:opacity-100"><Twitter size={24} /></Link></li>
                        <li className="ms-3"><Link href="" className="text-light opacity-75 hover:opacity-100"><MessageCircle size={24} /></Link></li>
                    </ul>
                </div>
            </footer>
        </div>

        {/* Footer Section 2 */}
        <footer className="footer fixed-bottom text-center bg-dark" id="footer2">
            <div className="contact">
                <Link className="footer-item text-decoration-none px-3 d-flex flex-column justify-content-center align-items-center group" href="/">
                    <div data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" className='d-flex flex-column justify-content-center align-items-center group'>
                        <Home className="text-purple-600 w-5 h-5 group-hover:text-white" />
                        <span className="text-sm">Home</span>
                    </div>
                </Link>
                <Link className="footer-item text-decoration-none px-3 d-flex flex-column justify-content-center align-items-center group" href="/v6/notifications">
                    <div data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" className='d-flex flex-column justify-content-center align-items-center group'>
                        <div className="position-relative">
                            <Bell className="text-purple-600 w-5 h-5 group-hover:text-white" />
                        </div>
                        <span className="text-sm">Alerts</span>
                    </div>
                </Link>
                <Link className="footer-item text-decoration-none px-3 d-flex flex-column justify-content-center align-items-center group" href="/explore">
                    <div data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" className='d-flex flex-column justify-content-center align-items-center group'>
                        <Compass className="text-purple-600 w-5 h-5 group-hover:text-white" />
                        <span className="text-sm">Explore</span>
                    </div>
                </Link>
                <Link className="footer-item text-decoration-none px-3 d-flex flex-column justify-content-center align-items-center group" href="/market">
                    <div data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" className='d-flex flex-column justify-content-center align-items-center group'>
                        <Bot className="text-purple-600 w-5 h-5 group-hover:text-white" />
                        <span className="text-sm">Market</span>
                    </div>
                </Link>
                <div className="footer-item navbar-toggler mb-0 px-3 d-flex flex-column justify-content-center align-items-center group" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
                    <Menu className="text-purple-600 w-5 h-5 group-hover:text-white" />
                    <span className="d-block text-sm mt-1">Menu</span>
                </div>
            </div>
        </footer>
    </>
  )
}
