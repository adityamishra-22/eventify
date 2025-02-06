import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";

const MainHeader = () => {
  return (
    <div className='flex justify-between align-middle content-center px-[5rem] py-[1rem] border-b-[0.1rem] border-gray-300'>
      <img src="/mammothyLogo.png" alt="" />
      <div className='flex items-center gap-3'>
        <img src="/Avatar.png" alt="" />
      <div>
        Profile
      </div>
      </div>
    </div>
  )
}

export default MainHeader
