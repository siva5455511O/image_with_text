import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/upload", upload.single("image"), (req, res) => {
  try {
    const file = req.file;
    console.log("CLOUD NAME:", process.env.CLOUD_NAME);
    console.log("CLOUD KEY:", process.env.CLOUD_KEY);
    console.log("CLOUD SECRET:", process.env.CLOUD_SECRET);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "image_with_text" },
      (error, result) => {
        if (error) return res.status(500).json({ error });

        return res.json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default route;
