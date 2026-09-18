import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

const ProductImageGallery = ({
  images,
  onImageSelect,
  hoveredColor,
  setHoveredColor,
  setImage,
  image
}) => {
  return (
    <div className="flex flex-1 gap-x-2 xl:flex-1">
      {/* Thumbnail Images */}
      <div className="flexCenter flex-row gap-[7px] flex-wrap">
        {images?.map((item, i) => (
          <img
            onClick={() => setImage(item.url)}
            onMouseEnter={() => setHoveredColor(item.url)}
            onMouseLeave={() => setHoveredColor("")}
            src={item.url}
            key={i}
            alt="Product Thumbnail"
            className="max-h-[59px] rounded-lg cursor-pointer border"
          />
        ))}
      </div>
      {/* Main Zoomable Image */}
      <div className="max-h-[477px] w-auto flex">
        <InnerImageZoom
          src={image || images[0].url}
          // src="https://res.cloudinary.com/dutyno5yw/image/upload/v1742400764/product/ux20r50p3zccalexwpsw.png"
          alt="Main Product"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;