import { useContext, useRef } from "react";
import { ShopContext } from "../context/ShopContext";

const Category = () => {
  const { categories, isLoadingCategories, setSelectedProduct, selectedProduct } = useContext(ShopContext);
  const scrollRef = useRef(null);

  // Map and filter categories to items (limit to 12 categories)
  const items = categories
    .filter((category) => category.name || category.images?.length > 0 || category.videos?.length > 0)
    .slice(0, 12)
    .map((category) => ({
      id: category._id,
      name: category.name || "Unnamed Category",
      images: category.images || [],
      videos: category.videos || [],
    }));

  // Handle hover to preview in left column
  const handleHover = (item, media) => {
    setSelectedProduct({
      id: item.id,
      name: item.name,
      image: media.url,
      video: media.url.endsWith(".mp4") || media.url.endsWith(".webm") ? media.url : null,
    });
  };

  // Handle click to set selected item
  const handleCategoryClick = (item, media) => {
    setSelectedProduct({
      id: item.id,
      name: item.name,
      image: media.url,
      video: media.url.endsWith(".mp4") || media.url.endsWith(".webm") ? media.url : null,
    });
  };

  // Scroll functions for slider
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="max-padd-container mt-6 xl:mt-2">
      {isLoadingCategories ? (
        <p className="text-center text-gray-600">Loading categories...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600">No categories available</p>
      ) : (
        <div className="relative">
          {/* Slider Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
          >
            &lt;
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
          >
            &gt;
          </button>

          {/* Slider Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          >
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[300px]">
                <div className="flex flex-row gap-4">
                  {[...item.images, ...item.videos].map((media, mediaIndex) => (
                    <div
                      key={mediaIndex}
                      className={`w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center ${
                        selectedProduct?.id === item.id && selectedProduct?.image === media.url ? "border-blue-500" : ""
                      }`}
                      onClick={() => handleCategoryClick(item, media)}
                      onMouseEnter={() => handleHover(item, media)}
                      onMouseLeave={() => {
                        if (selectedProduct?.id !== item.id || selectedProduct?.image !== media.url) {
                          handleHover(
                            items[0],
                            items[0].images[0] || items[0].videos[0] || { url: "https://via.placeholder.com/150" }
                          );
                        }
                      }}
                    >
                      {media.url.endsWith(".mp4") || media.url.endsWith(".webm") ? (
                        <video
                          src={media.url}
                          className="w-24 h-24 object-contain"
                          muted
                          loop
                          autoPlay
                        />
                      ) : (
                        <img src={media.url} alt={item.name} className="w-24 h-24 object-contain" />
                      )}
                    </div>
                  ))}
                  {item.images.length === 0 && item.videos.length === 0 && (
                    <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center">
                      <img src="https://via.placeholder.com/150" alt={item.name} className="w-24 h-24 object-contain" />
                    </div>
                  )}
                </div>
                {/* <p className="text-center text-xs mt-1 text-gray-700 font-serif font-semibold line-clamp-1">{item.name}</p> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;