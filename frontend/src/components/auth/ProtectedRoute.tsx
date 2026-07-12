import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Loading from "../common/Loading";

import {
  useAuth,
} from "../../context/AuthContext";


export default function ProtectedRoute() {
  const {
    authenticated,
    loading,
  } = useAuth();

  const location =
    useLocation();


  if (loading) {
    return <Loading />;
  }


  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  return <Outlet />;
}