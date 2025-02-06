import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import FormSubmitModal from "../FormSubmitModal";

const LocationDetails = () => {
  const [showModal, setShowModal] = useState(false); 
  const [formdata, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    city: "",
    state: "",
    contactNumber: "",
    contactName: "",
  });

  const [errors, setErrors] = useState({
    addressLine1: "",
    zipCode: "",
    city: "",
    state: "",
    contactNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      addressLine1: "",
      zipCode: "",
      city: "",
      state: "",
      contactNumber: "",
    };

    if (!formdata.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required.";
      valid = false;
    }
    if (!formdata.zipCode.trim()) {
      newErrors.zipCode = "ZIP Code is required.";
      valid = false;
    }
    if (!formdata.city.trim()) {
      newErrors.city = "City is required.";
      valid = false;
    }
    if (!formdata.state.trim()) {
      newErrors.state = "State is required.";
      valid = false;
    }
    if (!formdata.contactNumber.trim()) {
      newErrors.contactNumber = "Contact Number is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }

    console.log("Form submitted:", formdata);
    setShowModal(true);
  };

  return (
    <div>
      <h2 className="font-inter text-xl font-bold text-gray-900">Location Details</h2>
      <div className="flex pb-4">Please specify the address for where the activity takes place.</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Address Inputs */}
        <label>
          Address Line 1 <span className="text-red-600">*</span>
        </label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="addressLine1"
          placeholder="House number and street name"
          value={formdata.addressLine1}
          onChange={handleChange}
        />
        {errors.addressLine1 && <p className="text-red-500">{errors.addressLine1}</p>}

        <label>Address Line 2</label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="addressLine2"
          placeholder="Other information, e.g., building name, landmark, etc."
          value={formdata.addressLine2}
          onChange={handleChange}
        />

        <label>
          ZIP Code <span className="text-red-600">*</span>
        </label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="zipCode"
          placeholder="e.g., 123456"
          value={formdata.zipCode}
          onChange={handleChange}
        />
        {errors.zipCode && <p className="text-red-500">{errors.zipCode}</p>}

        {/* City & State Inputs */}
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label>
              City <span className="text-red-600">*</span>
            </label>
            <input
              className="w-[18rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="city"
              placeholder="Your City"
              value={formdata.city}
              onChange={handleChange}
            />
            {errors.city && <p className="text-red-500">{errors.city}</p>}
          </div>

          <div className="flex flex-col">
            <label>
              State <span className="text-red-600">*</span>
            </label>
            <input
              className="w-[18rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="state"
              placeholder="Your State"
              value={formdata.state}
              onChange={handleChange}
            />
            {errors.state && <p className="text-red-500">{errors.state}</p>}
          </div>
        </div>

        <div className="w-full h-[0.1rem] bg-gray-100 my-5"></div>

        {/* Contact Details */}
        <h2 className="font-inter text-xl font-bold text-gray-900">Contact Details</h2>
        <div className="flex pb-4">Please provide contact information for this activity.</div>

        <div className="flex gap-4">
          <PhoneInput
            defaultCountry="US"
            placeholder="Contact Number *"
            value={formdata.contactNumber}
            onChange={(value) => {
              setFormData({ ...formdata, contactNumber: value || "" });
              setErrors({ ...errors, contactNumber: "" }); 
            }}
            className="w-[20rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contactNumber && <p className="text-red-500">{errors.contactNumber}</p>}

          <input
            type="text"
            name="contactName"
            placeholder="Contact Name"
            value={formdata.contactName}
            onChange={handleChange}
            className="w-[20rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className=" flex  gap-3 mt-6">
            <button className="p-2 px-6  border-gray-100 border-[0.1rem]  rounded-full">
                Previous
            </button>
          <button type="submit" className="p-2 px-6 bg-black text-white rounded-full">
            Submit
          </button>
        </div>
      </form>

      {showModal && <FormSubmitModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default LocationDetails;
