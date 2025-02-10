import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNews } from "../context/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Shownews: React.FC = () => {
    const { index } = useParams<{ index: string }>();
      const navigate = useNavigate();
      const newsIndex = parseInt(index || "0", 10);
      const { newsEntries } = useNews();
        if (isNaN(newsIndex) || newsIndex < 0 || newsIndex >= newsEntries.length) {
          return <p className="p-8">News not found.</p>;
        }
 

        return (
            <div className="flex items-center justify-center min-h-screen">
        
              {newsEntries.length === 0 ? (
                <p className="text-gray-500">No news entries yet.</p>
              ) : (
                <div>
                  {/* Main Story */}
                  {newsEntries[0] && (
                    <div
                      className="mb-6 border-b pb-6 cursor-pointer"
                      onClick={() => navigate(`/news/0`)}
                    >
                        <button
                  onClick={() => navigate(-1)}
                  className="mb-4  py-2  rounded-lg  text-gray-500 flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="" />
                </button>
                       <h1 className="text-2xl font-bold mb-4">Top Stories</h1>
                      {newsEntries[0].image && (
                        <img
                          src={newsEntries[0].image}
                          alt={newsEntries[0].title}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        
                      )}
                       <h2 className="text-3xl font-bold mb-2">{newsEntries[0].title}</h2>
                      {/* <p className="text-gray-700 text-lg mb-2">{newsEntries[0].body}</p> */}
                      <div className="flex gap-6">
                        <p className="text-gray-500 text-sm">2 weeks ago</p>
                        <p className="text-gray-500 text-sm">3 min read</p>
                        <p className="text-gray-700 text-sm">{newsEntries[0].date}</p> 
                      </div>
                    </div>
                  )}
        
                  {/* Remaining Stories */}
                  <ul>
                    {newsEntries.slice(1).map((entry, index) => (
                      <li
                        key={index + 1}
                        className="mb-4 border-b pb-4 p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/news/${index + 1}`)}
                      >
                        <div className="flex justify-between items-start">
                          {/* Left Section: Text */}
                          <div>
                            <h3 className="text-lg font-bold">{entry.title}</h3>
                            <div className="flex gap-6 mt-2">
                            
                              <p className="text-gray-700 text-sm">{entry.date}</p> 
                              <p className="text-gray-700 text-sm">3 min read</p>
                            </div>
                          </div>
                          {/* Right Section: Image */}
                          {entry.image && (
                            <div>
                              <img
                                src={entry.image}
                                alt={entry.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        };
        

export default Shownews;
