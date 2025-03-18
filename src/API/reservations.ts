import axiosInstance from "../API/axiosInstance";

// Fetch all reservations
export const fetchReservations= async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/manager/reservations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

