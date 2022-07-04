import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ProtectDoubleLogin } from "./routes/ProtectDoubleLogin";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectDoubleLogin>
              <Login />
            </ProtectDoubleLogin>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
