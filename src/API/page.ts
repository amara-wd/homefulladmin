import axiosInstance from "./axiosInstance";

// Fetch all resources
export const fetchPages = async () => { 
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/pages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched Pages Response:", response.data);
    
    // if (Array.isArray(response.data)) {
    //   return response.data; 
    // } 
    // else if (response.data && typeof response.data === "object") {
      return [response.data]; 
    // } else {
    //   return []; 
    // }
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

// Add a new pages entry
 export const addPages = async (pagesData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/admin/pages", pagesData, {
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
// export const updateNews = async (newsId: string, newsData: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axiosInstance.put(`/news/${newsId}`, newsData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating news:", error);
//     throw error;
//   }
// };

// Delete a news entry
// export const deleteNews = async (newsId: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axiosInstance.delete(`/news/${newsId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting news:", error);
//     throw error;
//   }
// };
