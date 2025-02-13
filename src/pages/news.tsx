import React, { useState,useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaEdit, FaTrash,FaEye,FaUser ,FaClock} from "react-icons/fa";
import { fetchNews, addNews, updateNews, deleteNews } from "../API/news";
const News: React.FC = () => {
   const [adminName] = useState<string>(
         localStorage.getItem("adminName") || "John Doe"
       );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [read_time, setReadtime] = useState<number>(1);
  const [source, setSource] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [showPopup, setShowPopup] = useState(false);
const [popupContent, setPopupContent] = useState("");
const [popupTitle, setPopupTitle] = useState("");
const [news, setNews] = useState<any[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [searchReadTime, setSearchReadTime] = useState<number | "">(""); 
const handleSidebarToggle = (isOpen: boolean) => {
  setIsSidebarOpen(isOpen);
};
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value.toLowerCase());
};
const handleReadTimeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value === "" ? "" : Number(event.target.value);
  setSearchReadTime(value);
};
const filteredNews = news.filter((news) => {
  const author = news.author ? news.author.toLowerCase() : "";
  const nameMatches = author.includes(searchQuery);
  const readTimeMatches = searchReadTime === "" || news.read_time === searchReadTime;

  return nameMatches && readTimeMatches;
});
 const [profileImage] = useState<string>(
    localStorage.getItem("profileImage") || "/default-profile.png"
  );
  const handleTdClick = (title: string, content: string) => {
    setPopupTitle(title);
    setPopupContent(content);
    setShowPopup(true);
  };
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setContent("");
    setSource("");
    setExcerpt("");
    setReadtime(1);
    setImage(null);
    setEditIndex(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (title && content) {
      let base64Image = null;
      if (image) {
        base64Image = await toBase64(image);
      }
      const newEntry = {
        title,
        content,
        author,
        image: base64Image,
        read_time,
        source,
        excerpt,
        date: new Date().toISOString(),
      };
      try {
        if (editIndex !== null) {
          const updatedNews = await updateNews(news[editIndex].id, newEntry);
          // Directly update the news state without waiting for a fetch call
          setNews((prevNews) =>
            prevNews.map((item, index) =>
              index === editIndex ? updatedNews : item
            )
          );
        } else {
          const addedNews = await addNews(newEntry);
          // Add the new news entry directly to the state
          setNews((prevNews) => [...prevNews, addedNews]);
        }
        resetForm();
      } catch (error) {
        setError("An error occurred while submitting the data. Please try again.");
        console.error("Error submitting news:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please make sure all fields are filled out correctly.");
      setLoading(false);
    }
  };
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const newsData = await fetchNews();
      setNews(newsData); 
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  fetchData();
}, []);
  const toBase64 = (file: File): Promise<string | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(file);
    });
  const handleEdit = (index: number) => {
  const entry = news[index];
  setTitle(entry.title);
  setAuthor(entry.author);
  setContent(entry.content);
  setSource(entry.source);
  setExcerpt(entry.excerpt);
  setReadtime(entry.read_time);
  setEditIndex(index);
};
  const openDeleteModal = (index: number) => {
    setIsDeleteModalOpen(true);
    setEntryToDelete(index);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEntryToDelete(null);
  }; 
  const confirmDelete = async () => {
    if (entryToDelete !== null) {
      try {
        await deleteNews(news[entryToDelete].id);
        setNews((prevNews) => prevNews.filter((_, index) => index !== entryToDelete));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
    closeDeleteModal();
  };
  return (
    <div className="flex h-screen bg-gray-100 ">
    <Sidebar onSidebarToggle={handleSidebarToggle} />
    <div
        className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`} >
    <Header profileImage={profileImage} userName={adminName} />
        <div  className="p-4">
      <div className="flex gap-6  ">
    
       </div>
       <h1 className="text-3xl  font-bold mb-6 mt-2 ">News</h1>
       <form 
  onSubmit={handleSubmit}
  className="bg-white p-8 rounded-xl shadow-lg border border-gray-300  mx-auto mb-4">
  
  {/* Title & Author */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Title <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
        placeholder="Enter news title"
        required/>
    </div>
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Author</label>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
        placeholder="Enter author name"/>
    </div>
  </div>

  {/* Read Time & Excerpt */}
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Read Time (mins)</label>
      <input
        type="number"
        value={read_time}
        onChange={(e) => setReadtime(Number(e.target.value))}
        className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
        placeholder="Enter minutes"
      />
    </div>
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Excerpt</label>
      <input
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50" 
        placeholder="Short summary"
      />
    </div>
  </div>

  {/* Source & Image Upload */}
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label className="block text-gray-700 font-semibold mb-2 ">Source</label>
      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
        placeholder="Enter source"
      />
    </div>
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full file:py-2 file:px-4 file:border-0 file:text-white file:bg-[#5F25EB] focus:bg-[#3A1A82]  cursor-pointer bg-gray-50"
      />
    </div>
  </div>

  {/* Content */}
  <div className="mt-4">
    <label className="block text-gray-700 font-semibold mb-2">Content <span className="text-red-500">*</span></label>
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
      placeholder="Enter news content"
      rows={4}
      required
    ></textarea>
  </div>

  {/* Loading & Error Messages */}
  {loading && <p className="mt-3 text-purple-500">Submitting...</p>}
  {error && <p className="mt-3 text-red-500">{error}</p>}

  {/* Submit Button */}


    
  <button type="submit" className="mt-4 px-4 py-2 bg-[#5F25EB] focus:bg-[#3A1A82] text-white ">
              {editIndex !== null ? "Update News" : "Add News"} </button> 

</form>



      <div className="p-4 bg-gray-50 shadow-md rounded-lg">
      <h1 className="text-2xl  font-bold mb-4">News Table</h1>
      <div className="flex gap-4 flex-wrap mb-6">
  {/* Search by Author */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-author" className="block text-gray-700 font-semibold mb-2">Search by Author</label>
    <div className="relative">
      <input
        id="search-author"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by Author"
        className="w-full px-4 py-3 pl-10 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
      />
      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  </div>

  {/* Filter by Read Time */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-readtime" className="block text-gray-700 font-semibold mb-2">Filter by Read Time (mins)</label>
    <div className="relative">
      <input
        id="search-readtime"
        type="number"
        value={searchReadTime}
        onChange={handleReadTimeSearch}
        placeholder="Enter read time (in minutes)"
        className="w-full px-4 py-3 pl-10 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
      />
      <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  </div>
</div>

<div className="p-4 bg-gray-50 shadow-md rounded-lg">
    <div className="overflow-x-auto">
   
      <table className="min-w-full bg-white border border-gray-300 table-fixed">
        <thead>
          <tr  className="bg-gray-200">
            <th className="p-3 border text-left">Image</th>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border  text-left">Auth.</th>
            <th className="p-3 border  text-left">Excp.</th>
            <th className="p-3 border  text-left">Content</th>
            <th className="p-3 border  text-left">Source</th>
            <th className="p-3 border  text-left">Read T.</th>
            <th className="p-3 border  text-left">Tags</th>
            <th className="p-3 border  text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
  {filteredNews.map((news, index) => (
    <tr key={news.id} className="hover:bg-gray-100">
      <td className="border p-3">
        {news.image ? (
          <img
            src={news.image}
            alt={news.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">No image</span>
        )}
      </td>
     
     <td
        className="px-4 py-2 text-center border cursor-pointer hover:bg-gray-200"
        onClick={() => handleTdClick("Title", news.title)}
      >
        <FaEye />
      </td>
      <td className="border p-3 cursor-pointer hover:bg-gray-200">
        {news.author}
      </td>
     
       <td
                    className="border p-3 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleTdClick("Excerpt", news.excerpt)}
                  ><FaEye /> </td>
      <td className="px-4 py-2 border border-gray-200 ">
        {news.content}
      </td>
      <td className="px-4 py-2 border border-gray-200 ">
        {news.source}
      </td>
      <td className="px-4 py-2 border border-gray-200">
        {news.read_time}
      </td>
      <td className="px-4 py-2 border border-gray-200 ">
        {news.tags}
      </td>
      <td className=" p-3 flex gap-2  border-gray-200">
      
          <button
            onClick={() => handleEdit(index)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => openDeleteModal(index)}
            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FaTrash />
          </button>
      </td>
    </tr>
  ))}
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-lg font-semibold mb-4">{popupTitle}</h2>
        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: popupContent }}
        /><button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setShowPopup(false)}> Close </button>
      </div>
    </div>
  )}
           {isDeleteModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this news entry?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )}
        </tbody>
      </table>
    </div>
</div>
      </div>
    </div>  
    </div>
    </div>
  ); 
};
export default News;
