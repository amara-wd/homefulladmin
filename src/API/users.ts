import axiosInstance from "../API/axiosInstance";

// Fetch all Users
export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Ensure the response includes assigned shelter info
    return response.data.map((user: any) => ({
      ...user,
      assigned_shelter: user.assigned_shelter || null, // Ensure the key exists
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


// Update user role
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const token = localStorage.getItem("token");
    const endpoint = role === "manager" ? "/users/make-manager" : "/users/make-user";
    await axiosInstance.post(endpoint, { user_id: userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};

// Assign or unassign shelter
export const assignShelter = async (userId: string, shelterId: string, assign = true) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const endpoint = assign ? "/users/assign" : "/users/unassign";
    await axiosInstance.post(
      endpoint,
      { user_id: userId, shelter_id: shelterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(`Error ${assign ? "assigning" : "unassigning"} shelter:`, error);
  }
};

