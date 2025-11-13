import React, { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface Field {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  validation?: { min?: number; max?: number };
  options?: Option[];
}

interface Form {
  _id: string;
  title: string;
  description: string;
  fields: Field[];
}

interface Props {
  formId: string;
  onBack: () => void;
}

const UserSubmissionForm: React.FC<Props> = ({ formId, onBack }) => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // ✅ Fetch the form schema
  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/forms/${formId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load form");
        setForm(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Error loading form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [API_BASE, formId]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // ✅ Validate required fields
    for (const field of form.fields) {
      if (field.required && !formData[field.name]) {
        alert(`"${field.label}" is required.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit form");
      setSuccess(true);
      alert("Form submitted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{form.title}</h2>
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ← Back
        </button>
      </div>

      <p className="text-gray-600 mb-4">{form.description}</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {form.fields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.type === "radio" && field.options ? (
              <div className="flex gap-4">
                {field.options.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={field.name}
                      value={opt.value}
                      checked={formData[field.name] === opt.value}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required={field.required}
                minLength={field.validation?.min}
                maxLength={field.validation?.max}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 rounded text-white ${
            submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {success && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ Form submitted successfully!
        </p>
      )}
    </div>
  );
};

export default UserSubmissionForm;
