import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";
import logo from "/src/assets/logo.png";

const Footer = () => {
  return (
    <div className="max-padd-container max-xl:mt-8 ">
      <footer className="bg-white text-black  px-2 border-t border-gray-300 max-padd-container py-16">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-12 justify-between">
          {/* Logo & Company Description */}
          <div className="flex-1 max-w-sm">
            <h4 className="flex items-center mb-10 text-red-500">
              <img
                src={logo}
                alt="Demiui Logo"
                className="logo-img mr-1"
                style={{ height: "52px", width: "auto" }}
              />
            </h4>

            <p className="text-base text-gray-600 leading-relaxed">
              YOUR GO-TO PLACE FOR THE LATEST TRENDS AND TIMELESS CLASSICS. WE
              BRING FASHION TO YOUR DOORSTEP WITH A TOUCH OF STYLE.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1 max-w-sm">
            <h4 className="text-xl font-bold mb-4 text-black">Quick Links</h4>
            <ul className="list-none">
              <li className="mb-3">
                <a
                  href="/privacy"
                  className="text-lg text-black hover:text-orange-500 transition duration-300"
                >
                  PRIVACY POLICY
                </a>
              </li>
              <li className="mb-3">
                <a
                  href="/shippingReturnPolicy"
                  className="text-lg text-black hover:text-orange-500 transition duration-300"
                >
                  SHIPPING & RETURN POLICY
                </a>
              </li>

              <li className="mb-3">
                <a
                  href="/termsAndConditions"
                  className="text-lg text-black hover:text-orange-500 transition duration-300"
                >
                  TERMS & CONDITIONS
                </a>
              </li>
              <li className="mb-3">
                <a
                  href="/contact"
                  className="text-lg text-black hover:text-orange-500 transition duration-300"
                >
                  CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="flex-1 max-w-sm">
            <h4 className="text-xl font-bold mb-4 text-black">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-4 rounded-md text-black text-2xl hover:bg-orange-500 hover:text-white transition duration-300 shadow-md"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-4 rounded-md text-black text-2xl hover:bg-orange-500 hover:text-white transition duration-300 shadow-md"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-4 rounded-md text-black text-2xl hover:bg-orange-500 hover:text-white transition duration-300 shadow-md"
              >
                <FaTwitter />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-4 rounded-md text-black text-2xl hover:bg-orange-500 hover:text-white transition duration-300 shadow-md"
              >
                <FaPinterest />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-300"></div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700">
          <p className="mb-4 sm:mb-0">
            &copy; 2024 Demi UI. All Rights Reserved.
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://demiui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 font-medium hover:underline"
            >
              Demi UI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
