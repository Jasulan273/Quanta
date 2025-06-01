import React from "react";
import Banner from "./Banner";
import Categories from "./Categories";
import Featured from "./Featured";
import Advertisment from './Advertisment'
import Statistics from "./Statistics";
import Advantages from "./Advantages";
import Popular from "./Popular";
import Feedback from "./Feedback";
import LastArticles from "./LastArticles";

export default function Home({ user }) {
  return (
  <div className="Home">
     <Banner />
     <Categories />
     <Featured />
     <Advertisment />
     <Statistics />
     <Advantages />
     <Popular />
     <Feedback user={user} />
     <LastArticles />
  </div>
  );
}
