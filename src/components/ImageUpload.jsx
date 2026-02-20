import { useState } from "react";
import UploadBox from "../components/UploadBox";
import OptionSelector from "../components/OptionSelector";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const BACKEND_BASE_URL = "https://8c0d3g2n95.execute-api.ap-south-1.amazonaws.com/upload/";

export default function Home() {
  const [image, setImage] = useState(null);
  const [method, setMethod] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  const handleSearch = async () => {
    if (!image || !method) return alert("Upload an image and choose a method!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image); 

    try {
      const uploadRes = await axios.post(`${BACKEND_BASE_URL}/upload`, formData);
      const imageUrl = uploadRes.data.url;

      const endpoint =
        method === "direct"
          ? `${BACKEND_BASE_URL}ebay/search-by-image`
          : `${BACKEND_BASE_URL}rekog-search`;
      
      const res = await axios.post(endpoint, { image_url: imageUrl });
      setResults(res.data.items || res.data.itemSummaries || []);
      setFeedback(null); 
    } catch (err) {
      console.error(err);
      alert("Error uploading or fetching results!");
    }

    setLoading(false);
  };

  const handleFeedback = (isFound) => {
    setFeedback(
      isFound
        ? "Awesome! 🎉 Glad you found what you were looking for!"
        : "No worries! Check out the r/helpmefind community ❤️"
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Snap N Seek 🔍</h1>

      <UploadBox onUpload={setImage} />
      <OptionSelector selected={method} onSelect={setMethod} />

      <button
        onClick={handleSearch}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
      >
        {loading ? "Searching..." : "Find Similar Products"}
      </button>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {results.map((item, i) => (
              <ProductCard key={i} item={item} />
            ))}
          </div>

          <div className="mt-8">
            <p className="text-lg mb-3 font-medium">
              Did you find what you were looking for?
            </p>
            <button
              onClick={() => handleFeedback(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
            >
              Yes ✅
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
            >
              No ❌
            </button>

            {feedback && (
              <p className="mt-4 text-gray-800 font-semibold">{feedback}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}