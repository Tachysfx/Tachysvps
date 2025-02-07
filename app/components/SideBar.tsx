'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdsCard from '../components/AdsCard';

const promotion1 = '/promotion1.png';
const promotion2 = '/promotion2.png';
const promotion3 = '/server.png';
const testing = '/testing.png';
const money = '/money.png';
const selling = '/selling.png';
const ads = '/advertisements.png';

const CardSideBar = () => {
  const initialCards = [
    { key: 1, img: testing, txt: 'Test trading bot on a demo account before risking real money' },
    { key: 2, img: money, txt: 'Do you want to earn free money? Click here to get started' },
    { key: 3, img: selling, txt: 'Boost sales of your trading applications with compelling templates' },
    { key: 4, img: ads, txt: 'Advertise for us to reach more audience and get rewarded' },
    { key: 5, img: promotion1, txt: 'Stay updated! Get notified when prices drop!' },
    { key: 6, img: promotion3, txt: 'Launch your VPS in just 5 mins - Fast, Simple & Reliable' },
    { key: 7, img: promotion2, txt: 'Grab your favorite prop firm challenges at an unbeatable price now!!!' },
  ];

  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5));
    }, 7000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="grid-container">
      <div className="column">
        {cards.map((card) => (
          <motion.div
            key={card.key}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="card-wrapper"
          >
            <AdsCard img={card.img} txt={card.txt} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CardSideBar;