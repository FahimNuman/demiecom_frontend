import { useContext, useState, useEffect, useRef, Component } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";
import Category from "../components/Category";
import ProductDetails from "../components/product/ProductDetails";
import ProductSizeTable from "../components/product/ProductSizeTable";
import { fetchAProduct } from "../components/api/product";
import { toast } from "react-toastify";

// Error Boundary Class (unchanged)
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen bg-white text-gray-800">
          <div className="text-center">
            <p className="text-sm font-serif font-bold text-gray-700">Something went wrong!</p>
            <p className="text-sm mt-1 text-gray-500">Error: {this.state.error.message}</p>
            <button
              className="mt-2 px-3 py-1 bg-gold-accent text-black text-sm hover-glow transition-all duration-300 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Custom styles (unchanged)
const customStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .column-transition {
    transition: width 0.5s ease-in-out, opacity 0.3s ease;
  }
  .premium-gradient {
    background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
  }
  .gold-accent {
    color: #d4af37;
  }
  .shadow-elegant {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .hover-glow {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-glow:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
  }
  .image-zoom-container {
    position: relative;
    overflow: hidden;
  }
  .image-zoom-container .main-image {
    transition: opacity 0.3s ease;
  }
  .zoom-magnifier {
    position: fixed !important;
    right: 50px !important;
    z-index: 1000 !important;
    border-radius: 8px !important;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.2) !important;
  }
  .zoom-icon {
    background: white;
    border-radius: 50%;
    padding: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
  }
  .zoom-icon:hover {
    background-color: #f0f0f0;
  }
  .pip-video {
    position: fixed !important;
    bottom: 15px !important;
    right: 15px !important;
    z-index: 2000 !important;
    width: 150px !important;
    height: 112px !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  }
  .middle-section-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }
  .middle-section-scroll::-webkit-scrollbar {
    display: none;
  }
  .skeleton {
    background-color: #e5e7eb;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const Product = () => {
  const { productId } = useParams();
  const {
    currency = "S",
    addTocart,
    selectedProduct,
    setSelectedProduct,
    showLeftColumn,
    setShowLeftColumn,
    categories,
  } = useContext(ShopContext);
  const [selectedColors, setSelectedColors] = useState([]);
  const [hoveredColor, setHoveredColor] = useState("");
  const [image, setImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [magnifiedPosition, setMagnifiedPosition] = useState({ x: 0, y: 0 });
  const [magnifiedBackgroundPosition, setMagnifiedBackgroundPosition] = useState("0 0");
  const [activeTab, setActiveTab] = useState("description");
  const videoRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const imageRefs = useRef([]);

  // Fetch product data
  const {
    data: productData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchAProduct(productId),
  });

  // Prepare images for gallery with specific view labels
  const viewLabels = ["FRONT VIEW", "BACK VIEW", "SIDE VIEW", "DETAIL VIEW", "STYLING VIEW"];
  const imgs =
    (selectedColors.length > 0
      ? selectedColors[selectedColors.length - 1]?.images
      : productData?.product?.colors[0]?.images
    )?.map((img, index) => ({
      url: img.image,
      label: viewLabels[index] || `VIEW ${index + 1}`,
    })) || [];

  // Debounce function to limit scroll event frequency
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Handle scroll for updating currentIndex
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const imageHeight = 700; // Fixed height of each image container
        const visibleIndex = Math.min(
          Math.round(scrollPosition / imageHeight),
          imgs.length - 1
        );
        setCurrentIndex(visibleIndex);
        setImage(imgs[visibleIndex]?.url);
      }
    }, 100);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [imgs]);

  // Handle PiP on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current && !document.pictureInPictureElement && !videoRef.current.paused) {
        videoRef.current.requestPictureInPicture().catch((error) => {
          console.error("Failed to enter Picture-in-Picture mode:", error);
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse move for zoom
  const handleMouseMove = (e, index) => {
    if (!imageRefs.current[index] || !isZoomEnabled) return;

    const rect = imageRefs.current[index].getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imgWidth = imageRefs.current[index].offsetWidth;
    const imgHeight = imageRefs.current[index].offsetHeight;

    const mouseX = Math.max(0, Math.min(x, imgWidth));
    const mouseY = Math.max(0, Math.min(y, imgHeight));

    setMousePosition({ x: mouseX, y: mouseY });

    const previewWidth = 400;
    const previewHeight = 500;
    const zoomFactor = 2;
    const bgX = -(mouseX * zoomFactor - previewWidth / 2);
    const bgY = -(mouseY * zoomFactor - previewHeight / 2);
    setMagnifiedBackgroundPosition(`${bgX}px ${bgY}px`);

    let magY = e.clientY - previewHeight / 2;
    magY = Math.max(0, Math.min(magY, window.innerHeight - previewHeight));
    setMagnifiedPosition({ y: magY });
  };

  // Toggle zoom
  const toggleZoom = () => {
    setIsZoomEnabled(!isZoomEnabled);
    setIsZoomed(!isZoomEnabled);
    toast.info(isZoomEnabled ? "Zoom disabled" : "Zoom enabled", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle category hover to show left column and update selected product
  const handleCategoryHover = (category) => {
    setShowLeftColumn(true); // Show left column on hover
    setSelectedProduct({
      id: category._id,
      name: category.name || "Unnamed Category",
      image:
        category.images?.[0]?.url ||
        category.videos?.[0]?.url ||
        "https://via.placeholder.com/150",
      video: category.videos?.[0]?.url || null,
    });
    if (videoRef.current && category.videos?.[0]?.url) {
      videoRef.current.play().catch((err) => console.error("Auto-play failed:", err));
    }
  };

  // Handle category hover end to hide left column
  const handleCategoryHoverEnd = () => {
    setShowLeftColumn(false); // Hide left column when hover ends
    setSelectedProduct(null); // Clear selected product
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white text-gray-800">
        <div className="w-full max-w-6xl p-4">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Left Column Skeleton */}
            <div className="w-full md:w-1/5 h-[700px] shadow-elegant bg-gray-200 animate-pulse"></div>
            {/* Middle Column Skeleton */}
            <div className="w-full md:w-2/3 h-[700px] shadow-elegant bg-gray-200 animate-pulse flex flex-col">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-[700px] bg-gray-300 animate-pulse"></div>
              ))}
              <div className="mt-2 flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            {/* Right Column Skeleton */}
            <div className="w-full md:w-1/3 h-[700px] shadow-elegant bg-gray-200 animate-pulse flex flex-col p-2">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="h-20 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (queryError || !productData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white text-gray-800">
        <div className="text-center">
          <p className="text-sm font-serif font-bold text-gray-700">Error loading product! Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative bg-gradient-to-br from-white text-gray-800 min-h-screen">
        <style>{customStyles}</style>
        <Category
          setSelectedProduct={setSelectedProduct}
          onCategoryHover={handleCategoryHover}
          onCategoryHoverEnd={handleCategoryHoverEnd}
        />
        <section className="flex flex-col md:flex-row justify-center items-start py-0 px-2 md:px-4 lg:px-10 gap-0 md:gap-0">
          {/* Left Column */}
          {showLeftColumn && (
            <div
              className="w-full md:w-1/5 sticky top-12 h-[700px] md:h-[700px] column-transition shadow-elegant overflow-hidden premium-gradient border border-gray-200"
            >
              <div className="relative w-full h-full">
                {selectedProduct?.video ? (
                  <video
                    ref={videoRef}
                    src={selectedProduct.video}
                    className="object-contain w-full h-full"
                    muted
                    loop
                    controls
                  />
                ) : (
                  <img
                    src={
                      selectedProduct?.image ||
                      productData?.product?.colors[0]?.images[0]?.image ||
                      "/api/placeholder/400/600"
                    }
                    alt="Product thumbnail"
                    className="object-contain w-full h-full"
                  />
                )}
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={() => {
                      setShowLeftColumn(false);
                      toast.info("Left column hidden. Enjoy the expanded view!", {
                        position: "top-right",
                        autoClose: 2000,
                      });
                    }}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover-glow transition-all duration-300"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-800"
                    >
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Restore Button */}
          {!showLeftColumn && (
            <button
              className="fixed top-1/2 left-2 z-50 w-8 h-8 bg-gold-accent rounded-full flex items-center justify-center hover-glow transition-all duration-300"
              onClick={() => {
                setShowLeftColumn(true);
                toast.info("Left column restored!", {
                  position: "top-right",
                  autoClose: 2000,
                });
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M20 12H4M12 4L4 12L12 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Middle Column */}
          <div
            className={`w-full ${
              showLeftColumn ? "md:w-2/3" : "md:w-3/4"
            } relative column-transition shadow-elegant mt-2 md:mt-0 bg-white`}
            style={{ height: "700px" }}
          >
            <div className="relative w-full h-full">
              {/* Zoom Button */}
              <button
                onClick={toggleZoom}
                className="absolute top-2 right-10 z-30 zoom-icon hover-glow"
                title={isZoomEnabled ? "Disable Zoom" : "Enable Zoom"}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-800"
                >
                  <path
                    d="M15 15L21 21M10 7V10M10 10V13M10 10H7M10 10H13M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Scroll Bar Indicator */}
              <div className="absolute right-1 top-3 bottom-3 w-1 bg-gray-100 rounded-full z-30">
                <div
                  className="w-full bg-gold-accent rounded-full transition-all duration-300 ease-out"
                  style={{
                    height: `${100 / imgs.length}%`,
                    top: `${(currentIndex * 100) / imgs.length}%`,
                    position: "relative",
                  }}
                ></div>
              </div>

              {/* Image Counter */}
              <div className="absolute top-2 right-4 z-30 bg-white/70 text-sm px-1 py-0.5 rounded-full">
                {currentIndex + 1}/{imgs.length}
              </div>

              {/* Scrollable Image Gallery */}
              <div
                ref={scrollContainerRef}
                className="flex flex-col middle-section-scroll snap-y snap-proximity"
                style={{ height: "100%", overflow: "auto", backgroundColor: "#f5f5f5" }}
              >
                {imgs.map((img, index) => (
                  <div
                    key={`img-${index}`}
                    className="w-full h-[650px] flex-shrink-0 relative image-zoom-container snap-center"
                  >
                    <img
                      ref={(el) => (imageRefs.current[index] = el)}
                      src={img.url}
                      alt={img.label}
                      className="main-image object-contain w-full h-full block transition-opacity duration-300 hover:opacity-90"
                      onMouseMove={(e) => handleMouseMove(e, index)}
                      onMouseEnter={() => isZoomEnabled && setIsZoomed(true)}
                      onMouseLeave={() => isZoomEnabled && setIsZoomed(false)}
                      onClick={() => {
                        setCurrentIndex(index);
                        setImage(img.url);
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-white/70 text-gold-accent text-sm font-serif px-2 py-0.5 shadow-md">
                      {img.label}
                    </div>
                    {isZoomed && isZoomEnabled && currentIndex === index && (
                      <div
                        className="zoom-magnifier pointer-events-none bg-white/90 border border-gray-300 shadow-lg"
                        style={{
                          width: "700px",
                          height: "500px",
                          top: `${magnifiedPosition.y}px`,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            background: `url(${img.url}) no-repeat`,
                            backgroundSize: `${
                              imageRefs.current[index]?.offsetWidth * 2
                            }px ${imageRefs.current[index]?.offsetHeight * 2}px`,
                            backgroundPosition: magnifiedBackgroundPosition,
                          }}
                        />
                      </div>
                    )}
                    {isZoomed && isZoomEnabled && currentIndex === index && (
                      <div
                        className="absolute border-2 border-gold-accent bg-black/20 rounded-full pointer-events-none"
                        style={{
                          width: "150px",
                          height: "150px",
                          left: mousePosition.x + (imageRefs.current[index]?.offsetLeft || 0),
                          top: mousePosition.y + (imageRefs.current[index]?.offsetTop || 0),
                          transform: "translate(-50%, -50%)",
                          zIndex: 40,
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Thumbnail Gallery */}
                <div className="sticky bottom-0 left-0 right-0 bg-white/90 p-1 z-40 border-t border-gray-200 rounded-t-lg">
                  <div className="flex justify-center items-center space-x-1 overflow-x-auto hide-scrollbar">
                    {imgs.map((img, index) => (
                      <div
                        key={`thumb-${index}`}
                        className={`w-12 h-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-md transition-all duration-300 hover-glow ${
                          currentIndex === index
                            ? "border-2 border-gold-accent"
                            : "border border-gray-300"
                        }`}
                        onClick={() => {
                          setCurrentIndex(index);
                          setImage(img.url);
                          if (imageRefs.current[index]) {
                            imageRefs.current[index].scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`${img.label} thumbnail`}
                          className="object-contain w-full h-full rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="w-full md:w-1/3 p-2 sticky top-12 h-auto md:h-[700px] overflow-auto column-transition shadow-elegant mt-2 md:mt-0 bg-white border border-gray-200"
          >
            <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider">
              HOME / {productData.product.category} / {productData.product.subCategory}
            </div>
            <h1 className="text-sm md:text-base font-serif font-bold tracking-wide text-gray-900">
              {productData.product.name}
            </h1>
            <p className="text-sm md:text-sm text-gray-700 mt-1 mb-2 leading-relaxed line-clamp-3">
              {productData.product.description}
            </p>
            <div className="flex items-center mb-2">
              <div className="text-sm md:text-base text-gold-accent">★★★★★</div>
              <div className="text-sm text-gray-500 ml-1">3 reviews</div>
            </div>
            <div className="bg-gold-accent/20 text-gold-accent text-sm font-semibold text-center py-0.5 px-2 rounded-full inline-block mb-4 shadow-inner">
              PREMIUM QUALITY
            </div>
            <hr className="my-2 border-gray-200" />
            <ProductDetails product={productData.product} currency={currency} />
            <ProductSizeTable
              product={productData.product}
              setSelectedColors={setSelectedColors}
              selectedColors={selectedColors}
              setImage={setImage}
            />
            <div className="mt-4 pt-2 border-t border-gray-200 flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gold-accent"
              >
                <path d="M3 10H17" stroke="currentColor" strokeWidth="2" />
                <path d="M7 14L3 10L7 6" stroke="currentColor" strokeWidth="2" />
                <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="text-sm md:text-sm text-gray-600 ml-1 font-medium">
                FREE SHIPPING & RETURNS
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-700">Material: 70% Wool, 30% Polyester</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              {activeTab === "description" && productData?.product?.description && (
                <p className="text-sm text-gray-700">
                  {productData.product.description || "No description available."}
                </p>
              )}
              {activeTab === "details" && (
                <div>
                  {[
                    { label: "Material", value: productData?.product?.material || "70% Wool, 30% Polyester" },
                    { label: "Lining", value: "100% Viscose" },
                    { label: "Buttons", value: "Horn with matte finish" },
                    { label: "Pockets", value: "Two front flap pockets, one chest pocket" },
                    { label: "Care", value: "Dry clean only" },
                  ].map((spec, i) => (
                    <div key={i} className="flex py-2 border-b border-gray-200">
                      <div className="w-1/3 text-sm text-gray-500">{spec.label}</div>
                      <div className="w-2/3 text-sm">{spec.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex mb-6">
                    <div className="w-1/4 pr-4 border-r border-gray-200">
                      <div className="flex items-center justify-center flex-col">
                        <div className="text-2xl font-bold mb-1">4.7</div>
                        <div className="text-sm mb-1">★★★★★</div>
                        <div className="text-sm text-gray-500">Based on 3 reviews</div>
                      </div>
                    </div>
                    <div className="w-3/4 pl-4">
                      {[
                        {
                          name: "Alex M.",
                          rating: 5,
                          date: "March 1, 2025",
                          verified: true,
                          title: "Exceptional Quality",
                          comment:
                            "This coat exceeded my expectations in every way. The fabric is substantial without being heavy, and the cut is perfectly tailored.",
                        },
                        {
                          name: "Jamie S.",
                          rating: 4,
                          date: "February 15, 2025",
                          verified: true,
                          title: "Great Value",
                          comment:
                            "The quality matches much more expensive brands. Sizing runs slightly small, so I'd recommend going up if you're between sizes.",
                        },
                      ].map((review, i) => (
                        <div key={i} className={`mb-4 pb-4 ${i < 1 ? "border-b border-gray-200" : ""}`}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium text-sm">{review.name}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="text-sm mr-1">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </div>
                            {review.verified && (
                              <div className="text-sm bg-gray-100 px-1 py-0.5 rounded">Verified Purchase</div>
                            )}
                          </div>
                          <div className="font-medium text-sm mb-1">{review.title}</div>
                          <div className="text-sm text-gray-700">{review.comment}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="block mx-auto border border-gray-300 text-sm py-1 px-2 hover:bg-gray-100 transition-colors duration-300 rounded">
                    Write a Review
                  </button>
                </div>
              )}
              {activeTab === "shipping" && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Shipping</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Free standard shipping on all orders over $100. Orders typically ship within 1-2 business days.
                    Delivery typically takes 3-5 business days depending on your location.
                  </p>
                  <h3 className="font-medium text-sm mb-2 mt-4">Returns</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and with the original tags attached.
                    Return shipping is free for customers in the United States.
                  </p>
                </div>
              )}
              {!activeTab && <p className="text-sm text-gray-700">Select a tab to view content.</p>}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex flex-row space-x-2">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "description" ? "text-gray-900" : "text-gray-500"
                  } hover:text-gray-900`}
                  onClick={() => setActiveTab("description")}
                >
                  DESCRIPTION
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "details" ? "text-gray-900" : "text-gray-500"
                  } hover:text-gray-900`}
                  onClick={() => setActiveTab("details")}
                >
                  DETAILS
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "reviews" ? "text-gray-900" : "text-gray-500"
                  } hover:text-gray-900`}
                  onClick={() => setActiveTab("reviews")}
                >
                  REVIEWS (3)
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "shipping" ? "text-gray-900" : "text-gray-500"
                  } hover:text-gray-900`}
                  onClick={() => setActiveTab("shipping")}
                >
                  SHIPPING
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {productData.product.category && productData.product.subCategory && (
          <RelatedProducts
            category={productData.product.category}
            subCategory={productData.product.subCategory}
          />
        )}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Product;