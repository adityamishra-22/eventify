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

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = LocationDraft;

type FormErrors = Partial<
  Record<
    "addressLine1" | "zipCode" | "city" | "state" | "contactNumber",
    string
  >
>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

interface LocationDetailsProps {
  onBack: () => void;
}

function LocationDetails({ onBack }: LocationDetailsProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(buildInitialState);
  const [errors, setErrors] = useState<FormErrors>({});

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name as keyof FormData]: value,
    }));
    setErrors((prev: FormErrors) => ({ ...prev, [name]: "" }));
    // Auto-save draft
    saveLocationDraft({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phone = value ?? "";
    setFormData((prev: FormData) => ({ ...prev, contactNumber: phone }));
    setErrors((prev: FormErrors) => ({ ...prev, contactNumber: "" }));
    saveLocationDraft({ ...formData, contactNumber: phone });
  };

  const handleBack = () => {
    // Persist whatever has been typed so ActivityDetails can restore itself
    saveLocationDraft(formData);
    onBack();
  };

  // ─── Validation ──────────────────────────────────────────────────────────

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

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Persist location draft
    saveLocationDraft(formData);

    // Finalize: push validated activity to the database
    const activityDraft = getActivityDraft();
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

    // Clear drafts after successful finalization
    clearActivityDraft();
    clearLocationDraft();

    setShowModal(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      <h2 className="font-inter text-xl font-bold text-gray-900">
        Location Details
      </h2>
      <div className="flex pb-4">
        Please specify the address for where the activity takes place.
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Address Line 1 */}
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

        {/* Address Line 2 */}
        <label>Address Line 2</label>
        <input
          className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="addressLine2"
          placeholder="Other information, e.g., building name, landmark, etc."
          value={formData.addressLine2}
          onChange={handleChange}
        />

        {/* ZIP Code */}
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

        {/* City & State */}
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

        {/* Contact Details */}
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

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {/* type="button" prevents accidental form submission */}
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
