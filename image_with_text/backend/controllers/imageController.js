import cloudinary from "../config/cloudinary.js";
import Image from "../models/imagemodel.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "image_with_text" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const newImage = await Image.create({
          url: result.secure_url,
          public_id: result.public_id,
        });

        res.json(newImage);
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
