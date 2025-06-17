import React from 'react';
import Script from 'next/script';

interface AlgoStructuredDataProps {
  name: string;
  description: string;
  image: string;
  datePublished: string;
  sellerName: string;
  sellerId: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  id: string;
}

const AlgoStructuredData: React.FC<AlgoStructuredDataProps> = ({
  name,
  description,
  image,
  datePublished,
  sellerName,
  sellerId,
  price,
  currency = 'USD',
  rating,
  reviewCount,
  id
}) => {
  // Create structured data for the algorithm
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    image: image,
    applicationCategory: 'FinanceTool',
    operatingSystem: 'Windows, Linux, macOS',
    datePublished: datePublished,
    offers: price ? {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock'
    } : undefined,
    author: {
      '@type': 'Person',
      id: sellerId,
      name: sellerName
    },
    aggregateRating: rating && reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount
    } : undefined,
    url: `https://tachysvps.com/market/${id}`
  };

  // Remove undefined properties
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  return (
    <Script id={`structured-data-${id}`} type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
};

export default AlgoStructuredData; 