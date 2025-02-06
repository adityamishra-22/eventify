import React, { useState, useEffect } from "react";
import LocationDetails from "./LocationDetails";
import { Activity, getActivityByName, addActivity } from "../../database/database";

interface FormData {
  activityName: string;
  category: string;
  description: string;
  type: string;
  location: string;
  minimumMembers: string;
  maximumMembers: string;
}

const ActivityDetails: React.FC = () => {
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    activityName: "",
    category: "",
    description: "",
    type: "",
    location: "",
    minimumMembers: "",
    maximumMembers: "",
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Prefill form with existing data if available
  useEffect(() => {
    const activity = getActivityByName("Cooking class"); // Replace with dynamic ID if needed
    if (activity) {
      setFormData({
        activityName: activity.activityName,
        category: activity.category,
        description: activity.description,
        type: activity.type,
        location: activity.location,
        minimumMembers: activity.minimumMembers.toString(),
        maximumMembers: activity.maximumMembers.toString(),
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Reset the error when the user starts typing
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // Check required fields
    if (!formData.activityName) newErrors.activityName = "Activity Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Activity Type is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.minimumMembers) newErrors.minimumMembers = "Minimum members is required";
    if (!formData.maximumMembers) newErrors.maximumMembers = "Maximum members is required";
    if (parseInt(formData.minimumMembers) >= parseInt(formData.maximumMembers)) {
      newErrors.members = "Minimum members must be less than maximum members";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const nextForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Final Form Data:", formData);

      // Add new activity to the database
      addActivity({
        activityName: formData.activityName,
        category: formData.category,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        minimumMembers: Number(formData.minimumMembers),
        maximumMembers: Number(formData.maximumMembers),
      });

      setShowLocationDetails(true); // Show location details form
    }
  };

  return (
    <div>
      {showLocationDetails ? (
        <LocationDetails />
      ) : (
        <>
          <h2 className="font-inter text-xl font-bold text-gray-900 mb-6">
            Activity Details
          </h2>

          <form onSubmit={nextForm}>
            {/* Activity Name */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">
                Activity Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="activityName"
                placeholder="Eg: Cooking class in Palo Alto"
                value={formData.activityName}
                onChange={handleChange}
              />
              {errors.activityName && <p className="text-red-500 text-sm">{errors.activityName}</p>}
            </div>

            {/* Category Selection */}
            <fieldset className="mb-6">
              <legend className="font-semibold text-gray-700 mb-2">
                Select the best category to describe your activity{" "}
                <span className="text-red-500">*</span>
              </legend>
              <div className="flex flex-col space-y-3">
                {[
                  "Adventure & Games",
                  "Creative Expression",
                  "Food & Drink",
                  "Learning & Development",
                  "Sports and Fitness",
                  "Volunteering",
                ].map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={handleChange}
                    />{" "}
                    {category}
                  </label>
                ))}
                <label className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="Others"
                      checked={formData.category === "Others"}
                      onChange={handleChange}
                    />{" "}
                    Others
                  </div>
                  <input
                    className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="category"
                    placeholder="Specify the Category"
                    value={formData.category === "Others" ? "" : formData.category}
                    onChange={handleChange}
                  />
                </label>
              </div>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </fieldset>

            {/* About this Activity */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">
                About this Activity <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-[40rem] h-32 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                placeholder="Activity Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Activity Type */}
            <fieldset className="mb-6">
              <legend className="font-semibold text-gray-700 mb-2">
                Please select activity type <span className="text-red-500">*</span>
              </legend>
              <div className="flex flex-col space-y-3">
                {["Indoor", "Outdoor", "Virtual"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleChange}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </fieldset>

            {/* Location Type */}
            <fieldset className="mb-6">
              <legend className="font-semibold text-gray-700 mb-2">
                Please select type of location <span className="text-red-500">*</span>
              </legend>
              <div className="flex flex-col space-y-3">
                {["Provider Location", "User Location"].map((location) => (
                  <label key={location} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="location"
                      value={location}
                      checked={formData.location === location}
                      onChange={handleChange}
                    />{" "}
                    {location}
                  </label>
                ))}
              </div>
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </fieldset>

            {/* Number of Participants */}
            <div className="mb-6">
              <label className="font-semibold text-gray-700 mb-2 block">
                How many Members can take part in the activity?
              </label>
              <div className="flex gap-4">
                <input
                  className="w-1/2 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="minimumMembers"
                  placeholder="Minimum members"
                  value={formData.minimumMembers}
                  onChange={handleChange}
                />
                <input
                  className="w-1/2 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="maximumMembers"
                  placeholder="Maximum members"
                  value={formData.maximumMembers}
                  onChange={handleChange}
                />
              </div>
              {errors.minimumMembers && <p className="text-red-500 text-sm">{errors.minimumMembers}</p>}
              {errors.members && <p className="text-red-500 text-sm">{errors.members}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-black text-white py-3 px-5 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Save and Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ActivityDetails;
