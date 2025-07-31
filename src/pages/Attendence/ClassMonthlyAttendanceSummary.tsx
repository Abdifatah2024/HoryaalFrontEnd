// import React, { useState, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchClassMonthlyAttendanceSummary,
// } from "../../Redux/Attedence/AttendancePeClassSlice";
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useReactToPrint } from "react-to-print";
// import logo from "../../../public/assets/logo.png";

// const classOptions = [
//   { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
//   { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
//   { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
//   { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
//   { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
//   { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
//   { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
// ];

// // PDF styles
// const styles = StyleSheet.create({
//   page: { padding: 24, fontSize: 10 },
//   logo: { width: 80, height: 80, marginBottom: 8 },
//   heading: { fontSize: 14, marginBottom: 12, fontWeight: "bold", textAlign: "center" },
//   table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
//   tableRow: { flexDirection: "row" },
//   tableCellHeader: { flex: 1, borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: "#eee", fontWeight: "bold", padding: 4 },
//   tableCell: { flex: 1, borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4 },
// });

// export const ClassMonthlyAttendanceSummary: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { classMonthlySummary, loading, errorMessage } = useAppSelector(
//     (state) => state.attendance
//   );

//   const currentYear = new Date().getFullYear();
//   const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
//   const [year, setYear] = useState<number>(currentYear);

//   const tableRef = useRef<HTMLDivElement | null>(null);


//   const handleFetch = () => {
//     if (selectedClassId) {
//       dispatch(fetchClassMonthlyAttendanceSummary({ classId: selectedClassId, year }));
//     }
//   };

//   const handleExportExcel = () => {
//     if (!classMonthlySummary) return;

//     const wsData = [
//       [
//         "No",
//         "Student Name",
//         "Total Absent",
//         ...Array.from({ length: 12 }, (_, i) =>
//           new Date(0, i).toLocaleString("en-US", { month: "short" })
//         ),
//       ],
//       ...classMonthlySummary.summary.map((stu, idx) => [
//         idx + 1,
//         stu.fullname,
//         stu.totalAbsentCount,
//         ...Array.from({ length: 12 }, (_, i) => {
//           const m = stu.monthly.find((x) => x.month === i + 1);
//           return m?.absentCount ?? "-";
//         }),
//       ]),
//     ];

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     XLSX.utils.book_append_sheet(wb, ws, "Attendance");

//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "ClassMonthlyAttendance.xlsx");
//   };

//   const handlePrint = useReactToPrint({
//     content: () => tableRef.current,
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 md:p-12">
//       <h1 className="text-3xl font-bold text-center mb-8">
//         Class Monthly Attendance Summary
//       </h1>

//       <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
//         <select
//           value={selectedClassId ?? ""}
//           onChange={(e) => setSelectedClassId(Number(e.target.value))}
//           className="p-2 border rounded min-w-[150px]"
//         >
//           <option value="">Select Class</option>
//           {classOptions.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={year}
//           onChange={(e) => setYear(Number(e.target.value))}
//           className="p-2 border rounded"
//         >
//           {[2024, 2025, 2026].map((y) => (
//             <option key={y} value={y}>
//               {y}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleFetch}
//           disabled={!selectedClassId}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Load Report
//         </button>
//       </div>

//       {loading && <p className="text-center">Loading...</p>}
//       {errorMessage && (
//         <p className="text-red-600 text-center">{errorMessage}</p>
//       )}

//       {!loading && classMonthlySummary && (
//         <div>
//           <div className="flex gap-2 mb-4">
//             <button
//               onClick={handleExportExcel}
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Download Excel
//             </button>
//             <PDFDownloadLink
//               document={
//                 <Document>
//                   <Page size="A4" style={styles.page}>
//                     <Image src={logo} style={styles.logo} />
//                     <Text style={styles.heading}>
//                       Class Monthly Attendance Summary ({year})
//                     </Text>
//                     <View style={styles.table}>
//                       {/* Table Header */}
//                       <View style={styles.tableRow}>
//                         {[
//                           "No",
//                           "Student Name",
//                           "Total Absent",
//                           ...Array.from({ length: 12 }, (_, i) =>
//                             new Date(0, i).toLocaleString("en-US", { month: "short" })
//                           ),
//                         ].map((header, idx) => (
//                           <Text key={idx} style={styles.tableCellHeader}>
//                             {header}
//                           </Text>
//                         ))}
//                       </View>
//                       {/* Table Rows */}
//                       {classMonthlySummary.summary.map((stu, idx) => (
//                         <View key={stu.studentId} style={styles.tableRow}>
//                           <Text style={styles.tableCell}>{idx + 1}</Text>
//                           <Text style={styles.tableCell}>{stu.fullname}</Text>
//                           <Text style={styles.tableCell}>{stu.totalAbsentCount}</Text>
//                           {Array.from({ length: 12 }, (_, i) => {
//                             const m = stu.monthly.find((x) => x.month === i + 1);
//                             return (
//                               <Text key={i} style={styles.tableCell}>
//                                 {m?.absentCount ?? "-"}
//                               </Text>
//                             );
//                           })}
//                         </View>
//                       ))}
//                     </View>
//                   </Page>
//                 </Document>
//               }
//               fileName="ClassMonthlyAttendance.pdf"
//             >
//               {({ loading }) => (
//                 <button
//                   disabled={loading}
//                   className="bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   {loading ? "Generating PDF..." : "Download PDF"}
//                 </button>
//               )}
//             </PDFDownloadLink>
//             <button
//               onClick={handlePrint}
//               className="bg-gray-600 text-white px-4 py-2 rounded"
//             >
//               Print
//             </button>
//           </div>

