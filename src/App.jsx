// src/App.jsx
import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedView from "./components/common/ProtectedView";
import AdminLayout from "./components/common/AdminLayout";

function App() {
  const [session, setSession] = useState(null);
  const [globalError, setGlobalError] = useState("");
  const [authPage, setAuthPage] = useState("login");

  const handleLoginSuccess = (loginData) => {
    setSession(loginData);
    setGlobalError("");
  };

  const handleLogout = () => {
    setSession(null);
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
          <AdminLayout
            session={session}
            onLogout={handleLogout}
            onForbidden={setGlobalError}
          />
        </ProtectedView>
      )}

      
      {session && session.user.role === "apprenant" && (
        <div>
          <h1>Welcome Learner: {session.user.fullName}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;