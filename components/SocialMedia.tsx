import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
const SocialMedia = () => {
  return (
    <div className='flex gap-5'>
        <FaFacebook />
        <FaInstagram />
        <FaLinkedin />
        <CiMail />

    </div>
  )
}

export default SocialMedia
