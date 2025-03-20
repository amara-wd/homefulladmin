import React, { useState,useEffect  } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { FaEye ,FaEdit, FaTrash,FaSearch,FaBed } from "react-icons/fa"; 
import { fetchShelters, addShelter, updateShelter, deleteShelter  } from "../API/shelter";
const Shelter: React.FC = () => {
 const [profileImage] = useState<string>( localStorage.getItem("profileImage") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC71DQ4-MmziD-OYefebcWaYZB78NLwclD8A&s"); 
  const [adminName] = useState<string>(
        localStorage.getItem("adminName") || "John Doe"
      );
  const [orgnname, setOrgnname] = useState("");
  const [orgaddress, setOrgaddress] = useState("");
  const [orgcontactnumber, setOrgcontactnumber] = useState("");
  const [orgtimings, setOrgtimings] = useState("");
  const [orgdescription, setOrgdescription] = useState("");
  const [orgrules, setRules] = useState<{ title: string, description: string }[]>([]);
const [ruleTitle, setRuleTitle] = useState('');
const [ruleDescription, setRuleDescription] = useState('');
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [orglatitude, setOrglatitude] = useState(37.7749);
const [orglongitude, setOrglongitude] = useState(-122.4194);
const [orgisfull, setOrgisfull] = useState(0);
const [orgstandbyenabled, setOrgstandbyenabled] = useState(0);
const [orgoccupancyrate, setOrgoccupancyrate] = useState(0);
const [orgimg, setOrgimg] = useState<File | null>(null);
const [orgemgcontactnumber, setOrgemgcontactnumber] = useState("");
const [availablebeds, setAvailablebeds] = useState("");
const [amenities, setAmenities] = useState<{ title: string, description: string }[]>([]);
const [editIndex, setEditIndex] = useState<number | null>(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [shelters, setShelters] = useState<any[]>([]);  // Assuming the shelters will be in an array
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [showPopup, setShowPopup] = useState(false);
const [popupContent, setPopupContent] = useState("");
const [popupTitle, setPopupTitle] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchbed, setSearchbed] = useState("");
const [searchStandby, setSearchStandby] = useState<string>("");
const [currentShelterId, setCurrentShelterId] = useState<number | null>(null);
const handleTdClick = (title: string, content: string) => {
  setPopupTitle(title);
  setPopupContent(content);
  setShowPopup(true);
};
const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value.toLowerCase());
};
const handleSearchbed = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchbed(event.target.value.toLowerCase());
};
const filteredShelters = shelters.filter((shelter) => {
  const nameMatches = shelter.name.toLowerCase().includes(searchQuery);
  const bedsMatch = shelter.available_beds.toString().includes(searchbed);
  const standbyMatch = searchStandby === "" || shelter.standby_enabled.toString() === searchStandby;
  return nameMatches && bedsMatch && standbyMatch;
});
  // Ensure you are never setting `amenities` to a non-array value
  const addAmenity = () => {
    if (title && description) {
      setAmenities(prevAmenities => [...prevAmenities, { title, description }]);
      setTitle('');
      setDescription('');
    }
  };
  const addRule = () => {
    if (ruleTitle && ruleDescription) {
      setRules(prevRules => [...prevRules, { title: ruleTitle, description: ruleDescription }]);
      setRuleTitle('');
      setRuleDescription('');
    }
  };
