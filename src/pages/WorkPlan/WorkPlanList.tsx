// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchAllWorkPlansWithComments,
//   addComment,
//   createWorkPlan,
//   updateWorkPlan,
//   deleteWorkPlan,
//   clearWorkPlanState,
// } from "./workPlanSlice";
// import axios from "axios";

// const BASE_API_URL = "http://localhost:4000/api";

// const WorkPlanListPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { workPlans, loading, error } = useAppSelector((state) => state.workPlan);

//   const [users, setUsers] = useState<any[]>([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     assignedToId: 0,
//   });
//   const [editId, setEditId] = useState<number | null>(null);
//   const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
//   const [showCommentInput, setShowCommentInput] = useState<{ [key: number]: boolean }>({});

//   useEffect(() => {
//     dispatch(fetchAllWorkPlansWithComments());
//     return () => {
//       dispatch(clearWorkPlanState());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     const token = localStorage.getItem("Access_token");
//     axios
//       .get(`${BASE_API_URL}/user/listAll`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUsers(res.data || []))
//       .catch((err) => console.error("Failed to fetch users:", err));
//   }, []);

//   const handleFormChange = (e: React.ChangeEvent<any>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "assignedToId" ? parseInt(value) : value,
//     }));
//   };

//   const handleSubmit = () => {
//     if (editId) {
//       dispatch(updateWorkPlan({ id: editId, data: formData }));
//     } else {
//       dispatch(createWorkPlan(formData));
//     }
//     resetForm();
//   };

//   const handleEdit = (plan: any) => {
//     setEditId(plan.id);
//     setFormData({
//       title: plan.title,
//       description: plan.description,
//       startDate: plan.startDate.slice(0, 10),
//       endDate: plan.endDate.slice(0, 10),
//       assignedToId: plan.assignedToId,
//     });
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Are you sure you want to delete this work plan?")) {
//       dispatch(deleteWorkPlan(id));
//     }
//   };

//   const resetForm = () => {
//     setEditId(null);
//     setFormData({
//       title: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       assignedToId: users[0]?.id || 0,
//     });
//   };

//   const handleCommentSubmit = (workPlanId: number) => {
//     const comment = newComments[workPlanId]?.trim();
//     if (!comment) return;

//     dispatch(addComment({ workPlanId, comment, status: "Pending" })); // Assuming status is handled on backend or set dynamically
//     setNewComments((prev) => ({ ...prev, [workPlanId]: "" }));
//     setShowCommentInput((prev) => ({ ...prev, [workPlanId]: false }));
//   };

//   const formatDate = (date: string) =>
//     new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 font-sans">
//       <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-10">
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
//           Work Plan Management
//         </h2>

//         {/* Create/Edit Form */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-inner mb-12">
//           <h3 className="text-2xl font-bold text-gray-700 mb-6">
//             {editId ? "Edit Work Plan" : "Create New Work Plan"}
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               name="title"
//               placeholder="Work Plan Title"
//               value={formData.title}
//               onChange={handleFormChange}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
//             />
//             <textarea
//               name="description"
//               placeholder="Detailed Description"
//               value={formData.description}
//               onChange={handleFormChange}
//               rows={3}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 resize-y"
//             />
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleFormChange}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
//             />
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleFormChange}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
//             />
//             <select
//               name="assignedToId"
//               value={formData.assignedToId}
//               onChange={handleFormChange}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 bg-white"
//             >
//               <option value={0} disabled>
//                 -- Assign To User --
//               </option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.fullName} ({user.role})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex space-x-4 mt-6 justify-end">
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               {editId ? "Update Work Plan" : "Create Work Plan"}
//             </button>
//             {editId && (
//               <button
//                 onClick={resetForm}
//                 className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Cancel Edit
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Work Plans List */}
//         {loading && (
//           <p className="text-center text-gray-600 text-lg font-medium">Loading work plans...</p>
//         )}
//         {error && <p className="text-red-600 text-center text-lg">{error}</p>}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {workPlans.length === 0 && !loading && !error && (
//             <p className="text-center text-gray-500 text-lg col-span-full">No work plans found. Create one above!</p>
//           )}
//           {workPlans.map((plan) => (
//             <div key={plan.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
//               <div>
//                 <h4 className="font-bold text-xl text-gray-800 mb-2">{plan.title}</h4>
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.description}</p>
//                 <p className="text-sm text-gray-500 mb-1">
//                   <span className="font-medium">Start:</span> {formatDate(plan.startDate)}
//                 </p>
//                 <p className="text-sm text-gray-500 mb-3">
//                   <span className="font-medium">End:</span> {formatDate(plan.endDate)}
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   Assigned To:{" "}
//                   <strong className="text-blue-700">{plan.assignedTo?.fullName || "N/A"}</strong>
//                 </p>
//                 <p className="text-sm text-gray-700 mb-4">
//                   Status:{" "}
//                   <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                     {plan.status}
//                   </span>
//                 </p>
//               </div>

//               <div className="flex space-x-3 mt-4 border-t border-gray-100 pt-4">
//                 <button
//                   onClick={() => handleEdit(plan)}
//                   className="text-blue-600 hover:text-blue-800 font-medium text-sm transition duration-200"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(plan.id)}
//                   className="text-red-600 hover:text-red-800 font-medium text-sm transition duration-200"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {/* Comments Section */}
//               <div className="mt-5 pt-5 border-t border-gray-100">
//                 <h5 className="font-semibold text-gray-700 mb-3 text-base">Comments</h5>
//                 {plan.WorkPlanComment?.length === 0 ? (
//                   <p className="text-gray-500 text-sm italic">No comments yet. Be the first to add one!</p>
//                 ) : (
//                   <div className="max-h-32 overflow-y-auto pr-2">
//                     {plan.WorkPlanComment.map((comment) => (
//                       <div key={comment.id} className="bg-gray-50 p-3 rounded-lg mb-2 shadow-sm">
//                         <p className="text-sm text-gray-800">{comment.comment}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           — {comment.user?.fullName || "Unknown"} •{" "}
//                           {new Date(comment.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Add Comment Toggle */}
//                 <button
//                   onClick={() =>
//                     setShowCommentInput((prev) => ({
//                       ...prev,
//                       [plan.id]: !prev[plan.id],
//                     }))
//                   }
//                   className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200"
//                 >
//                   {showCommentInput[plan.id] ? "Hide Comment Input" : "Add Comment"}
//                 </button>

//                 {/* Add Comment Section (conditionally rendered) */}
//                 {showCommentInput[plan.id] && (
//                   <div className="mt-4">
//                     <textarea
//                       className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 resize-y"
//                       placeholder="Type your comment here..."
//                       value={newComments[plan.id] || ""}
//                       onChange={(e) =>
//                         setNewComments((prev) => ({ ...prev, [plan.id]: e.target.value }))
//                       }
//                       rows={2}
//                     />
//                     <button
//                       onClick={() => handleCommentSubmit(plan.id)}
//                       className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition duration-300 ease-in-out"
//                     >
//                       Submit Comment
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkPlanListPage;
// src/pages/WorkPlanListPage.tsx
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
