import React, { useState, useEffect } from "react";
import {
  Activity,
  getActivityDraft,
  saveActivityDraft,
} from "../../database/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityDetailsProps {
  onNext: () => void;
}

interface FormData {
  activityName: string;
  categoryOption: string;
  categoryCustom: string;
  description: string;
  type: string;
  location: string;
  minimumMembers: string;
  maximumMembers: string;
}

type FormErrors = Partial<Record<keyof FormData | "members", string>>;

const CATEGORY_OPTIONS = [
  "Adventure & Games",
  "Creative Expression",
  "Food & Drink",
  "Learning & Development",
  "Sports and Fitness",
  "Volunteering",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decomposeCategory(stored: string): {
  categoryOption: string;
  categoryCustom: string;
} {
  if (!stored) return { categoryOption: "", categoryCustom: "" };
  if ((CATEGORY_OPTIONS as readonly string[]).includes(stored)) {
    return { categoryOption: stored, categoryCustom: "" };
  }
  return { categoryOption: "Others", categoryCustom: stored };
}

function composeCategory(option: string, custom: string): string {
  if (option === "Others") return custom.trim();
  return option;
}

// ─── Component ────────────────────────────────────────────────────────────────

function ActivityDetails({ onNext }: ActivityDetailsProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    const draft = getActivityDraft();
    if (draft) {
      const { categoryOption, categoryCustom } = decomposeCategory(
        draft.category ?? "",
      );
      return {
        activityName: draft.activityName ?? "",
        categoryOption,
        categoryCustom,
        description: draft.description ?? "",
        type: draft.type ?? "",
        location: draft.location ?? "",
        minimumMembers:
          draft.minimumMembers != null ? String(draft.minimumMembers) : "",
        maximumMembers:
          draft.maximumMembers != null ? String(draft.maximumMembers) : "",
      };
    }
    return {
      activityName: "",
      categoryOption: "",
      categoryCustom: "",
      description: "",
      type: "",
      location: "",
      minimumMembers: "",
      maximumMembers: "",
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-save draft on every change
  useEffect(() => {
    saveActivityDraft({
      activityName: formData.activityName,
      category: composeCategory(
        formData.categoryOption,
        formData.categoryCustom,
      ),
      description: formData.description,
      type: formData.type,
      location: formData.location,
      minimumMembers: formData.minimumMembers
        ? Number(formData.minimumMembers)
        : undefined,
      maximumMembers: formData.maximumMembers
        ? Number(formData.maximumMembers)
        : undefined,
    } as Partial<Activity>);
  }, [formData]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name as keyof FormData]: value,
    }));
    setErrors((prev: FormErrors) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFormData((prev: FormData) => ({
      ...prev,
      categoryOption: value,
      categoryCustom: value !== "Others" ? "" : prev.categoryCustom,
    }));
    setErrors((prev: FormErrors) => ({
      ...prev,
      categoryOption: "",
      categoryCustom: "",
    }));
  };

  const handleCategoryCustomChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev: FormData) => ({
      ...prev,
      categoryCustom: e.target.value,
    }));
    setErrors((prev: FormErrors) => ({ ...prev, categoryCustom: "" }));
  };

  // ─── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.activityName.trim())
      newErrors.activityName = "Activity Name is required.";

    if (!formData.categoryOption) {
      newErrors.categoryOption = "Please select a category.";
    } else if (
      formData.categoryOption === "Others" &&
      !formData.categoryCustom.trim()
    ) {
      newErrors.categoryCustom = "Please specify the category.";
    }

    if (!formData.description.trim())
      newErrors.description = "Description is required.";

    if (!formData.type) newErrors.type = "Activity Type is required.";

    if (!formData.location) newErrors.location = "Location type is required.";

    if (!formData.minimumMembers.trim())
      newErrors.minimumMembers = "Minimum members is required.";

    if (!formData.maximumMembers.trim())
      newErrors.maximumMembers = "Maximum members is required.";

    const min = parseInt(formData.minimumMembers, 10);
    const max = parseInt(formData.maximumMembers, 10);

    if (
      formData.minimumMembers.trim() &&
      formData.maximumMembers.trim() &&
      !isNaN(min) &&
      !isNaN(max) &&
      min >= max
    ) {
      newErrors.members = "Minimum members must be less than maximum members.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const nextForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    saveActivityDraft({
      activityName: formData.activityName.trim(),
      category: composeCategory(
        formData.categoryOption,
        formData.categoryCustom,
      ),
      description: formData.description.trim(),
      type: formData.type,
      location: formData.location,
      minimumMembers: Number(formData.minimumMembers),
      maximumMembers: Number(formData.maximumMembers),
    });

    onNext(); // ✅ tells the parent to switch the step
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <h2 className="font-inter text-xl font-bold text-gray-900 mb-6">
        Activity Details
      </h2>

      <form onSubmit={nextForm} noValidate>
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
          {errors.activityName && (
            <p className="text-red-500 text-sm mt-1">{errors.activityName}</p>
          )}
        </div>

        {/* Category Selection */}
        <fieldset className="mb-6">
          <legend className="font-semibold text-gray-700 mb-2">
            Select the best category to describe your activity{" "}
            <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-col space-y-3">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryOption"
                  value={cat}
                  checked={formData.categoryOption === cat}
                  onChange={handleCategoryOptionChange}
                />
                {cat}
              </label>
            ))}

            {/* Others row */}
            <label className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryOption"
                  value="Others"
                  checked={formData.categoryOption === "Others"}
                  onChange={handleCategoryOptionChange}
                />
                Others
              </div>
              {formData.categoryOption === "Others" && (
                <input
                  className="w-[40rem] p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="categoryCustom"
                  placeholder="Specify the Category"
                  value={formData.categoryCustom}
                  onChange={handleCategoryCustomChange}
                />
              )}
            </label>
          </div>
          {errors.categoryOption && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryOption}</p>
          )}
          {errors.categoryCustom && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryCustom}</p>
          )}
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
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Activity Type */}
        <fieldset className="mb-6">
          <legend className="font-semibold text-gray-700 mb-2">
            Please select activity type <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-col space-y-3">
            {(["Indoor", "Outdoor", "Virtual"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={formData.type === t}
                  onChange={handleChange}
                />
                {t}
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </fieldset>

        {/* Location Type */}
        <fieldset className="mb-6">
          <legend className="font-semibold text-gray-700 mb-2">
            Please select type of location{" "}
            <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-col space-y-3">
            {(["Provider Location", "User Location"] as const).map((loc) => (
              <label key={loc} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="location"
                  value={loc}
                  checked={formData.location === loc}
                  onChange={handleChange}
                />
                {loc}
              </label>
            ))}
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </fieldset>

        {/* Number of Participants */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            How many Members can take part in the activity?
          </label>
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <input
                className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                name="minimumMembers"
                placeholder="Minimum members"
                value={formData.minimumMembers}
                onChange={handleChange}
                min={1}
              />
              {errors.minimumMembers && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minimumMembers}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <input
                className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                name="maximumMembers"
                placeholder="Maximum members"
                value={formData.maximumMembers}
                onChange={handleChange}
                min={1}
              />
              {errors.maximumMembers && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maximumMembers}
                </p>
              )}
            </div>
          </div>
          {errors.members && (
            <p className="text-red-500 text-sm mt-1">{errors.members}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white py-3 px-5 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}

export default ActivityDetails;
