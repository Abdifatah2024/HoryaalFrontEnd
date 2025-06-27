import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { checkAuth } from "./Redux/Auth/LoginSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth()); // ✅ load access token on app start
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
