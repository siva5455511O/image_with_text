import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env
});

// UPLOAD IMAGE
export const uploadImage = (data) => API.post("/upload", data);

// GET ALL IMAGES
export const getImages = () => API.get("/images");

// DELETE IMAGE
export const deleteImage = (id) => API.delete(`/delete/${id}`);
