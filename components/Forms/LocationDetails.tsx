import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import FormSubmitModal from "../FormSubmitModal";
import {
  getLocationDraft,
  saveLocationDraft,
  clearActivityDraft,
  clearLocationDraft,
  addActivity,
  getActivityDraft,
  LocationDraft,
} from "../../database/database";

type FormData = LocationDraft;

type FormErrors = Partial<
  Record<
    "addressLine1" | "zipCode" | "city" | "state" | "contactNumber",
    string
  >
>;

function buildInitialState(): FormData {
  const draft = getLocationDraft();
  return {
    addressLine1: draft?.addressLine1 ?? "",
    addressLine2: draft?.addressLine2 ?? "",
    zipCode: draft?.zipCode ?? "",
    city: draft?.city ?? "",
    state: draft?.state ?? "",
    contactNumber: draft?.contactNumber ?? "",
    contactName: draft?.contactName ?? "",
  };
}

function saveToLocalStorage(activityData: object, locationData: object) {
  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem("activities") ?? "[]");
    if (!Array.isArray(existing)) existing = [];
  } catch {
    existing = [];
  }

  const newRecord = { ...activityData, ...locationData };
  existing.push(newRecord);
  localStorage.setItem("activities", JSON.stringify(existing));
}

interface LocationDetailsProps {
  onBack: () => void;
}

function LocationDetails({ onBack }: LocationDetailsProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(buildInitialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name as keyof FormData]: value };
    setFormData(updated);
    setErrors((prev: FormErrors) => ({ ...prev, [name]: "" }));
    saveLocationDraft(updated);
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phone = value ?? "";
    const updated = { ...formData, contactNumber: phone };
    setFormData(updated);
    setErrors((prev: FormErrors) => ({ ...prev, contactNumber: "" }));
    saveLocationDraft(updated);
  };

  const handleBack = () => {
    saveLocationDraft(formData);
    onBack();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required.";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const activityDraft = getActivityDraft();

    saveToLocalStorage(activityDraft ?? {}, formData);

    if (activityDraft) {
      addActivity({
        activityName: activityDraft.activityName ?? "",
        category: activityDraft.category ?? "",
        description: activityDraft.description ?? "",
        type: activityDraft.type ?? "",
        location: activityDraft.location ?? "",
        minimumMembers: activityDraft.minimumMembers ?? 0,
        maximumMembers: activityDraft.maximumMembers ?? 0,
      });
    }

    clearActivityDraft();
    clearLocationDraft();

    setShowModal(true);
  };

  return (
    <div>
      <h2 className="font-inter text-xl font-bold text-gray-900">
        Location Details
      </h2>
      <div className="flex pb-4">
        Please specify the address for where the activity takes place.
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <label>
          Address Line 1 <span className="text-red-600">*</span>
        </label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="addressLine1"
          placeholder="House number and street name"
          value={formData.addressLine1}
          onChange={handleChange}
        />
        {errors.addressLine1 && (
          <p className="text-red-500">{errors.addressLine1}</p>
        )}

        <label>Address Line 2</label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="addressLine2"
          placeholder="Other information, e.g., building name, landmark, etc."
          value={formData.addressLine2}
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
          value={formData.zipCode}
          onChange={handleChange}
        />
        {errors.zipCode && <p className="text-red-500">{errors.zipCode}</p>}

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
              value={formData.city}
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
              value={formData.state}
              onChange={handleChange}
            />
            {errors.state && <p className="text-red-500">{errors.state}</p>}
          </div>
        </div>

        <div className="w-full h-[0.1rem] bg-gray-100 my-5" />

        <h2 className="font-inter text-xl font-bold text-gray-900">
          Contact Details
        </h2>
        <div className="flex pb-4">
          Please provide contact information for this activity.
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex flex-col">
            <PhoneInput
              defaultCountry="US"
              placeholder="Contact Number *"
              value={formData.contactNumber}
              onChange={handlePhoneChange}
              className="w-[20rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          <input
            type="text"
            name="contactName"
            placeholder="Contact Name"
            value={formData.contactName}
            onChange={handleChange}
            className="w-[20rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 px-6 border-gray-100 border-[0.1rem] rounded-full"
          >
            Previous
          </button>
          <button
            type="submit"
            className="p-2 px-6 bg-black text-white rounded-full"
          >
            Submit
          </button>
        </div>
      </form>

      {showModal && <FormSubmitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default LocationDetails;
