import PropTypes from "prop-types";

const ConfirmModal = ({ cancelAction, confirmAction }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Confirm Removal</h2>
        <p className="mb-4">
          Are you sure you want to remove the selected items?
        </p>
        <div className="flex justify-between">
          <button
            onClick={cancelAction}
            className="py-2 px-4 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirmAction}
            className="py-2 px-4 bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  cancelAction: PropTypes.func.isRequired,
  confirmAction: PropTypes.func.isRequired,
};

export default ConfirmModal;
