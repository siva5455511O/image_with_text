import { useState } from "react";
import { uploadImage } from "../services/api";
import { useNavigate } from "react-router-dom";
import homeimage from "../assets/tools-feature_edit-text-in-image_hero_mobile4x.png";

function Home() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await uploadImage(formData);
      // Assuming backend returns { success: true, data: { _id, url } }
      const uploadedImage = res.data; 

      // Navigate directly to editor page with the new image's ID
      navigate(`/editor/${uploadedImage._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* FULL BACKGROUND IMAGE */}
      <img
        src={homeimage}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* OVERLAY BLACK SHADE */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-transparent backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div
        style={{ padding: "20px", textAlign: "center" }}
        className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20"
      >
        {/* LEFT CONTENT */}
        <div className="space-y-7">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#222] leading-tight drop-shadow-sm">
            Edit Text in Images <br /> Easily with React vite + Cloudinary
          </h1>

          {/* Rating */}
          <div
            style={{ marginLeft: "190px" }}
            className="flex text-yellow-500 text-3xl "
          >
            ★★★★★
          </div>

          <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
            Upload any image and modify or remove text instantly. No Photoshop.
            No complex tools. A clean and easy-to-use text editing tool built by
            Siva.
          </p>

          {/* Upload Button */}
          <div
            style={{ marginLeft: "180px", marginTop: "10px" }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <label
              style={{ padding: "10px" }}
              className="cursor-pointer inline-flex items-center gap-3 bg-orange-300 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:bg-orange-600 transition active:scale-95"
            >
              <span className="text-xl">⬆</span> Upload Image
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>

            {image && (
              <button
                onClick={handleUpload}
                style={{ padding: "10px" }}
                className="bg-black text-white px-8 py-4 rounded-full shadow-lg hover:bg-gray-900 transition active:scale-95"
              >
                Continue →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — HERO IMAGE */}
        <div className="flex justify-center">
          <img
            src={homeimage}
            alt="hero"
            className="w-[100%] lg:w-[100%] drop-shadow-xl rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
