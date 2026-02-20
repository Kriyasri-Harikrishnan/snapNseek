import { UploadCloud } from "lucide-react";
import React, { useState } from "react";

export default function UploadBox({ onUpload, largePreview }) {
  const handleFileChange = (e) => onUpload(e.target.files[0]);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 w-full flex flex-col items-center justify-center">
      {!preview ? (
        <>
          <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-600 mb-3">Click to upload an image</p>
          <input type="file" onChange={handleFileSelect} className="hidden" id="upload" />
          <label
            htmlFor="upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
          >
            Upload Image
          </label>
        </>
      ) : (
        <img
          src={preview}
          alt="preview"
          className={`rounded-xl object-contain ${
            largePreview ? "w-4/5 max-h-96" : "w-1/2"
          }`}
        />
      )}
    </div>
  );
}
