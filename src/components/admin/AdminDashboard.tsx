import React, { useEffect, useState } from "react";
import ViewForm from "./ViewForm";
import AddForm from "./AddForm";
import EditForm from "./EditForm";

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
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [editFormId, setEditFormId] = useState<string | null>(null);
  const fetchForms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this form?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/forms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete form");
      }
      alert("Form deleted successfully!");
      fetchForms();
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form. Check console for details.");
    }
  };
  // ✅ New: Handle CSV Export
  const handleExport = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/forms/${id}/submissions/export`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to export CSV");
      }

      // Convert response to Blob (CSV file)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form_${id}_submissions.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Check console for details.");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  if (selectedFormId) {
    return (
      <ViewForm
        formId={selectedFormId}
        onClose={() => setSelectedFormId(null)}
      />
    );
  }

  if (showAddForm) {
    return (
      <AddForm
        onClose={() => {
          setShowAddForm(false);
          fetchForms();
        }}
      />
    );
  }
  if (editFormId) {
    return (
      <EditForm
        formId={editFormId}
        onClose={() => {
          setEditFormId(null);
          fetchForms();
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Form
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading forms...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Version</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form._id}>
                <td className="border px-4 py-2">{form.title}</td>
                <td className="border px-4 py-2">{form.description}</td>
                <td className="border px-4 py-2">{form.version}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setSelectedFormId(form._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditFormId(form._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                   <button
                    onClick={() => handleExport(form._id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AdminDashboard;
