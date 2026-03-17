// ─── Types ───────────────────────────────────────────────────────────────────

export interface Activity {
  activityName: string;
  category: string;
  description: string;
  type: string;
  location: string;
  minimumMembers: number;
  maximumMembers: number;
}

export interface LocationDraft {
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  contactNumber: string;
  contactName: string;
}

// ─── Finalized Records ───────────────────────────────────────────────────────

export const activitiesDatabase: Activity[] = [];

export const getAllActivities = (): Activity[] => {
  return activitiesDatabase;
};

export const addActivity = (newActivity: Activity): void => {
  activitiesDatabase.push(newActivity);
};

export const getActivityByName = (name: string): Activity | undefined => {
  return activitiesDatabase.find((activity) => activity.activityName === name);
};

// ─── Activity Draft ──────────────────────────────────────────────────────────

let activityDraft: Partial<Activity> | null = null;

export const getActivityDraft = (): Partial<Activity> | null => {
  return activityDraft;
};

export const saveActivityDraft = (draft: Partial<Activity>): void => {
  activityDraft = { ...draft };
};

export const clearActivityDraft = (): void => {
  activityDraft = null;
};

// ─── Location Draft ───────────────────────────────────────────────────────────

let locationDraft: Partial<LocationDraft> | null = null;

export const getLocationDraft = (): Partial<LocationDraft> | null => {
  return locationDraft;
};

export const saveLocationDraft = (draft: Partial<LocationDraft>): void => {
  locationDraft = { ...draft };
};

export const clearLocationDraft = (): void => {
  locationDraft = null;
};
