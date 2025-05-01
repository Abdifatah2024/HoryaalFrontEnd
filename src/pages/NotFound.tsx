import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <div style={styles.emoji}>🚫</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.description}>
          Sorry, we couldn’t find what you were looking for. <br />
          You might have followed a broken link or entered a URL that doesn't exist.
        </p>
        <button onClick={() => navigate("/dashboard")} style={styles.button}>
          ⬅ Go Dashboard
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    backgroundColor: "#f2f4f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    background: "#fff",
    borderRadius: "12px",
    padding: "50px 30px",
    textAlign: "center",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
  },
  emoji: {
    fontSize: "4rem",
    marginBottom: "10px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#222",
    marginBottom: "15px",
    fontWeight: 700,
  },
  description: {
    color: "#555",
    fontSize: "1rem",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#1e88e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default NotFoundPage;
