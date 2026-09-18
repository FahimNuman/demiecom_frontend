import React, { useState } from "react";
import { BsCollection } from "react-icons/bs";
import { FaRegWindowClose } from "react-icons/fa";
import { SiAtlassian, SiGooglehome, SiMaildotcom } from "react-icons/si";
import { Link, NavLink } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Navbar = ({ containerStyles, toggleMenu, menuOpened }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { to: "/", label: "WOMEN", icon: null, subItems: ["Tops", "Dresses", "Bottoms"] },
    { to: "/curve", label: "CURVE", icon: null, subItems: ["Plus Size Tops", "Plus Size Dresses"] },
    { to: "/men", label: "MEN", icon: null, subItems: ["Shirts", "Pants", "Jackets"] },
    { to: "/kids", label: "KIDS", icon: null, subItems: ["Boys", "Girls"] },
    { to: "/beauty", label: "BEAUTY", icon: null, subItems: ["Skincare", "Makeup"] },
  ];

  return (
    <nav className={containerStyles}>
      {menuOpened && (
        <>
          <FaRegWindowClose
            onClick={toggleMenu}
            className="text-xl self-end cursor-pointer relative left-8 text-red-500"
          />

          {/* Logo for larger screens */}
          <Link to={"/"} className="bold-24 flex-1 hidden xl:flex">
            <h4 className="text-red-500 flex justify-center items-center w-auto px-2 relative" style={{ fontSize: "12px", fontWeight: "700" }}>
              <span className="font-bold">DEMI UI ECOMMERCE</span>
            </h4>
          </Link>
        </>
      )}
      {navItems.map(({ to, label, icon, subItems }) => (
        <div
          key={label}
          className="relative"
          onMouseEnter={() => setHoveredItem(label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <NavLink
            to={to}
            className={({ isActive }) =>
              isActive ? "active-link flexCenter gap-x-2 " : "flexCenter gap-x-2 "
            }
            onClick={menuOpened && toggleMenu}
            style={{ fontSize: "12px", fontWeight: "700" }}
          >
            {icon}
            <h5 className="medium-16">{label}</h5>
          </NavLink>
          {hoveredItem === label && subItems && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
              {subItems.map((subItem) => (
                <Link
                  key={subItem}
                  to={`/${label.toLowerCase()}/${subItem.toLowerCase().replace(" ", "-")}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  style={{ fontSize: "12px", fontWeight: "700" }}
                >
                  {subItem}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;