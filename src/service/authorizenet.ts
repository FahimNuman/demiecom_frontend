// authorizenet.ts

// Authorize.net payment service

// Create a payment transaction using Authorize.net API
export const createAuthorizenetTransaction = async (data: { 
  amount: number,
  cardData: {
    cardNumber: string,
    expirationDate: string,
    cardCode: string
  },
  billingInfo: {
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string
  },
  userId: string // Make userId required
}) => {
  try {
    const payload = {
      cardData: {
        cardNumber: data.cardData.cardNumber,
        expirationDate: data.cardData.expirationDate,
        cardCode: data.cardData.cardCode
      },
      amount: data.amount,
      address: data.billingInfo,
      userId: data.userId // Include userId in the payload
    };

    console.log("Sending to Authorize.net backend:", JSON.stringify(payload));

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/authorize-net/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Authorize.net response error:", response.status, errorText);
      throw new Error(`Failed to create Authorize.net transaction: ${errorText}`);
    }

    const jsonResponse = await response.json();
    console.log("Authorize.net response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Authorize.net transaction error:", error);
    throw error;
  }
};

// Validate card information without charging (optional, keep as is or update similarly)
export const validateCardInfo = async (data: {
  cardNumber: string,
  expirationDate: string,
  cardCode: string
}) => {
  try {
    const payload = {
      cardData: {
        cardNumber: data.cardNumber,
        expirationDate: data.expirationDate,
        cardCode: data.cardCode
      },
      amount: 0 // Use 0 for validation if supported
    };

    console.log("Sending validation request to Authorize.net backend:", JSON.stringify(payload));

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/authorize-net/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Card validation response error:", response.status, errorText);
      throw new Error(`Failed to validate card information: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Card validation error:", error);
    throw error;
  }
};