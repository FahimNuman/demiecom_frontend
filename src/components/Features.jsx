import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine, RiTShirtLine } from "react-icons/ri";
import { FaChild, FaUserAlt } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import Title from "./Title";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/collection");
  };

  // Sample data for trend report items with provided image URLs
  const items = [
    { name: "Printed Paradise", image: "https://cdn.sanity.io/images/0v989dzu/production/0d0f5131aa7bffdffe57a6a9543a13e48f521b24-585x780.jpg?w=600&h=756&q=100&crop=center&auto=format" },
    { name: "Santorini Stroll", image: "https://cdn.sanity.io/images/0v989dzu/production/d5159444492f8e37962ec4f3f2b9b5096063fad3-585x780.jpg?w=600&h=756&q=100&crop=center&auto=format" },
    { name: "Coastal Getaway", image: "https://cdn.sanity.io/images/0v989dzu/production/f99bc543de44abeb488b4a9b4e3efb72aa43a462-585x780.jpg?w=600&h=756&q=100&crop=center&auto=format" },
    { name: "Barely There", image: "https://cdn.sanity.io/images/0v989dzu/production/7df8a51803bb16285c5960144481f35bed5bc8ab-585x780.jpg?w=600&h=756&q=100&crop=center&auto=format" },
  ];

  return (
    <section className="max-padd-container ">
      <Title title={"THE TREND REPORT"} titleStyles={"text-start text-2xl font-bold "} />

      <div className="flex flex-wrap justify-center gap-2 overflow-hidden relative">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={handleNavigation}
            className="flex flex-col items-center justify-center cursor-pointer "
          >
            <div className="w-[445px] h-[620px] border overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <a href={`/category/${item.name.toLowerCase().replace(/ /g, '-')}`} className="text-center text-lg font-semibold  text-black-500 hover:underline">
              {item.name} 
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;