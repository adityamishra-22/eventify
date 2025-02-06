import React from 'react';
import SocialMedia from './SocialMedia';

const Footer = () => {
  return (
    <div className="h-[20rem] flex flex-col justify-center items-center text-center border-t-[0.1rem] border-gray-100 ">
      <div className="flex flex-col gap-4 items-center">
        <img  src="/mammothyLogo.png" alt="Mammothy Logo" className="" />
        <p className="text-center font-inter text-base font-normal leading-6 text-[#6B6B6B]
">
          Marketplace for searching, filtering, and instantly booking team activities
        </p>
        <SocialMedia />
        <div className=' w-[70rem] border-[0.1rem] border-gray-100'>       
        </div>
        <div className='text-[#6B6B6B]'>
            Copyright © 2024
        </div>
      </div>
    </div>
  );
};

export default Footer;
