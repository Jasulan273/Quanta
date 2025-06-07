import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { fetchUserProfile } from "./Api/profile";
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
import AI from "./Pages/AI/AI";
import CreateCourse from "./Pages/UserPanel/CreateCourse";
import EditCourse from "./Pages/UserPanel/EditCourse";
import EditLesson from "./Pages/UserPanel/EditLesson";
import BlogEditor from "./Pages/UserPanel/BlogEditor";
import CreateBlog from "./Pages/UserPanel/CreateBlog";
import ChatAssistant from "./Components/СhatAssistant/ChatAssistant";
import AuthCallback from "./Pages/Auth/AuthCallback";
import VerifyEmail from "./Pages/Auth/VerifyEmail";

function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          setUser(userData);
          localStorage.setItem("username", userData.username);
        } else {
          setUser(null);
          localStorage.removeItem("username");
          localStorage.removeItem("accessToken");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
      }
    } else {
      setUser(null);
      localStorage.removeItem("username");
    }
  };

  useEffect(() => {
    fetchUser();
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        fetchUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location.pathname]);

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
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/courses" element={<Courses />} />
        <Route
          path="/courses/:courseId/modules/:moduleId/lesson/:lessonId"
          element={
            <PrivateRoute user={user}>
              <LessonPage />
            </PrivateRoute>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/userpanel"
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
        <Route
          path="/create-blog"
          element={
            <PrivateRoute user={user}>
              <CreateBlog user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-blog/:blogId"
          element={
            <PrivateRoute user={user}>
              <BlogEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <PrivateRoute user={user}>
              <AI user={user} />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={<Auth setUser={setUser} fetchUser={fetchUser} />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/courses/:courseId" element={<CoursePage user={user} />} />
        <Route path="/blogpage/:id" element={<BlogPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ChatAssistant user={user} />
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