import { useEffect, useState } from "react";

interface Form {
  _id: string;
  title: string;
  description: string;
  version: number;
  createdAt: string;
}

interface Props {
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/admin/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setForms(data);
    };
    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Version</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form._id}>
              <td className="border px-4 py-2">{form.title}</td>
              <td className="border px-4 py-2">{form.description}</td>
              <td className="border px-4 py-2">{form.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
