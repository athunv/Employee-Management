import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

const api = axios.create({ baseURL: "http://127.0.0.1:8000/" });

const SortableItem = ({ id, label, type, deleteField }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <span>
        <strong>{label}</strong> - {type}
      </span>
      <button className="btn btn-sm btn-danger" onClick={deleteField}>
        Delete
      </button>
    </li>
  );
};

const DynamicForm = () => {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    fetchSavedForms();
  }, []);

  const fetchSavedForms = () => {
    setLoading(true);
    api.get("dynamicform/")
      .then((response) => setSavedForms(response.data))
      .catch(() => setMessage("Failed to fetch forms."))
      .finally(() => setLoading(false));
  };

  const addField = () => {
    if (!fieldName.trim()) {
      setMessage("Field label cannot be empty!");
      return;
    }
    setFields([...fields, { id: uuidv4(), label: fieldName, type: fieldType }]);
    setFieldName("");
    setFieldType("text");
    setMessage("");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFields((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const updatedArray = [...items];
      const [movedItem] = updatedArray.splice(oldIndex, 1);
      updatedArray.splice(newIndex, 0, movedItem);
      return updatedArray;
    });
  };

  const handleSubmit = () => {
    if (!formName.trim()) {
      setMessage("Form name cannot be empty!");
      return;
    }
    if (fields.length === 0) {
      setMessage("Add at least one field to the form!");
      return;
    }

    setLoading(true);

    const formData = {
      name: formName,
      fields: fields.map((field) => ({ label: field.label, field_type: field.type })),
    };

    api.post("dynamicform/", formData)
      .then(() => {
        setMessage("Form created successfully!");
        setFormName("");
        setFields([]);
        fetchSavedForms();
      })
      .catch((error) => {
        setMessage(error.response?.data?.detail || "Failed to create form. Try again later.");
      })
      .finally(() => setLoading(false));
  };

  const deleteForm = (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    api.delete(`dynamicform/${formId}/`)
      .then(() => {
        setMessage("Form deleted successfully!");
        fetchSavedForms();
      })
      .catch(() => setMessage("Failed to delete form."));
  };

  return (
    <div className="container mt-5">
      <h2>Create Dynamic Form</h2>
      <div className="mb-4">
        <label htmlFor="formName" className="form-label">Form Name</label>
        <input type="text" id="formName" className="form-control" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Enter form name" />
      </div>
      <div className="row">
        <div className="col-md-6">
          <h4>Add Field</h4>
          <div className="mb-3">
            <label htmlFor="fieldName" className="form-label">Label</label>
            <input type="text" id="fieldName" className="form-control" value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="Field Label" />
          </div>
          <div className="mb-3">
            <label htmlFor="fieldType" className="form-label">Field Type</label>
            <select id="fieldType"className="form-select" value={fieldType} onChange={(e) => setFieldType(e.target.value)} >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="password">Password</option>
              <option value="email">Email</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={addField}>Add Field</button>
        </div>
        <div className="col-md-6">
          <h4>Reorder Fields</h4>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              <ul className="list-group">
                {fields.map((field) => (
                  <SortableItem
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    deleteField={() => setFields(fields.filter((f) => f.id !== field.id))}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <button className="btn btn-success mt-4" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Form"}
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <div className="mt-5">
        <h2>Saved Forms</h2>
        <ul className="list-group">
          {savedForms.map((form) => (
            <li key={form.id} className="list-group-item d-flex justify-content-between align-items-center">
              {form.name}
              <button className="btn btn-sm btn-danger" onClick={() => deleteForm(form.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicForm;
