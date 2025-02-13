import React, { useState ,useEffect} from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaEdit, FaTrash,FaEye ,FaSearch } from "react-icons/fa";
import { updateParking, addParking, deleteParking, fetchParking } from "../API/parking";

const Parking: React.FC = () => {
 
 const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [adminName] = useState<string>(
         localStorage.getItem("adminName") || "John Doe"
       );
const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profileImage] = useState<string>( localStorage.getItem("profileImage") || "/default-profile.png"); 
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [image_url, setImageUrl] = useState<File | null>(null);

    const [available_now, setAvailableNow] = useState(0);
  const [hourly_rate, setHourlyRate] = useState(0);
  const [daily_rate, setDaily_rate] = useState(0);
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
    const [contact_number, setContactNumber] = useState("");

const [parkings, setParkings] = useState<any[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [availabilityFilter, setAvailabilityFilter] = useState(""); // New state for availability filter

const [showPopup, setShowPopup] = useState(false);
const [popupContent, setPopupContent] = useState("");
const [popupTitle, setPopupTitle] = useState("");
const handleTdClick = (title: string, content: string) => {
  setPopupTitle(title);
  setPopupContent(content);
  setShowPopup(true);
};
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value.toLowerCase());
};
const handleAvailabilityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setAvailabilityFilter(event.target.value);
};
const filteredParkings = Array.isArray(parkings)
  ? parkings.filter((parking) => {
      const name = parking.name ? parking.name.toLowerCase() : "";
      const matchesName = name.includes(searchQuery);
      const matchesAvailability =
        availabilityFilter === "" || parking.available_now.toString() === availabilityFilter;
      return matchesName && matchesAvailability;
    })
  : [];


const resetForm = () => {
  setName("");
  setAddress("");
  setAvailableNow(0);
  setContactNumber("");
  setLatitude(37.7749);
  setLongitude(-122.4194);
  setHourlyRate(0);
  setDaily_rate(0);
  setImageUrl(null);
  setEditIndex(null);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  console.log("Submitting with image_url:", image_url); 
  if (name && address) {
  let base64Image = null;
  if (image_url instanceof File) {
    try {
      base64Image = await toBase64(image_url);
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setError("Invalid image file. Please select a valid file.");
      setLoading(false);
      return;
    }
  }

  const newEntry = {
    name,
    address,
    latitude,
    longitude,
    image_url: base64Image, // Ensure this is always set even if image_url is null
    available_now,
    contact_number,
    hourly_rate,
    daily_rate,
  };

  try {
    if (editIndex !== null) {
      const updatedParking = await updateParking(parkings[editIndex].id, newEntry); // Make sure updateParking is imported
      setParkings((prevParkings) =>
        prevParkings.map((item, index) =>
          index === editIndex ? updatedParking : item
        )
      );
    } else {
      const addedParkings = await addParking(newEntry);
      setParkings((prevParkings) => [...prevParkings, addedParkings]);
    }
    resetForm();
  } catch (error) {
    setError("An error occurred while submitting the data. Please try again.");
    console.error("Error submitting parkings:", error);
  } finally {
    setLoading(false);
  }
}
  else {
    setError("Please make sure all fields are filled out correctly.");
    setLoading(false);
  }
};

