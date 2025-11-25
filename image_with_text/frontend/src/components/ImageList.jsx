import { useEffect, useState } from "react";
import { getImages, deleteImage } from "../services/api";
import { useNavigate } from "react-router-dom";
import homeimage from "../assets/tools-feature_edit-text-in-image_hero_mobile4x.png";

function ImageList() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const loadImages = async () => {
    const res = await getImages();

    if (Array.isArray(res.data)) {
      setImages(res.data);
    } else {
      setImages([]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    await deleteImage(id);
    loadImages();
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-start py-20 px-6">

      {/* SAME BACKGROUND LIKE HOME PAGE */}
      <img
        src={homeimage}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-transparent backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl w-full">

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#222] drop-shadow-sm mb-12">
          Your Uploaded Images
        </h1>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {images.length > 0 ? (
            images.map((img) => (
              <div
                key={img._id}
                className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:shadow-2xl transition relative"
              >
                {/* Image */}
                <img
                  src={img.url}
                  onClick={() => navigate(`/editor/${img._id}`)}
                  className="w-full h-56 object-cover rounded-xl cursor-pointer hover:scale-[1.03] transition"
                />

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(img._id)}
                  className="mt-4 w-full bg-orange-300 text-white py-2 rounded-xl hover:bg-orange-600 transition active:scale-95"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700 text-xl col-span-full">
              No images found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageList;
