import { BsSun } from "react-icons/bs"; // Using BsSun instead of BsFire for a summer theme
import { Link } from "react-router-dom";

const SummerCollection = () => {
  return (
    <section className="max-padd-container max-xl:mt-8 mb-16">
      <div className="max-padd-container bg-cover bg-center bg-no-repeat h-[736px] w-full rounded-tr-3xl mt-6 relative overflow-hidden" style={{ backgroundImage: "url('https://cdn.sanity.io/images/0v989dzu/production/6e683b81529b6de4a4d4690b77ebe7a4e4b0d793-2880x1135.jpg?w=2000&q=100&crop=center&auto=format')" }}>
        {/* <div className="relative max-w-[777px] top-48 animate-fadeInUp delay-200">
          <h5 className="flex items-center gap-x-2 text-yellow-500 medium-18 animate-bounce">
            Summer Collection <BsSun />
          </h5>
          <h1 className="h1 capitalize max-w-[611px] animate-slideInLeft delay-300">
            Dive Into Summer Styles Shop Now
          </h1>
          <p className="pl-2 max-w-lg mt-6 mb-8 border-l-4 border-l-yellow-300 animate-fadeIn delay-500">
            Discover the latest summer trends with vibrant designs and lightweight fabrics.
          </p>
          <div className="flex gap-2 sm:gap-6 mt-14 animate-fadeIn delay-700">
            <Link
              to="/collection"
              className="btn-dark max-sm:!p-3 transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              New Arrivals
            </Link>
            <Link
              to="/collection"
              className="btn-secondary max-sm:!p-3 transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Summer Favorites
            </Link>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default SummerCollection;