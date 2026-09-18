import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import Item from "./Item";

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let filtered = products.slice();

            filtered = filtered.filter((item) => item.category === category);
            filtered = filtered.filter((item) => item.subCategory === subCategory);

            setRelated(filtered.slice(0, 5));
        }
    }, [products, category, subCategory]);

    return (
        <div className="max-padd-container py-16">
            <Title title="Related Products" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {related.map((product, i) => (
                    <Item product={product} key={product._id} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
