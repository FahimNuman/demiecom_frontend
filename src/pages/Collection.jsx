import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import Item from "../components/Item";
import AxiosClient from "../utils/axiosConfig";
import ShowSearch from "../components/ShowSearch";
import ReactSlider from "react-slider";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const ITEMS_PER_PAGE = 14;

// Updated color mapping with more colors and their hex codes
const colorMap = {
  Mustard: "#FFDB58",
  DarkHeather: "#1E1E2F",
  Red: "#FF0000",
  Blue: "#0000FF",
  Green: "#008000",
  Black: "#000000",
  White: "#FFFFFF",
  Yellow: "#FFFF00",
  Orange: "#FFA500",
  Purple: "#800080",
  Pink: "#FFC0CB",
  Brown: "#A52A2A",
  Gray: "#808080",
  Navy: "#000080",
  Teal: "#008080",
};

const Collection = () => {
  const { search, showSearch } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [styleType, setStyleType] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [fabricPlatform, setFabricPlatform] = useState("");
  const [thickness, setThickness] = useState("");
  const [collar, setCollar] = useState("");
  const [fitType, setFitType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState({
    styleType: false,
    color: true,
    size: true,
    fabricPlatform: false,
    thickness: false,
    collar: false,
    fitType: false,
    priceRange: true,
  });
  const [sidebarTop, setSidebarTop] = useState(120);

  // State for dynamic filter options
  const [filterOptions, setFilterOptions] = useState({
    styleTypes: [],
    colors: [],
    sizes: [],
    fabrics: [],
    thicknesses: [],
    collars: [],
    fitTypes: [],
  });

  const toggleFilter = (filterName, value, setState) => {
    setState((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const toggleExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

 const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await AxiosClient.get("/api/product/list");
    console.log("API Response:", res.data);  // ← এটা যোগ করো
    const fetchedProducts = res.data.products || [];
    console.log("Fetched Products Count:", fetchedProducts.length);
    setProducts(fetchedProducts);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    setError("Failed to load products: " + (err.message || "Unknown error"));
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const extractFilterOptions = () => {
      const styleTypes = [...new Set(products.map((p) => p.category).filter(Boolean))];
      const colors = [
        ...new Set(products.flatMap((p) => p.colors?.map((c) => c.name)).filter(Boolean)),
      ];
      const sizes = [
        ...new Set(
          products.flatMap((p) => p.colors?.flatMap((c) => c.sizes?.map((s) => s.name))).filter(Boolean)
        ),
      ];
      const fabrics = [...new Set(products.map((p) => p.fabric).filter(Boolean))];
      const thicknesses = [...new Set(products.map((p) => p.thickness).filter(Boolean))];
      const collars = [...new Set(products.map((p) => p.collar).filter(Boolean))];
      const fitTypes = [...new Set(products.map((p) => p.fit).filter(Boolean))];

      setFilterOptions({
        styleTypes,
        colors,
        sizes,
        fabrics,
        thicknesses,
        collars,
        fitTypes,
      });
    };

    if (products.length > 0) {
      extractFilterOptions();
    }
  }, [products]);

  const applyFilters = () => {
    let filtered = [...products];

    if (search && showSearch) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (styleType) {
      filtered = filtered.filter((p) => p.category === styleType);
    }

    if (colors.length > 0) {
      filtered = filtered.filter((p) => p.colors?.some((c) => colors.includes(c.name)));
    }

    if (sizes.length > 0) {
      filtered = filtered.filter((p) => p.colors?.some((c) => c.sizes?.some((s) => sizes.includes(s.name))));
    }

    if (fabricPlatform) {
      filtered = filtered.filter((p) => p.fabric === fabricPlatform);
    }

    if (thickness) {
      filtered = filtered.filter((p) => p.thickness === thickness);
    }

    if (collar) {
      filtered = filtered.filter((p) => p.collar === collar);
    }

    if (fitType) {
      filtered = filtered.filter((p) => p.fit === fitType);
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    return filtered;
  };

  const applySorting = (productList) => {
    return [...productList].sort((a, b) => a.price - b.price);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = applyFilters();
    const sorted = applySorting(filtered);
    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [search, showSearch, styleType, colors, sizes, fabricPlatform, thickness, collar, fitType, priceRange, products]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newTop = Math.max(120 - Math.min(scrollY * 0.1, 70), 50);
      setSidebarTop(newTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const minPrice = products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1000;

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  const priceHistogramData = () => {
    const bins = 10;
    const binSize = (maxPrice - minPrice) / bins || 1;
    const counts = Array(bins).fill(0);

    products.forEach((product) => {
      const binIndex = Math.min(
        Math.floor((product.price - minPrice) / binSize),
        bins - 1
      );
      counts[binIndex]++;
    });

    return {
      labels: Array.from({ length: bins }, (_, i) =>
        `$${Math.round(minPrice + i * binSize)} - $${Math.round(minPrice + (i + 1) * binSize)}`
      ),
      datasets: [
        {
          label: "Products",
          data: counts,
          backgroundColor: "rgba(0, 191, 165, 0.2)",
          borderColor: "rgba(0, 191, 165, 0.4)",
          borderWidth: 0,
          hoverBackgroundColor: "rgba(0, 191, 165, 0.3)",
        },
      ],
    };
  };

  return (
    <section className="max-padd-container min-h-screen flex">
      <div
        className="p-6 bg-white shadow-sm w-72 fixed left-4 h-[calc(100vh-120px)] overflow-y-auto z-10 transition-all duration-200"
        style={{ top: `${sidebarTop}px` }}
      >
        <ShowSearch />

        <div className="mb-8 mt-6 space-y-4">
          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px] for thinner border, increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Style Type
            </span>
            <button
              onClick={() => toggleExpand("styleType")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.styleType ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.styleType && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.styleType ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.styleType && (
            <div
              className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.styleType ? "150px" : "0" }}
            >
              {filterOptions.styleTypes.length > 0 ? (
                filterOptions.styleTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center text-sm text-gray-800"
                    style={{
                      fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="styleType"
                      value={type}
                      checked={styleType === type}
                      onChange={(e) => toggleFilter("styleType", e.target.value, setStyleType)}
                      className="mr-2 accent-blue-600"
                    />
                    {type}
                  </label>
                ))
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No style types available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Color
            </span>
            <button
              onClick={() => toggleExpand("color")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.color ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.color && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.color ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.color && (
            <div
              className="pl-3 mt-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.color ? "150px" : "0" }}
            >
              {filterOptions.colors.length > 0 ? (
                <div className="grid grid-cols-6">
                  {filterOptions.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleFilter("colors", c, setColors)}
                      className={`w-5 h-5 rounded-full border border-gray-300 ${
                        colors.includes(c)
                          ? "ring-2 ring-gray-800"
                          : "hover:ring-1 hover:ring-gray-400"
                      }`}
                      style={{ backgroundColor: colorMap[c] || c }}
                    ></button>
                  ))}
                </div>
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No colors available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Size
            </span>
            <button
              onClick={() => toggleExpand("size")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.size ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.size && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.size ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.size && (
            <div
              className="pl-3 mt-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.size ? "150px" : "0" }}
            >
              {filterOptions.sizes.length > 0 ? (
                <div className="grid grid-cols-6 gap-1">
                  {filterOptions.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleFilter("sizes", s, setSizes)}
                      className={`px-1 py-1 rounded text-xs border border-gray-300 max-w-8 ${
                        sizes.includes(s)
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No sizes available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Fabric Platform
            </span>
            <button
              onClick={() => toggleExpand("fabricPlatform")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.fabricPlatform ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.fabricPlatform && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.fabricPlatform ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.fabricPlatform && (
            <div
              className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.fabricPlatform ? "150px" : "0" }}
            >
              {filterOptions.fabrics.length > 0 ? (
                filterOptions.fabrics.map((f) => (
                  <label
                    key={f}
                    className="flex items-center text-sm text-gray-700"
                    style={{
                      fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="fabricPlatform"
                      value={f}
                      checked={fabricPlatform === f}
                      onChange={(e) => toggleFilter("fabricPlatform", e.target.value, setFabricPlatform)}
                      className="mr-2 accent-blue-600"
                    />
                    {f}
                  </label>
                ))
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No fabrics available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Thickness
            </span>
            <button
              onClick={() => toggleExpand("thickness")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.thickness ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.thickness && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.thickness ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.thickness && (
            <div
              className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.thickness ? "150px" : "0" }}
            >
              {filterOptions.thicknesses.length > 0 ? (
                filterOptions.thicknesses.map((t) => (
                  <label
                    key={t}
                    className="flex items-center text-sm text-gray-700"
                    style={{
                      fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="thickness"
                      value={t}
                      checked={thickness === t}
                      onChange={(e) => toggleFilter("thickness", e.target.value, setThickness)}
                      className="mr-2 accent-blue-600"
                    />
                    {t}
                  </label>
                ))
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No thicknesses available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Collar
            </span>
            <button
              onClick={() => toggleExpand("collar")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.collar ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.collar && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.collar ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.collar && (
            <div
              className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.collar ? "150px" : "0" }}
            >
              {filterOptions.collars.length > 0 ? (
                filterOptions.collars.map((c) => (
                  <label
                    key={c}
                    className="flex items-center text-sm text-gray-700"
                    style={{
                      fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="collar"
                      value={c}
                      checked={collar === c}
                      onChange={(e) => toggleFilter("collar", e.target.value, setCollar)}
                      className="mr-2 accent-blue-600"
                    />
                    {c}
                  </label>
                ))
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No collars available
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b-[1px] pb-2">
            {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
            <span
              className="text-sm font-semibold text-gray-800"
              style={{
                fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                fontSize: "14px",
                color: "#000000",
                fontWeight: 400,
                fontStyle: "normal",
                fontVariant: "normal",
                fontKerning: "auto",
                fontOpticalSizing: "auto",
                fontStretch: "100%",
                fontVariationSettings: "normal",
                fontFeatureSettings: "normal",
                textTransform: "none",
                textDecoration: "none solid rgb(0, 0, 0)",
                textAlign: "start",
                textIndent: "0px",
              }}
            >
              Fit Type
            </span>
            <button
              onClick={() => toggleExpand("fitType")}
              className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                expandedFilters.fitType ? 'bg-white rounded-full text-white' : ''
              }`}
              style={{
                ...(expandedFilters.fitType && {
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                }),
              }}
            >
              {expandedFilters.fitType ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
            </button>
          </div>
          {expandedFilters.fitType && (
            <div
              className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
              style={{ maxHeight: expandedFilters.fitType ? "150px" : "0" }}
            >
              {filterOptions.fitTypes.length > 0 ? (
                filterOptions.fitTypes.map((f) => (
                  <label
                    key={f}
                    className="flex items-center text-sm text-gray-700"
                    style={{
                      fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    <input
                      type="radio"
                      name="fitType"
                      value={f}
                      checked={fitType === f}
                      onChange={(e) => toggleFilter("fitType", e.target.value, setFitType)}
                      className="mr-2 accent-blue-600"
                    />
                    {f}
                  </label>
                ))
              ) : (
                <p
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  No fit types available
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between border-b-[1px] pb-2">
              {/* Changed border-b-2 to border-b-[1px], increased pb-1 to pb-2 */}
              <span
                className="text-sm font-semibold text-gray-800"
                style={{
                  fontFamily: '"proxima-nova", "Gill Sans MT", Arial, sans-serif',
                  fontSize: "14px",
                  color: "#000000",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  fontKerning: "auto",
                  fontOpticalSizing: "auto",
                  fontStretch: "100%",
                  fontVariationSettings: "normal",
                  fontFeatureSettings: "normal",
                  textTransform: "none",
                  textDecoration: "none solid rgb(0, 0, 0)",
                  textAlign: "start",
                  textIndent: "0px",
                }}
              >
                Price
              </span>
              <button
                onClick={() => toggleExpand("priceRange")}
                className={`flex items-center justify-center w-6 h-6 text-gray-800 transition-transform hover:scale-105 ${
                  expandedFilters.priceRange ? 'bg-white rounded-full text-white' : ''
                }`}
                style={{
                  ...(expandedFilters.priceRange && {
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                  }),
                }}
              >
                {expandedFilters.priceRange ? <FaAngleUp style={{ color: 'white' }} /> : <FaAngleDown />}
              </button>
            </div>
            {expandedFilters.priceRange && (
              <div
                className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
                style={{ maxHeight: expandedFilters.priceRange ? "100px" : "0" }}
              >
                <div className="relative h-10">
                  <Bar
                    data={priceHistogramData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        tooltip: { enabled: false },
                      },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                      barThickness: 6,
                    }}
                  />
                  <ReactSlider
                    className="absolute top-1/6 transform -translate-y-1/2 w-full h-0.5 bg-gray-300 rounded-full"
                    thumbClassName="w-3 h-3 bg-gradient-to-br from-teal-500 to-teal-400 rounded-full cursor-pointer -top-1 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg transition-all duration-200"
                    trackClassName="react-slider-track bg-gradient-to-r from-teal-500 to-teal-300 h-0.5 rounded-full"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    pearling
                    minDistance={10}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-800 font-semibold">
                  <span>{minPrice} USD</span>
                  <span>{maxPrice} USD</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 ml-64">
        <Title title="Our Collection" />
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2">
            {paginatedProducts.length ? (
              paginatedProducts.map((product) => (
                <Item key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500">No products found.</p>
            )}
          </div>
        )}

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection; 