import axiosInstance from "../API/axiosInstance";

// Fetch all Users
export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.map((user:any) => ({
      ...user,
      assigned_shelter: user.assigned_shelter || null, // Ensure assigned shelter is present
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

// Assign or unassign shelter and parking
export const assignShelter = async (
  userId: string,
  shelterIds: string[] = [], // Ensure it always expects an array
  parkingSpotIds: string[] = []
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const endpoint = "/users/assign"; // Keeping the assignment logic

    await axiosInstance.post(
      endpoint,
      {
        user_id: userId,
        shelter_ids: shelterIds, // Pass arrays
        parking_spot_ids: parkingSpotIds, // Pass arrays
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Error assigning shelter and parking:", error);
  }
};

