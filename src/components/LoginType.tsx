interface Props {
  onSelect: (type: "user" | "admin") => void;
}

const LoginType: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Select Login Type</h1>
      <div className="flex gap-6">
        <button
          onClick={() => onSelect("user")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          User Login
        </button>
        <button
          onClick={() => onSelect("admin")}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default LoginType;
