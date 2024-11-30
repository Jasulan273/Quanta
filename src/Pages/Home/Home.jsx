import React from "react";
import Banner from "./Banner";
import Categories from "./Categories";
import Featured from "./Featured";

export default function Home() {
  return (
  <div className="Home">
     <Banner />
     <Categories />
     <Featured />
  </div>
  );
}
