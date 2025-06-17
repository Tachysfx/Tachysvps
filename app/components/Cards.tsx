"use client"

import Image from 'next/image';

import CountUp from 'react-countup';

const imgYears="/calendar.png";
const imgCenters="/local.png";
const imgLatency="/latency.png";
const imgHappy="/happy.png";

export default function Cards() {
  return (
    <>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {/* <!-- Card 1 --> */}
          <div className="col-6">
            <div className="card border-purple hover:shadow-lg transition-shadow duration-300">
              <div className="card-body text-center carrd p-4">
                <h2 className="card-title d-flex align-items-center justify-content-center mb-3">
                  <Image
                    src={imgCenters}
                    width={48}
                    height={48}
                    alt="Locations icon"
                    className='me-3'
                  />
                  <span className="text-purple fw-bold"><CountUp end={200} duration={3.5} />+</span>
                </h2>
                <h6 className="card-text text-muted">Server Locations</h6>
              </div>
            </div>
          </div>
          {/* <!-- Card 2 --> */}
          <div className="col-6">
            <div className="card border-purple hover:shadow-lg transition-shadow duration-300">
              <div className="card-body text-center carrd p-4">
                <h2 className="card-title d-flex align-items-center justify-content-center mb-3">
                  <Image
                    src={imgLatency}
                    width={48}
                    height={48}
                    alt="Latency icon"
                    className='me-3'
                  />
                  <span className="text-purple fw-bold">1ms</span>
                </h2>
                <h6 className="card-text text-muted">Or Less Latency</h6>
              </div>
            </div>
          </div>
          {/* <!-- Card 3 --> */}
          <div className="col-6">
            <div className="card border-purple hover:shadow-lg transition-shadow duration-300">
              <div className="card-body text-center carrd p-4">
                <h2 className="card-title d-flex align-items-center justify-content-center mb-3">
                  <Image
                    src={imgHappy}
                    width={48}
                    height={48}
                    alt="Customers icon"
                    className='me-3'
                  />
                  <span className="text-purple fw-bold"><CountUp end={2000} duration={5.5} />+</span>
                </h2>
                <h6 className="card-text text-muted">Happy Customers</h6>
              </div>
            </div>
          </div>
          {/* <!-- Card 4 --> */}
          <div className="col-6">
            <div className="card border-purple hover:shadow-lg transition-shadow duration-300">
              <div className="card-body text-center carrd p-4">
                <h2 className="card-title d-flex align-items-center justify-content-center mb-3">
                  <Image
                    src={imgYears}
                    width={48}
                    height={48}
                    alt="Years icon" 
                    className='me-3'
                  />
                  <span className="text-purple fw-bold"><CountUp end={5} duration={2.5} />+</span>
                </h2>
                <h6 className="card-text text-muted">Years of Operation</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
