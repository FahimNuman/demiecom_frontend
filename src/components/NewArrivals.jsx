import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import Item from "./Item";

const NewArrivals = () => {
  const { products } = useContext(ShopContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const data = products.slice(0, 20);
    setNewArrivals(data);
  }, [products]);
  return (
    <section className="max-padd-container py-16">
      <Title title={"New Arrivals"} titleStyles={"text-center"} />

      {/* container */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
        {newArrivals.map((product) => (
          <div key={product.id}>
            <Item product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
