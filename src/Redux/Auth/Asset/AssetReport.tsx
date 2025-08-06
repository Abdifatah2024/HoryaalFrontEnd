// import React, { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../store";
// import { fetchAssetReport} from "../../Auth/Asset/assetSlice";
// import { FiRefreshCcw, FiBarChart2 } from "react-icons/fi";
// import dayjs from "dayjs";

// const AssetReport: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { report, loading, error } = useAppSelector((state) => state.assets);

//   // Load report on mount
//   useEffect(() => {
//     dispatch(fetchAssetReport());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 font-sans">
//       <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <FiBarChart2 className="text-indigo-600" /> Asset Summary Report
//           </h1>
//           <button
//             onClick={() => dispatch(fetchAssetReport())}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
//           >
//             <FiRefreshCcw />
//             Refresh
//           </button>
//         </div>

//         {loading && (
//           <div className="py-10 text-center text-indigo-600 font-semibold">
//             Loading report...
//           </div>
//         )}

//         {error && (
//           <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {report && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <div className="bg-gradient-to-br from-indigo-100 to-white p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500">Generated At</p>
//                 <p className="text-lg font-semibold">
//                   {dayjs(report.generatedAt).format("MMM D, YYYY HH:mm")}
//                 </p>
//               </div>
//               <div className="bg-gradient-to-br from-blue-100 to-white p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500">Total Assets</p>
//                 <p className="text-lg font-bold text-blue-700">
//                   {report.totalAssets}
//                 </p>
//               </div>
//               <div className="bg-gradient-to-br from-green-100 to-white p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500">Total Purchase Value</p>
//                 <p className="text-lg font-bold text-green-700">
//                   ${report.totalPurchaseValue.toFixed(2)}
//                 </p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-100 to-white p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500">Total Current Value</p>
//                 <p className="text-lg font-bold text-purple-700">
//                   ${report.totalCurrentValue.toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               {/* By Category */}
//               <div className="bg-white border rounded-lg p-4 shadow-sm">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-3">
//                   Assets by Category
//                 </h2>
//                 <ul className="space-y-2">
//                   {Object.entries(report.byCategory).map(([category, count]) => (
//                     <li
//                       key={category}
//                       className="flex justify-between border-b pb-1 text-gray-700"
//                     >
//                       <span>{category}</span>
//                       <span className="font-semibold">{count}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* By Condition */}
//               <div className="bg-white border rounded-lg p-4 shadow-sm">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-3">
//                   Assets by Condition
//                 </h2>
//                 <ul className="space-y-2">
//                   {Object.entries(report.byCondition).map(
//                     ([condition, count]) => (
//                       <li
//                         key={condition}
//                         className="flex justify-between border-b pb-1 text-gray-700"
//                       >
//                         <span>{condition}</span>
//                         <span className="font-semibold">{count}</span>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//             </div>

