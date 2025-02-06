
export interface Activity {
    activityName: string;
    category: string;
    description: string;
    type: string;
    location: string;
    minimumMembers: number;
    maximumMembers: number;
  }
  
  export const activitiesDatabase: Activity[] = [
    {
      activityName: "",
      category: "",
      description: "",
      type: "",
      location: "",
      minimumMembers: 0,
      maximumMembers: 0,
    },
  ];
  
  export const getAllActivities = (): Activity[] => {
    return activitiesDatabase;
  };
  
  export const addActivity = (newActivity: Activity): void => {
    activitiesDatabase.push(newActivity);
  };
  
  export const getActivityByName = (name: string): Activity | undefined => {
    return activitiesDatabase.find((activity) => activity.activityName === name);
  };
  