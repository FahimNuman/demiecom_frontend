import { useState } from "react";
import { FaCreditCard, FaLock, FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const AuthorizeNetForm = ({ onSubmit, loading }) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expirationDate: "",
    cardCode: "",
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Format card number with spaces
    if (id === "cardNumber") {
      const cleaned = value.replace(/\D/g, "");
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setCardData({
        ...cardData,
        [id]: formatted,
      });
    } 
    // Format expiration date with slash
    else if (id === "expirationDate") {
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
      }
      setCardData({
        ...cardData,
        [id]: formatted,
      });
    } else {
      setCardData({
        ...cardData,
        [id]: value,
      });
    }
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number (basic validation - should be 15-16 digits)
    if (!/^\d{15,16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid card number";
    }
    
    // Validate expiration date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(cardData.expirationDate)) {
      newErrors.expirationDate = "Please enter a valid date (MM/YY)";
    } else {
      // Check if date is not expired
      const [month, year] = cardData.expirationDate.split("/");
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      
      if (expiryDate < currentDate) {
        newErrors.expirationDate = "Card is expired";
      }
    }
    
    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cardData.cardCode)) {
      newErrors.cardCode = "Please enter a valid security code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format expiration date for Authorize.net (MMYY)
      const formattedExpDate = cardData.expirationDate.replace("/", "");
      
      onSubmit({
        ...cardData,
        expirationDate: formattedExpDate,
      });
    }
  };

  return (
    <div className="mt-4">
      <div className="p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaCreditCard className="text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Credit Card Information</h3>
          </div>
          <div className="flex items-center text-green-600">
            <FaLock className="mr-1" />
            <span className="text-xs">Secure Payment</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="5424 0000 0000 0015"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              maxLength={19}
              className={`w-full p-3 border ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="text"
                id="expirationDate"
                placeholder="MM/YY"
                value={cardData.expirationDate}
                onChange={handleInputChange}
                maxLength={5}
                className={`w-full p-3 border ${
                  errors.expirationDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="cardCode" className="block text-sm font-medium text-gray-700 mb-1">
                Security Code (CVV)
              </label>
              <input
                type="text"
                id="cardCode"
                placeholder="123"
                value={cardData.cardCode}
                onChange={handleInputChange}
                maxLength={4}
                className={`w-full p-3 border ${
                  errors.cardCode ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.cardCode && (
                <p className="text-red-500 text-xs mt-1">{errors.cardCode}</p>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <span>Pay Securely</span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <img src="https://cdn.iconscout.com/icon/free/png-256/visa-3-226460.png" alt="Visa" className="h-6" />
              <img src="https://cdn.iconscout.com/icon/free/png-256/mastercard-6-226455.png" alt="Mastercard" className="h-6" />
              <img src="https://cdn.iconscout.com/icon/free/png-256/american-express-7-226451.png" alt="Amex" className="h-6" />
              <img src="https://cdn.iconscout.com/icon/free/png-256/discover-3-226457.png" alt="Discover" className="h-6" />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            <div className="flex items-start">
              <FaInfoCircle className="mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-semibold">Test Card Information:</p>
                <p>Use these cards for testing in sandbox mode:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Visa: 4111 1111 1111 1111</li>
                  <li>Mastercard: 5424 0000 0000 0015</li>
                  <li>Expiration: Any future date (MM/YY)</li>
                  <li>CVV: Any 3 digits (4 for Amex)</li>
                </ul>
                <p className="mt-1 text-xs">See <code>src/docs/authorize-net-testing.md</code> for more test cards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthorizeNetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default AuthorizeNetForm;
