// import { FaStar, FaStarHalfStroke } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";

const ProductDetails = ({ product, currency }) => (
  <>
    <h3 className="h3 !my-2.5">{product.name}</h3>
    <div className="flex items-baseline gap-x-5">
      <h3 className="h3">
        {currency}
        {product.price}
      </h3>
      <div className="flex gap-x-2 text-secondary text-xl">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStarHalfStroke />
      </div>
      <span>{122}</span>
    </div>
    <p>{product.description}</p>
  </>
);

export default ProductDetails;
