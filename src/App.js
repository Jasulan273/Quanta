import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Courses from "./Pages/Courses/Courses";
import Blog from "./Pages/Blog/Blog";
import About from "./Pages/About/About";
import FAQ from "./Pages/FAQ/FAQ";
import Auth from "./Pages/Auth/Auth";
import Registration from "./Pages/Auth/Registration";
import CoursePage from "./Pages/CoursePages/CoursePage";
import LessonPage from "./Pages/CoursePages/LessonPage";
import Loader from "./Components/Loader"; 
import BlogPage from "./Pages/Blog/BlogPage";

function App() {
  const [loading, setLoading] = useState(false); 
  const location = useLocation(); 

  useEffect(() => {
    setLoading(true); 
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="App">
      {loading && <Loader />} 
      <Header />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/About" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/CoursePages" element={<CoursePage />} />
        <Route path="/Lesson" element={<LessonPage />} />
        <Route path="/BlogPage" element={<BlogPage />} />
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Routes>
      <Footer />
   

    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
