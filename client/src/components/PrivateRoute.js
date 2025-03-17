import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token") !== null; // Check if token exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
