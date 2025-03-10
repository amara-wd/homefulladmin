import axiosInstance from "../API/axiosInstance";

// Fetch all Parking
export const fetchParking = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/parking-spots", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Parking:", error);
    throw error;
  }
};

// Add a new Parking entry
export const addParking = async (parkingsData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/parking-spots", parkingsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding Parking:", error);
    throw error;
  }
};

// Update an existing Parking entry
export const updateParking = async (parkingsId: string, parkingsData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(`/parking-spots/${parkingsId}`, parkingsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating Parking:", error);
    throw error;
  }
};

// Delete a Parking entry
export const deleteParking = async (parkingsId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`/parking-spots/${parkingsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting Parking:", error);
    throw error;
  }
};
