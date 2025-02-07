import Image from 'next/image';
import Link from 'next/link';

const imgYoutube = '/youtube.png';
const emptyLink = "";

export default function AdsCard({ lnk= emptyLink, img= imgYoutube, txt= 'Tachys is a VPS hosting company that leverages artificial intelligence.'}) {  

  return (
    <>
      <Link href={lnk}>
        <div className="card alerty border mb-2 mx-2">
          <div className="row p-1">
            <div className='col-3 pe-1'>
              <Image
                src={img}
                width={40}
                height={54}
                alt="blur"
                className='img-fluid'
              />
            </div>
            <p className="alerty1 col-8 px-0 mb-0">{txt}</p>
          </div>
        </div>
      </Link>
    </>
  )
}