//             {/* Top Valuable Assets */}
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Top Valuable Assets
//               </h2>
//               <div className="overflow-x-auto rounded-lg border">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Name
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Category
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Purchase Date
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Purchase Price
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Current Value
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Condition
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Location
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {report.topValuable.map((asset) => (
//                       <tr key={asset.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900">
//                           {asset.name}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-700">
//                           {asset.category}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-700">
//                           {dayjs(asset.purchaseDate).format("MMM D, YYYY")}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-green-700 font-semibold">
//                           ${asset.purchasePrice.toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-purple-700 font-semibold">
//                           ${asset.currentValue.toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-700">
//                           {asset.condition}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-700">
//                           {asset.location}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetReport;
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchAssetReport } from "../../Auth/Asset/assetSlice";
import { FiRefreshCcw, FiBarChart2, FiDownload } from "react-icons/fi";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AssetReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { report, loading, error } = useAppSelector((state) => state.assets);

  // Load report on mount
  useEffect(() => {
    dispatch(fetchAssetReport());
  }, [dispatch]);

  // const handleExportPDF = () => {
  //   if (!report) return;

  //   const doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text("Asset Summary Report", 14, 20);

  //   doc.setFontSize(12);
  //   doc.text(`Generated: ${dayjs(report.generatedAt).format("MMM D, YYYY HH:mm")}`, 14, 28);

  //   // Table of Top Valuable Assets
  //   autoTable(doc, {
  //     startY: 35,
  //     head: [
  //       [
  //         "Name",
  //         "Category",
  //         "Purchase Date",
  //         "Purchase Price",
  //         "Current Value",
  //         "Condition",
  //         "Location",
  //       ],
  //     ],
  //     body: report.topValuable.map((a) => [
  //       a.name,
  //       a.category,
  //       dayjs(a.purchaseDate).format("MMM D, YYYY"),
  //       `$${a.purchasePrice.toFixed(2)}`,
  //       `$${a.currentValue.toFixed(2)}`,
  //       a.condition,
  //       a.location,
  //     ]),
  //   });

  //   doc.save("Asset_Report.pdf");
  // };
const handleExportPDF = () => {
  if (!report) return;

  const doc = new jsPDF();

  // ✅ School name at the very top
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("HORYAAL PRIMARY", 14, 15);

  // ✅ Report title below it
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Asset Summary Report", 14, 25);

  // ✅ Date below title
  doc.setFontSize(11);
  doc.text(`Generated: ${dayjs(report.generatedAt).format("MMM D, YYYY HH:mm")}`, 14, 32);

  // ✅ Table of Top Valuable Assets
  autoTable(doc, {
    startY: 38, // Start lower so it doesn't overlap
    head: [
      [
        "Name",
        "Category",
        "Purchase Date",
        "Purchase Price",
        "Current Value",
        "Condition",
        "Location",
      ],
    ],
    body: report.topValuable.map((a) => [
      a.name,
      a.category,
      dayjs(a.purchaseDate).format("MMM D, YYYY"),
      `$${a.purchasePrice.toFixed(2)}`,
      `$${a.currentValue.toFixed(2)}`,
      a.condition,
      a.location,
    ]),
  });

  doc.save("Asset_Report.pdf");
};

  const handleExportExcel = () => {
    if (!report) return;

    const worksheetData = [
      [
        "Name",
        "Category",
        "Purchase Date",
        "Purchase Price",
        "Current Value",
        "Condition",
        "Location",
      ],
      ...report.topValuable.map((a) => [
        a.name,
        a.category,
        dayjs(a.purchaseDate).format("MMM D, YYYY"),
        a.purchasePrice,
        a.currentValue,
        a.condition,
        a.location,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Valuable Assets");

    XLSX.writeFile(workbook, "Asset_Report.xlsx");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow border border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiBarChart2 className="text-indigo-600" /> Asset Summary Report
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(fetchAssetReport())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <FiRefreshCcw />
              Refresh
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              <FiDownload />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
            >
              <FiDownload />
              Excel
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-10 text-center text-indigo-600 font-semibold">
            Loading report...
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {report && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-100 to-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Generated At</p>
                <p className="text-lg font-semibold">
                  {dayjs(report.generatedAt).format("MMM D, YYYY HH:mm")}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Total Assets</p>
                <p className="text-lg font-bold text-blue-700">
                  {report.totalAssets}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Total Purchase Value</p>
                <p className="text-lg font-bold text-green-700">
                  ${report.totalPurchaseValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-white p-4 rounded-lg border">
                <p className="text-sm text-gray-500">Total Current Value</p>
                <p className="text-lg font-bold text-purple-700">
                  ${report.totalCurrentValue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* By Category */}
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Assets by Category
                </h2>
                <ul className="space-y-2">
                  {Object.entries(report.byCategory).map(([category, count]) => (
                    <li
                      key={category}
                      className="flex justify-between border-b pb-1 text-gray-700"
                    >
                      <span>{category}</span>
                      <span className="font-semibold">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* By Condition */}
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Assets by Condition
                </h2>
                <ul className="space-y-2">
                  {Object.entries(report.byCondition).map(
                    ([condition, count]) => (
                      <li
                        key={condition}
                        className="flex justify-between border-b pb-1 text-gray-700"
                      >
                        <span>{condition}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Top Valuable Assets Table */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Top Valuable Assets
              </h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Purchase Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Purchase Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Current Value
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Condition
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.topValuable.map((asset) => (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {asset.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {asset.category}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {dayjs(asset.purchaseDate).format("MMM D, YYYY")}
                        </td>
                        <td className="px-4 py-2 text-sm text-green-700 font-semibold">
                          ${asset.purchasePrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-purple-700 font-semibold">
                          ${asset.currentValue.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {asset.condition}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {asset.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetReport;
