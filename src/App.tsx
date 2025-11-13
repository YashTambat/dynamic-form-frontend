import { useEffect, useState } from "react";
import LoginType from "./components/LoginType";
import AdminLogin from "./components/AdminLogin";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

const App: React.FC = () => {
  const [loginType, setLoginType] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ✅ Restore state on reload
useEffect(() => {
  // defer state updates to avoid React’s synchronous warning
  const restoreLogin = () => {
    const token = localStorage.getItem("token");
    const savedType = localStorage.getItem("loginType");

    if (token === "changeme_admin_token_123" && savedType === "admin") {
      setLoginType("admin");
      setIsLoggedIn(true);
    } else if (savedType === "user") {
      setLoginType("user");
      setIsLoggedIn(true);
    }
  };

  // ✅ Run in next microtask (safe, non-blocking)
  queueMicrotask(restoreLogin);

  // ✅ Cleanup (not strictly needed here)
  return () => {};
}, []);


  // ✅ Logout clears everything
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginType");
    setIsLoggedIn(false);
    setLoginType(null);
  };

  // ✅ Admin login handler
  const handleAdminLogin = () => {
    localStorage.setItem("token", "changeme_admin_token_123");
    localStorage.setItem("loginType", "admin");
    setIsLoggedIn(true);
    setLoginType("admin");
  };

  // ✅ User login handler (no token required)
  const handleUserLogin = () => {
    localStorage.setItem("loginType", "user");
    setIsLoggedIn(true);
    setLoginType("user");
  };

  // ✅ Conditional rendering
  if (!loginType)
    return <LoginType onSelect={(type) => {
      if (type === "admin") setLoginType("admin");
      else if (type === "user") handleUserLogin();
    }} />;

  if (loginType === "admin" && !isLoggedIn)
    return <AdminLogin onLogin={handleAdminLogin} />;

  if (loginType === "admin" && isLoggedIn)
    return <AdminDashboard onLogout={handleLogout} />;

  if (loginType === "user" && isLoggedIn)
    return <UserDashboard onLogout={handleLogout} />;

  return null;
};

export default App;
