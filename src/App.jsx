// src/App.jsx
import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedView from "./components/common/ProtectedView";
import AdminLayout from "./components/common/AdminLayout";
import CoursesList from "./components/common/CoursesList";
import { getAllCourses } from "./services/courseService";

function App() {
  const [session, setSession] = useState(null);
  const [globalError, setGlobalError] = useState("");
  const [authPage, setAuthPage] = useState("login");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");

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
  };

  const handleLogout = () => {
    setSession(null);
    setCourses([]);
    setLoadingCourses(false);
    setCoursesError("");
    setGlobalError("");
    setAuthPage("login");
  };

  return (
    <div>
      {/* 403 Error Banner */}
      {globalError && (
        <div>
          <p>{globalError}</p>
          <button onClick={() => setGlobalError("")}>Close</button>
        </div>
      )}

      
      {!session && authPage === "login" && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthPage("register")}
        />
      )}

      {!session && authPage === "register" && (
        <RegisterForm
          onSwitchToLogin={() => setAuthPage("login")}
        />
      )}

      
      {session && session.user.role === "admin" && (
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
      )}

      {session && session.user.role === "apprenant" && (
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
      )}
    </div>
  );
}

export default App;