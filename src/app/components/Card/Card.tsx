import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface CardProps {
  id: string;
  title: string;
  category: string;
  rating?: number;
  price?: string;
  image?: string;
  description?: string;
  href: string;
  variant?: 'default' | 'trending' | 'featured';
}

export default function Card({
  title,
  category,
  rating,
  price,
  image,
  description,
  href,
  variant = 'default'
}: CardProps) {
  const [imgError, setImgError] = useState(false);

  const cardVariantClasses = {
    default: 'bg-white border border-light-gray',
    trending: 'bg-pale-spring-bud border border-hoockers-green',
    featured: 'bg-hoockers-green text-white border border-hoockers-green'
  };

  const textColorClasses = {
    default: 'text-black',
    trending: 'text-black',
    featured: 'text-white'
  };

  return (
    <article className={`
      rounded shadow-2 hover:shadow-1 transition-all duration-1 ease-cubic-out
      ${cardVariantClasses[variant]}
    `}>
      <Link href={href} className="block p-4">
        <div className="relative w-full h-32 mb-3 rounded overflow-hidden bg-cultured-1">
          {image && !imgError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-web">
              <ion-icon name="image-outline" size="large"></ion-icon>
            </div>
          )}
          {rating && (
            <div className="absolute top-2 right-2 bg-hoockers-green text-white px-2 py-1 rounded flex items-center space-x-1">
              <ion-icon name="star" style={{ color: 'white' }} size="small"></ion-icon>
              <span className="font-urbanist text-8 font-500">{rating}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className={`font-urbanist text-6 font-600 ${textColorClasses[variant]}`}>
              {title}
            </h3>
            {price && (
              <span className={`font-urbanist text-8 font-500 ${textColorClasses[variant]}`}>
                {price}
              </span>
            )}
          </div>
          
          <p className={`font-urbanist text-8 font-400 ${variant === 'featured' ? 'text-white opacity-90' : 'text-gray-web'}`}>
            {category}
          </p>
          
          {description && (
            <p className={`font-urbanist text-8 font-400 ${variant === 'featured' ? 'text-white opacity-80' : 'text-gray-web'}`}>
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}