//           {/* HTML Table */}
//           <div ref={tableRef} className="overflow-x-auto bg-white p-4 border rounded">
//             <table className="min-w-full text-sm border">
//               <thead>
//                 <tr>
//                   <th className="border p-2">#</th>
//                   <th className="border p-2">Student Name</th>
//                   <th className="border p-2">Total Absent</th>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <th key={i} className="border p-2">
//                       {new Date(0, i).toLocaleString("en-US", { month: "short" })}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {classMonthlySummary.summary
//                   .slice()
//                   .sort((a, b) => b.totalAbsentCount - a.totalAbsentCount)
//                   .map((stu, idx) => (
//                     <tr key={stu.studentId}>
//                       <td className="border p-2">{idx + 1}</td>
//                       <td className="border p-2">{stu.fullname}</td>
//                       <td className="border p-2">{stu.totalAbsentCount}</td>
//                       {Array.from({ length: 12 }, (_, i) => {
//                         const m = stu.monthly.find((x) => x.month === i + 1);
//                         return (
//                           <td key={i} className="border p-2 text-center">
//                             {m?.absentCount ?? "-"}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchClassMonthlyAttendanceSummary,
} from "../../Redux/Attedence/AttendancePeClassSlice";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../../../public/assets/logo.png";

const classOptions = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  logo: { width: 80, height: 80, marginBottom: 8 },
  heading: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
 table: {
  flexDirection: "column", // ✅ Acts like a table vertically
  width: "auto",
  borderStyle: "solid",
  borderWidth: 1,
  borderRightWidth: 0,
  borderBottomWidth: 0
},

  tableRow: { flexDirection: "row" },
  tableCellHeader: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#eee",
    fontWeight: "bold",
    padding: 4,
  },
  tableCell: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
});

export const ClassMonthlyAttendanceSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { classMonthlySummary, loading, errorMessage } = useAppSelector(
    (state) => state.attendance
  );

  const currentYear = new Date().getFullYear();
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [year, setYear] = useState<number>(currentYear);

  const handleFetch = () => {
    if (selectedClassId) {
      dispatch(
        fetchClassMonthlyAttendanceSummary({ classId: selectedClassId, year })
      );
    }
  };

  const handleExportExcel = () => {
    if (!classMonthlySummary) return;

    const wsData = [
      [
        "No",
        "Student Name",
        "Total Absent",
        ...Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString("en-US", { month: "short" })
        ),
      ],
      ...classMonthlySummary.summary.map((stu, idx) => [
        idx + 1,
        stu.fullname,
        stu.totalAbsentCount,
        ...Array.from({ length: 12 }, (_, i) => {
          const m = stu.monthly.find((x) => x.month === i + 1);
          return m?.absentCount ?? "-";
        }),
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ClassMonthlyAttendance.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Class Monthly Attendance Summary
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        <select
          value={selectedClassId ?? ""}
          onChange={(e) => setSelectedClassId(Number(e.target.value))}
          className="p-2 border rounded min-w-[150px]"
        >
          <option value="">Select Class</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetch}
          disabled={!selectedClassId}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Load Report
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {errorMessage && (
        <p className="text-red-600 text-center">{errorMessage}</p>
      )}

      {!loading && classMonthlySummary && (
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Download Excel
            </button>

            <PDFDownloadLink
              document={
                <Document>
                  <Page size="A4" style={styles.page}>
                    <Image src={logo} style={styles.logo} />
                    <Text style={styles.heading}>
                      Class Monthly Attendance Summary ({year})
                    </Text>
                    <View style={styles.table}>
                      {/* Table Header */}
                      <View style={styles.tableRow}>
                        {[
                          "No",
                          "Student Name",
                          "Total Absent",
                          ...Array.from({ length: 12 }, (_, i) =>
                            new Date(0, i).toLocaleString("en-US", {
                              month: "short",
                            })
                          ),
                        ].map((header, idx) => (
                          <Text key={idx} style={styles.tableCellHeader}>
                            {header}
                          </Text>
                        ))}
                      </View>
                      {/* Table Rows */}
                      {classMonthlySummary.summary.map((stu, idx) => (
                        <View key={stu.studentId} style={styles.tableRow}>
                          <Text style={styles.tableCell}>{idx + 1}</Text>
                          <Text style={styles.tableCell}>{stu.fullname}</Text>
                          <Text style={styles.tableCell}>
                            {stu.totalAbsentCount}
                          </Text>
                          {Array.from({ length: 12 }, (_, i) => {
                            const m = stu.monthly.find(
                              (x) => x.month === i + 1
                            );
                            return (
                              <Text key={i} style={styles.tableCell}>
                                {m?.absentCount ?? "-"}
                              </Text>
                            );
                          })}
                        </View>
                      ))}
                    </View>
                  </Page>
                </Document>
              }
              fileName="ClassMonthlyAttendance.pdf"
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "Generating PDF..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>

          {/* HTML Table */}
          <div className="overflow-x-auto bg-white p-4 border rounded">
            <table className="min-w-full text-sm border">
              <thead>
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Student Name</th>
                  <th className="border p-2">Total Absent</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="border p-2">
                      {new Date(0, i).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classMonthlySummary.summary
                  .slice()
                  .sort((a, b) => b.totalAbsentCount - a.totalAbsentCount)
                  .map((stu, idx) => (
                    <tr key={stu.studentId}>
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{stu.fullname}</td>
                      <td className="border p-2">{stu.totalAbsentCount}</td>
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = stu.monthly.find((x) => x.month === i + 1);
                        return (
                          <td key={i} className="border p-2 text-center">
                            {m?.absentCount ?? "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