const toBase64 = (file: File): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(null);
    reader.readAsDataURL(file);
  });

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const parkingsData = await fetchParking();  // Fetch data from the API
        setParkings(parkingsData);  // Assuming your data is in a `data` array
      
      } catch (error) {
        setError("An error occurred while fetching parkings.");
        console.error("Error fetching parkings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


    

  const handleEdit = (index: number) => {
    const entry = parkings[index];
    setName(entry.name);
    setAddress(entry.address);
    setAvailableNow(entry.available_now);
    setContactNumber(entry.contact_number);
    setLatitude(entry.latitude);
    setLongitude(entry.longitude);
    setHourlyRate(entry.hourly_rate);
    setDaily_rate(entry.daily_rate);
    // setImageUrl(entry.image_url);
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
          await deleteParking(parkings[entryToDelete].id);
          setParkings((prevParkings) => prevParkings.filter((_, index) => index !== entryToDelete));
        } catch (error) {
          console.error("Error deleting parkings:", error);
        }
      }
      closeDeleteModal();
    };

 

 
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSidebarToggle={(isOpen) => setIsSidebarOpen(isOpen)} />
      <div
        className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header profileImage={profileImage} userName={adminName} />
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6 mt-2">Parkings</h1>

          {/* Parking Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    
    {/* Parking Name */}
    <div className="flex flex-col">
      <label htmlFor="parkingname" className="block text-gray-700 mb-2">Name</label>
      <input
        type="text"
        id="parkingname"
        name="parkingname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Parking Name"
        className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        required
      />
    </div>

    {/* Parking Address */}
    <div className="flex flex-col">
      <label htmlFor="parkingaddress" className="block text-gray-700 mb-2">Address</label>
      <input
        type="text"
        id="parkingaddress"
        name="parkingaddress"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Parking Address"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        required
      />
    </div>

    {/* Parking Availability */}
    <div className="flex flex-col">
      <label htmlFor="parkingavailability" className="block text-gray-700 mb-2">Availability</label>
      <select
        id="parkingavailability"
        name="parkingavailability"
        value={available_now}
        onChange={() => setAvailableNow(available_now === 1 ? 0 : 1)}
        
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
       
      >
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>
    </div>
    <div className="grid grid-cols-2 gap-4">
    {/* Parking Hourly Rate */}
    <div className="flex flex-col">
      <label htmlFor="parkinghourlyrate" className="block text-gray-700 mb-2">Hourly Rate</label>
      <input
        type="number"
        id="parkinghourlyrate"
        name="parkinghourlyrate"
        value={hourly_rate}
        onChange={(e) => setHourlyRate(Number(e.target.value))}
        placeholder="Hourly Rate"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
      
      />
    </div>

    {/* Parking Weekly Rate */}
    <div className="flex flex-col">
      <label htmlFor="parkingweeklyrate" className="block text-gray-700 mb-2">Weekly Rate</label>
      <input
        type="number"
        id="parkingweeklyrate"
        name="parkingweeklyrate"
        value={daily_rate}
        onChange={(e) => setDaily_rate(Number(e.target.value))}
        placeholder="Weekly Rate"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        
      />
    </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
    {/* Latitude */}
    <div className="flex flex-col">
      <label htmlFor="parkinglatitude" className="block text-gray-700 mb-2">Latitude</label>
      <input
        type="number"
        id="parkinglatitude"
        name="parkinglatitude"
        value={latitude }
        onChange={(e) => setLatitude(parseFloat(e.target.value))}
        placeholder="Latitude"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        
      />
    </div>

    {/* Longitude */}
    <div className="flex flex-col">
      <label htmlFor="parkinglongitude" className="block text-gray-700 mb-2">Longitude</label>
      <input
        type="number"
        id="parkinglongitude"
        name="parkinglongitude"
        value={longitude}
        onChange={(e) => setLongitude(parseFloat(e.target.value))}
        placeholder="Longitude"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        
      />
    </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
    {/* Contact Number */}
    <div className="flex flex-col">
      <label htmlFor="parkingcontactnumber" className="block text-gray-700 mb-2">Contact Number</label>
      <input
        type="text"
        id="parkingcontactnumber"
        name="parkingcontactnumber"
        value={contact_number}
        onChange={(e) => setContactNumber(e.target.value)}
        placeholder="Contact Number"
        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#5F25EB] bg-gray-50"
     
        
      />
    </div>
    

    {/* Parking Image */}
    <div className="flex flex-col">
      <label htmlFor="parkingimg" className="block text-gray-700 mb-2">Parking Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          console.log("Selected file:", file);
          setImageUrl(file);
        }}
        className="w-full file:py-2 file:px-4 file:border-0 file:text-white file:bg-[#5F25EB] focus:bg-[#3A1A82] cursor-pointer bg-gray-50"
      />
    </div>
   
   </div>
  </div>

     {/* Loading & Error Messages */}
     {loading && <p className="mt-3 text-purple-500">Submitting...</p>}
  {error && <p className="mt-3 text-red-500">{error}</p>}
  <button type="submit" className="mt-4 px-4 py-2 bg-[#5F25EB] focus:bg-[#3A1A82] text-white ">
              {editIndex !== null ? "Update Parking" : "Add Parking"} </button> 
 
</form>
<div className="p-4 bg-gray-50 shadow-md rounded-lg mt-5">
<div className="flex gap-4 mb-6 flex-wrap">
  {/* Search by Name */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-name" className="block text-gray-700 font-semibold mb-2">
      Search by Name
    </label>
    <div className="relative">
      <input
        id="search-name"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by Name"
        className="w-full px-4 py-3 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  </div>

  {/* Search by Availability */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-availability" className="block text-gray-700 font-semibold mb-2">
      Filter by Availability
    </label>
    <select
      id="search-availability"
      value={availabilityFilter}
      onChange={handleAvailabilityChange}
      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
    >
      <option value="">All</option>
      <option value="1">Available</option>
      <option value="0">Not Available</option>
    </select>
  </div>
</div>

</div>
          {/* List of Parking Entries */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-200">Img</th>
                  <th className="px-4 py-2 border border-gray-200">Name</th>
                  <th className="px-4 py-2 border border-gray-200">Add.</th>
                  <th className="px-4 py-2 border border-gray-200">Hr Rate</th>
                  <th className="px-4 py-2 border border-gray-200">Wk Rate</th>
                  <th className="px-4 py-2 border border-gray-200">Latitude</th>
                  <th className="px-4 py-2 border border-gray-200">Longitude</th>
                  <th className="px-4 py-2 border border-gray-200">Contact</th>
                  <th className="px-4 py-2 border border-gray-200">Availibility</th>
                  <th className="px-4 py-2 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParkings.map((parkings, index) => (
                  <tr key={parkings.id} className="hover:bg-gray-50">

                    <td className="border p-3">
        {parkings.image_url ? (
          <img
            src={parkings.image_url}
            alt={parkings.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">No image</span>
        )}
      </td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.name}</td>
                  
                     <td
                            className="px-4 py-2 text-center border cursor-pointer hover:bg-gray-200"
                            onClick={() => handleTdClick("Address", parkings.address)}
                          >
                            <FaEye />
                          </td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.hourly_rate}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.daily_rate}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.latitude}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.longitude}</td>
                    <td className="px-4 py-2 border border-gray-200 text-center">{parkings.contact_number}</td>
                     <td className="px-4 py-2 border border-gray-200 text-center">
        {parkings.available_now ? "Available" : "Not Available"}
      </td>
                    <td className="px-4 py-2 border border-gray-200">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="px-4 py-2 bg-yellow-500 text-white  rounded-lg hover:bg-yellow-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModal(index)}
                          className="px-4 py-3 bg-red-500 text-white rounded-lg  hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
                      <p>Are you sure you want to delete this parking entry?</p>
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
  );
};

export default Parking;
