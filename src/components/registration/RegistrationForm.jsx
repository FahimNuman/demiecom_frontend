import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authApis } from "../api/auth";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Company & Address Information
    companyName: "",
    attention: "",
    // Billing Details
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingPhone: "",
    faxNumber: "",
    billingAddressType: "", // Business/Residential
    // Shipping Details
    sameAsBilling: false,
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingAddressType: "", // Business/Residential

    // Step 2 - Business and Preferences
    businessType: "",
    otherBusinessType: "",
    businessDescription: "",
    tradeOrganization: "",
    doesEmbellish: false,
    embellishmentTypes: [],
    doesResell: false,
    currentSupplier: "",
    annualSpend: "",
    preferredBrands: [],
    websiteUrl: "",

    // Step 3 - User and Account Details
    fullName: "",
    jobTitle: "",
    phoneNumber: "",
    alternateEmail: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    subscribeToEmails: false,
  });

  const { mutate: registerMutation, isLoading } = useMutation({
    mutationFn: authApis.register,
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.message || "Registration failed. Please try again.");
    },
  });

  const handleStepComplete = (stepData) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      companyDetails: {
        companyName: formData.companyName,
        attention: formData.attention,
      },
      billingDetails: {
        address: formData.billingAddress,
        city: formData.billingCity,
        stateProvince: formData.billingState,
        postalCode: formData.billingPostalCode,
        phoneNumber: formData.billingPhone,
        faxNumber: formData.faxNumber,
        addressType: formData.billingAddressType,
      },
      shippingDetails: {
        sameAsBilling: formData.sameAsBilling,
        address: formData.sameAsBilling
          ? formData.billingAddress
          : formData.shippingAddress,
        city: formData.sameAsBilling
          ? formData.billingCity
          : formData.shippingCity,
        stateProvince: formData.sameAsBilling
          ? formData.billingState
          : formData.shippingState,
        postalCode: formData.sameAsBilling
          ? formData.billingPostalCode
          : formData.shippingPostalCode,
        addressType: formData.sameAsBilling
          ? formData.billingAddressType
          : formData.shippingAddressType,
      },
      businessInformation: {
        businessType: formData.businessType,
        otherBusinessType: formData.otherBusinessType,
        businessDescription: formData.businessDescription,
        tradeOrganization: formData.tradeOrganization,
      },
      productDecoration: {
        doesEmbellish: formData.doesEmbellish,
        embellishmentTypes: formData.embellishmentTypes,
        doesResell: formData.doesResell,
      },
      preferences: {
        currentSupplier: formData.currentSupplier,
        annualSpend: formData.annualSpend,
        preferredBrands: formData.preferredBrands,
        websiteUrl: formData.websiteUrl,
      },
      userDetails: {
        jobTitle: formData.jobTitle,
        phoneNumber: formData.phoneNumber,
        alternateEmail: formData.alternateEmail,
      },
      marketingPreferences: {
        subscribeToEmails: formData.subscribeToEmails,
      },
    };

    registerMutation(payload);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const stepTitles = ["Company & Address", "Business Details", "Account Setup"];

  const stepIcons = ["🏢", "📋", "👤"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-24">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1 relative w-full">
              <div
                className={`h-2 ${
                  num === 1 ? "rounded-l" : num === 3 ? "rounded-r" : ""
                } ${num <= step ? "bg-blue-500" : "bg-gray-200"}`}
              />
              <div className="absolute flex flex-col lg:w-36 items-center justify-center top-4 left-1/2 transform -translate-x-1/2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    num <= step ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {stepIcons[num - 1]}
                </div>
                <p
                  className={`block text-sm mt-2 text-center w-full ${
                    num <= step ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  {stepTitles[num - 1]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <StepOne
          data={formData}
          onComplete={handleStepComplete}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <StepTwo
          data={formData}
          onComplete={handleStepComplete}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 3 && (
        <StepThree
          data={formData}
          onComplete={handleStepComplete}
          onSubmit={handleSubmit}
          onPrev={prevStep}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RegistrationForm;
