import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import {
  listUser,
  getUserById,
  deleteUser,
  updateUser,
} from "../Redux/Auth/RegisterSlice";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: string;
}

const RegisterList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.registerSlice
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    role: "USER",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(listUser());
  }, [dispatch]);

  useEffect(() => {
    if (isModalOpen && currentUserId) {
      dispatch(getUserById(currentUserId)).then((action) => {
        const userData = action.payload?.user || action.payload;
        setEditFormData({
          email: userData.email || "",
          fullName: userData.fullName || "",
          phoneNumber: userData.phoneNumber || "",
          role: userData.role || "USER",
          password: "",
          confirmPassword: "",
        });
      });
    }
  }, [isModalOpen, currentUserId, dispatch]);

  const handleEditClick = (userId: string) => {
    setCurrentUserId(userId);
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!currentUserId) return;

    if (
      editFormData.password &&
      editFormData.password !== editFormData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    const payload: any = {
      email: editFormData.email,
      fullName: editFormData.fullName,
      phoneNumber: editFormData.phoneNumber,
      role: editFormData.role,
    };

    if (editFormData.password) payload.password = editFormData.password;

    const result = await dispatch(
      updateUser({ userId: currentUserId, userData: payload })
    );

    if (updateUser.fulfilled.match(result)) {
      toast.success("User updated successfully");
      setIsModalOpen(false);
      dispatch(listUser());
    } else {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId)).then((action) => {
        if (deleteUser.fulfilled.match(action)) {
          toast.success("User deleted");
          dispatch(listUser());
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        User Management
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        ) : users?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No users found</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 uppercase text-xs text-gray-500">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phoneNumber || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEditClick(user.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>

            <div className="space-y-4">
              {["email", "fullName", "phoneNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {field}
                  </label>
                  <input
                    name={field}
                    type="text"
                    value={editFormData[field as keyof typeof editFormData]}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={editFormData.confirmPassword}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterList;