useEffect(() => {
  const fetchData = async () => {
    try {
      const sheltersData = await fetchShelters();
      setShelters(sheltersData);  
    } catch (error) {
      console.error("Error fetching shelters:", error);
    }
  };
  fetchData();
}, []); 
const handleSidebarToggle = (isOpen: boolean) => {
  setIsSidebarOpen(isOpen);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
      // console.log("State before submission:", { orgisfull, orgstandbyenabled });
      const finalIsFull = orgisfull === 1 ? true : false;
const finalStandbyEnabled = orgstandbyenabled === 1 ? true : false;
 const amenitiesString = amenities && amenities.length ? amenities.map(amenity => `${amenity.title}#-#${amenity.description}`).join('*-*') : '';
const rulesString = orgrules && orgrules.length ? orgrules.map(rule => `${rule.title}#-#${rule.description}`).join('*-*') : '';
  if (
    orgnname &&
    orgaddress &&
    availablebeds &&
    Number.isFinite(orglatitude) &&
    Number.isFinite(orglongitude) &&
    orgoccupancyrate !== undefined &&
    orgisfull !== undefined &&
    orgstandbyenabled !== undefined
  ) {
      let base64Image = null;
      if (orgimg) {
        base64Image = await toBase64(orgimg); // Convert image to base64
      }
      const newEntry = {
        name: orgnname,
        address: orgaddress,
        contact_number: orgcontactnumber,
        open_hours: orgtimings,
        description: orgdescription,
        rules: rulesString,
        amenities: amenitiesString,
        latitude: orglatitude.toString(),
        longitude: orglongitude.toString(),   
        is_full: finalIsFull, 
        standby_enabled: finalStandbyEnabled, 
        occupancy_rate: orgoccupancyrate.toString(),
        available_beds: availablebeds.toString(),
        image_url: base64Image !== null ? base64Image : null,
        emergency_contact:  orgemgcontactnumber,
   };
//    console.log("Final Submitted Data:", {
//     is_full: Number(orgisfull),
//     standby_enabled: Number(orgstandbyenabled),
// });
   try {
    // If editing, update the shelter; otherwise, add a new shelter
    if (editIndex !== null) {
      await updateShelter(shelters[editIndex].id, newEntry);
    } else {
      await addShelter(newEntry);
    }
   // Reset form fields after submission
    setOrgnname("");
    setOrgaddress("");
    setOrgcontactnumber("");
    setOrgtimings("");
    setOrgdescription("");
    setRules([]);
    setAmenities([]);
    setOrglatitude(37.7749);
    setOrglongitude(-122.4194);
    setOrgisfull(0);
    setAvailablebeds("");
    setOrgstandbyenabled(0);
    setOrgoccupancyrate(1);
    setOrgimg(null);
    setOrgemgcontactnumber("");
    setEditIndex(null); 
  //refetch after submission
      const sheltersData = await fetchShelters();
      setShelters(sheltersData); 
    } catch (error) {
      console.error(error);
      // Handle error if the submission fails
      setError("An error occurred while submitting the data. Please try again.");
    } finally {
      // Stop loading state
      setLoading(false);
    }
    }
    else {
      // Handle invalid form case
      setError("Please make sure all fields are filled out correctly.");
      setLoading(false); // Stop loading if validation fails
    }
  };
  useEffect(() => {
    // console.log("Updated orgisfull:", orgisfull);
    // console.log("Updated orgstandbyenabled:", orgstandbyenabled);
}, [orgisfull, orgstandbyenabled]);
  // Convert file to base64
  const toBase64 = (file: File): Promise<string | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(file);
    });
  // Handle editing of an organization entry
  const handleEdit = (index: number) => {
    const shelter = shelters[index];
    setOrgnname(shelter.name); // Use correct property names
    setOrgaddress(shelter.address);
    setOrgdescription(shelter.description);
    setOrgtimings(shelter.open_hours);
    setAvailablebeds(shelter.available_beds); 
    setOrgcontactnumber(shelter.contact_number);
    setOrglatitude(parseFloat(shelter.latitude)); // Ensure it's a number
    setOrglongitude(parseFloat(shelter.longitude)); // Ensure it's a number
    setOrgoccupancyrate(parseFloat(shelter.occupancy_rate)); // Convert to number
    setOrgisfull(shelter.is_full ? 1 : 0);
    setOrgstandbyenabled(shelter.standby_enabled ? 1 : 0);
    setOrgemgcontactnumber(shelter.emergency_contact);
    // Convert rules and amenities from string to array
    setRules(shelter.rules ? shelter.rules.split("*-*").map((rule: string) => {
      const [title, description] = rule.split("#-#");
      return { title, description };
  }) : []);
  setAmenities(shelter.amenities ? shelter.amenities.split("*-*").map((amenity: string) => {
      const [title, description] = amenity.split("#-#");
      return { title, description };
  }) : []);
  setOrgimg(null); // Reset image input
    setEditIndex(index);
};
const handleDeleteClick = (shelterId: number) => {
  setCurrentShelterId(shelterId);
  setIsModalOpen(true); // Show the modal
};
const handleDeleteShelter = async () => {
  if (currentShelterId !== null) {
    try {
      await deleteShelter(currentShelterId.toString()); // Call your delete function
      setShelters((prevShelters) => prevShelters.filter(shelter => shelter.id !== currentShelterId));
      setIsModalOpen(false); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting shelter:", error);
    }
  }
};
  return (
    <div className="flex h-screen bg-gray-100 ">
    <Sidebar onSidebarToggle={handleSidebarToggle} />
    <div
        className={`flex-grow transition-all duration-300 ease-in-out bg-white shadow-inner overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0" }`} >
       <Header profileImage={profileImage} userName={adminName} />
        <div  className="p-6">
      <div className="flex gap-6">
        <h1 className="text-3xl font-bold mb-6">Shelters</h1>
      </div> 
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">     
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700">Name<span className="text-red-500 text-md font-bold "> *</span></label>
      <input type="text" required value={orgnname} onChange={(e) => setOrgnname(e.target.value)} placeholder="Shelter Name" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    <div>
      <label className="block text-gray-700">Address<span className="text-red-500 text-md font-bold"> *</span></label>
      <input type="text" required value={orgaddress} onChange={(e) => setOrgaddress(e.target.value)} placeholder="Address" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    <div className="mb-4">
        <label className="block text-gray-700">Amenities</label>
        <div className="flex mb-2 ">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-2 w-1/2 mr-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-2 w-1/2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]"
          />
          <button
            onClick={addAmenity}
            className="ml-2 p-2 px-3.5 bg-[#5F25EB] text-white focus:bg-[#3A1A82]"
          >
            +
          </button>
        </div>
        {amenities.length > 0 && (
  <div className="mt-4">
    <h4 className="font-bold">Added Amenities:</h4>
    <ul>
      {amenities.map((amenity, index) => (
        <li key={index}>
          <strong> {amenity.title}: </strong> {amenity.description}
        </li>
      ))}
    </ul>
  </div>
)}
</div>
    <div className="mb-4">
    <label className="block text-gray-700">Rules</label>
    <div className="flex mb-2">
      <input
        type="text"
        value={ruleTitle}
        onChange={(e) => setRuleTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-1/2 mr-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]"
      />
      <input
        type="text"
        value={ruleDescription}
        onChange={(e) => setRuleDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-1/2 bg-gray-50"
      />
      <button
        onClick={addRule}
        className="ml-2 p-2 px-3.5 bg-[#5F25EB] text-white focus:outline-none focus:ring-2 focus:bg-[#3A1A82]"
      > +
      </button>
    </div>
    {orgrules.length > 0 && (
      <div className="mt-4">
        <h4 className="font-bold">Added Rules:</h4>
        <ul>
          {orgrules.map((rule, index) => (
            <li key={index}>
             <strong>  {rule.title}:</strong>  {rule.description}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
    <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700">Contact No.</label>
      <input type="text" value={orgcontactnumber} onChange={(e) => setOrgcontactnumber(e.target.value)} placeholder="Contact Number" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    <div>
      <label className="block text-gray-700">Emergency</label>
      <input type="text" value={orgemgcontactnumber} onChange={(e) => setOrgemgcontactnumber(e.target.value)} placeholder="Emergency Contact" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700">Timings</label>
      <input type="text" value={orgtimings} onChange={(e) => setOrgtimings(e.target.value)} placeholder="Timings" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    <div>
      <label className="block text-gray-700">Image</label>
      <input type="file"
       accept="image/*" 
       onChange={(e) => setOrgimg(e.target.files?.[0] || null)} 
        className="w-full file:py-2 file:px-4 file:border-0 file:text-white file:bg-[#5F25EB] focus:bg-[#3A1A82] cursor-pointer bg-gray-50"/>
    

    </div>
    </div>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700">Total Beds<span className="text-red-500 text-md font-bold"> *</span></label>
      <input type="number" required value={availablebeds} onChange={(e) => setAvailablebeds(e.target.value)} placeholder="Available Beds" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    <div>
      <label className="block text-gray-700">Occ%</label>
      <input type="number" required value={orgoccupancyrate} onChange={(e) => setOrgoccupancyrate(parseInt(e.target.value, 10))} placeholder="Occupacy Rate" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" />
    </div>
    </div>
    <div>
      <label className="block text-gray-700">Description</label>
      <textarea value={orgdescription} onChange={(e) => setOrgdescription(e.target.value)} placeholder="Description" className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]" rows={1}></textarea>
    </div>
   <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700  mb-1">Lat</label>
        <input
          type="number"
          value={orglatitude}
          onChange={(e) => setOrglatitude(parseFloat(e.target.value))}
          placeholder="Latitude"
          className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]"
        />
      </div>
      <div>
        <label className="block text-gray-700  mb-1">Long</label>
        <input
          type="number"
          value={orglongitude}
          onChange={(e) => setOrglongitude(parseFloat(e.target.value))}
          placeholder="Longitude"
          className="border p-2 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5F25EB]"
        />
      </div>
    </div>
   <div className="grid grid-cols-2 gap-4">
    <div >
      <label className="block text-gray-700  mr-2">Shelter Full?</label>
      <input
        type="checkbox"
        checked={orgisfull === 1}
        onChange={() => setOrgisfull(orgisfull === 1 ? 0 : 1)}
        className="mt-2 ml-2 w-6 h-6 "
      />
    </div>
    <div >
      <label className="block text-gray-700  mr-2">Standby Enabled?</label>
      <input
        type="checkbox"
        checked={orgstandbyenabled === 1}
        onChange={() => setOrgstandbyenabled(orgstandbyenabled === 1 ? 0 : 1)}
         className="mt-2 ml-2 w-6 h-6"
      />
    </div>
    </div>
  </div>
  
  {loading && <p className="mt-3 text-purple-500">Submitting...</p>}
    {error && <p className="text-red-500">{error}</p>}
    
  <button type="submit" className="mt-4 px-4 py-2 bg-[#5F25EB] focus:bg-[#3A1A82] text-white ">
              {editIndex !== null ? "Update Shelter" : "Add Shelter"} </button>          
</form>

<div className="p-4 bg-gray-50 shadow-md rounded-lg mt-4">
<div className="flex gap-4 mb-6 flex-wrap">
  {/* Search by Name */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-name" className="block text-gray-700 font-semibold mb-2">Search by Name</label>
    <div className="relative">
      <input
        id="search-name"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by Name"
        className="w-full px-4 py-3 pl-10 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  </div>

  {/* Search by Beds */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-beds" className="block text-gray-700 font-semibold mb-2">Search by Beds</label>
    <div className="relative">
      <input
        id="search-beds"
        type="text"
        value={searchbed}
        onChange={handleSearchbed}
        placeholder="Search by Beds"
        className="w-full px-4 py-3 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
      />
      <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  </div>

  {/* Standby Enabled */}
  <div className="flex-1 mb-4">
    <label htmlFor="search-standby" className="block text-gray-700 font-semibold mb-2">Standby Enabled</label>
    <select
      id="search-standby"
      value={searchStandby}
      onChange={(e) => setSearchStandby(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5F25EB] transition-all duration-200"
    >
      <option value="">Select Standby</option>
      <option value="1">Yes</option>
      <option value="0">No</option>
    </select>
  </div>
</div>

  
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 table-fixed">
      <thead>
        <tr className="bg-gray-200">
        <th className="border p-3 text-left">ID</th>
          <th className="border p-3 text-left">Name</th>
          <th className="border p-3 text-left">Add.</th>
          <th className="border p-3 text-left">Desc.</th>
          <th className="border p-3 text-left">Beds</th>
          <th className="border p-3 text-left">Occ%</th>
          <th className="border p-3 text-left">Phone</th>
          <th className="border p-3 text-left">Timings</th>
          <th className="border p-3 text-left">Ament.</th>
          <th className="border p-3 text-left">Rules</th>
          <th className="border p-3 text-left">Latitude</th>
          <th className="border p-3 text-left">Longitude</th>
          <th className="border p-3 text-left">SF</th>
          <th className="border p-3 text-left">Stby</th>
          <th className="border p-3 text-left">Actions</th>
        </tr>

      </thead>
      <tbody>
        {filteredShelters.map((shelter, index) => (
          <tr key={shelter.id} className="hover:bg-gray-100">
             <td className="border p-3">{shelter.id}</td>
            <td className="border p-3">{shelter.name}</td>
            {/* <td className="border p-3">{shelter.address}</td> */}
            <td
              className="border p-3 cursor-pointer hover:bg-gray-200"
              onClick={() => handleTdClick("Address", shelter.address)}
            ><FaEye /> </td>
            <td
              className="border p-3 cursor-pointer hover:bg-gray-200"
              onClick={() => handleTdClick("Description", shelter.description)}
            ><FaEye /> </td>
            <td className="border p-3">{shelter.available_beds}</td>
            <td className="border p-3">{shelter.occupancy_rate}</td>
            <td className="border p-3">{shelter.contact_number}</td>
            <td className="border p-3">{shelter.open_hours}</td>
            <td
              className="border p-3 cursor-pointer hover:bg-gray-200"
              onClick={() =>
                handleTdClick(
                  "Amenities",
                  (shelter.amenities?.split("*-*") || [])
                    .map((amenity: string) => {
                      const [title, description] = amenity.split("#-#");
                      return `<strong>${title}:</strong> ${description}`;
                    }).join("<br/>")) }><FaEye /></td>
            <td
              className="border p-3 cursor-pointer hover:bg-gray-200"
              onClick={() =>
                handleTdClick(
                  "Rules",
                  (shelter.rules?.split("*-*") || [])
                    .map((rule: string) => {
                      const [title, description] = rule.split("#-#");
                      return `<strong>${title}:</strong> ${description}`;
                    })
                    .join("<br/>"))}> <FaEye /> </td>
            <td className="border p-3">{shelter.latitude}</td>
            <td className="border p-3">{shelter.longitude}</td>
            <td className="border p-3">{shelter.is_full}</td>
            <td className="border p-3">{shelter.standby_enabled}</td>
            <td className="border p-3 flex gap-2 justify-center">
              <button
                onClick={() => handleEdit(index)}
                className="px-3.5 py-2 bg-yellow-500 text-white rounded-lg  hover:bg-yellow-600"
              ><FaEdit /> </button>
              <button
                onClick={() => handleDeleteClick(shelter.id)}
                className="px-3.5 py-3 bg-red-500 text-white rounded-lg  hover:bg-red-600"
              ><FaTrash /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-lg font-semibold mb-4">{popupTitle}</h2>
        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: popupContent }}
        /><button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setShowPopup(false)}>
          Close
        </button>
      </div>
    </div>
  )}

  {/* Confirm Delete Modal */}
  <ConfirmDeleteModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onConfirm={handleDeleteShelter}
  />
</div>
      </div>
    </div>
    </div>   
  );
};
export default Shelter;
