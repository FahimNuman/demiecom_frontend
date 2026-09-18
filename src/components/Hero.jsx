
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="max-padd-container max-xl:mt-8 mb-16">
      <div className="max-padd-container bg-gray-200 bg-cover bg-center bg-no-repeat h-[800px] w-full  mt-6 relative overflow-hidden" style={{ backgroundImage: "url('https://cdn.sanity.io/images/0v989dzu/production/e7a9a680e6e8849128a4ef1e040818f7967173d6-2880x1134.jpg?w=2000&q=100&crop=center&auto=format')" }}>
        {/* <div className="absolute top-1/3 left-1/4 text-white">
          <h5 className="flex items-center gap-x-2 text-yellow-400 text-xs font-bold uppercase">
            SUMMER SALE
          </h5>
          <h1 className="text-4xl font-bold uppercase mt-2 leading-tight">
            UP TO 80% OFF SITEWIDE
          </h1>
          <div className="mt-4">
            <Link
              to="/collection"
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold uppercase inline-block"
            >
              SHOP NOW
            </Link>
          </div>
          <p className="text-xs text-white mt-2">Prices as marked. T&Cs apply.</p>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;