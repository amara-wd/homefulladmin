import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
interface NewsEntry {
  title: string;
  content: string;
  author:string;
  image?: string | null; // Optional image property
  date: string;
  time:string;
  source:string;
  readtime: number;
  excerpt:string;
}
interface NewsContextType {
  newsEntries: NewsEntry[];
  addNewsEntry: (entry: NewsEntry) => void;
  updateNewsEntry: (index: number, entry: NewsEntry) => void;
  deleteNewsEntry: (index: number) => void;
}
// Interfaces for Organization
interface OrganizationEntry {
  orgnname: string; 
  orgaddress: string;
  orgdescription: string; 
  availablebeds: string;
  orgoccupancyrate: number; //
  orgimg?: string | null;  //
  orgcontactnumber: string;
  orgemgcontactnumber: string; //
  orgtimings: string;
  amenities: { title: string; description: string }[];
  orgrules: { title: string; description: string }[]; 
  orglatitude: number;
  orglongitude: number;
  orgisfull: boolean;
  orgstandbyenabled: boolean;

}
interface OrganizationContextType {
  organizationEntries: OrganizationEntry[];
  addOrganizationEntry: (entry: OrganizationEntry) => void;
  updateOrganizationEntry: (index: number, entry: OrganizationEntry) => void;
  deleteOrganizationEntry: (index: number) => void;
}
// Interfaces for User
interface User {
  useremail: string;
  username: string;
  userpassword: string;
  userDOB: string;
  usergender: string;
  userimg?: string | null;
}
interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (index: number, user: User) => void;
  deleteUser: (index: number) => void;
}
// Interface for Parking
interface ParkingEntry {
  parkingname: string;
  parkingaddress: string;
  parkingimg?: string | null;
  parkingavailability: boolean;
  parkinghourlyrate: number;
  parkingweeklyrate: number;
  parkinglatitude: number;
  parkinglongitude: number;
  parkingcontactnumber: string;
}

