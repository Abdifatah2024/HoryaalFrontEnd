
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { listUser, getUserById, deleteUser, updateUser } from "../Redux/Auth/RegisterSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
}

const RegisterList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.registerSlice);
  const navigate = useNavigate();
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "USER",
    password: "",
    confirmPassword: ""
  });

  // Fetch users on mount
  useEffect(() => {
    dispatch(listUser());
  }, [dispatch]);

  // Fetch user data when modal opens
  useEffect(() => {
    if (isEditModalOpen && currentUserId) {
      dispatch(getUserById(currentUserId)).then((action) => {
        if (getUserById.fulfilled.match(action)) {
          const userData = action.payload;
          setEditFormData({
            username: userData.username,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            password: "",
            confirmPassword: ""
          });
        }
      });
    }
  }, [isEditModalOpen, currentUserId, dispatch]);

  const handleEditClick = (userId: string) => {
    setCurrentUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!currentUserId) return;
    
    // Validate passwords if they're provided
    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const result = await dispatch(updateUser({
        id: currentUserId,
        username: editFormData.username,
        email: editFormData.email,
        fullName: editFormData.fullName,
        role: editFormData.role,
        password: editFormData.password || undefined,
      }));

      if (updateUser.fulfilled.match(result)) {
        toast.success("User updated successfully!");
        setIsEditModalOpen(false);
        dispatch(listUser()); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId)).then((action) => {
        if (deleteUser.fulfilled.match(action)) {
          toast.success("User deleted successfully!");
          dispatch(listUser());
        }
      });
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={editFormData.confirmPassword}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User List */}
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="grid gap-4">
        {users?.length === 0 ? (
          <p className="text-center py-4">No users found</p>
        ) : (
          users?.map((user: User) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                </div>
                <div className="flex space-x-2">
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegisterList;
