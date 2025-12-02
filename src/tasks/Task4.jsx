
    /* ---------------------------------------------
      Document Upload
     --------------------------------------------- */
import React, { useState, useRef } from "react";
import { FiFile, FiTrash2 } from "react-icons/fi";

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  const handleBrowse = () => fileInputRef.current.click();
 /* ---------------------------------------------
      Funtion to add files
     --------------------------------------------- */
  const addFiles = (filesList) => {
    const newDocs = Array.from(filesList).map((file) => ({
      title: file.name,
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };
 /* ---------------------------------------------
      Funtion to handle File Change
     --------------------------------------------- */
  const handleFileChange = (e) => {
    if (e.target.files.length) addFiles(e.target.files);
  };
 /* ---------------------------------------------
      Funtion to handle File Remove
     --------------------------------------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();
 /* ---------------------------------------------
      Funtion to handle File Delete
     --------------------------------------------- */
  const handleDelete = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
        <div className="w-full p-6  bg-gradient-to-br from-blue-40 to-indigo-100">
    <div className="max-w-xl mx-auto mt-6 p-4">
      <h2 className="text-lg font-semibold mb-4">Add Documents</h2>

      {/* Upload Row */}
      <div className="flex items-center gap-3 mb-4 bg-[#E3F4F1] p-3 rounded-xl border border-[#A7E0D7]">
        <button
          type="button"
          onClick={handleBrowse}
          className="bg-[#45C1AF] text-white px-8 py-2 rounded-full text-sm hover:bg-[#34ad9c] transition"
        >
          Browse
        </button>

        <span className="text-gray-500 font-medium text-sm">OR</span>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex-1 border-2 border-dashed border-[#87D1C7] p-2 rounded-xl text-center text-[#45C1AF] cursor-pointer text-sm hover:border-[#45C1AF]"
        >
          Drag and Drop file here
        </div>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button className="px-6 py-2 bg-[#E6E6E6] text-gray-700 rounded-lg text-sm hover:bg-[#DCDCDC]">
          Cancel
        </button>

        <button className="px-6 py-2 bg-[#1A1A27] text-white rounded-lg text-sm hover:bg-[#12121b]">
          Add Document
        </button>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-1"
          >
            <div className="flex items-center gap-2">
              <FiFile className="text-xl text-black" />
              <span className="font-semibold">{doc.title}</span>
            </div>

            <button onClick={() => handleDelete(idx)}>
              <FiTrash2 className="text-red-500 text-xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
