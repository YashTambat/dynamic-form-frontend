import React, { useEffect, useState } from "react";
import UserSubmissionForm from "./UserSubmissionForm";

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

const UserDashboard: React.FC<Props> = ({ onLogout }) => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/forms`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch forms");
        setForms(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Error fetching forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [API_BASE]);

  // ✅ If a form is selected, show the submission form
  if (selectedFormId) {
    return (
      <UserSubmissionForm
        formId={selectedFormId}
        onBack={() => setSelectedFormId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, User 👋</h2>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading forms...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && forms.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {form.title}
              </h3>
              <p className="text-gray-600 mb-4">{form.description}</p>
              <button
                onClick={() => setSelectedFormId(form._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Fill Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-600">No forms available yet.</p>
      )}
    </div>
  );
};

export default UserDashboard;
