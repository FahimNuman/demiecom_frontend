import { FaCheck } from "react-icons/fa";

const ColorSelector = ({
  colors,
  selectedColors,
  hoveredColor,
  onColorChange,
  setHoveredColor,
}) => {
  return (
    <div className="mb-5 mt-3">
      {selectedColors.length > 0 && (
        <p className="mb-2 text-gray-700">
          Selected Colors: {selectedColors.join(", ")}
        </p>
      )}
      <div className="flex flex-col items-start my-2">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {colors?.map((color, i) => {
            const imageUrl = color.images?.[0]?.url || ""; // Safely get the image URL

            // Log image URL for debugging
            console.log("Image URL: ", imageUrl);

            return (
              <div key={i} className="relative">
                {/* Color block with background image */}
                <div
                  onClick={() => onColorChange(color)}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  className={`h-20 w-20 flex items-center justify-center border ${
                    selectedColors.includes(color)
                      ? "border-green-500"
                      : "border-black"
                  }`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : "", // Apply the background image if URL exists
                    backgroundSize: "cover", // Ensure the image covers the area
                    backgroundPosition: "center", // Center the image
                  }}
                >
                  {selectedColors.includes(color) && (
                    <FaCheck className="absolute top-2 right-2 text-green-500" />
                  )}
                </div>
                {/* Optionally show the image below the block */}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={color.name}
                    className="mt-2 h-12 w-12 object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
        {!colors?.length && <p>No colors available</p>}
      </div>
    </div>
  );
};

export default ColorSelector;
