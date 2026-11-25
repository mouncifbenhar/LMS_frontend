// src/App.jsx
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedView from "./components/common/ProtectedView";
import AdminLayout from "./components/common/AdminLayout";
import CoursesList from "./components/common/CoursesList";
import { getAllCourses } from "./services/courseService";

function App() {
  const [session, setSession] = useState(null);
  const [globalError, setGlobalError] = useState("");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  const navigate = useNavigate();

  const loadCourses = async (userToken) => {
    setLoadingCourses(true);
    setCoursesError("");

    try {
      const loadedCourses = await getAllCourses(
        userToken,
        handleLogout,
        setGlobalError
      );
      setCourses(loadedCourses);
    } catch (error) {
      setCoursesError(error.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLoginSuccess = (loginData) => {
    setSession(loginData);
    setGlobalError("");
    loadCourses(loginData.token);

    // Redirect user based on role after login
    if (loginData.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/learner");
    }
  };

  const handleLogout = () => {
    setSession(null);
    setCourses([]);
    setLoadingCourses(false);
    setCoursesError("");
    setGlobalError("");
    navigate("/login");
  };

  // Where to send the user by default
  const defaultRoute = !session
    ? "/login"
    : session.user.role === "admin"
      ? "/admin"
      : "/learner";

  return (
    <div>
      {/* 403 Error Banner */}
      {globalError && (
        <div>
          <p>{globalError}</p>
          <button onClick={() => setGlobalError("")}>Close</button>
        </div>
      )}

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            session ? (
              <Navigate to={defaultRoute} />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={
            session ? <Navigate to={defaultRoute} /> : <RegisterForm />
          }
        />

        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            !session ? (
              <Navigate to="/login" />
            ) : (
              <ProtectedView userRole={session.user.role} allowedRole="admin">
                <>
                  <AdminLayout session={session} onLogout={handleLogout} />
                  <CoursesList
                    courses={courses}
                    isLoading={loadingCourses}
                    error={coursesError}
                    onRefresh={() => loadCourses(session.token)}
                  />
                </>
              </ProtectedView>
            )
          }
        />

        {/* Learner Page */}
        <Route
          path="/learner"
          element={
            !session ? (
              <Navigate to="/login" />
            ) : (
              <ProtectedView
                userRole={session.user.role}
                allowedRole="apprenant"
              >
                <div>
                  <h1>Welcome Learner: {session.user.fullName}</h1>
                  <button onClick={handleLogout}>Logout</button>
                  <CoursesList
                    courses={courses}
                    isLoading={loadingCourses}
                    error={coursesError}
                    onRefresh={() => loadCourses(session.token)}
                  />
                </div>
              </ProtectedView>
            )
          }
        />

        {/* Any other URL (including "/") redirects to defaultRoute */}
        <Route path="*" element={<Navigate to={defaultRoute} />} />
      </Routes>
    </div>
  );
}

export default App;