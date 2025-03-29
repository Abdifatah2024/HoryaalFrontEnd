// import React from "react";

// const Dashboard: React.FC = () => {
//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <h1 style={styles.heading}>🎓 School Dashboard</h1>

//       {/* Stats Cards */}
//       <div style={styles.cardsContainer}>
//         <StatCard title="Total Students" value="300" color="#007bff" />
//         <StatCard title="Male Students" value="120" color="#17a2b8" />
//         <StatCard title="Female Students" value="180" color="#ff69b4" />
//         <StatCard title="Total Teachers" value="29" color="#28a745" />
//         <StatCard title="Total Classes" value="20" color="#ffc107" />
//         <StatCard title="Administration Staff" value="8" color="#6f42c1" />
//       </div>

//       {/* Additional Sections */}
//       <div style={styles.sectionContainer}>
//         {/* Recent Activities */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>📌 Recent Activities</h2>
//           <ul style={styles.list}>
//             <li>🏆 Annual Sports Day event planned for March 5th.</li>
//             <li>📢 Parent-Teacher Meeting scheduled for next Friday.</li>
//             <li>📝 Mid-term exams start from February 20th.</li>
//             <li>🎨 Art competition winners announced.</li>
//           </ul>
//         </div>

//         {/* Notifications */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>🔔 Notifications</h2>
//           <ul style={styles.list}>
//             <li>⚠️ New admission applications open for 2025.</li>
//             <li>✅ Attendance records updated for February.</li>
//             <li>📚 New books added to the school library.</li>
//             <li>🚀 Coding workshop for senior students next week.</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Reusable Stat Card Component
// const StatCard: React.FC<{ title: string; value: string; color: string }> = ({
//   title,
//   value,
//   color,
// }) => {
//   return (
//     <div style={{ ...styles.card, backgroundColor: color }}>
//       <h2 style={styles.cardTitle}>{title}</h2>
//       <p style={styles.cardValue}>{value}</p>
//     </div>
//   );
// };

// // ✅ Styling
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     padding: "20px",
//     fontFamily: "'Poppins', sans-serif",
//     backgroundColor: "#f8f9fa",
//     minHeight: "100vh",
//   },
//   heading: {
//     fontSize: "2rem",
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//   },
//   cardsContainer: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "20px",
//     marginTop: "20px",
//   },
//   card: {
//     padding: "20px",
//     borderRadius: "10px",
//     textAlign: "center",
//     color: "#fff",
//     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//   },
//   cardTitle: {
//     fontSize: "1.2rem",
//     marginBottom: "5px",
//   },
//   cardValue: {
//     fontSize: "2rem",
//     fontWeight: "bold",
//   },
//   sectionContainer: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px",
//     marginTop: "40px",
//   },
//   section: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     marginBottom: "10px",
//     color: "#333",
//   },
//   list: {
//     listStyle: "none",
//     padding: "0",
//   },
// };

// export default Dashboard;
