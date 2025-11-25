import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md text-white px-6 py-4 shadow-lg border-b border-white/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Name */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-wide hover:text-cyan-300 transition"
        >
          PixelCraft
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="relative font-medium hover:text-cyan-300 transition"
          >
            Home
          </Link>

          <Link
            to="/upload"
            className="relative font-medium hover:text-cyan-300 transition"
          >
            Upload
          </Link>

          <Link
            to="/gallery"
            className="relative font-medium hover:text-cyan-300 transition"
          >
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
