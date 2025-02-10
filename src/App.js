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
import LessonPage from "./Pages/LessonPage/LessonPage";
import Loader from "./Components/Loader";
import BlogPage from "./Pages/Blog/BlogPage";
import NotFound from "./Pages/NotFound/NotFound";
import UserPanel from "./Pages/UserPanel/UserPanel"
import PrivateRoute from "./Components/PrivateRoute"; 
import Snowfall from "react-snowfall";

function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="App relative overflow-hidden">
      {loading && <Loader />}
      <div className="absolute inset-0 pointer-events-none">
        <Snowfall snowflakeCount={800} />
      </div>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route
          path="/courses/:courseId/lesson/:lessonId"
          element={
           // <PrivateRoute user={user}>
              <LessonPage />
           // </PrivateRoute> 
          }
        /> 
        <Route path="/Blog" element={<Blog />} />
        <Route path="UserPanel" element={<UserPanel />} />
        <Route path="/About" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Auth" element={<Auth setUser={setUser} />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/CoursePages" element={<CoursePage />} />
        <Route path="/Lesson" element={<LessonPage />} />
        <Route path="/BlogPage" element={<BlogPage />} />
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router basename="/Quanta">
      <App />
    </Router>
  );
}
