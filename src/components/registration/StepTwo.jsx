import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

const formSchema = z
  .object({
    businessType: z.string().min(1, "Business type is required"),
    otherBusinessType: z.string().optional(),
    businessDescription: z.string().min(1, "Business description is required"),
    tradeOrganization: z.string().min(1, "Trade organization is required"),
    doesEmbellish: z.boolean(),
    embellishmentTypes: z.array(z.string()).min(1, "At least one embellishment type is required"),
    doesResell: z.boolean(),
    currentSupplier: z.string().min(1, "Current supplier is required"),
    annualSpend: z.string().min(1, "Annual spend is required"),
    preferredBrands: z.array(z.string()).min(1, "At least one preferred brand is required"),
    websiteUrl: z.string().url("Valid website URL is required").min(1, "Website URL is required"),
  })
  .refine(
    (data) => {
      if (data.businessType === "Other") {
        return data.otherBusinessType && data.otherBusinessType.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your business type",
      path: ["otherBusinessType"],
    }
  )
  .refine(
    (data) => !data.doesEmbellish || (data.doesEmbellish && data.embellishmentTypes.length > 0),
    {
      message: "At least one embellishment type is required if you embellish products",
      path: ["embellishmentTypes"],
    }
  );

const businessTypes = ["Retailer", "Decorator", "Distributor", "Other"];
const tradeOrganizations = ["None", "ASI", "SAGE", "PPAI", "Other"];
const embellishmentTypes = [
  "Screen Printing",
  "Embroidery",
  "Heat Transfer",
  "Sublimation",
  "Other",
];
const annualSpendRanges = [
  "Less than $30,000",
  "$30,000–$50,000",
  "More than $50,000",
];
const preferredBrandOptions = [
  "Next Level Apparel",
  "Bella+Canvas",
  "Gildan",
  "Other",
];

const StepTwo = ({ data, onComplete, onNext, onPrev }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: data.businessType || "",
      otherBusinessType: data.otherBusinessType || "",
      businessDescription: data.businessDescription || "",
      tradeOrganization: data.tradeOrganization || "",
      doesEmbellish: data.doesEmbellish || false,
      embellishmentTypes: data.embellishmentTypes || [],
      doesResell: data.doesResell || false,
      currentSupplier: data.currentSupplier || "",
      annualSpend: data.annualSpend || "",
      preferredBrands: data.preferredBrands || [],
      websiteUrl: data.websiteUrl || "",
    },
  });

  const businessType = watch("businessType");
  const doesEmbellish = watch("doesEmbellish");

  const onSubmit = (data) => {
    onComplete(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Business Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Business Information
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="businessType"
              className="block text-sm font-medium text-gray-700"
            >
              Business Type *
            </label>
            <select
              {...register("businessType")}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {businessType === "Other" && (
            <div>
              <label
                htmlFor="otherBusinessType"
                className="block text-sm font-medium text-gray-700"
              >
                Specify Your Business Type *
              </label>
              <input
                {...register("otherBusinessType")}
                type="text"
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.otherBusinessType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.otherBusinessType.message}
                </p>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label
              htmlFor="businessDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Tell Us About Your Business *
            </label>
            <textarea
              {...register("businessDescription")}
              rows={3}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your business operations and focus"
            />
            {errors.businessDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.businessDescription.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tradeOrganization"
              className="block text-sm font-medium text-gray-700"
            >
              Membership in Trade Organizations *
            </label>
            <select
              {...register("tradeOrganization")}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Organization</option>
              {tradeOrganizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
            {errors.tradeOrganization && (
              <p className="mt-1 text-sm text-red-600">
                {errors.tradeOrganization.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Decoration */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Product Decoration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              {...register("doesEmbellish")}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="doesEmbellish"
              className="ml-2 block text-sm text-gray-900"
            >
              Do You Embellish or Decorate Products? *
            </label>
          </div>

          {doesEmbellish && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                How Do You Embellish? *
              </label>
              <div className="mt-2 space-y-2">
                {embellishmentTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      {...register("embellishmentTypes")}
                      type="checkbox"
                      value={type}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">{type}</label>
                  </div>
                ))}
                {errors.embellishmentTypes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.embellishmentTypes.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              {...register("doesResell")}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="doesResell"
              className="ml-2 block text-sm text-gray-900"
            >
              Do You Resell the Goods? *
            </label>
          </div>
        </div>
      </div>

      {/* Spending and Preferences */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Spending and Preferences
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="currentSupplier"
              className="block text-sm font-medium text-gray-700"
            >
              Current Supplier of Blank Apparel *
            </label>
            <input
              {...register("currentSupplier")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.currentSupplier && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentSupplier.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="annualSpend"
              className="block text-sm font-medium text-gray-700"
            >
              Average Annual Spend on Blank Apparel *
            </label>
            <select
              {...register("annualSpend")}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Range</option>
              {annualSpendRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            {errors.annualSpend && (
              <p className="mt-1 text-sm text-red-600">
                {errors.annualSpend.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Preferred Brands *
            </label>
            <div className="mt-2 space-y-2">
              {preferredBrandOptions.map((brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    {...register("preferredBrands")}
                    type="checkbox"
                    value={brand}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">{brand}</label>
                </div>
              ))}
              {errors.preferredBrands && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.preferredBrands.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="websiteUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Website URL *
            </label>
            <input
              {...register("websiteUrl")}
              type="url"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://www.example.com"
            />
            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.websiteUrl.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex justify-center border rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="inline-flex justify-center border rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

StepTwo.propTypes = {
  data: PropTypes.shape({
    businessType: PropTypes.string,
    otherBusinessType: PropTypes.string,
    businessDescription: PropTypes.string,
    tradeOrganization: PropTypes.string,
    doesEmbellish: PropTypes.bool,
    embellishmentTypes: PropTypes.arrayOf(PropTypes.string),
    doesResell: PropTypes.bool,
    currentSupplier: PropTypes.string,
    annualSpend: PropTypes.string,
    preferredBrands: PropTypes.arrayOf(PropTypes.string),
    websiteUrl: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default StepTwo;