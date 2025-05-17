// src/components/ProtectRoute/PublicOnlyRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const PublicOnlyRoute = ({ children }) => {
  const auth = useAuthUser();

  if (auth?.authStatus) {
    return <Navigate to="/submitdb" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
