import axiosInstance from "../API/axiosInstance";

// Fetch all news
export const fetchNews = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/news", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

// Add a new news entry
export const addNews = async (newsData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/news", newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding news:", error);
    throw error;
  }
};

// Update an existing news entry
export const updateNews = async (newsId: string, newsData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(`/news/${newsId}`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

// Delete a news entry
export const deleteNews = async (newsId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`/news/${newsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};
