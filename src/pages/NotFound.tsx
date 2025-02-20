import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Oops! Page Not Found</h1>
      <p style={styles.message}>
        We can't seem to find the page you're looking for. But don’t worry, you can always go back home! 😊
      </p>
      <button style={styles.button} onClick={() => navigate("/")}>
        🔙 Go Home
      </button>
    </div>
  );
};

// ✅ Simple inline styles for a modern look
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: "1.2rem",
    color: "#666",
    maxWidth: "500px",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default NotFoundPage;
