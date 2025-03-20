import React from "react";
import Main from "./Main";
import Categories from "./Categories";
import Features from "./Features";
import Footer from "./Footer";
import Bcscanner from "./Bcscanner";

const Home = (props) => {
  const { showAlert, login } = props.prop;
  return (
    <>
      <Main prop={{ showAlert, login }} />
      <Categories />
      <Bcscanner />
      <Features />
      <Footer />
    </>
  );
};

export default Home;
