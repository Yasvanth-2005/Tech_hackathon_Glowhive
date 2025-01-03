import React, { useState } from "react";
import Layout from "../../components/layout/Layout";

const Criticals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const videoUrl =
    "https://res.cloudinary.com/duo4ymk7n/video/upload/v1735888966/f5kbcmk22kmebyltklvz.mp4";

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className=" min-h-screen bg-gray-100">
        <div className="relative w-full max-w-3xl bg-black rounded-md shadow-lg">
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Video player */}
          <video
            className="w-full h-auto rounded-md"
            controls
            onLoadedData={handleLoadedData}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </Layout>
  );
};

export default Criticals;
