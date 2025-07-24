import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchAllBuses,
  createBus,
  updateBus,
  deleteBus,
  fetchBusDriversOnly,
  // IMPORT THE INTERFACES HERE FROM YOUR SLICE FILE
  Bus,        // Import Bus interface
  BusDriver,  // Import BusDriver interface
  BusFeeState 
} from "../../Redux/Auth/busFeeSlice";

// --- Type Definitions (Interfaces) ---
// IMPORTANT: The BusDriver and Bus interfaces defined here PREVIOUSLY
// have been removed to avoid conflict. We are now importing them
// directly from "../../Redux/Auth/busFeeSlice".

// This interface remains local as it's specific to the form's state
interface BusFormData {
  name: string;
  route: string;
  plate: string;
  type: string;
  color: string;
  seats: number;
  capacity: number;
  driverId?: number;
}
// --- End Type Definitions ---

// Predefined lists for bus types and colors, used in select dropdowns
const busTypes = ["Minibus", "Coach", "School Bus", "Van", "Sedan"];
const busColors = ["Red", "Blue", "White", "Yellow", "Black", "Silver", "Green"];

const BusManagementPage: React.FC = () => {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch<AppDispatch>();
  // Use the imported BusFeeState for accurate typing of the destructured state
  const { buses, loading, error, drivers } = useSelector((state: RootState) => state.busFee) as BusFeeState;

  // State for managing form inputs
  const [formData, setFormData] = useState<BusFormData>({
    name: "",
    route: "",
    plate: "",
    type: "",
    color: "",
    seats: 0,
    capacity: 0,
    driverId: undefined,
  });
  // State to track if we are in edit mode and which bus is being edited
  const [editId, setEditId] = useState<number | null>(null);
  // State to control the visibility of the bus registration/edit form
  const [showForm, setShowForm] = useState(false);

  // Effect to manage global body overflow-x to prevent horizontal scrolling across the entire page
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    // Cleanup function: reset overflowX when the component unmounts
    return () => {
      document.body.style.overflowX = '';
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Effect to fetch initial bus data and bus drivers when the component mounts
  useEffect(() => {
    dispatch(fetchAllBuses());
    dispatch(fetchBusDriversOnly()); // Fetches all employees, which we then filter for 'Bus' drivers
  }, [dispatch]); // Dependency on dispatch to avoid lint warnings

  // Handler for input and select changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => {
      let newFormData = { ...prevData };

      // Special handling for the driverId select to autofill bus name
      if (name === "driverId") {
        const selectedDriverId = value === "" ? undefined : Number(value);
        newFormData = {
          ...newFormData,
          driverId: selectedDriverId,
        };

        // Autofill the 'name' field with the selected driver's full name
        if (selectedDriverId !== undefined) {
          const selectedDriver = drivers.find(
            (driver) => driver.id === selectedDriverId
          );
          if (selectedDriver) {
            newFormData.name = selectedDriver.fullName; // Set bus name to driver's full name
          }
        } else {
          newFormData.name = ""; // Clear bus name if no driver is selected
        }
      } else {
        // General handling for other form fields
        newFormData = {
          ...newFormData,
          [name]: (type === "number" || name === "seats" || name === "capacity")
            ? (value === "" ? 0 : Number(value)) // Convert to number, default to 0 if empty for number fields
            : value, // For other types (text, select), use value directly
        };
      }
      return newFormData;
    });
  };

  // Handler for form submission (create or update bus)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    if (editId !== null) {
      // If in edit mode, dispatch update action
      dispatch(updateBus({ id: editId, data: formData }));
    } else {
      // Otherwise, dispatch create action
      dispatch(createBus(formData));
    }
    // Reset form to initial empty state
    setFormData({
      name: "", route: "", plate: "", type: "", color: "", seats: 0, capacity: 0, driverId: undefined
    });
    setEditId(null); // Exit edit mode
    setShowForm(false); // Hide the form
  };

  // Handler to set up the form for editing an existing bus
  const handleEdit = (bus: Bus) => {
    // Populate form data with the bus's current details
    setFormData({
      name: bus.name,
      route: bus.route,
      plate: bus.plate,
      type: bus.type,
      color: bus.color,
      seats: bus.seats,
      capacity: bus.capacity,
      driverId: bus.driverId,
    });
    setEditId(bus.id); // Set the ID of the bus being edited
    setShowForm(true); // Show the form
  };

  // Handler for deleting a bus
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      dispatch(deleteBus(id));
    }
  };

  // Helper function to get the driver's full name for display in the table
  const getDriverName = (driverId: number | undefined) => {
    if (driverId === undefined) return "N/A";
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.fullName : "Unknown Driver";
  };

  // Filter the fetched drivers to only include those with the jobTitle 'Bus'
  const busDrivers = drivers.filter(driver => driver.jobTitle === 'Bus');

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900 text-center sm:text-left">Bus Management</h1>

      {/* Button to toggle the visibility of the Bus Registration/Edit Form */}
      <button
        onClick={() => {
          setShowForm(!showForm); // Toggle form visibility
          if (showForm) { // If the form is being closed, reset edit state and form data
            setEditId(null);
            setFormData({ name: "", route: "", plate: "", type: "", color: "", seats: 0, capacity: 0, driverId: undefined });
          }
        }}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-2 px-4 sm:px-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto transform hover:-translate-y-0.5"
      >
        {showForm ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span>Close Bus Form</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Register New Bus</span>
          </>
        )}
      </button>

      {/* Bus Registration/Edit Form - conditionally rendered based on showForm state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 p-6 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-bold text-gray-800 col-span-full mb-4 text-center sm:text-left">
            {editId !== null ? "Edit Bus Details" : "Register New Bus"}
          </h2>
          {/* Bus Name Input - Autofilled and Read-only */}
          <div className="col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Bus Name</label>
            <input
              id="name"
              name="name"
              placeholder="Autofilled from Driver Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm bg-gray-100 cursor-not-allowed"
              readOnly // This makes the input field non-editable by the user
              required
            />
          </div>
          {/* Route Input */}
          <div className="col-span-1">
            <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <input
              id="route"
              name="route"
              placeholder="e.g., Downtown to School"
              value={formData.route}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm"
              required
            />
          </div>
          {/* Plate Number Input */}
          <div className="col-span-1">
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
            <input
              id="plate"
              name="plate"
              placeholder="e.g., SL-2024-A"
              value={formData.plate}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm"
              required
            />
          </div>
          {/* Bus Type Select */}
          <div className="col-span-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm bg-white"
              required
            >
              <option value="">Select Type</option>
              {busTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {/* Color Select */}
          <div className="col-span-1">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm bg-white"
              required
            >
              <option value="">Select Color</option>
              {busColors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          {/* Number of Seats Input */}
          <div className="col-span-1">
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
            <input
              id="seats"
              name="seats"
              placeholder="e.g., 30"
              type="number"
              value={formData.seats}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm"
              min="0"
              required
            />
          </div>
          {/* Bus School Number (Capacity) Input */}
          <div className="col-span-1">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Bus School Number</label>
            <input
              id="capacity"
              name="capacity"
              placeholder="e.g., 101"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm"
              min="0"
              required
            />
          </div>
          {/* Driver Select - Populated by filtered bus drivers */}
          <div className="col-span-1">
            <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <select
              id="driverId"
              name="driverId"
              value={formData.driverId ?? ""} // Use nullish coalescing to handle undefined
              onChange={handleChange}
              className="border border-gray-300 p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 text-sm bg-white"
              required // Making driver selection mandatory
            >
              <option value="">Select Driver</option>
              {busDrivers.map((driver: BusDriver) => (
                <option key={driver.id} value={driver.id}>{driver.fullName} (ID: {driver.id})</option>
              ))}
            </select>
          </div>
          {/* Form Action Buttons */}
          <div className="col-span-full flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 text-sm transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>{editId !== null ? "Update Bus" : "Create Bus"}</span>
            </button>
            {/* Cancel Edit button, only shown when in edit mode */}
            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null); // Clear edit ID
                  setFormData({ name: "", route: "", plate: "", type: "", color: "", seats: 0, capacity: 0, driverId: undefined }); // Reset form
                  setShowForm(false); // Hide form
                }}
                className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2 text-sm transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                <span>Cancel Edit</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* Feedback messages: Loading, Error, or Empty State */}
      {loading && <p className="text-center text-gray-600 font-medium italic mt-8">Loading buses data...</p>}
      {error && <p className="text-center text-red-600 font-semibold mt-8">Error: {error}</p>}
      {!loading && buses.length === 0 && !error && (
        <p className="text-center text-gray-600 italic mt-8">No buses registered yet. Click "Register New Bus" to add one.</p>
      )}

      {/* Bus List Table - conditionally rendered when buses are available */}
      {!loading && buses.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100 mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tl-xl">Name</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Route</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Plate</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider hidden md:table-cell">Color</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Seats</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Bus School Number</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Driver</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {buses.map((bus: Bus) => (
                <tr key={bus.id} className="hover:bg-indigo-50/20 even:bg-gray-50 transition-colors duration-150 transform hover:scale-[1.005]">
                  {/* Removed whitespace-nowrap from most table data cells to allow text wrapping */}
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-900 font-medium">{bus.name}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700">{bus.route}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">{bus.plate}</td> {/* Kept whitespace-nowrap for plate numbers as they are typically fixed-format */}
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700 hidden sm:table-cell">{bus.type}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700 hidden md:table-cell">{bus.color}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700">{bus.seats}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700">{bus.capacity}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm text-gray-700">{getDriverName(bus.driverId)}</td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-center text-sm font-medium space-x-1 sm:space-x-3">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150 p-1 rounded-md hover:bg-indigo-100"
                      title="Edit Bus"
                    >
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150 p-1 rounded-md hover:bg-red-100 ml-2"
                      title="Delete Bus"
                    >
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusManagementPage;