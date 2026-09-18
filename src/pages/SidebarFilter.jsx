import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ShowSearch from "../components/ShowSearch";
import ReactSlider from "react-slider";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SidebarFilter = ({
  styleType,
  setStyleType,
  color,
  setColor,
  size,
  setSize,
  fabricPlatform,
  setFabricPlatform,
  thickness,
  setThickness,
  collar,
  setCollar,
  fitType,
  setFitType,
  priceRange,
  setPriceRange,
  products,
  minPrice,
  maxPrice,
  filterOptions,
}) => {
  const { showSearch } = useContext(ShopContext);
  const [expandedFilters, setExpandedFilters] = useState({
    styleType: false,
    color: false,
    size: false,
    fabricPlatform: false,
    thickness: false,
    collar: false,
    fitType: false,
    priceRange: true,
  });

  const isAnyFilterExpanded = Object.values(expandedFilters).some((expanded) => expanded);

  const toggleFilter = (filterName, value, setState) => {
    setState(value);
  };

  const toggleExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

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
    <div
      className={`bg-white p-6 rounded-2xl shadow-md transition-all duration-300 ${
        isAnyFilterExpanded ? "min-w-48" : "min-w-60"
      } sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto z-10`}
      style={{ position: "sticky", top: "16px" }}
    >
      <ShowSearch />

      <div className="mt-6 space-y-4">
        {/* Style Type Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Style Type</span>
          <button
            onClick={() => toggleExpand("styleType")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.styleType ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.styleType && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.styleType ? "150px" : "0" }}
          >
            {filterOptions.styleTypes.length > 0 ? (
              filterOptions.styleTypes.map((type) => (
                <label key={type} className="flex items-center text-sm text-gray-700">
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
              <p className="text-sm text-gray-500">No style types available</p>
            )}
          </div>
        )}

        {/* Color Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Color</span>
          <button
            onClick={() => toggleExpand("color")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.color ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.color && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.color ? "150px" : "0" }}
          >
            {filterOptions.colors.length > 0 ? (
              filterOptions.colors.map((c) => (
                <label key={c} className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    name="color"
                    value={c}
                    checked={color === c}
                    onChange={(e) => toggleFilter("color", e.target.value, setColor)}
                    className="mr-2 accent-blue-600"
                  />
                  {c}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No colors available</p>
            )}
          </div>
        )}

        {/* Size Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Size</span>
          <button
            onClick={() => toggleExpand("size")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.size ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.size && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.size ? "150px" : "0" }}
          >
            {filterOptions.sizes.length > 0 ? (
              filterOptions.sizes.map((s) => (
                <label key={s} className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={(e) => toggleFilter("size", e.target.value, setSize)}
                    className="mr-2 accent-blue-600"
                  />
                  {s}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No sizes available</p>
            )}
          </div>
        )}

        {/* Fabric Platform Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Fabric Platform</span>
          <button
            onClick={() => toggleExpand("fabricPlatform")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.fabricPlatform ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.fabricPlatform && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.fabricPlatform ? "150px" : "0" }}
          >
            {filterOptions.fabrics.length > 0 ? (
              filterOptions.fabrics.map((f) => (
                <label key={f} className="flex items-center text-sm text-gray-700">
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
              <p className="text-sm text-gray-500">No fabrics available</p>
            )}
          </div>
        )}

        {/* Thickness Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Thickness</span>
          <button
            onClick={() => toggleExpand("thickness")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.thickness ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.thickness && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.thickness ? "150px" : "0" }}
          >
            {filterOptions.thicknesses.length > 0 ? (
              filterOptions.thicknesses.map((t) => (
                <label key={t} className="flex items-center text-sm text-gray-700">
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
              <p className="text-sm text-gray-500">No thicknesses available</p>
            )}
          </div>
        )}

        {/* Collar Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Collar</span>
          <button
            onClick={() => toggleExpand("collar")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.collar ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.collar && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.collar ? "150px" : "0" }}
          >
            {filterOptions.collars.length > 0 ? (
              filterOptions.collars.map((c) => (
                <label key={c} className="flex items-center text-sm text-gray-700">
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
              <p className="text-sm text-gray-500">No collars available</p>
            )}
          </div>
        )}

        {/* Fit Type Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Fit Type</span>
          <button
            onClick={() => toggleExpand("fitType")}
            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
          >
            {expandedFilters.fitType ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        </div>
        {expandedFilters.fitType && (
          <div
            className="pl-3 mt-2 space-y-2 overflow-hidden transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: expandedFilters.fitType ? "150px" : "0" }}
          >
            {filterOptions.fitTypes.length > 0 ? (
              filterOptions.fitTypes.map((f) => (
                <label key={f} className="flex items-center text-sm text-gray-700">
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
              <p className="text-sm text-gray-500">No fit types available</p>
            )}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Price</span>
            <button
              onClick={() => toggleExpand("priceRange")}
              className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs transition-transform hover:scale-105"
            >
              {expandedFilters.priceRange ? <FaChevronDown /> : <FaChevronRight />}
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
                  className="absolute top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-300 rounded-full"
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
  );
};

export default SidebarFilter;