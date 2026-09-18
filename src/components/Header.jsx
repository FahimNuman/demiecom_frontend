import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaBarsStaggered, FaRegCircleUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { GiBeachBag } from "react-icons/gi";
import { TbArrowNarrowRight } from "react-icons/tb";
import { ShopContext } from "../context/ShopContext";
import logo from "../assets/logo.png"; // Adjusted path
import { useGetCarts } from "../service/cart";
import { useUser } from "../services/userService";

const Header = () => {
  const navigate = useNavigate();
  const context = useContext(ShopContext);
  const { userId } = useUser() || {};
  const { data: cartList } = useGetCarts(userId) || { data: null };

  // Fallback for context
  if (!context) {
    console.error("ShopContext is not provided");
    return null;
  }
  const { setShowSearch, token, setToken } = context;

  const [menuOpened, setMenuOpened] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categoryRef = useRef(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  // Handle keyboard events for accessibility
  const handleUserIconKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!token) navigate("/login");
      else setIsUserMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (categoryRef.current && hoveredCategory) {
      const submenu = categoryRef.current.querySelector(`[data-category="${hoveredCategory}"]`);
      if (submenu) {
        const firstCategoryBottom = categoryRef.current.getBoundingClientRect().bottom + window.scrollY;
        submenu.style.top = `${firstCategoryBottom}px`;
      }
    }
  }, [hoveredCategory]);

  const categories = {
    "NEW IN CLOTHING": {
      sections: {
        "Shop All New In": ["Shop All New In"],
        "New In This Week": ["New In This Week"],
        "Back In Stock": ["Back In Stock"],
        "Best Sellers": ["Best Sellers"],
        "Coming Soon": ["Coming Soon"],
      },
      to: "/new-in-clothing",
      image: "../assets/new-in-image.jpg",
    },
    "SALE": {
      sections: {
        "Shop by Style": ["Discount Tops", "Discount Dresses"],
      },
      to: "/sale",
      image: "../assets/sale-image.jpg",
    },
    "NOVA DEALS": {
      sections: {
        "Shop by Style": ["Deal Tops", "Deal Sets"],
      },
      to: "/nova-deals",
      image: "../assets/nova-deals-image.jpg",
    },
    "SWIM": {
      sections: {
        "Shop All Swim": ["Shop All Swim"],
        "Shop by Style": ["Bikinis", "One-Piece"],
        "Shop by Coverage": ["Cheeky", "Moderate"],
        "Shop by Trend": ["Tropical Prints", "Solid Colors"],
      },
      to: "/swim",
      image: "../assets/swim-image.jpg",
    },
    "WEDDING SUITE": {
      sections: {
        "Shop by Style": ["Bridal Gowns", "Accessories"],
      },
      to: "/wedding-suite",
      image: "../assets/wedding-suite-image.jpg",
    },
    "DRESSES": {
      sections: {
        "Shop by Style": ["Casual", "Formal"],
      },
      to: "/dresses",
      image: "../assets/dresses-image.jpg",
    },
    "MATCHING SETS": {
      sections: {
        "Shop by Style": ["Tops & Bottoms", "Sets"],
      },
      to: "/matching-sets",
      image: "../assets/matching-sets-image.jpg",
    },
    "TOPS": {
      sections: {
        "Shop by Style": ["Blouses", "T-Shirts"],
      },
      to: "/tops",
      image: "../assets/tops-image.jpg",
    },
    "JEANS": {
      sections: {
        "Shop by Style": ["Skinny", "Bootcut"],
      },
      to: "/jeans",
      image: "../assets/jeans-image.jpg",
    },
    "SHOES": {
      sections: {
        "Shop by Style": ["Heels", "Sneakers"],
      },
      to: "/shoes",
      image: "../assets/shoes-image.jpg",
    },
    "BOTTOMS": {
      sections: {
        "Shop by Style": ["Skirts", "Pants"],
      },
      to: "/bottoms",
      image: "../assets/bottoms-image.jpg",
    },
    "JUMPSUITS & ROMPERS": {
      sections: {
        "Shop by Style": ["Jumpsuits", "Rompers"],
      },
      to: "/jumpsuits",
      image: "../assets/jumpsuits-image.jpg",
    },
    "JACKETS": {
      sections: {
        "Shop by Style": ["Leather", "Denim"],
      },
      to: "/jackets",
      image: "../assets/jackets-image.jpg",
    },
    "LINGERIE & SLEEP": {
      sections: {
        "Shop by Style": ["Bras", "Nightwear"],
      },
      to: "/lingerie",
      image: "../assets/lingerie-image.jpg",
    },
    "ACTIVEWEAR": {
      sections: {
        "Shop by Style": ["Leggings", "Sports Bras"],
      },
      to: "/activewear",
      image: "../assets/activewear-image.jpg",
    },
    "NOVA LUXE": {
      sections: {
        "Shop by Style": ["Luxe Dresses", "Luxe Matching Sets", "Luxe Tops", "Luxe Bottoms", "Luxe Outerwear"],
        "Shop by Occasion": ["Red Carpet", "Going Out", "Birthday", "Wedding Guest", "Vacation", "Cocktail Dresses", "Brunch & Luncheon"],
        "Shop by Trend": ["Sequins", "Feathers", "Matching Separates", "Suiting"],
        "Shop by Color": ["Black", "White", "Pink", "Red"],
      },
      to: "/nova-luxe",
      image: "../assets/nova-luxe-image.jpg",
    },
  };

  return (
    <header
      className={`py-5 w-full bg-white relative ${isHeaderHovered ? "fixed top-0 left-0 w-full z-50 shadow-lg" : ""}`}
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
    >
      <div className="max-padd-container flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="bold-24 flex-1 xl:hidden flex items-center gap-2"
          aria-label="Fashion Nova Home"
          style={{ fontSize: "12px", fontWeight: "700" }}
        >
          <img src={logo} alt="Fashion Nova Logo" className="h-8" />
          <span className="font-bold">FASHION NOVA</span>
        </Link>

        {/* Navbar */}
        <div className="flex-1">
          <Navbar
            menuOpened={menuOpened}
            toggleMenu={toggleMenu}
            containerStyles={`${
              menuOpened
                ? "flex flex-col gap-y-12 h-screen w-[222px] absolute left-0 top-0 bg-white z-60 px-10 shadow-xl"
                : "hidden xl:flex gap-x-5 xl:gap-8 medium-15"
            }`}
          />
        </div>

        {/* Right-Side Icons */}
        <div className="flex items-center gap-x-2 xs:gap-x-8">
          {/* Hamburger Icon */}
          {!menuOpened && (
            <FaBarsStaggered
              onClick={toggleMenu}
              onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
              tabIndex={0}
              className="xl:hidden cursor-pointer text-2xl"
              aria-label="Toggle Menu"
              role="button"
            />
          )}
          {/* Search Bar */}
          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              style={{ fontSize: "12px" }}
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-full w-64"
              style={{
                borderColor: "#e5e7eb",
                borderRadius: "9999px",
                backgroundColor: "#f9fafb",
                color: "#6b7280",
                fontSize: "12px",
                fontWeight: "700",
              }}
              onFocus={() => setShowSearch(true)}
              onClick={() => setShowSearch((prev) => !prev)}
              aria-label="Search products"
            />
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="flex relative" aria-label="View Cart">
            <GiBeachBag className="text-[25px]" />
            <span className="bg-red-500 text-white medium-14 absolute right-0.5 -top-3 flex justify-center items-center w-5 h-5 rounded-full shadow-inner">
              {cartList?.carts?.length || 0}
            </span>
          </Link>

          {/* User Account */}
          <div
            className="relative"
            onMouseEnter={() => token && setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <FaRegCircleUser
              onClick={() => !token && navigate("/login")}
              onKeyDown={handleUserIconKeyDown}
              tabIndex={0}
              className="text-2xl cursor-pointer"
              aria-label="User Account"
              role="button"
            />
            {token && isUserMenuOpen && (
              <ul
                className="bg-white shadow-sm p-3 w-32 ring-1 ring-slate-900/15 rounded absolute right-0 top-full mt-1 z-70 flex flex-col"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
                role="menu"
                aria-label="User Menu"
              >
                <li
                  onClick={() => {
                    navigate("/orders");
                    setIsUserMenuOpen(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/orders") && setIsUserMenuOpen(false)}
                  tabIndex={0}
                  className="flex justify-between cursor-pointer hover:bg-gray-100 py-1 px-2"
                  style={{ fontSize: "12px", fontWeight: "700" }}
                  role="menuitem"
                >
                  <p>Orders</p>
                  <TbArrowNarrowRight className="text-[19px] opacity-50" />
                </li>
                <hr className="my-2" />
                <li
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && logout() && setIsUserMenuOpen(false)}
                  tabIndex={0}
                  className="flex justify-between cursor-pointer hover:bg-gray-100 py-1 px-2"
                  style={{ fontSize: "12px", fontWeight: "700" }}
                  role="menuitem"
                >
                  <p>Logout</p>
                  <TbArrowNarrowRight className="text-[19px] opacity-100" />
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Categories for Desktop */}
      <div className="max-padd-container hidden xl:block mt-4 relative" ref={categoryRef}>
        <nav className="flex gap-4" role="navigation" aria-label="Category Menu">
          {Object.entries(categories).map(([label, { sections, to, image }]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => setHoveredCategory(label)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to={to}
                className={`medium-15 ${label === "SALE" ? "text-red-500" : label === "NOVA DEALS" ? "text-blue-500" : ""}`}
                style={{ fontSize: "12px", fontWeight: "700" }}
                aria-label={`Navigate to ${label}`}
              >
                {label}
              </Link>
              {hoveredCategory === label && sections && (
                <div
                  className="fixed w-full h-[40vh] bg-white shadow-lg z-60 p-4 overflow-auto"
                  data-category={label}
                  onMouseEnter={() => setHoveredCategory(label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    top: categoryRef.current ? categoryRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
                    left: 0,
                  }}
                  role="menu"
                  aria-label={`${label} Submenu`}
                >
                  <div className="max-padd-container flex justify-between items-start h-full">
                    <div className="grid grid-cols-4 gap-4 w-3/4">
                      {Object.entries(sections).map(([sectionTitle, items]) => (
                        <div key={sectionTitle} className="p-4">
                          <h3
                            className="font-bold mb-2"
                            style={{ fontSize: "12px", fontWeight: "700" }}
                          >
                            {sectionTitle}
                          </h3>
                          {items.map((item) => (
                            <Link
                              key={item}
                              to={`${to}/${item.toLowerCase().replace(" ", "-")}`}
                              className="block py-1 text-sm hover:bg-gray-100"
                              style={{ fontSize: "12px", fontWeight: "700" }}
                              role="menuitem"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    {image && (
                      <div className="w-1/4 p-4">
                        <img
                          src={image}
                          alt={`${label} Category Image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;