import PropTypes from "prop-types";

const CartActions = ({
  getCartCount,
  isSelecting,
  setIsSelecting,
  removeAllSelectedItems,
  loading,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Cart ({getCartCount()} items)</h1>
      </div>
      {/* {isSelecting && ( */}
      <div
        className={`flex ${
          isSelecting ? "justify-between" : "justify-end"
        } items-center mb-6`}
      >
        {/* <button
            onClick={toggleSelectAll}
            className="bg-red-500 text-white py-2 px-3 rounded"
          >
            Select All
          </button> */}
        {isSelecting && (
          <button
            onClick={removeAllSelectedItems}
            className={`bg-red-500 text-white py-2 px-3 rounded flex items-center gap-2 ${
              loading && "cursor-not-allowed"
            }`}
            disabled={loading}
          >
            Remove
          </button>
        )}

        <button
          onClick={() => setIsSelecting(!isSelecting)}
          className={`py-2 px-4 rounded ${
            isSelecting ? "bg-red-300 text-black" : "bg-red-500 text-white"
          } ${loading && "cursor-not-allowed"}`}
          disabled={loading}
        >
          {isSelecting ? "Cancel" : "Select Items"}
        </button>
      </div>
    </>
  );
};
CartActions.propTypes = {
  getCartCount: PropTypes.func.isRequired,
  isSelecting: PropTypes.bool.isRequired,
  setIsSelecting: PropTypes.func.isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
  removeAllSelectedItems: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default CartActions;
