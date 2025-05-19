// src/components/ProtectRoute/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const PrivateRoute = () => {
  const auth = useAuthUser();

  if (!auth?.authStatus) {
    return <Navigate to="/"/>;
  }

  return <Outlet />;
};

export default PrivateRoute;
