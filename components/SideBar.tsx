'use client'
import React, { useState } from "react";
import ActivityDetails from "./Forms/ActivityDetails";
import LocationDetails from "./Forms/LocationDetails";

const SideBar = () => {
  const [activeScreen, setActiveScreen] = useState("activity"); // Default screen

  return (
    <div className="flex  border-r-[0.1rem] ">
      <div className="  font-inter text-base font-semibold leading-6 text-left border-r-[0.1rem] border-gray-100">
        <div className="px-[4rem] space-y-2">
          <button
            className={`flex items-center gap-2 py-2 px-2 w-full text-left hover:bg-slate-100 rounded-md ${
              activeScreen === "activity" ? "bg-slate-100" : ""
            }`}
            onClick={() => setActiveScreen("activity")}
          >
            <img src="/flag.png" alt="Activity" /> Activity Details
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-2 w-full text-left hover:bg-slate-100 rounded-md ${
              activeScreen === "location" ? "bg-slate-100" : ""
            }`}
            onClick={() => setActiveScreen("location")}
          >
            <img src="/location.png" alt="Location" /> Location Details
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 ">
        {activeScreen === "activity" && (
          <div>
            <ActivityDetails/>
          </div>
        )}
        {activeScreen === "location" && (
          <div>
            <LocationDetails />
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
