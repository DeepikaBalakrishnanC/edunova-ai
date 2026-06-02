import ProtectedRoute from "./ProtectedRoute";

export default function RoleProtectedRoute({ children, role }) {
  return <ProtectedRoute roles={[role]}>{children}</ProtectedRoute>;
}
