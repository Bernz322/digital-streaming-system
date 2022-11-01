import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "./helpers";

const PrivateRoutes = () => {
  if (!isLoggedIn()) return <Navigate to="/welcome" replace />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoutes;
