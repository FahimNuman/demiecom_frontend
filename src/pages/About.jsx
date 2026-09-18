

const About = () => {
  return (
    <div className="bg-gray-100 max-padd-container py-16 ">
      {/* Hero Section */}
      <div className="relative w-full h-64 bg-cover bg-center bg-[url('https://via.placeholder.com/1500')]">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">Start the conversation to establish good relationships and business.</p>
        </div>
      </div>

      {/* Contact Form and Details */}
      <div className="container mx-auto py-10 px-5 lg:px-0 flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">Have a Question?</h2>
          <p className="text-gray-600 mb-6">Fill in the form to start a conversation</p>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mobile</label>
              <input
                type="text"
                placeholder="+880"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Purpose</label>
              <input
                type="text"
                placeholder="Purpose"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>
            <button className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700 transition duration-200">
              Submit
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">Get In Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Head Office</h3>
              <p className="text-gray-600">198 Canal St, Ellenville, New York 12428</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email Support</h3>
              <p className="text-gray-600">
                <a href="mailto:tabrez@rsikdercorporation.com" className="text-teal-600 hover:underline">tabrez@rsikdercorporation.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Contact Us</h3>
              <p className="text-gray-600">Phone: +1(631)-455-0077; 631-507-0024</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-teal-700 mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600"><i className="fab fa-facebook-f"></i> Facebook</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600"><i className="fab fa-pinterest-p"></i> Pinterest</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600"><i className="fab fa-twitter"></i> Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600"><i className="fab fa-instagram"></i> Instagram</a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-10">
        <h2 className="text-center text-2xl font-semibold text-teal-700 mb-6">Find Us on the Map</h2>
        <p className="text-center text-gray-600 mb-4">Our location is conveniently situated to serve you better. Visit us or get directions using the map below.</p>
        <div className="w-full max-w-4xl mx-auto">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.317388070179!2d90.369490214981!3d23.80694768456352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7abf99e7c43%3A0x1b3a1e1be6eaa2e4!2sHouse%2023%2C%20Rd%20No.%203%2C%20Dhaka%201209%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1631189388726!5m2!1sen!2sbd"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default About;
