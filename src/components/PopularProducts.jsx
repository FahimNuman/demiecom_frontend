import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";  // Import context here
import Item from "./Item";

const PopularProducts = () => {
    const { products } = useContext(ShopContext);  // Access the products from context directly
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(() => {
        // Filter and set popular products only on mount or when products change
        const data = products.filter(item => item.popular);
        setPopularProducts(data.slice(0, 5));
    }, [products]);  // Dependency array - when products change, filter again

    return (
        <section className="max-padd-container py-16">
            <Title title={'Popular Products'} titleStyles={"text-center"} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {popularProducts.map(product => (
                    <div key={product.id}>  {/* Assuming product.id is the correct unique identifier */}
                        <Item product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PopularProducts;
