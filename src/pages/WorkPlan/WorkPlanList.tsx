import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchAllWorkPlansWithComments,
  addComment,
  createWorkPlan,
  updateWorkPlan,
  deleteWorkPlan,
  fetchAllUsers,
  clearWorkPlanState,
} from "./workPlanSlice";

const WorkPlanListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workPlans, users, loading, error } = useAppSelector((state) => state.workPlan);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedToId: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [showCommentInput, setShowCommentInput] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    dispatch(fetchAllWorkPlansWithComments());
    dispatch(fetchAllUsers());
    return () => {
      dispatch(clearWorkPlanState());
    };
  }, [dispatch]);

  const handleFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "assignedToId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (editId) {
      dispatch(updateWorkPlan({ id: editId, data: formData }));
    } else {
      dispatch(createWorkPlan(formData));
    }
    resetForm();
  };

  const handleEdit = (plan: any) => {
    setEditId(plan.id);
    setFormData({
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate.slice(0, 10),
      endDate: plan.endDate.slice(0, 10),
      assignedToId: plan.assignedToId,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this work plan?")) {
      dispatch(deleteWorkPlan(id));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      assignedToId: 0,
    });
  };

  const handleCommentSubmit = (workPlanId: number) => {
    const comment = newComments[workPlanId]?.trim();
    if (!comment) return;
    dispatch(addComment({ workPlanId, comment, status: "Pending" }));
    setNewComments((prev) => ({ ...prev, [workPlanId]: "" }));
    setShowCommentInput((prev) => ({ ...prev, [workPlanId]: false }));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Work Plan Management</h1>

      {/* Form Section */}
      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl font-semibold mb-4">{editId ? "Edit" : "Create"} Work Plan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="Title"
            className="border p-2 rounded"
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleFormChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleFormChange}
            className="border p-2 rounded"
          />
          <select
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleFormChange}
            className="border p-2 rounded"
          >
            <option value={0} disabled>
              -- Assign To User --
            </option>
            {(users || []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Work Plans List */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          workPlans.map((plan) => (
            <div key={plan.id} className="border-b py-4">
              <h3 className="font-bold text-lg">{plan.title}</h3>
              <p className="text-sm text-gray-600">{plan.description}</p>
              <p className="text-sm">Start: {formatDate(plan.startDate)}</p>
              <p className="text-sm">End: {formatDate(plan.endDate)}</p>
              <p className="text-sm">
                Assigned to: <strong>{plan.assignedTo?.fullName || "Unassigned"}</strong>
              </p>
              <p className="text-sm mb-2">Status: {plan.status}</p>
              <div className="mb-3">
                <button onClick={() => handleEdit(plan)} className="text-blue-600 mr-3">
                  Edit
                </button>
                <button onClick={() => handleDelete(plan.id)} className="text-red-600">
                  Delete
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-2">
                <h4 className="font-semibold mb-2">Comments</h4>
                {(plan.WorkPlanComment || []).map((comment) => (
                  <p key={comment.id} className="text-sm mb-1">
                    - {comment.comment}{" "}
                    <span className="text-xs text-gray-500">
                      ({comment.user?.fullName || "Unknown"})
                    </span>
                  </p>
                ))}

                <button
                  onClick={() =>
                    setShowCommentInput((prev) => ({ ...prev, [plan.id]: !prev[plan.id] }))
                  }
                  className="text-sm text-blue-600 mt-2"
                >
                  {showCommentInput[plan.id] ? "Cancel" : "Add Comment"}
                </button>

                {showCommentInput[plan.id] && (
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      className="w-full border p-2 rounded text-sm"
                      value={newComments[plan.id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({ ...prev, [plan.id]: e.target.value }))
                      }
                      placeholder="Write your comment..."
                    />
                    <button
                      onClick={() => handleCommentSubmit(plan.id)}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default WorkPlanListPage;
