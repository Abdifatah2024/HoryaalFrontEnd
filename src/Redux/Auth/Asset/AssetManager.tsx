import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store"; // Adjust path as per your project structure
import {
  fetchAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  clearAssetState,
  // fetchAssetByNumber, // No longer needed for client-side filtering
} from "../../Auth/Asset/assetSlice"; // Adjust path as per your project structure
import { toast } from "react-hot-toast";
import {
  FiPlusCircle,
  FiSave,
  FiXCircle,
  FiLoader,
  FiPackage,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPrinter,
} from "react-icons/fi";

// Define the Asset type based on your Redux slice's state
interface Asset {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciationRate: number;
  currentValue: number;
  purchaseCompany: string;
  condition: string;
  location: string;
  assignedTo: string;
  serialNumber: string;
  remarks: string;
  assetNumber?: string; // Make assetNumber optional for form data, but expect it on fetched assets
}

const AssetManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets, loading, error, successMessage, newlyCreatedAsset } =
    useAppSelector((state) => state.assets); // Assuming newlyCreatedAsset is added to your assetSlice state

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [searchAssetNumber, setSearchAssetNumber] = useState(""); // This will now filter locally
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const initialFormData = {
    name: "",
    category: "",
    purchaseDate: "",
    purchasePrice: "",
    depreciationRate: "",
    currentValue: "",
    purchaseCompany: "",
    condition: "",
    location: "",
    assignedTo: "",
    serialNumber: "",
    remarks: "",
    // assetNumber is removed from initialFormData
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAssetState());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAssetState());
      if (formOpen) {
        setFormOpen(false);
        resetForm();
      }
      // If a new asset was created and its details are available, trigger print
      if (successMessage.includes("Asset created successfully") && newlyCreatedAsset) {
        handlePrintAsset(newlyCreatedAsset);
      }
    }
  }, [error, successMessage, dispatch, formOpen, newlyCreatedAsset]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.purchaseDate)
      errors.purchaseDate = "Purchase date is required";

    if (formData.purchasePrice && isNaN(Number(formData.purchasePrice))) {
      errors.purchasePrice = "Must be a valid number";
    }
    if (
      formData.depreciationRate &&
      (isNaN(Number(formData.depreciationRate)) ||
        Number(formData.depreciationRate) < 0 ||
        Number(formData.depreciationRate) > 100)
    ) {
      errors.depreciationRate = "Must be between 0 and 100";
    }
    if (formData.currentValue && isNaN(Number(formData.currentValue))) {
      errors.currentValue = "Must be a valid number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const assetDataToSend = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      depreciationRate: parseFloat(formData.depreciationRate) || 0,
      currentValue: parseFloat(formData.currentValue) || 0,
    };

    if (editingId) {
      dispatch(updateAsset({ id: editingId, data: assetDataToSend }));
    } else {
      dispatch(createAsset(assetDataToSend)); // Send data without assetNumber
    }
  };

  const handleEdit = (id: number) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) {
      toast.error("Asset not found.");
      return;
    }
    setEditingId(id);
    setFormData({
      name: asset.name || "",
      category: asset.category || "",
      purchaseDate: asset.purchaseDate
        ? new Date(asset.purchaseDate).toISOString().split("T")[0]
        : "",
      purchasePrice: asset.purchasePrice?.toString() || "",
      depreciationRate: asset.depreciationRate?.toString() || "",
      currentValue: asset.currentValue?.toString() || "",
      purchaseCompany: asset.purchaseCompany || "",
      condition: asset.condition || "",
      location: asset.location || "",
      assignedTo: asset.assignedTo || "",
      serialNumber: asset.serialNumber || "",
      remarks: asset.remarks || "",
    });
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      dispatch(deleteAsset(id));
    }
  };

  const handlePrintAsset = (asset: Asset) => {
    const printContent = `
      <h1>Asset Details</h1>
      <p><strong>Asset Number:</strong> ${asset.assetNumber || "N/A"}</p>
      <p><strong>Name:</strong> ${asset.name}</p>
      <p><strong>Category:</strong> ${asset.category}</p>
      <p><strong>Purchase Date:</strong> ${
        asset.purchaseDate
          ? new Date(asset.purchaseDate).toLocaleDateString()
          : "N/A"
      }</p>
      <p><strong>Purchase Price:</strong> $${
        asset.purchasePrice?.toFixed(2) ?? "0.00"
      }</p>
      <p><strong>Depreciation Rate:</strong> ${asset.depreciationRate}%</p>
      <p><strong>Current Value:</strong> $${
        asset.currentValue?.toFixed(2) ?? "0.00"
      }</p>
      <p><strong>Purchase Company:</strong> ${asset.purchaseCompany || "N/A"}</p>
      <p><strong>Condition:</strong> ${asset.condition || "N/A"}</p>
      <p><strong>Location:</strong> ${asset.location || "N/A"}</p>
      <p><strong>Assigned To:</strong> ${asset.assignedTo || "N/A"}</p>
      <p><strong>Serial Number:</strong> ${asset.serialNumber || "N/A"}</p>
      <p><strong>Remarks:</strong> ${asset.remarks || "N/A"}</p>
    `;

    const printWindow = window.open("", "_blank", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Asset</title>");
      printWindow.document.write(
        '<style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #333; } p { margin-bottom: 5px; }</style>'
      );
      printWindow.document.write("</head><body>");
      printWindow.document.write(printContent);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error("Could not open print window. Please allow pop-ups.");
    }
  };

  // Filter assets locally based on all filter criteria
  const filteredAssets = assets.filter(
    (a) =>
      (filterCategory === "" || a.category === filterCategory) &&
      (filterLocation === "" || a.location === filterLocation) &&
      (searchAssetNumber === "" ||
        (a.assetNumber && // Ensure assetNumber exists before calling toLowerCase
          a.assetNumber.toLowerCase().includes(searchAssetNumber.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Asset Management Dashboard
        </h1>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Assets Overview
          </h2>
          <button
            onClick={() => {
              setFormOpen(!formOpen);
              if (!formOpen) resetForm();
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition w-full md:w-auto justify-center"
          >
            {formOpen ? (
              <>
                <FiXCircle className="text-lg" /> Close Form
              </>
            ) : (
              <>
                <FiPlusCircle className="text-lg" /> Register New Asset
              </>
            )}
          </button>
        </div>

        {formOpen && (
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Asset" : "Add New Asset"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Number field is REMOVED from the form */}

              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="e.g., Dell Laptop"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.category ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="ICT Equipment">ICT Equipment</option>
                  <option value="Laboratory Equipment">Laboratory Equipment</option>
                  <option value="Sports Equipment">Sports Equipment</option>
                  <option value="Library Resources">Library Resources</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>

              {/* Purchase Date */}
              <div className="space-y-1">
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="purchaseDate"
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.purchaseDate ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {formErrors.purchaseDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.purchaseDate}</p>
                )}
              </div>

              {/* Purchase Price */}
              <div className="space-y-1">
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
                  Purchase Price ($)
                </label>
                <input
                  id="purchasePrice"
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.purchasePrice ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="e.g., 1200"
                  min="0"
                  step="0.01"
                />
                {formErrors.purchasePrice && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.purchasePrice}</p>
                )}
              </div>

              {/* Depreciation Rate */}
              <div className="space-y-1">
                <label htmlFor="depreciationRate" className="block text-sm font-medium text-gray-700">
                  Depreciation Rate (%)
                </label>
                <input
                  id="depreciationRate"
                  type="number"
                  name="depreciationRate"
                  value={formData.depreciationRate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.depreciationRate ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="e.g., 15"
                  min="0"
                  max="100"
                />
                {formErrors.depreciationRate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.depreciationRate}</p>
                )}
              </div>

              {/* Current Value */}
              <div className="space-y-1">
                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">
                  Current Value ($)
                </label>
                <input
                  id="currentValue"
                  type="number"
                  name="currentValue"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                    formErrors.currentValue ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="e.g., 900"
                  min="0"
                  step="0.01"
                />
                {formErrors.currentValue && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.currentValue}</p>
                )}
              </div>

              {/* Purchase Company */}
              <div className="space-y-1">
                <label htmlFor="purchaseCompany" className="block text-sm font-medium text-gray-700">
                  Purchase Company
                </label>
                <input
                  id="purchaseCompany"
                  name="purchaseCompany"
                  value={formData.purchaseCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Tech Solutions Inc."
                />
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Library">Library</option>
                  <option value="Classroom A">Classroom A</option>
                  <option value="Classroom B">Classroom B</option>
                  <option value="Store Room">Store Room</option>
                  <option value="Office">Office</option>
                  <option value="Server Room">Server Room</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Assigned To */}
              <div className="space-y-1">
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <input
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Serial Number */}
              <div className="space-y-1">
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., SN123456789"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2 space-y-1">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2 rounded-md shadow font-medium ${
                    loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" /> Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <FiSave /> Update Asset
                    </>
                  ) : (
                    <>
                      <FiPlusCircle /> Add Asset
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="ICT Equipment">ICT Equipment</option>
              <option value="Laboratory Equipment">Laboratory Equipment</option>
              <option value="Sports Equipment">Sports Equipment</option>
              <option value="Library Resources">Library Resources</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="filterLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Location
            </label>
            <select
              id="filterLocation"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Library">Library</option>
              <option value="Classroom A">Classroom A</option>
              <option value="Classroom B">Classroom B</option>
              <option value="Store Room">Store Room</option>
              <option value="Office">Office</option>
              <option value="Server Room">Server Room</option>
              <option value="Cafeteria">Cafeteria</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="searchAssetNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Asset Number
            </label>
            <div className="flex">
              <input
                id="searchAssetNumber"
                type="text"
                value={searchAssetNumber}
                onChange={(e) => setSearchAssetNumber(e.target.value)} // Update state locally
                placeholder="Search by asset number..."
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                // onKeyPress event is no longer needed to trigger a backend search
              />
              {/* The search button is still there, but now it just visually confirms input, actual filtering is reactive */}
              <button
                // onClick={handleSearchByAssetNumber} // No longer dispatching a backend call
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                onClick={() => toast("Filtering assets locally...")} // Provide feedback for local search
              >
                <FiSearch />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !formOpen && (
          <div className="flex flex-col items-center justify-center py-10 text-blue-600">
            <FiLoader className="animate-spin h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Loading assets...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <FiPackage className="text-5xl mb-4" />
            <p className="text-lg">No assets match your filters.</p>
          </div>
        )}

        {/* Assets Table */}
        {!loading && filteredAssets.length > 0 && (
          // Removed overflow-x-auto for "no scroll sides"
          // Consider using responsive table patterns if content is too wide on small screens.
          <div className="rounded-lg border border-gray-200"> 
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Asset No.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Condition
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Purchase Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Value
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asset.assetNumber || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {asset.category}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {asset.condition}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {asset.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      {asset.purchaseDate
                        ? new Date(asset.purchaseDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                      ${asset.currentValue?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(asset.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-gray-100 transition"
                          title="Edit"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100 transition"
                          title="Delete"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                        <button
                          onClick={() => handlePrintAsset(asset)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100 transition"
                          title="Print"
                        >
                          <FiPrinter className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManager;