import {
    Zap, // for performance/speed (replaces faBolt)
    Check, // for checkmarks
    CircleCheck, // for feature checkmarks (replaces faCheckCircle)
    Code, // for development
    Monitor, // for display/interface
    Bot, // for automation/robots
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
                className="d-block mx-lg-auto img-fluid scale-x-[-1]"
                />
              </div>
              <div className = "col-lg-8">
                <h1 className = " mb-3">Power Your Forex Trading with <span className='text-purple'>Tachys VPS</span></h1>
                <p className="fs-5 fw-light">Enjoy lightning-fast, reliable vps hosting designed specifically for Forex traders.</p>
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
                    Tachys VPS minimizes slippage, prevents downtime losses, and ensures fast execution while offering thousands of free trading bots, algos and EAs in our Algo Market to boost your strategies
                  </p>
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <Link 
                      href={market} 
                      className="btn btn-purple px-5 py-3 fw-semibold shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      Explore Algo Market
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="features-section my-5">
            <div className="container">
              <h3 className="text-center display-6 text-purple fw-bold mb-4">Why Choose Tachys VPS?</h3>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <div className="feature-card text-center p-4 rounded shadow-lg bg-white">
                    <div className="d-flex justify-content-center">
                      <CircleCheck className="text-purple h-12 w-12 mb-3" />
                    </div>
                    <h5 className="fw-bold">High Performance</h5>
                    <p className="text-muted">Experience ultra-fast execution and minimal latency.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="feature-card text-center p-4 rounded shadow-lg bg-white">
                    <div className="d-flex justify-content-center">
                      <CircleCheck className="text-purple h-12 w-12 mb-3" />
                    </div>
                    <h5 className="fw-bold">24/7 Support</h5>
                    <p className="text-muted">Our team is here to assist you anytime, day or night.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="feature-card text-center p-4 rounded shadow-lg bg-white">
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
  
          <div className="scrolling-container">
            <div className='text-center'>
              <h3 className='text-purple fw-bold display-6'>Compatible with the Trading Platforms You Love</h3>
            </div>
            <div className="scrolling-track">
              {/* <!-- Add your images here --> */}
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
              {/* <!-- Duplicate images for smooth looping --> */}
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
                  <h3 className="display-6 fw-bold text-purple mb-4">
                    Cloud Servers Built for Traders
                  </h3>
                  <p className="text-muted text-gray-600 mb-5">
                    Experience ultra-low latency and seamless trading with our enterprise-grade cloud infrastructure
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
                          <p className="text-muted mb-0">1ms trade execution speed</p>
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
                  <p className="fs-6">Faster trade execution means better profits. Our servers are close to trading hubs for lightning-quick response times.</p>
                  <div className="text-button">
                    <Link className='text-purple fw-semibold' href={pricing}>Choose a plan</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mb-2">
                <div className="service-item second-service">
                  <div className="icon"></div>
                  <h4 className="fw-bold">High Uptime</h4>
                  <p className="fs-6">Trade 24/7 without worry. Our VPS guarantees near-perfect uptime, so you never miss a trade.</p>
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
                  <div className="pe-lg-5">
                    <h3 className="display-6 mb-4">
                      Every <span className="text-purple fw-bold">Forex Trader</span> needs
                      <br/><span className="text-purple fw-bold">Tachys VPS</span>
                    </h3>
                    <Image
                      src={heading}
                      width={70}
                      height={5}
                      alt="Decorative heading"
                      className="mb-4"
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
  
          <div id="pricing" className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="section-heading text-center">
                  <h3 className="display-6 mb-4">
                    We Have The Best <em className="text-purple fw-bold">Prices</em> You Can Get
                  </h3>
                  <Image
                    src={heading}
                    width={80}
                    height={6}
                    alt="Decorative heading underline"
                    className="mx-auto mb-4"
                  />
                  <p className="text-muted">
                    Affordable plans designed for traders — Tachys VPS offers top features at the lowest market rates.
                  </p>
                </div>
              </div>
              <div className="row mt-4">
                {/* Lite Plan */}
                <div className="col-md-4 my-2">
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
  
                {/* Basic Plan - Featured */}
                <div className="col-md-4 my-2">
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
  
                {/* Standard Plan */}
                <div className="col-md-4 my-2">
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
  
                {/* Ultra Plan */}
                <div className="col-md-4 my-2">
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
  
                {/* Dedicated Server Plan */}
                <div className="col-md-4 my-2">
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
  
                {/* Custom Plan */}
                <div className="col-md-4 my-2">
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
  
          <div className="container-fluid py-5" id="use-cases">
            <div className="container">
              <div className="text-center mb-2">
                <h3 className="display-6 fw-bold text-purple mb-3">Perfect For Your Trading Style</h3>
                <div className="w-50 mx-auto">
                  <p className="text-muted">Discover how Tachys VPS can enhance your trading experience</p>
                </div>
              </div>
  
              <div className="row g-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Bot className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Forex Automation</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Run Algos, Bots and EAs</h5>
                      <p className="text-muted mb-0">Achieve 24/7 automated trading with ultra-reliable, low-latency servers for precise execution</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Zap className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">HFT Trading</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Lightning-Fast Execution</h5>
                      <p className="text-muted mb-0">Tachys VPS ensures minimal slippage and ultra-low latency for time-sensitive trading strategies</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Monitor className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Multi-Platform</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Trade Anywhere, Anytime</h5>
                      <p className="text-muted mb-0">Access your trading platforms on any device with secure and uninterrupted connections</p>
                    </div>
                  </div>
                </div>
  
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-4 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="p-3 bg-purple bg-opacity-10 rounded-circle me-3">
                        <Code className="text-white w-8 h-8" />
                      </div>
                      <h3 className="h5 fw-bold mb-0">Algo Development</h3>
                    </div>
                    <div>
                      <h5 className="text-purple mb-3 fs-6">Test & Deploy Strategies</h5>
                      <p className="text-muted mb-0">Use our Algo Market to test, refine and deploy Forex algorithms effortlessly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div id="testimonialsCarousel" className="carousel slide carousel-fade mb-5 py-5 rounded-4 pointer-event" data-bs-ride="carousel">
            <div className="text-center mb-2">
              <h3 className="display-6 mb-3 text-purple fw-bold">What Our Customers Say</h3>
              <p className="text-muted">
                Trusted by thousands of traders worldwide
              </p>
            </div>
  
            <div className="carousel-inner container">
              {/* Testimonial 1 */}
              <div className="carousel-item active">
                <div className="card border-0 p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes2}
                        width={120}
                        height={120}
                        alt="Sarah Williams"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Sarah Williams</h5>
                      <p className="text-muted small mb-0 text-center">Toronto, Canada</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Tachys VPS has been a game-changer for my Forex trading. The low latency has significantly improved my execution time, saving me thousands!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Testimonial 2 */}
              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes3}
                        width={120}
                        height={120}
                        alt="Michael Brown"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Michael Brown</h5>
                      <p className="text-muted small mb-0 text-center">London, UK</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;I&apos;ve tried multiple VPS providers, but nothing matches Tachys VPS for uptime and reliability. Highly recommended for serious traders.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Testimonial 3 */}
              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes1}
                        width={120}
                        height={120}
                        alt="Denil Kumar"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Denil Kumar</h5>
                      <p className="text-muted small mb-0 text-center">Mumbai, India</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Thanks to Tachys VPS, I can trade 24/7 without interruptions. The 24/7 support is always there when I need help.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Testimonial 4 */}
              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes4}
                        width={120}
                        height={120}
                        alt="Victoria Genesis"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Victoria Genesis</h5>
                      <p className="text-muted small mb-0 text-center">Sydney, Australia</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;Tachys VPS helped me optimize my high-frequency trading strategies. The speed and performance are unmatched!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Testimonial 5 */}
              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes5}
                        width={120}
                        height={120}
                        alt="Maria Gonzalez"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Maria Gonzalez</h5>
                      <p className="text-muted small mb-0 text-center">Madrid, Spain</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;The Algo Market on Tachys VPS is incredible. I found bots that boosted my ROI by 30% in weeks!&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Testimonial 6 */}
              <div className="carousel-item">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{maxWidth: "800px"}}>
                  <div className="row align-items-center g-4">
                    <div className="col-md-4 text-center">
                      <Image
                        src={tes6}
                        width={120}
                        height={120}
                        alt="Mariam Al-Farsi"
                        className="img-fluid rounded-circle mb-3 mx-auto"
                      />
                      <h5 className="mb-1 text-center">Mariam Al-Farsi</h5>
                      <p className="text-muted small mb-0 text-center">Dubai, UAE</p>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex h-100 align-items-center">
                        <blockquote className="blockquote mb-0">
                          <p className="mb-0 fs-5 fst-italic text-muted">
                            &quot;The security features on Tachys VPS give me peace of mind. My trades and data are always safe.&quot;
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Carousel Controls */}
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
  
            {/* Carousel Indicators */}
            <div className="carousel-indicators mt-4">
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="0" className="active bg-purple" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="1" className="bg-purple" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="2" className="bg-purple" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="3" className="bg-purple" aria-label="Slide 4"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="4" className="bg-purple" aria-label="Slide 5"></button>
              <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="5" className="bg-purple" aria-label="Slide 6"></button>
            </div>
          </div>
  
          <div className="px-4 mt-5 text-start bg-white" id='faq'>
            <div className="max-w-6xl mx-auto py-16">
              <h1 className="text-4xl text-purple font-bold text-center mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Find answers to common questions about Tachys VPS and our services. Can't find what you're looking for? Contact our support team <Link href="/contact-us" className='text-purple-800 fw-bold'>here</Link>.</p>
              <div className="space-y-1">
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What makes Tachys VPS ideal for Forex trading?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Tachys VPS is specifically optimized for Forex traders, offering ultra-low latency connections to broker servers, 99.99% uptime to ensure you never miss a trade, and powerful servers capable of running multiple platforms smoothly. Additionally, our focus on security and 24/7 support ensures peace of mind, whether you&apos;re a beginner or a professional trader.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">Which VPS hosting plan is right for me?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      All Tachys VPS plans offers a lots for the buck. The most popular plan our customers choose is Standard & Ultra plan. The right VPS plan depends on your trading needs and experience level:
                      <ul className="list-disc pl-6 mt-4 space-y-3">
                        <li>
                          <span className="font-medium text-gray-800">For Beginners:</span> If you&apos;re just starting or using basic trading tools like a single MT4/MT5 terminal, our entry-level Lite/Basic plan offers sufficient CPU, RAM, and storage to run smoothly.
                        </li>
                        <li>
                          <span className="font-medium text-gray-800">For Intermediate Traders:</span> If you use multiple accounts, Expert Advisors (EAs), or more resource-intensive strategies, consider a Standard plan for enhanced performance and capacity.
                        </li>
                        <li>
                          <span className="font-medium text-gray-800">For Professional Traders:</span> For high-frequency trading (HFT) or managing multiple platforms simultaneously, our Ultra & Dedicated Server plan which includes higher CPU cores, RAM, and ultra-low latency are ideal.
                        </li>
                        <li>
                          <span className="font-medium text-gray-800">For Custom Needs:</span> If you need highly specific configurations or scalability, our Custom plan allows customization to fit your unique trading strategies.
                        </li>
                      </ul>
                      <p className="mt-4">If you&apos;re unsure, our 24/7 support team can guide you to the best plan based on your goals and trading volume. Start small and upgrade as your needs grow—our plans are flexible and scalable!</p>
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">Can I run multiple trading platforms on Tachys VPS?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Absolutely! Tachys VPS is designed to handle multiple terminals and trading accounts simultaneously, depending on the plan you choose. This makes it perfect for traders who need to manage different strategies, accounts, or brokers without compromising performance.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">Do I need technical knowledge to use Tachys VPS?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Not at all! Tachys VPS is built with simplicity in mind, offering easy setup instructions and a user-friendly control panel. Plus, our 24/7 support team is always available to assist you with installation, troubleshooting, or any technical questions, ensuring you&apos;re always up and running.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">How secure is Tachys VPS for trading?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      Security is our top priority. Tachys VPS uses industry-standard encryption to protect your data, robust firewalls to prevent unauthorized access, and advanced DDoS protection to safeguard against attacks. With regular updates and monitoring, we provide a secure environment for all your trading activities.
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
                      Yes, our plans are fully scalable. As your trading volume or resource requirements grow, you can easily upgrade to a higher plan without downtime. This ensures that your VPS always matches your trading needs, from beginner to professional levels.
                    </div>
                  </details>
                </div>
  
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h2 className="text-lg font-semibold text-purple">What is the Algo Market, and how can I use it?</h2>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg fill="none" height="24" width="24" stroke="currentColor" className="text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      The Algo Market is an exclusive online store by Tachys VPS where you can find both free and premium Forex trading algorithms, bots, and Expert Advisors (EAs). These tools are designed to enhance your trading strategies and save you time. Once you find a bot or EA that suits your needs, you can download and integrate it seamlessly into your trading platform hosted on our VPS. Check it out <Link href={market} className="text-purple-600 hover:text-purple-700 font-medium">here</Link>.
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