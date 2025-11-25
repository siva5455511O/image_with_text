import express from "express";
import multer from "multer";
import { deleteImage, getAllImages, uploadImage } from "../controllers/imagecontroller.js";

const imagerouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

imagerouter.post("/upload", upload.single("image"), uploadImage);
imagerouter.get("/images", getAllImages);
imagerouter.delete("/delete/:id", deleteImage);

export default imagerouter;
