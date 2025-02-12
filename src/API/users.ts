import axiosInstance from "../API/axiosInstance";

// Fetch all Parking
export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Add a new users entry
// export const addParking = async (parkingsData: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axiosInstance.post("/parking-spots", parkingsData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding Parking:", error);
//     throw error;
//   }
// };

// Update an existing users entry
export const updateUsers = async (usersId: string, usersData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(`/users/make-user/${usersId}`, usersData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating users:", error);
    throw error;
  }
};


// Delete a users entry
// export const deleteParking = async (parkingsId: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axiosInstance.delete(`/parking-spots/${parkingsId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting Parking:", error);
//     throw error;
//   }
// };
