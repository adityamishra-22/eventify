'use client'
import React, { useEffect, useState } from "react";

const FormSubmitModal = ({ onClose }: { onClose: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null; 

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-30">
      <div className="w-[510px] h-[211px] rounded-xl bg-white flex flex-col items-center justify-center relative p-6">
        
        <button className="absolute top-4 right-4" onClick={() => { setVisible(false); onClose(); }}>
          <img src="/cross.png" alt="Close" />
        </button>

        <div className="flex bg-gray-100 rounded-full p-3">
          <img src="/CrossIcon.png" alt="Success" />
        </div>
        
        <div className="flex py-3 font-inter text-[24px] font-semibold leading-[29.05px] text-center">
          Form Submitted
        </div>
      </div>
    </div>
  );
};

export default FormSubmitModal;
