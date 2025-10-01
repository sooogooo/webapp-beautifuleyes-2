import React, { useState, useEffect } from 'react';

const images = [
  'https://docs.bccsw.cn/images/chacha/faceonly.jpg',
  'https://docs.bccsw.cn/images/chacha/manke1.jpg',
  'https://docs.bccsw.cn/images/chacha/manke2.jpg',
  'https://docs.bccsw.cn/images/chacha/splendeur.jpg',
  'https://docs.bccsw.cn/images/chacha/superorder.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan1.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan2.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan3.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan4.jpg'
];

const HeroImage: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setHeroImage(images[randomIndex]);
  }, []);

  if (!heroImage) {
    return <div className="aspect-[2.35/1] w-full bg-slate-200 rounded-lg mb-8 animate-pulse"></div>;
  }

  return (
    <div className="w-full aspect-[2.35/1] rounded-lg overflow-hidden shadow-lg mb-8 animate-fade-in">
      <img 
        src={heroImage} 
        alt="Inspirational hero image" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroImage;
