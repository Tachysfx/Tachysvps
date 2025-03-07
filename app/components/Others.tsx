import {
    Zap, // for performance/speed (replaces faBolt)
    Check, // for checkmarks
    CircleCheck, // for feature checkmarks (replaces faCheckCircle)
    Code, // for development
    Monitor, // for display/interface
    Bot, // for automation/robots
    LineChart, // for forex & trading
    Globe, // for web hosting
    Gamepad2, // for game servers
    Database, // for database hosting
    Code2, // for development
    MonitorSmartphone, // for remote desktop
  } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Cards from './Cards';
  
import { pricing, market, support, plans2, plans3, plans4, plans5, plans6, tes1, tes2, tes3, tes4, tes5, tes6, heading, mt4, mt5, ctrader, ninjatrader, tradingview } from '../lib/links';
  

export default function Others() {
    return (
      <>
        <div className="container mb-4">
  
          <div className = "hous container col-xxl-12 px-4 my-1">
            <div className = "mee row flex-lg-row-reverse align-items-center g-5">
              <div className = "col-10 col-sm-8 col-lg-4">
                <Image
                  src="/dem.svg"
                  width={1200}
                  height={1000}
                  alt="blur"
                  className="d-block mx-auto img-fluid scale-x-[-1] max-w-[80%] lg:max-w-full"
                  priority
                />
              </div>
              <div className = "col-lg-8">
                <h1 className="mb-3 text-center text-lg-start">Power Your Online Operations with <span className="text-purple">Tachys VPS</span></h1>
                <p className="fs-5 fw-light text-center text-lg-start">Experience lightning-fast, reliable VPS hosting for trading, development, business, and more.</p>
                <div className = "text-center">
                  <Link href= {pricing} type="button" className="btn btn-purple px-4 mx-2 mb-2">Launch VPS</Link>
                  <Link href= {market} type="button" className="btn btn-outline-purple px-4 mx-2 mb-2">Visit Algo Market</Link>
                </div>
              </div>
            </div>
          </div>
  
          <Cards />
  
          <div className="one my-5 py-4 rounded-3">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="section-heading text-center">
                  <h4 className="display-6 fw-bold mb-4">
                    How <em className='text-purple'>Tachys VPS</em> Can Save You 
                    <div className="mt-2">Thousands of Dollars</div>
                  </h4>
                  <Image
                    src={heading}
                    width={80}
                    height={6}
                    alt="Decorative heading underline"
                    className="mx-auto mb-4"
                  />
                  <p className="text-muted mb-4 px-4">
                    Tachys VPS keeps your operations running 24/7 with ultra-low latency, high uptime, and powerful automation. Whether you're trading, hosting, or building something unique, our robust infrastructure saves you money by eliminating costly downtime and inefficiencies.
                  </p>
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <Link 
                      href="/plans/basic" 
                      className="btn btn-purple px-5 py-3 fw-semibold shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="versatility-section py-8 py-lg-12 bg-gradient-to-b from-purple-50 to-white">
            <div className="container">
              <div className="text-center mb-6 mb-lg-8 px-3">
                <span className="text-purple-600 text-sm font-semibold tracking-wider uppercase mb-2 d-block">
                  Multipurpose Solutions
                </span>
                <h2 className="display-6 fw-bold mb-3">One Platform, <span className="text-purple">Endless Possibilities</span></h2>
                <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
                  Tachys VPS powers your applications with enterprise-grade infrastructure, whether you're a developer, gamer, trader, or business owner.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="card h-100 border-0 bg-purple text-white shadow-lg rounded-4 p-3 p-lg-4">
                    <div className="card-body">
                      <h3 className="h4 mb-3">Why Choose Us?</h3>
                      <ul className="list-unstyled mb-4">
                        <li className="mb-2 d-flex align-items-center">
                          <Check className="me-2 h-5 w-5" /> 99.99% Uptime
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <Check className="me-2 h-5 w-5" /> Global Network
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <Check className="me-2 h-5 w-5" /> 24/7 Support
                        </li>
                      </ul>
                      <Link href={pricing} className="btn btn-light btn-sm px-4">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="row g-3 g-lg-4">
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <Globe className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Web Hosting</h4>
                        </div>
                        <p className="text-muted small mb-0">Host websites with exceptional performance.</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <LineChart className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Trading</h4>
                        </div>
                        <p className="text-muted small mb-0">Ultra-low latency trade execution.</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <Gamepad2 className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Game Servers</h4>
                        </div>
                        <p className="text-muted small mb-0">Low-latency gaming experience.</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <Database className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Databases</h4>
                        </div>
                        <p className="text-muted small mb-0">Secure database hosting solutions.</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <Code2 className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Development</h4>
                        </div>
                        <p className="text-muted small mb-0">Perfect dev & test environments.</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="card h-100 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-4 p-2 p-lg-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="p-2 bg-purple-100 rounded-circle me-2">
                            <Bot className="text-purple h-5 w-5" />
                          </div>
                          <h4 className="h6 fw-bold mb-0">Automation</h4>
                        </div>
                        <p className="text-muted small mb-0">Reliable automated operations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href={pricing} className="btn btn-purple px-4 me-2">
                  Start Now
                </Link>
                <Link href={support} className="btn btn-outline-purple px-4">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
  
          <div className="features-section my-4 my-lg-5">
            <div className="container px-3">
              <h3 className="text-center display-6 text-purple fw-bold mb-4">Why Choose Tachys VPS?</h3>
              <div className="row g-3 g-lg-4">
                <div className="col-md-6 col-lg-4">
                  <div className="feature-card text-center p-3 p-lg-4 rounded shadow-lg bg-white h-100">
                    <div className="d-flex justify-content-center">
                      <CircleCheck className="text-purple h-12 w-12 mb-3" />
                    </div>
                    <h5 className="fw-bold">High Performance</h5>
                    <p className="text-muted">Enjoy ultra-fast speeds, low latency, and reliable uptime.</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="feature-card text-center p-3 p-lg-4 rounded shadow-lg bg-white h-100">
                    <div className="d-flex justify-content-center">
                      <CircleCheck className="text-purple h-12 w-12 mb-3" />
                    </div>
                    <h5 className="fw-bold">24/7 Support</h5>
                    <p className="text-muted">Our team is here to assist you anytime, day or night.</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="feature-card text-center p-3 p-lg-4 rounded shadow-lg bg-white h-100">
                    <div className="d-flex justify-content-center">
                      <CircleCheck className="text-purple h-12 w-12 mb-3" />
                    </div>
                    <h5 className="fw-bold">Secure & Reliable</h5>
                    <p className="text-muted">Your data is protected with top-notch security measures.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid py-5" id="use-cases">
            <div className="container">
              <div className="text-center mb-2">
                <h3 className="display-6 fw-bold text-purple mb-3">Perfect For Your Needs</h3>
                <div className="w-50 mx-auto">
                  <p className="text-muted">Discover how Tachys VPS can power your applications and services</p>
                </div>
              </div>
  
              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <LineChart className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Forex & Trading</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">24/7 Trading Operations</h5>
                      <p className="text-muted mb-0">Run trading bots, algorithms, and platforms with ultra-low latency and reliable execution</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Globe className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Web Hosting</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Powerful Web Applications</h5>
                      <p className="text-muted mb-0">Host websites, web apps, and e-commerce platforms with exceptional performance</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Gamepad2 className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Game Servers</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Low-Latency Gaming</h5>
                      <p className="text-muted mb-0">Host multiplayer game servers with minimal lag and maximum uptime</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Database className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Database Hosting</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Secure Data Management</h5>
                      <p className="text-muted mb-0">Host databases with automated backups, high availability, and robust security</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Code2 className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Development</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Dev & Testing Environment</h5>
                      <p className="text-muted mb-0">Perfect for development, testing, and CI/CD pipeline deployment</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <MonitorSmartphone className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Remote Desktop</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Virtual Workspace</h5>
                      <p className="text-muted mb-0">Access powerful computing resources from any device, anywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scrolling-container">
            <div className='text-center'>
              <h3 className='text-purple fw-bold display-6'>Compatible with the Trading Platforms You Love</h3>
            </div>
            <div className="scrolling-track">
              <Image
                src={mt4}
                width={319}
                height={100}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={mt5}
                width={319}
                height={85}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={ctrader}
                width={301}
                height={71}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={ninjatrader}
                width={483}
                height={62}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={tradingview}
                width={406}
                height={70}
                alt="blur"
                className="mx-5"
              />
              <span className='mx-5'>.</span>
              <Image
                src={mt4}
                width={319}
                height={100}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={mt5}
                width={319}
                height={85}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={ctrader}
                width={301}
                height={71}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={ninjatrader}
                width={483}
                height={62}
                alt="blur"
                className="mx-5"
              />
              <Image
                src={tradingview}
                width={406}
                height={70}
                alt="blur"
                className="mx-5"
              />
            </div>
          </div>
  
          <div className="my-8 overflow-hidden">
            <div className="container">
              <div className="row align-items-center py-12 px-4">
                <div className="col-lg-7 pe-lg-5">
                  <h3 className="display-6 fw-bold text-purple mb-4 text-center text-lg-start">
                    Cloud Servers Built for Optimal Performance
                  </h3>
                  <p className="text-muted text-gray-600 mb-5">
                    Experience ultra-low latency and seamless performance with our enterprise-grade cloud infrastructure.
                  </p>
  
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">Ultra-Fast Performance</h5>
                          <p className="text-muted mb-0">1ms execution speed</p>
                        </div>
                      </div>
  
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">Global Coverage</h5>
                          <p className="text-muted mb-0">200+ server locations worldwide</p>
                        </div>
                      </div>
  
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">24/7 Support</h5>
                          <p className="text-muted mb-0">Technical assistance anytime</p>
                        </div>
                      </div>
                    </div>
  
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">99.9% Uptime</h5>
                          <p className="text-muted mb-0">Guaranteed reliability</p>
                        </div>
                      </div>
  
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">Flexible Resources</h5>
                          <p className="text-muted mb-0">Easily scale CPU, RAM & storage</p>
                        </div>
                      </div>
  
                      <div className="feature-item d-flex align-items-start mb-4 p-3 rounded-3 border-1 border-success hover:bg-purple-50 transition-colors shadow-lg bg-white">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-purple-200 rounded-circle shadow-sm">
                            <Check className="text-purple w-5 h-5" />
                          </div>
                        </div>
                        <div className="ms-4">
                          <h5 className="mb-2 fw-bold">Free Algo Market</h5>
                          <p className="text-muted mb-0">Access trading bots & EAs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-5 mt-5 mt-lg-0">
                  <div className="position-relative">
                    <div className="bg-purple-100 rounded-circle position-absolute" style={{width: "400px", height: "400px", top: "-20px", right: "-20px"}}></div>
                    <Image
                      src="/amico.svg"
                      width={700}
                      height={700}
                      alt="Cloud Server Illustration"
                      className="position-relative"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="two my-4">
            <div className="row">
              <div className="col-lg-3 mb-2">
                <div className="service-item first-service">
                  <div className="icon"></div>
                  <h4 className="fw-bold">Low Latency</h4>
                  <p className="fs-6">Enjoy lightning-fast response times with servers strategically located for optimal performance.</p>
                  <div className="text-button">
                    <Link className='text-purple fw-semibold' href={pricing}>Choose a plan</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="service-item second-service">
                  <div className="icon"></div>
                  <h4 className="fw-bold">High Uptime</h4>
                  <p className="fs-6">Stay online 24/7 with near-perfect uptime, ensuring uninterrupted performance for all your critical operations.</p>
                  <div className="text-button">
                    <Link className='text-purple fw-semibold' href={pricing}>Choose a plan</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="service-item third-service">
                  <div className="icon"></div>
                  <h4 className="fw-bold">Security</h4>
                  <p className="fs-6">Your data is safe with top-notch encryption, firewalls and protection from online threats. Trade with peace of mind.</p>
                  <div className="text-button">
                    <Link className='text-purple fw-semibold' href={pricing}>Choose a plan</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="service-item fourth-service">
                  <div className="icon"></div>
                  <h4 className="fw-bold">24/7 Help & Support</h4>
                  <p className="fs-6">You&apos;ve got a question or an issue? We&apos;re here around the clock to keep your trading smooth and stress free.</p>
                  <div className="text-button">
                    <Link className='text-purple fw-semibold' href={support}>Contact Suoport</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div id="about" className="section my-5 py-5">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="pe-lg-5 text-center text-lg-start">
                    <h3 className="display-6 mb-4">
                      Every <span className="text-purple fw-bold">Forex Trader</span> needs
                      <br/><span className="text-purple fw-bold">Tachys VPS</span>
                    </h3>
                    <Image
                      src={heading}
                      width={70}
                      height={5}
                      alt="Decorative heading"
                      className="mb-4 mx-auto lg:mx-0"
                    />
                    <p className="text-muted mb-5">
                      Dominate Forex trading with Tachys VPS - Lightning-fast execution, unbeatable uptime, 24/7 support and tailored solutions.
                    </p>
                    
                    <div className="row g-4 mb-5">
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex-shrink-0 me-3">
                            <div className="p-2 bg-opacity-10 rounded-circle">
                              <CircleCheck className="text-purple text-2xl" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1 text-purple">200+ Locations</h5>
                            <p className="mb-0 text-muted small">Trade from any data-centers location</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex-shrink-0 me-3">
                            <div className="p-2 bg-opacity-10 rounded-circle">
                              <CircleCheck className="text-purple text-2xl" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1 text-purple">Fast Setup</h5>
                            <p className="mb-0 text-muted small">Less than 3mins setup</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex-shrink-0 me-3">
                            <div className="p-2 bg-opacity-10 rounded-circle">
                              <CircleCheck className="text-purple text-2xl" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1 text-purple">Custom Configs</h5>
                            <p className="mb-0 text-muted small">Tailor your setup to your taste</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center p-3 bg-white rounded-3 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex-shrink-0 me-3">
                            <div className="p-2 bg-opacity-10 rounded-circle">
                              <CircleCheck className="text-purple text-2xl" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1 text-purple">Performance</h5>
                            <p className="mb-0 text-muted small">Smooth trading, easy upgrades</p>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <div className="text-center text-sm-start">
                      <p className="mb-4">
                        Invest in your trading success - choose a <span className="text-purple fw-bold">Tachys VPS</span> plan for premium speed, uptime and unmatched reliability
                      </p>
                      <Link href={pricing} className="btn btn-purple btn-lg px-4 me-3">
                        Start at $34/month
                      </Link>
                      <small className="text-muted">*No hidden charges</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6 mt-5 mt-lg-0">
                  <div className="position-relative">
                    <Image
                      src="/bro.svg"
                      width={600}
                      height={450}
                      alt="Trading dashboard"
                      className="img-fluid scale-x-[-1]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div id="pricing" className="container px-3 px-lg-4">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="section-heading text-center">
                  <h3 className="display-6 mb-4">
                      We Offer The Best <em className="text-purple fw-bold">Value</em> For Your Money
                  </h3>
                  <Image  
                      src={heading}  
                      width={80}  
                      height={6}  
                      alt="Decorative heading underline"  
                      className="mx-auto mb-4"  
                  />
                  <p className="text-muted">
                      Powerful, feature-rich VPS plans at unbeatable prices—designed for businesses, developers, and traders alike.
                  </p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="card-header py-4 bg-gradient-to-r from-purple-600 to-purple-800 border-0 rounded-top-4 text-center">
                      <h4 className="my-0 fw-normal text-white">Lite</h4>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$34<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          4 vCPU Cores
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          4GB RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          100GB NVMe/400GB SSD
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows Server 2022
                        </li>
                      </ul>
                      <Link href={plans2} className="btn btn-lg btn-purple hover:opacity-90 transition-opacity duration-300">
                        Launch VPS
                      </Link>
                    </div>
                  </div>
                </div>
  
                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 scale-105">
                    <div className="position-relative">
                      <div className="card-header py-4 bg-gradient-to-r from-purple-700 to-purple-900 border-0 rounded-top-4 text-center">
                        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-warning text-dark px-3 py-2" style={{ marginTop: '-4px' }}>Most Popular</span>
                        <h4 className="my-0 fw-normal text-white">Basic</h4>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$48<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          6 vCPU Cores
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          16GB RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          200GB NVMe/400GB SSD
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows Server 2022
                        </li>
                      </ul>
                      <Link href={plans3} className="btn btn-lg btn-purple hover:opacity-90 transition-opacity duration-300">
                        Launch VPS
                      </Link>
                    </div>
                  </div>
                </div>
  
                <div className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="card-header py-4 bg-gradient-to-r from-purple-600 to-purple-800 border-0 rounded-top-4 text-center">
                      <h4 className="my-0 fw-normal text-white">Standard</h4>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$80<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          8 vCPU Cores
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          24GB RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          300GB NVMe/1.2TB SSD
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows Server 2022
                        </li>
                      </ul>
                      <Link href={plans4} className="btn btn-lg btn-purple hover:opacity-90 transition-opacity duration-300">
                        Launch VPS
                      </Link>
                    </div>
                  </div>
                </div>
  
                <div className="col-md-6 col-lg-4 mt-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="card-header py-4 bg-gradient-to-r from-purple-600 to-purple-800 border-0 rounded-top-4 text-center">
                      <h4 className="my-0 fw-normal text-white">Ultra</h4>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$130<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          12 vCPU Cores
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          48GB RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          400GB NVMe/1.8TB SSD
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows Server 2022
                        </li>
                      </ul>
                      <Link href={plans5} className="btn btn-lg btn-purple hover:opacity-90 transition-opacity duration-300">
                        Launch VPS
                      </Link>
                    </div>
                  </div>
                </div>
  
                <div className="col-md-6 col-lg-4 mt-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="card-header py-4 bg-gradient-to-r from-purple-600 to-purple-800 border-0 rounded-top-4 text-center">
                      <h4 className="my-0 fw-normal text-white">Dedicated Server</h4>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$250<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          3 Physical Cores AMD EPYC
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          24GB RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          180GB NVMe
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows Server 2022
                        </li>
                      </ul>
                      <Link href={plans6} className="btn btn-lg btn-purple hover:opacity-90 transition-opacity duration-300">
                        Launch VPS
                      </Link>
                    </div>
                  </div>
                </div>
  
                <div className="col-md-6 col-lg-4 mt-3">
                  <div className="card h-100 rounded-4 shadow-sm border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="card-header py-4 bg-gradient-to-r from-purple-600 to-purple-800 border-0 rounded-top-4 text-center">
                      <h4 className="my-0 fw-normal text-white">Custom</h4>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h1 className="card-title pricing-card-title mb-4 text-purple text-center">$~<small className="text-muted fw-light">/mo</small></h1>
                      <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Zap className="text-purple w-5 h-5" />
                          </span>
                          Customizable vCPU
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Code className="text-purple w-5 h-5" />
                          </span>
                          Customizable RAM
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Monitor className="text-purple w-5 h-5" />
                          </span>
                          Customizable Storage
                        </li>
                        <li className="py-2 border-bottom d-flex align-items-center gap-2">
                          <span className="badge bg-purple-100 text-purple p-2 rounded-circle">
                            <Bot className="text-purple w-5 h-5" />
                          </span>
                          Windows/Mac/Linux
                        </li>
                      </ul>
                      <Link href="/contact-us" className="btn btn-lg btn-outline-purple transition-colors duration-300">
                        Contact us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div id="testimonialsCarousel" className="carousel slide mb-5 py-4 py-lg-5 rounded-4">
            <div className="text-center mb-4 px-3">
              <h3 className="display-6 mb-3 text-purple fw-bold">What Our Customers Say</h3>
              <p className="text-muted">Trusted by developers, businesses, and professionals worldwide</p>
            </div>
  
            <div className="carousel-inner container px-3">
              <div className="carousel-item active">
                <div className="card border-0 p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes2}
                        width={120}
                        height={120}
                        alt="Sarah Williams"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Sarah Williams</h5>
                      <p className="text-muted small mb-0 text-center">Web Developer, Toronto</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Tachys VPS has been perfect for hosting our client websites. The performance is outstanding, and the development environment setup was a breeze!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes3}
                        width={120}
                        height={120}
                        alt="Michael Brown"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Michael Brown</h5>
                      <p className="text-muted small mb-0 text-center">E-commerce Owner, London</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Our online store has never performed better. The reliability and speed of Tachys VPS have significantly improved our customer experience.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes1}
                        width={120}
                        height={120}
                        alt="Denil Kumar"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Denil Kumar</h5>
                      <p className="text-muted small mb-0 text-center">Game Server Admin, Mumbai</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Running game servers on Tachys VPS has been fantastic. Low latency, great uptime, and the support team is always there when needed.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes4}
                        width={120}
                        height={120}
                        alt="Victoria Genesis"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Victoria Genesis</h5>
                      <p className="text-muted small mb-0 text-center">DevOps Engineer, Sydney</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;The flexibility and performance of Tachys VPS make it perfect for our CI/CD pipelines and testing environments. Deployment is seamless!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes5}
                        width={120}
                        height={120}
                        alt="Maria Gonzalez"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Maria Gonzalez</h5>
                      <p className="text-muted small mb-0 text-center">Digital Agency Owner, Madrid</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Managing multiple client projects is effortless with Tachys VPS. The scalability and resource management tools are exceptional!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-3 p-lg-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-3 g-lg-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes6}
                        width={120}
                        height={120}
                        alt="Mariam Al-Farsi"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Mariam Al-Farsi</h5>
                      <p className="text-muted small mb-0 text-center">Database Administrator, Dubai</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;The backup features and security measures are top-notch. Perfect for hosting critical database systems with confidence.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#testimonialsCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon bg-purple rounded-circle p-3" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#testimonialsCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon bg-purple rounded-circle p-3" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
  
            <div className="carousel-indicators mt-4">
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="0" className="active bg-purple" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="1" className="bg-purple" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="2" className="bg-purple" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="3" className="bg-purple" aria-label="Slide 4"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="4" className="bg-purple" aria-label="Slide 5"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="5" className="bg-purple" aria-label="Slide 6"></button>
            </div>
          </div>
  
          <div className="px-3 px-lg-4 mt-5 text-start bg-white" id='faq'>
            <div className="max-w-6xl mx-auto py-8 py-lg-16">
              <h1 className="text-3xl text-lg-4xl text-purple font-bold text-center mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 text-center mb-8 mb-lg-12 max-w-2xl mx-auto px-2">
                Find answers to common questions about Tachys VPS and our services.
              </p>
              <div className="space-y-1">
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What can I use Tachys VPS for?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Tachys VPS is versatile and can be used for various purposes:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li><span className="font-medium text-gray-800">Web Hosting:</span> Host websites, web applications, and e-commerce platforms with reliable performance.</li>
                        <li><span className="font-medium text-gray-800">Development & Testing:</span> Create development environments, test applications, or run CI/CD pipelines.</li>
                        <li><span className="font-medium text-gray-800">Trading & Finance:</span> Run trading platforms, algorithmic trading bots, and financial analysis tools.</li>
                        <li><span className="font-medium text-gray-800">Game Servers:</span> Host multiplayer game servers with low latency.</li>
                        <li><span className="font-medium text-gray-800">Remote Desktop:</span> Access a powerful Windows or Linux environment from anywhere.</li>
                        <li><span className="font-medium text-gray-800">Database Hosting:</span> Run database servers for your applications with high availability.</li>
                      </ul>
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">Which VPS plan should I choose?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      The right plan depends on your specific needs:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li><span className="font-medium text-gray-800">Basic Plan:</span> Perfect for personal websites, development environments, or light applications.</li>
                        <li><span className="font-medium text-gray-800">Standard Plan:</span> Ideal for business websites, medium-traffic applications, or running multiple services.</li>
                        <li><span className="font-medium text-gray-800">Ultra Plan:</span> Suitable for high-traffic websites, resource-intensive applications, or enterprise solutions.</li>
                        <li><span className="font-medium text-gray-800">Dedicated Server:</span> For maximum performance, complete control, and specialized requirements.</li>
                        <li><span className="font-medium text-gray-800">Custom Solutions:</span> Available for unique requirements with tailored specifications.</li>
                      </ul>
                      <p className="mt-4">Our support team can help you choose the perfect plan based on your specific use case and requirements.</p>
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What operating systems do you support?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      We support a wide range of operating systems including Windows Server, Ubuntu, CentOS, Debian, and other popular Linux distributions. Custom OS installations are also available upon request for specific needs.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">How reliable is your service?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      We maintain 99.99% uptime with enterprise-grade infrastructure, redundant systems, and 24/7 monitoring. Our data centers are equipped with backup power, cooling systems, and multiple network connections to ensure continuous operation of your services.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">How secure is Tachys VPS?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Security is our top priority. Tachys VPS uses industry-standard encryption to protect your data, robust firewalls to prevent unauthorized access, and advanced DDoS protection to safeguard against attacks. With regular updates and monitoring, we provide a secure environment for all your services.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">Can I upgrade my plan later?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Yes, our plans are fully scalable. As your needs or resource requirements grow, you can easily upgrade to a higher plan without downtime. This ensures that your VPS always matches your needs, from basic to professional levels.
                    </div>
                  </details>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What technical support do you provide?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Our technical support includes:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li>24/7 customer support via ticket system, live chat, and email</li>
                        <li>Server monitoring and proactive issue resolution</li>
                        <li>Assistance with initial setup and configuration</li>
                        <li>Basic troubleshooting and problem resolution</li>
                        <li>Regular system maintenance and updates</li>
                        <li>Migration assistance for existing services</li>
                      </ul>
                    </div>
                  </details>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What backup options are available?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      We offer comprehensive backup solutions including:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li>Automated daily backups of your entire VPS</li>
                        <li>Optional weekly and monthly backup retention</li>
                        <li>Manual backup creation on demand</li>
                        <li>Easy restore options through control panel</li>
                        <li>Off-site backup storage for disaster recovery</li>
                      </ul>
                      Additional backup storage and retention periods are available as add-on services.
                    </div>
                  </details>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What network features do you offer?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Our network infrastructure includes:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li>High-speed network with multiple Tier-1 providers</li>
                        <li>DDoS protection included on all plans</li>
                        <li>Multiple data center locations worldwide</li>
                        <li>IPv4 and IPv6 support</li>
                        <li>Configurable firewall rules</li>
                        <li>Optional dedicated IP addresses</li>
                        <li>Virtual private network (VPN) compatibility</li>
                      </ul>
                    </div>
                  </details>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">How quickly can I get started?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Most VPS instances are provisioned within minutes after payment confirmation. The setup process includes:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li>Instant account creation</li>
                        <li>Automated OS installation</li>
                        <li>Access credentials delivered via email</li>
                        <li>Ready-to-use control panel access</li>
                      </ul>
                      For custom configurations or migrations, our team will provide an estimated timeline based on your specific requirements.
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </>
    )
}