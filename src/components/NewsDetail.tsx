import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNews } from "../context/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


const NewsDetail: React.FC = () => {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { newsEntries } = useNews();
  const newsIndex = parseInt(index || "0", 10);

  if (isNaN(newsIndex) || newsIndex < 0 || newsIndex >= newsEntries.length) {
    return <p className="p-4">News not found.</p>;
  }

  const news = newsEntries[newsIndex];

  return (
    <div className="flex items-center justify-center min-h-screen ">
  <div className="p-4 max-w-lg  shadow-lg rounded-lg">
    <button
      onClick={() => navigate(-1)}
      className="mb-4  py-2  rounded-lg  text-gray-500 flex items-center space-x-2 cursor-pointer"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="" />
    </button>
    <h1 className="text-xl font-bold mb-4  text-gray-700">{news.excerpt}</h1>
    <h1 className="text-2xl font-bold mb-4  text-gray-700">{news.title}</h1>
    <div className="flex gap-2">
    <p className="text-gray-700 mb-4">
  BY <span className="underline">{news.source}</span>
</p>
    <p className="text-gray-700 mb-4 ">{news.date}</p> 
    <p className="text-gray-700 mb-4 ">{news.time}</p> 
    </div>
   
    {news.image && (
      <img
        src={news.image}
        alt={news.title}
        className="w-full max-w-md object-cover rounded-lg mx-auto"
      />
    )}
    <p className="text-gray-700 mb-4 pt-4 ">{news.content}</p>
  </div>
</div>

  );
};

export default NewsDetail;
