interface Props {
  onLogout: () => void;
}

const UserDashboard: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h2 className="text-2xl font-semibold mb-4">Welcome User</h2>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
  