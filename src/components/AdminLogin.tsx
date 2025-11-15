import { useState } from "react";

interface Props {
  onLogin: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [adminId, setAdminId] = useState("");

const handleLogin = () => {
  if (adminId.trim() === "") {
    alert("Please enter Admin ID!");
    return;
  }

  if (adminId !== "changeme_admin_token_123") {
    alert("Invalid Login ID");
    return;
  }

  // valid
  localStorage.setItem("token", "changeme_admin_token_123");
  onLogin();
};


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
      <input
        type="text"
        placeholder="Enter Admin ID"
        value={adminId}
        onChange={(e) => setAdminId(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
      >
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
  