// import { useState } from "react";
// import { uploadImage } from "../services/api";
// import "../styles/upload.css";

// function ImageUpload() {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleUpload = async () => {
//     if (!image) return alert("Select an image first");

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", image);

//     const res = await uploadImage(formData);

//     setUploadedUrl(res.data.url);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4">

//       {/* Card */}
//       <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-8 rounded-2xl max-w-lg w-full text-center text-white">

//         <h2 className="text-3xl font-bold mb-6">Upload Image</h2>

//         {/* File Input */}
//         <input
//           type="file"
//           onChange={handleFileSelect}
//           className="w-full mb-6 bg-white/20 p-3 rounded-lg cursor-pointer"
//         />

//         {/* Preview */}
//         {preview && (
//           <img
//             src={preview}
//             className="w-full max-h-72 object-cover rounded-xl mb-6 shadow-lg"
//           />
//         )}

//         {/* Upload Button */}
//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="w-full bg-blue-600 py-3 rounded-xl text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:bg-gray-600"
//         >
//           {loading ? "Uploading..." : "Upload"}
//         </button>

//         {/* Uploaded Image */}
//         {uploadedUrl && (
//           <>
//             <h3 className="text-xl font-semibold mt-6">Uploaded:</h3>
//             <img
//               src={uploadedUrl}
//               className="w-full max-h-72 object-cover mt-4 rounded-xl shadow-lg"
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ImageUpload;
