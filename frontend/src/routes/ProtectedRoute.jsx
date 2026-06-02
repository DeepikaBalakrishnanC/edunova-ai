import { Navigate, useLocation } from "react-router-dom";

import { dashboardForRole, getStoredUser, hasRole } from "../utils/auth";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(user.role, roles)) {
    return <Navigate to={dashboardForRole(user.role)} replace />;
  }

  return children;
}
