import { useState } from "react";

function AdminLayout({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div>
      <header>
        <h2>Admin Dashboard - {session.user.fullName}</h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      <hr />

      <nav>
        <button onClick={() => setActiveTab("users")}>Manage Users</button>
        <button onClick={() => setActiveTab("courses")}>Manage Courses</button>
      </nav>

      <hr />

      <main>
        {activeTab === "users" && <h3>Users Management</h3>}
        {activeTab === "courses" && <h3>Courses Management</h3>}
      </main>
    </div>
  );
}

export default AdminLayout;