import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Static data with provided image URLs
const defaultBrands = [
  { id: 1, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/40dd1b48d83a678fc9345880b732c01abdad7a6a-403x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
  { id: 2, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/3159f97b5857d3246d6f97808c6ca85dd5a89b24-403x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
  { id: 3, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/00595c669efd845e800d7299d663d63e18752141-404x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
  { id: 4, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/6083fc87c3e441b0097a703988e00b6477de89aa-403x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
  { id: 5, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/b593a718ccee534d5f5afa7cea262f3a5cf4f193-403x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
  { id: 6, name: "", image: "https://cdn.sanity.io/images/0v989dzu/production/1627424ed48df223cb59caa0ee7b9fca31475e66-404x505.jpg?w=300&h=375&q=100&crop=center&auto=format" },
 
];  

const ShopByBrand = ({ brands = defaultBrands }) => {
  const [brandData, setBrandData] = useState(brands);

  // Simulate API call (replace with real API fetch in future)
  useEffect(() => {
    // Example API call (uncomment and adjust when ready)
    // const fetchBrands = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint');
    //     const data = await response.json();
    //     setBrandData(data);
    //   } catch (error) {
    //     console.error('Error fetching brands:', error);
    //   }
    // };
    // fetchBrands();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <section className="max-padd-container py-6">
      <h2 className="text-2xl font-bold mb-6">SHOP BY BRAND</h2>
      <div className="flex flex-wrap justify-center gap-2 overflow-x-auto scrollbar-hide">
        {brandData.map((brand) => (
          <div key={brand.id} className="flex-shrink-0 w-75 h-80 bg-gray-200 bg-cover bg-center  overflow-hidden relative">
            <img
              src={brand.image}
              alt={brand.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xl font-bold uppercase">
              {brand.name}
            </div>
            <Link
              to={`/brand/${brand.name.toLowerCase().replace(/ /g, '-')}`}
              className="absolute inset-0"
            ></Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrand;