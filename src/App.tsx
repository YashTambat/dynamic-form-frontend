import { useState } from "react";
import LoginType from "./components/LoginType";
import AdminLogin from "./components/AdminLogin";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

const App: React.FC = () => {
  const [loginType, setLoginType] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoginType(null);
  };

  if (!loginType) return <LoginType onSelect={setLoginType} />;
  if (loginType === "admin" && !isLoggedIn)
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  if (loginType === "admin" && isLoggedIn)
    return <AdminDashboard onLogout={handleLogout} />;
  if (loginType === "user") return <UserDashboard onLogout={handleLogout} />;

  return null;
};

export default App;
