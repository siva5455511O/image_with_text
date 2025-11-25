import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import Editor from "./pages/Editor";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/upload" element={<Upload />} /> */}
        <Route path="/gallery" element={<Gallery />} />
         <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
