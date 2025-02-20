import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user authentication (Example: Remove token from localStorage)
        localStorage.removeItem("authToken");

        // Redirect to login page
        navigate("/auth/login");
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default Logout;
