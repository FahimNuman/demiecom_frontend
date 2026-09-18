// eslint-disable-next-line no-unused-vars
import React from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
// import NewArrivals from '../components/NewArrivals';
// import PopularProducts from '../components/PopularProducts';
import Features from '../components/Features';
import SummerCollection from '../components/SummerCollection';
import ShopByBrand from '../components/ShopByBrand';

const Home = () => {
    return (
        <>
           <Hero/>
           {/* <NewArrivals/>
           <PopularProducts/> */}
           <Features/>
           <SummerCollection/>
           <ShopByBrand/>
           <Footer />
        </>
    );
};

export default Home;