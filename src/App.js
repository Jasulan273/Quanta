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
import UserPanel from "./Pages/UserPanel/UserPanel";
import PrivateRoute from "./Components/PrivateRoute";
import LanguageQuiz from "./Pages/LanguageQuiz/LanguageQuiz";
import CreateCourse from "./Pages/UserPanel/CreateCourse";
import EditCourse from "./Pages/UserPanel/EditCourse";
import EditLesson from "./Pages/UserPanel/EditLesson";

function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("username"));
  const location = useLocation();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("username");
      setUser(storedUser);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
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
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Courses" element={<Courses />} />
        <Route
          path="/courses/:courseId/modules/:modulesId/lesson/:lessonId"
          element={
            <PrivateRoute user={user}>
              <LessonPage />
            </PrivateRoute>
          }
        />
        <Route path="/Blog" element={<Blog />} />
        <Route
          path="/UserPanel"
          element={
            <PrivateRoute user={user}>
              <UserPanel user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <PrivateRoute user={user}>
              <CreateCourse user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-course/:courseId"
          element={
            <PrivateRoute user={user}>
              <EditCourse user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-lesson/:courseId/:moduleId/:lessonId"
          element={
            <PrivateRoute user={user}>
              <EditLesson />
            </PrivateRoute>
          }
        />
        <Route path="/About" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/quiz" element={<LanguageQuiz />} />
        <Route path="/Auth" element={<Auth setUser={setUser} />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/courses/:courseId" element={<CoursePage user={user} />} />
        <Route path="/BlogPage/:id" element={<BlogPage />} />
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