interface ParkingContextType {
  parkingEntries: ParkingEntry[];
  addParkingEntry: (entry: ParkingEntry) => void;
  updateParkingEntry: (index: number, entry: ParkingEntry) => void;
  deleteParkingEntry: (index: number) => void;
}
const NewsContext = createContext<NewsContextType | undefined>(undefined);
// Organization Context
const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined); // User context
const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const defaultNews: NewsEntry = {
    title: "Welcome to Homefull Admin",
    content: "Stay updated with the latest news and updates about the Homefull Admin platform.",
    author:"author",
    readtime: 3,
    image: null, // Default news entry has no image
    date: new Date().toLocaleDateString(), 
    time: new Date().toLocaleTimeString(),
    source:"AK",
    excerpt:"jajhha",
  };
   // Default Organization Entry
   const defaultOrganization: OrganizationEntry = {
    orgnname: "Default Organization",
    orgaddress:"Organization",
    orgdescription: "Default description for the organization.",
    availablebeds: "0",
    orgoccupancyrate:0,
    orgimg: null, // Default organization entry has no image
    orgcontactnumber: "1234567890",
    orgemgcontactnumber: "1234567899",
    orgtimings: "9:00 AM - 5:00 PM",
    amenities: [
      
    ],
    orgrules:  [
      
    ],
    orglatitude: 37.7749, 
    orglongitude: -122.4194,
    orgisfull: false,
  orgstandbyenabled: true,
    
  };
  const defaultUser: User = {
    useremail: "user@example.com",
    username: "name",
    userpassword: "password123",
    userDOB: "1990-01-01",
    usergender: "Other",
    userimg: null,
  };
  // Default Parking Entry
  const defaultParking: ParkingEntry = {
    parkingname: "Default Parking",
    parkingaddress: "Default Address",
    parkingimg: null,
    parkingavailability: false,
    parkinghourlyrate: 10,
    parkingweeklyrate: 10,
    parkinglatitude: 37.7749, 
    parkinglongitude: -122.4194, 
    parkingcontactnumber: "1234567890",
  };
  
  const [newsEntries, setNewsEntries] = useState<NewsEntry[]>(() => {
    const savedEntries = localStorage.getItem("newsEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        return Array.isArray(parsedEntries) ? parsedEntries : [defaultNews];
      } catch (e) {
        console.error("Failed to parse saved news entries:", e);
        return [defaultNews];
      }
    } else {
      return [defaultNews];
    }
  });

  useEffect(() => {
    localStorage.setItem("newsEntries", JSON.stringify(newsEntries));
  }, [newsEntries]);

  const addNewsEntry = (entry: NewsEntry) => {
    setNewsEntries((prevEntries) => [...prevEntries, entry]);
  };

  const updateNewsEntry = (index: number, entry: NewsEntry) => {
    const updatedEntries = [...newsEntries];
    updatedEntries[index] = entry;
    setNewsEntries(updatedEntries);
  };

  const deleteNewsEntry = (index: number) => {
    const updatedEntries = newsEntries.filter((_, i) => i !== index);
    setNewsEntries(updatedEntries);
  };
   // State for Organization
   const [organizationEntries, setOrganizationEntries] = useState<OrganizationEntry[]>(() => {
    const savedEntries = localStorage.getItem("organizationEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        return Array.isArray(parsedEntries) ? parsedEntries : [defaultOrganization];
      } catch (e) {
        console.error("Failed to parse saved organization entries:", e);
        return [defaultOrganization];
      }
    } else {
      return [defaultOrganization];
    }
  });
  useEffect(() => {
    localStorage.setItem("organizationEntries", JSON.stringify(organizationEntries));
  }, [organizationEntries]);

  const addOrganizationEntry = (entry: OrganizationEntry) => {
    setOrganizationEntries((prevEntries) => [...prevEntries, entry]);
  };

  const updateOrganizationEntry = (index: number, entry: OrganizationEntry) => {
    const updatedEntries = [...organizationEntries];
    updatedEntries[index] = entry;
    setOrganizationEntries(updatedEntries);
  };

  const deleteOrganizationEntry = (index: number) => {
    const updatedEntries = organizationEntries.filter((_, i) => i !== index);
    setOrganizationEntries(updatedEntries);
  };
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        return Array.isArray(parsedUsers) ? parsedUsers : [defaultUser];
      } catch (e) {
        console.error("Failed to parse saved user data:", e);
        return [defaultUser];
      }
    } else {
      return [defaultUser];
    }
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const updateUser = (index: number, user: User) => {
    const updatedUsers = [...users];
    updatedUsers[index] = user;
    setUsers(updatedUsers);
  };

  const deleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };
  // State for Parking
const [parkingEntries, setParkingEntries] = useState<ParkingEntry[]>(() => {
  const savedEntries = localStorage.getItem("parkingEntries");
  if (savedEntries) {
    try {
      const parsedEntries = JSON.parse(savedEntries);
      return Array.isArray(parsedEntries) ? parsedEntries : [defaultParking];
    } catch (e) {
      console.error("Failed to parse saved parking entries:", e);
      return [defaultParking];
    }
  } else {
    return [defaultParking];
  }
});

useEffect(() => {
  localStorage.setItem("parkingEntries", JSON.stringify(parkingEntries));
}, [parkingEntries]);

const addParkingEntry = (entry: ParkingEntry) => {
  setParkingEntries((prevEntries) => [...prevEntries, entry]);
};

const updateParkingEntry = (index: number, entry: ParkingEntry) => {
  const updatedEntries = [...parkingEntries];
  updatedEntries[index] = entry;
  setParkingEntries(updatedEntries);
};

const deleteParkingEntry = (index: number) => {
  const updatedEntries = parkingEntries.filter((_, i) => i !== index);
  setParkingEntries(updatedEntries);
};
  return (
    <NewsContext.Provider value={{ newsEntries, addNewsEntry, updateNewsEntry, deleteNewsEntry }}>
      <OrganizationContext.Provider value={{ organizationEntries, addOrganizationEntry, updateOrganizationEntry, deleteOrganizationEntry }}>
        <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
        <ParkingContext.Provider value={{ parkingEntries, addParkingEntry, updateParkingEntry, deleteParkingEntry }}>
  {children}
</ParkingContext.Provider>
        </UserContext.Provider>
      </OrganizationContext.Provider>
    </NewsContext.Provider>
  );
};
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error("useParking must be used within a UserProvider");
  }
  return context;
};