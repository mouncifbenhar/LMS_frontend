function ProtectedView({ userRole, allowedRole, children }) {
  if (userRole !== allowedRole) {
    return (
      <div>
        <h3>Access Denied</h3>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  return children;
}

export default ProtectedView;