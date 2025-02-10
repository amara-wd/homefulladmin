import axiosInstance from "../API/axiosInstance";

// Fetch all shelters
export const fetchShelters = async () => {
  try {
    const token = localStorage.getItem('token');
    // console.log('Token:', token);
    
    const response = await axiosInstance.get("/shelters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shelters:", error);
    throw error;
  }
};

// Add a new shelter
export const addShelter = async (shelterData: any) => {
  try {
    const response = await axiosInstance.post("/shelters", shelterData);
    return response.data;
  } catch (error) {
    console.error("Error adding shelter:", error);
    throw error;
  }
};

// Update a shelter
export const updateShelter = async (shelterId: string, shelterData: any) => {
  try {
    const response = await axiosInstance.put(`/shelters/${shelterId}`, shelterData);
    return response.data;
  } catch (error) {
    console.error("Error updating shelter:", error);
    throw error;
  }
};

// Delete a shelter
export const deleteShelter = async (shelterId: string) => {
  try {
    const response = await axiosInstance.delete(`/shelters/${shelterId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shelter:", error);
    throw error;
  }
};
