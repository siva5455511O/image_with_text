import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { deleteImage, getImages } from "../services/api";

const FALLBACK_IMAGE = "/mnt/data/homepage.DHispoUa.png";

function Editor() {
  const { id } = useParams();
  const [image, setImage] = useState(FALLBACK_IMAGE);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [textLayer, setTextLayer] = useState({
    text: "Your Text",
    x: 50,
    y: 50,
    fontSize: 36,
    color: "#000000",
    fontFamily: "Arial",
    blur: 0,
  });

  const [effects, setEffects] = useState({
    glow: false,
    outline: false,
    labelBg: false,
  });

  const dragRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await getImages();
        const found = Array.isArray(res.data)
          ? res.data.find((i) => i._id === id)
          : null;
        setImage(found?.url || FALLBACK_IMAGE);
      } catch {
        setImage(FALLBACK_IMAGE);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const startDrag = (e) => {
    isDragging.current = true;
    lastMouse.current = getClientPos(e);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDragging, { passive: false });
    document.addEventListener("touchend", stopDrag);
  };

  const stopDrag = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onDragging);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDragging);
    document.removeEventListener("touchend", stopDrag);
  };

  const getClientPos = (e) =>
    e.touches && e.touches[0]
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const onDragging = (e) => {
    if (!isDragging.current) return;
    e.preventDefault?.();
    const p = getClientPos(e);
    const dx = p.x - lastMouse.current.x;
    const dy = p.y - lastMouse.current.y;
    lastMouse.current = p;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dxPct = (dx / rect.width) * 100;
    const dyPct = (dy / rect.height) * 100;

    setTextLayer((prev) => ({
      ...prev,
      x: clamp(prev.x + dxPct, 0, 100),
      y: clamp(prev.y + dyPct, 0, 100),
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteImage(id); // delete the image by id
      alert("Image deleted successfully");
      navigate("/"); // go back to home
    } catch (err) {
      console.error(err);
      alert("Failed to delete image.");
    }
  };

  const downloadImage = () => {
    if (!image) return;

    const container = containerRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Match editor size exactly
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const imgEl = new Image();
    imgEl.crossOrigin = "anonymous";
    imgEl.src = image;

    imgEl.onload = () => {
      // Draw background image
      // Apply image blur
      ctx.filter = `blur(${textLayer.blur}px)`;
      ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none"; // text sharp-a irukka

      // Prepare text
      const lines = textLayer.text.split("\n");
      const px = (textLayer.x / 100) * canvas.width;
      const py = (textLayer.y / 100) * canvas.height;
      const lineHeight = textLayer.fontSize * 1.2; // spacing between lines

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${textLayer.fontSize}px ${textLayer.fontFamily}`;
      ctx.fillStyle = textLayer.color;

      lines.forEach((line, index) => {
        const y = py + (index - (lines.length - 1) / 2) * lineHeight;

        // Label background
        if (effects.labelBg) {
          const paddingX = 12;
          const paddingY = 6;
          const metrics = ctx.measureText(line);
          const rectWidth = metrics.width + paddingX * 2;
          const rectHeight = textLayer.fontSize + paddingY * 2;
          ctx.fillStyle = "rgba(0,0,0,0.45)";
          ctx.fillRect(
            px - rectWidth / 2,
            y - rectHeight / 2,
            rectWidth,
            rectHeight
          );
          ctx.fillStyle = textLayer.color;
        }

        // Glow effect
        ctx.shadowColor = effects.glow ? "rgba(0,0,0,0.35)" : "transparent";
        ctx.shadowBlur = effects.glow ? 18 : 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = effects.glow ? 6 : 0;

        // Outline effect
        if (effects.outline) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgba(0,0,0,0.6)";
          ctx.strokeText(line, px, y);
        }

        // Draw text
        ctx.fillText(line, px, y);
      });

      // Download
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    imgEl.onerror = () => {
      alert("Image failed to load for download.");
    };
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white/70 via-white/40 to-white/95 backdrop-blur-sm flex items-center justify-center py-10">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 px-6">
          {/* IMAGE EDITOR */}
          <div className="flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative w-[560px] h-[560px] rounded-2xl shadow-xl overflow-hidden bg-gray-50"
            >
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-semibold">
                  Loading...
                </div>
              ) : (
                <>
                  <img
                    src={image}
                    alt="editor"
                    className="w-full h-full object-cover"
                    style={{
                      filter: `blur(${textLayer.blur}px)`,
                      transition: "filter 0.2s ease",
                    }}
                  />

                  <div
                    ref={dragRef}
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                    className="absolute cursor-grab select-none whitespace-pre-wrap break-words"
                    style={{
                      left: `${textLayer.x}%`,
                      top: `${textLayer.y}%`,
                      transform: "translate(-50%, -50%)",
                      fontSize: `${textLayer.fontSize}px`,
                      color: textLayer.color,
                      fontFamily: textLayer.fontFamily,
                      padding: effects.labelBg ? "6px 12px" : 0,
                      borderRadius: effects.labelBg ? "8px" : 0,
                      background: effects.labelBg
                        ? "rgba(0,0,0,0.45)"
                        : "transparent",
                      textShadow: effects.glow
                        ? "0 6px 18px rgba(0,0,0,0.35)"
                        : "none",
                      WebkitTextStroke: effects.outline
                        ? "1.6px rgba(0,0,0,0.6)"
                        : "0px",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                  >
                    {textLayer.text}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CONTROL PANEL */}
          <aside className="w-full max-w-[520px] flex flex-col">
            <div
              style={{ padding: "20px" }}
              className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl p-6 flex-1 flex flex-col overflow-hidden"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-5">Editor</h3>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Text */}
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      Text
                    </label>
                    <textarea
                      value={textLayer.text}
                      onChange={(e) =>
                        setTextLayer({ ...textLayer, text: e.target.value })
                      }
                      rows={4} // default height
                      className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Font Size
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="200"
                      value={textLayer.fontSize}
                      onChange={(e) =>
                        setTextLayer({
                          ...textLayer,
                          fontSize: +e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Color
                    </label>
                    <input
                      type="color"
                      value={textLayer.color}
                      onChange={(e) =>
                        setTextLayer({ ...textLayer, color: e.target.value })
                      }
                      className="w-full h-10 rounded-lg border cursor-pointer"
                    />
                  </div>

                  {/* X/Y sliders */}
                  {["x", "y"].map((axis) => (
                    <div key={axis}>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {axis.toUpperCase()} (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textLayer[axis]}
                        onChange={(e) =>
                          setTextLayer({
                            ...textLayer,
                            [axis]: +e.target.value,
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(textLayer[axis])}%
                      </div>
                    </div>
                  ))}

                  {/* Blur */}
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Blur (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={textLayer.blur}
                      onChange={(e) =>
                        setTextLayer({ ...textLayer, blur: +e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                  </div>

                  {/* Effects */}
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Effects
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["glow", "outline", "labelBg"].map((eff) => (
                        <Toggle
                          key={eff}
                          active={effects[eff]}
                          onChange={() =>
                            setEffects({ ...effects, [eff]: !effects[eff] })
                          }
                        >
                          {eff.charAt(0).toUpperCase() + eff.slice(1)}
                        </Toggle>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="col-span-2 flex items-center gap-3 mt-2">
                    <label className="font-semibold text-gray-700">
                      Font Family:
                    </label>
                    <select
                      value={textLayer.fontFamily}
                      onChange={(e) =>
                        setTextLayer({
                          ...textLayer,
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-40 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    >
                      {[
                        "Arial",
                        "Poppins",
                        "Roboto",
                        "Montserrat",
                        "Times New Roman",
                        "cursive",
                        "fantasy",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="col-span-2 flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setTextLayer({
                          text: "",
                          x: 50,
                          y: 50,
                          fontSize: 36,
                          color: "#000000",
                          fontFamily: "Arial",
                          blur: 0,
                        });
                        setEffects({
                          glow: false,
                          outline: false,
                          labelBg: false,
                        });
                      }}
                      className="flex-1 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
                    >
                      Reset Layer
                    </button>

                    <button
                      onClick={downloadImage}
                      className="flex-1 py-2 rounded-lg bg-orange-400 text-white text-sm hover:bg-orange-500 transition"
                    >
                      Download
                    </button>

                    <button
                      onClick={handleDelete}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                      Delete Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Toggle({ children, active, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`px-3 py-1 rounded-full text-sm transition ${
        active ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-700"
      } hover:scale-105`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default Editor;
