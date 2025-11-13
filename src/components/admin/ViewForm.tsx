import { useEffect, useState } from "react";

interface Field {
  label: string;
  type: string;
  name: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

interface FormDetail {
  _id: string;
  title: string;
  description: string;
  version: number;
  fields: Field[];
  createdAt: string;
}

interface Props {
  formId: string;
  onClose: () => void;
}

const ViewForm: React.FC<Props> = ({ formId, onClose }) => {
  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/admin/forms/${formId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching form details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  if (loading) return <p className="p-6">Loading form details...</p>;
  if (!form) return <p className="p-6">Form not found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Form Details</h2>

        {/* ✅ Back Button */}
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">{form.title}</h3>
        <p className="mb-2 text-gray-700">{form.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Version: {form.version}
        </p>

        <h4 className="text-lg font-bold mb-2">Fields:</h4>
        <ul className="space-y-2">
          {form.fields.map((field, index) => (
            <li key={index} className="border rounded p-3">
              <p>
                <strong>Label:</strong> {field.label}
              </p>
              <p>
                <strong>Type:</strong> {field.type}
              </p>
              <p>
                <strong>Name:</strong> {field.name}
              </p>
              <p>
                <strong>Required:</strong> {field.required ? "Yes" : "No"}
              </p>
              <p>
                <strong>Order:</strong>{field.order}
              </p>

              {field.options && field.options.length > 0 && (
                <div>
                  <strong>Options:</strong>
                  <ul className="list-disc ml-6">
                    {field.options.map((opt, i) => (
                      <li key={i}>
                        {opt.label} ({opt.value})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewForm;
