// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} />;
  }

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
