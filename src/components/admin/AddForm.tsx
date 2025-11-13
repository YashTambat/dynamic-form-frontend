import React, { useState } from "react";

interface Field {
  label: string;
  type: string;
  name: string;
  required: boolean;
  validation?: { min?: number; max?: number };
  order: number;
  options?: { label: string; value: string }[];
}

interface Props {
  onClose: () => void;
}

const AddForm: React.FC<Props> = ({ onClose }) => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([]);

  const addField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", name: "", required: false, order: fields.length + 1, options: [] },
    ]);
  };

const updateField = <K extends keyof Field>(index: number, key: K, value: Field[K]) => {
  setFields((prev) =>
    prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
  );
};

  const addOption = (index: number) => {
    const updated = [...fields];
    if (!updated[index].options) updated[index].options = [];
    updated[index].options!.push({ label: "", value: "" });
    setFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const body = { title, description, fields };

    try {
      const res = await fetch(`${API_BASE}/api/admin/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create form");
      alert("Form created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create form. Check console for details.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Form Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Form Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="space-y-2">
          <h3 className="font-semibold">Fields</h3>
          {fields.map((field, index) => (
            <div key={index} className="border p-3 rounded space-y-2">
              <input
                type="text"
                placeholder="Label"
                className="border p-2 w-full"
                value={field.label}
                onChange={(e) => updateField(index, "label", e.target.value)}
              />
              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full"
                value={field.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
              />
              <select
                className="border p-2 w-full"
                value={field.type}
                onChange={(e) => updateField(index, "type", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Select</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(index, "required", e.target.checked)}
                />
                Required
              </label>
              {["text", "number"].includes(field.type) && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border p-2 w-full"
                    onChange={(e) =>
                      updateField(index, "validation", {
                        ...field.validation,
                        min: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="border p-2 w-full"
                    onChange={(e) =>
                      updateField(index, "validation", {
                        ...field.validation,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              {["radio", "select"].includes(field.type) && (
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm mb-2"
                    onClick={() => addOption(index)}
                  >
                    Add Option
                  </button>
                  {field.options?.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2 mb-1">
                      <input
                        type="text"
                        placeholder="Label"
                        className="border p-1 w-full"
                        value={opt.label}
                        onChange={(e) => {
                          const updated = [...fields];
                          updated[index].options![optIndex].label = e.target.value;
                          setFields(updated);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        className="border p-1 w-full"
                        value={opt.value}
                        onChange={(e) => {
                          const updated = [...fields];
                          updated[index].options![optIndex].value = e.target.value;
                          setFields(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Field
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Form
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
