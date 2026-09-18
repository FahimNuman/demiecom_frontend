import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

const formSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    jobTitle: z.string().optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    alternateEmail: z.string().email("Invalid email address").optional(),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    subscribeToEmails: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const StepThree = ({ data, onComplete, onSubmit, onPrev }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      phoneNumber: data.phoneNumber,
      alternateEmail: data.alternateEmail,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      termsAccepted: data.termsAccepted,
      subscribeToEmails: data.subscribeToEmails,
    },
  });

  const onFormSubmit = (formData) => {
    onComplete(formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* User Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">User Details</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name *
            </label>
            <input
              {...register("fullName")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              {...register("jobTitle")}
              type="text"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>
            <input
              {...register("phoneNumber")}
              type="tel"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="alternateEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Alternate Email
            </label>
            <input
              {...register("alternateEmail")}
              type="email"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.alternateEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.alternateEmail.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password *
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password *
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center">
              <input
                {...register("termsAccepted")}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="termsAccepted"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the terms and conditions *
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600">
                {errors.termsAccepted.message}
              </p>
            )}

            <div className="flex items-center">
              <input
                {...register("subscribeToEmails")}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="subscribeToEmails"
                className="ml-2 block text-sm text-gray-900"
              >
                Subscribe to promotional emails *
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex justify-center border rounded-lg  border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="inline-flex justify-center border rounded-lg  border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Complete Registration
        </button>
      </div>
    </form>
  );
};

StepThree.propTypes = {
  data: PropTypes.shape({
    fullName: PropTypes.string,
    jobTitle: PropTypes.string,
    phoneNumber: PropTypes.string,
    alternateEmail: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    termsAccepted: PropTypes.bool,
    subscribeToEmails: PropTypes.bool,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default StepThree;
