import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

const formSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    billingAddress: z.string().min(1, "Billing address is required"),
    billingCity: z.string().min(1, "Billing city is required"),
    billingState: z.string().min(1, "Billing state is required"),
    billingPostalCode: z.string().min(1, "Billing postal code is required"),
    billingPhone: z
      .string()
      .min(10, "Billing phone number must be at least 10 digits"),
    faxNumber: z.string().min(1, "Fax number is required"),
    billingAddressType: z.enum(["Business", "Residential"], {
      required_error: "Please select an address type",
    }),
    sameAsBilling: z.boolean(),
    shippingAddress: z.string().optional(),
    shippingCity: z.string().optional(),
    shippingState: z.string().optional(),
    shippingPostalCode: z.string().optional(),
    shippingAddressType: z.enum(["Business", "Residential"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.sameAsBilling) {
      if (!data.shippingAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shipping address is required when different from billing",
          path: ["shippingAddress"],
        });
      }
      if (!data.shippingCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shipping city is required when different from billing",
          path: ["shippingCity"],
        });
      }
      if (!data.shippingState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shipping state is required when different from billing",
          path: ["shippingState"],
        });
      }
      if (!data.shippingPostalCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Shipping postal code is required when different from billing",
          path: ["shippingPostalCode"],
        });
      }
      if (!data.shippingAddressType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Shipping address type is required when different from billing",
          path: ["shippingAddressType"],
        });
      }
    }
  });

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const StepOne = ({ data, onComplete, onNext }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: data.companyName,
      billingAddress: data.billingAddress,
      billingCity: data.billingCity,
      billingState: data.billingState,
      billingPostalCode: data.billingPostalCode,
      billingPhone: data.billingPhone,
      faxNumber: data.faxNumber,
      billingAddressType: data.billingAddressType,
      sameAsBilling: data.sameAsBilling,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingState: data.shippingState,
      shippingPostalCode: data.shippingPostalCode,
      shippingAddressType: data.shippingAddressType,
    },
  });

  const sameAsBilling = watch("sameAsBilling");

  const onSubmit = (data) => {
    onComplete(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Company Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Company Information
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name *
            </label>
            <input
              {...register("companyName")}
              type="text"
              className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border rounded-lg"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyName.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Billing Details</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="billingAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Billing Address *
            </label>
            <input
              {...register("billingAddress")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.billingAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingAddress.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingCity"
              className="block text-sm font-medium text-gray-700"
            >
              City *
            </label>
            <input
              {...register("billingCity")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.billingCity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingCity.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingState"
              className="block text-sm font-medium text-gray-700"
            >
              State/Province *
            </label>
            <select
              {...register("billingState")}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.billingState && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingState.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingPostalCode"
              className="block text-sm font-medium text-gray-700"
            >
              Postal Code *
            </label>
            <input
              {...register("billingPostalCode")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.billingPostalCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingPostalCode.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>
            <input
              {...register("billingPhone")}
              type="tel"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.billingPhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingPhone.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="faxNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Fax Number *
            </label>
            <input
              {...register("faxNumber")}
              type="tel"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.faxNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.faxNumber.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="billingAddressType"
              className="block text-sm font-medium text-gray-700"
            >
              Address Type *
            </label>
            <select
              {...register("billingAddressType")}
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Business">Business</option>
              <option value="Residential">Residential</option>
            </select>
            {errors.billingAddressType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingAddressType.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Shipping Details
          </h3>
          <div className="flex items-center">
            <input
              {...register("sameAsBilling")}
              type="checkbox"
              className="h-4 w-4 border rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="sameAsBilling"
              className="ml-2 block text-sm text-gray-900"
            >
              Same as Billing
            </label>
          </div>
        </div>

        {!sameAsBilling && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="shippingAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Address *
              </label>
              <input
                {...register("shippingAddress")}
                type="text"
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.shippingAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="shippingCity"
                className="block text-sm font-medium text-gray-700"
              >
                City *
              </label>
              <input
                {...register("shippingCity")}
                type="text"
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.shippingCity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingCity.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="shippingState"
                className="block text-sm font-medium text-gray-700"
              >
                State/Province *
              </label>
              <select
                {...register("shippingState")}
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.shippingState && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingState.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="shippingPostalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code *
              </label>
              <input
                {...register("shippingPostalCode")}
                type="text"
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.shippingPostalCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingPostalCode.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="shippingAddressType"
                className="block text-sm font-medium text-gray-700"
              >
                Address Type *
              </label>
              <select
                {...register("shippingAddressType")}
                className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Business">Business</option>
                <option value="Residential">Residential</option>
              </select>
              {errors.shippingAddressType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddressType.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-blue-blue-500"
          >
            Next
          </button>
        </div>
    </form>
  );
};

StepOne.propTypes = {
  data: PropTypes.shape({
    companyName: PropTypes.string,
    billingAddress: PropTypes.string,
    billingCity: PropTypes.string,
    billingState: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingPhone: PropTypes.string,
    faxNumber: PropTypes.string,
    billingAddressType: PropTypes.string,
    sameAsBilling: PropTypes.bool,
    shippingAddress: PropTypes.string,
    shippingCity: PropTypes.string,
    shippingState: PropTypes.string,
    shippingPostalCode: PropTypes.string,
    shippingAddressType: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default StepOne;