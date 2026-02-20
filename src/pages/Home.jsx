import { useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UploadBox from "../components/UploadBox";
import OptionSelector from "../components/OptionSelector";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import GCVADisplay from "../components/GCVADisplay";

const BACKEND_BASE_URL = "https://8c0d3g2n95.execute-api.ap-south-1.amazonaws.com/";

export default function Home() {
  const [image, setImage] = useState(null);
  const [method, setMethod] = useState(null);
  const [results, setResults] = useState([]);
  const [gcvaData, setGcvaData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const itemsPerPage = 4;
  const ADMIN_CODE = "letmein123";

  const handleSearch = async () => {
    if (!image || !method) return alert("Upload an image and choose a method!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadRes = await axios.post(`${BACKEND_BASE_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadRes.data.url;
      if (!imageUrl) throw new Error("No image URL returned from upload step.");

      let endpoint;
      if (method === "direct") endpoint = `${BACKEND_BASE_URL}ebay/search-by-image`;
      else if (method === "rekog") endpoint = `${BACKEND_BASE_URL}rekog-search`;
      else if (method === "gcva") endpoint = `${BACKEND_BASE_URL}gcva/search-by-image`;

      const res = await axios.post(endpoint, { image_url: imageUrl });

      if (method === "gcva") {
        setGcvaData(res.data);
        setResults([]);
      } else {
        setResults(res.data.items || res.data.itemSummaries || []);
        setGcvaData(null);
      }

      setFeedback(null);
      setAnswered(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Detailed error:", err);

      if (err.response) {
        alert(
          `Server Error (${err.response.status}): ${
            err.response.data?.message || "Unexpected response from backend."
          }`
        );
      } else if (err.request) {
        alert("No response from backend. Check your EB health or CORS settings.");
      } else {
        alert(`Client-side error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (isFound) => {
    setAnswered(true);
    setFeedback(isFound ? "yes" : "no");
  };

  const fetchMetrics = async () => {
    const code = prompt("Enter admin code:");
    if (code !== ADMIN_CODE) return alert("Wrong code!");

    try {
      const res = await axios.get(`${BACKEND_BASE_URL}metrics`);
      setMetrics(res.data);
      setShowMetrics(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch metrics");
    }
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-white text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto gap-8 p-8 w-full">
        {/* Left panel: Upload */}
        <div
          className={`md:w-[35%] rounded-2xl shadow-md flex flex-col h-[80vh] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <h2
            className={`text-2xl font-bold text-center p-4 border-b z-10 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            Upload Image
          </h2>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
            <UploadBox onUpload={setImage} largePreview />

            <OptionSelector
              selected={method}
              onSelect={setMethod}
              options={["direct", "rekog", "gcva"]}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`mt-6 w-3/4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Searching..." : "Find Similar Products"}
            </button>

            <button
              onClick={fetchMetrics}
              className="mt-4 w-3/4 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
            >
              Admin: Show Metrics
            </button>

            {showMetrics && metrics && (
              <div className="mt-4 text-left w-full bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Metrics (last 7 days)</h3>
                <p>S3 Uploads: {metrics.s3Uploads}</p>
                <p>Rekognition Calls: {metrics.rekognitionCalls}</p>
                <p>eBay API Calls: {metrics.ebayCalls}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Results */}
        <div
          className={`md:w-[65%] rounded-2xl shadow-md flex flex-col h-[80vh] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <h2
            className={`text-2xl font-bold text-center p-4 border-b z-10 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            {method === "gcva" ? "Web Detection Results" : "Results Found"}
          </h2>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center w-full">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
                <svg
                  className="animate-spin h-10 w-10 text-blue-600 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <p className="text-lg">Fetching your results...</p>
              </div>
            ) : method === "gcva" && gcvaData ? (
              <GCVADisplay data={gcvaData} darkMode={darkMode} />
            ) : paginatedResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {paginatedResults.map((item, i) => (
                    <ProductCard key={i} item={item} darkMode={darkMode} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}

                <div className="mt-8 text-center">
                  {!answered ? (
                    <>
                      <p className="text-lg mb-3 font-medium">
                        Did you find what you were looking for?
                      </p>
                      <button
                        onClick={() => handleFeedback(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all"
                      >
                        Yes ✅
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="ml-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
                      >
                        No ❌
                      </button>
                    </>
                  ) : (
                    <p className="mt-4 font-semibold animate-fade-in">
                      {feedback === "yes" ? (
                        <>Awesome! Glad you found what you were looking for! 🎉</>
                      ) : (
                        <>
                          No worries! Check out the{" "}
                          <a
                            href="https://www.reddit.com/r/helpmefind"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            r/helpmefind
                          </a>{" "}
                          community! ❤️
                        </>
                      )}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
                <p className="text-lg">Your results will appear here 🔎</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}