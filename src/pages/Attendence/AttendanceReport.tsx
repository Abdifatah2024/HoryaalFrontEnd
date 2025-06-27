
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchAbsentReport,
  updateAbsentRecord,
} from "../../Redux/Attedence/AttendancePeClassSlice";

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
  } as React.CSSProperties,

  header: {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    textAlign: "center",
  } as React.CSSProperties,

  filterSection: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  } as React.CSSProperties,

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  label: {
    marginBottom: "0.5rem",
    color: "#34495e",
    fontWeight: "bold",
  } as React.CSSProperties,

  input: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  } as React.CSSProperties,

  select: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  } as React.CSSProperties,

  button: {
    padding: "0.7rem 1.2rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s ease-in-out",
  } as React.CSSProperties,

  primaryButton: {
    backgroundColor: "#3498db",
    color: "white",
  } as React.CSSProperties,

  secondaryButton: {
    backgroundColor: "#ecf0f1",
    color: "#34495e",
    border: "1px solid #ccc",
  } as React.CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  } as React.CSSProperties,

  th: {
    backgroundColor: "#34495e",
    color: "white",
    padding: "0.6rem",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  } as React.CSSProperties,

  td: {
    padding: "0.2rem 0.4rem",
    borderBottom: "1px solid #eee",
    color: "#34495e",
  } as React.CSSProperties,

  tableRowEven: {
    backgroundColor: "#f8f8f8",
  } as React.CSSProperties,

  message: {
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  } as React.CSSProperties,

  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c0392b",
    border: "1px solid #c0392b",
  } as React.CSSProperties,

  successMessage: {
    backgroundColor: "#e8f5e9",
    color: "#27ae60",
    border: "1px solid #27ae60",
  } as React.CSSProperties,

  loadingMessage: {
    color: "#3498db",
  } as React.CSSProperties,

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  } as React.CSSProperties,

  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
  } as React.CSSProperties,

  modalTitle: {
    marginBottom: "1.5rem",
    color: "#2c3e50",
    textAlign: "center",
  } as React.CSSProperties,

  formGroup: {
    marginBottom: "1rem",
  } as React.CSSProperties,

  textarea: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
    width: "calc(100% - 1.6rem)",
    minHeight: "80px",
    resize: "vertical",
  } as React.CSSProperties,

  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.8rem",
    marginTop: "1.5rem",
  } as React.CSSProperties,

  completedCallRow: {
    backgroundColor: "#e6ffe6",
  } as React.CSSProperties,

  missedCallRow: {
    backgroundColor: "#fffacc",
  } as React.CSSProperties,

  noAnswerCallRow: {
    backgroundColor: "#ffe6e6",
  } as React.CSSProperties,
};


export default function AttendanceReport() {
  const dispatch = useAppDispatch();
  const { absentReport, loading, errorMessage, successMessage, updating } =
    useAppSelector((state) => state.attendancePerClass);

  const [selectedRecord, setSelectedRecord] = useState<null | {
    studentId: number;
    date: string;
    callStatus: string;
    callTime: string;
    callNotes: string;
  }>(null);

  const [startDate, setStartDate] = useState("2025-06-24");
  const [endDate, setEndDate] = useState("2025-06-27");
  const [selectedClass, setSelectedClass] = useState("All");

  useEffect(() => {
    dispatch(fetchAbsentReport({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

  const handleEdit = (item: any) => {
    if (!item.studentId) {
      alert("Missing student ID in record. Cannot edit.");
      return;
    }
    setSelectedRecord({
      studentId: item.studentId,
      date: item.date,
      callStatus:
        item.callStatus && item.callStatus.trim() !== ""
          ? item.callStatus
          : "Not Called",
      callTime: item.callTime || new Date().toISOString(),
      callNotes: item.callNotes || "",
    });
  };

  const handleUpdate = () => {
    if (!selectedRecord) return;
    dispatch(updateAbsentRecord(selectedRecord)).then(() => {
      dispatch(fetchAbsentReport({ startDate, endDate }));
      setSelectedRecord(null);
    });
  };

  const uniqueClasses = Array.from(
    new Set(absentReport.map((item) => item.className))
  );

  const filteredReport =
    selectedClass === "All"
      ? absentReport
      : absentReport.filter((item) => item.className === selectedClass);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Absent Report</h2>

      <div style={styles.filterSection}>
        <div style={styles.inputGroup}>
          <label htmlFor="startDate" style={styles.label}>Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="endDate" style={styles.label}>End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="classFilter" style={styles.label}>Class:</label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={styles.select}
          >
            <option value="All">All</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p style={{ ...styles.message, ...styles.loadingMessage }}>Loading report...</p>
      )}
      {errorMessage && (
        <p style={{ ...styles.message, ...styles.errorMessage }}>Error: {errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ ...styles.message, ...styles.successMessage }}>{successMessage}</p>
      )}

      {!loading && filteredReport.length === 0 && !errorMessage && (
        <p style={{ textAlign: "center", color: "#555" }}>
          No absent records found for the selected filters.
        </p>
      )}

      {filteredReport.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student ID</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Class</th>
              <th style={styles.th}>Phones</th>
              <th style={styles.th}>Call Notes</th>
              <th style={styles.th}>Call Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  ...(idx % 2 === 0 ? styles.tableRowEven : {}),
                  ...(item.callStatus === "Completed"
                    ? styles.completedCallRow
                    : item.callStatus === "Missed"
                    ? styles.missedCallRow
                    : item.callStatus === "No Answer"
                    ? styles.noAnswerCallRow
                    : {}),
                }}
              >
                <td style={styles.td}>{item.studentId}</td>
                <td style={styles.td}>{new Date(item.date).toLocaleDateString()}</td>
                <td style={styles.td}>{item.studentFullName}</td>
                <td style={styles.td}>{item.className}</td>
                <td style={styles.td}>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} style={{ color: "#3498db", textDecoration: "none" }}>
                      {item.phone}
                    </a>
                  )}
                  {item.phone2 && (
                    <>
                      {" / "}
                      <a href={`tel:${item.phone2}`} style={{ color: "#3498db", textDecoration: "none" }}>
                        {item.phone2}
                      </a>
                    </>
                  )}
                </td>
                <td style={styles.td}>{item.callNotes || "—"}</td>
                <td style={styles.td}>{item.callStatus || "Not Called"}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ ...styles.button, ...styles.primaryButton }}
                  >
                    Edit Call Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRecord && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Edit Call Information</h3>

            <div style={styles.formGroup}>
              <label htmlFor="callStatus" style={styles.label}>Call Status:</label>
              <select
                id="callStatus"
                value={selectedRecord.callStatus}
                onChange={(e) =>
                  setSelectedRecord({ ...selectedRecord, callStatus: e.target.value })
                }
                style={styles.select}
              >
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
                <option value="No Answer">No Answer</option>
                <option value="Not Called">Not Called</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="callTime" style={styles.label}>Call Time:</label>
              <input
                type="datetime-local"
                id="callTime"
                value={selectedRecord.callTime.slice(0, 16)}
                onChange={(e) =>
                  setSelectedRecord({
                    ...selectedRecord,
                    callTime: new Date(e.target.value).toISOString(),
                  })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="callNotes" style={styles.label}>Call Notes:</label>
              <textarea
                id="callNotes"
                value={selectedRecord.callNotes}
                onChange={(e) =>
                  setSelectedRecord({ ...selectedRecord, callNotes: e.target.value })
                }
                style={styles.textarea}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={handleUpdate}
                disabled={updating}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
