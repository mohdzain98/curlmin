import React from "react";
import Main2 from "./Main2";
import Categories from "./Categories";
import Features from "./Features";
import Footer from "./Footer";
import Bcscanner from "./Bcscanner";

const Home = (props) => {
  const { showAlert, login } = props.prop;
  return (
    <>
      <Main2 prop={{ showAlert, login }} />
      <Categories />
      <Bcscanner />
      <Features />
      <Footer />
    </>
  );
};

export default Home;
