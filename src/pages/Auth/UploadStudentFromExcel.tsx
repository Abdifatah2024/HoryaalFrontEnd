
// import React, { useState, useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import * as XLSX from 'xlsx';
// import { AppDispatch } from '../../Redux/store';
// import { uploadStudentsExcel } from '../../Redux/Auth/studentUploadSlice';
// import { FiUpload, FiCheck, FiFile, FiDownload, FiAlertCircle } from 'react-icons/fi';
// import { motion } from 'framer-motion';
// import styled from 'styled-components';
// import { Student } from '@/types/Register';

// // Styled components (you can reuse your existing styles)
// const Container = styled.div``;
// const Title = styled.h2``;
// const UploadBox = styled(motion.div)``;
// const FileInput = styled.input` display: none; `;
// const UploadLabel = styled.label``;
// const UploadIcon = styled(FiUpload)``;
// const PreviewContainer = styled(motion.div)``;
// const Table = styled.table``;
// const Th = styled.th``;
// const Td = styled.td``;
// const ActionButton = styled(motion.button)``;
// const SubmitButton = styled(ActionButton)``;
// const DownloadButton = styled(ActionButton)``;
// const Message = styled(motion.div)``;
// const ErrorMessage = styled(Message)` background: #fee2e2; color: #b91c1c; `;
// const SuccessMessage = styled(Message)` background: #dcfce7; color: #166534; `;
// const FileInfo = styled.div``;
// const Spinner = styled.div``;
// const RequiredFieldIndicator = styled.span` color: #ef4444; margin-left: 2px; `;

// const UploadStudents = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [studentsData, setStudentsData] = useState<Student[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       setError('File size exceeds 5MB limit');
//       return;
//     }

//     setFile(file);
//     setError(null);
//     setSuccess(false);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const bstr = evt.target?.result;
//         const wb = XLSX.read(bstr, { type: 'binary' });
//         const ws = wb.Sheets[wb.SheetNames[0]];
//         const data = XLSX.utils.sheet_to_json<Student>(ws);

//         if (data.length === 0) {
//           setError('The file is empty');
//           return;
//         }

//         // ✅ Fix: Allow fee = 0
//      const requiredFields = ['firstname', 'lastname', 'classId', 'phone', 'gender', 'Age', 'fee'];

// const missingInRows: number[] = [];

// data.forEach((row, index) => {
//   const missing = requiredFields.some((field) => {
//     const value = row[field as keyof Student];
//     return value === undefined || value === null || value === '';
//   });
//   if (missing) {
//     missingInRows.push(index + 2); // Excel rows start at 1, headers at 1
//   }
// });

// if (missingInRows.length > 0) {
//   setError(`Missing required fields in rows: ${missingInRows.join(', ')}`);
//   return;
// }


       

//         // ✅ Validate fee is number and >= 0
//         const invalidFee = data.find((s) => {
//           const fee = Number(s.fee);
//           return isNaN(fee) || fee < 0;
//         });
//         if (invalidFee) {
//           setError('One or more students have an invalid fee. Fee must be 0 or a positive number.');
//           return;
//         }

//         setStudentsData(data);
//       } catch {
//         setError('Invalid file format. Please upload a valid Excel file.');
//       }
//     };
//     reader.onerror = () => setError('Error reading file. Please try again.');
//     reader.readAsBinaryString(file);
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     if (!studentsData.length || !file) return;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       await dispatch(uploadStudentsExcel(formData)).unwrap();

//       setSuccess(true);
//       setStudentsData([]);
//       setFile(null);
//     } catch (err) {
//       if (err instanceof Error) setError(err.message);
//       else setError('Upload failed. Please check the file and try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [dispatch, file, studentsData]);

//   const handleDownloadTemplate = useCallback(() => {
//     const sample = [
//       {
//         firstname: 'John',
//         middlename: 'Michael',
//         lastname: 'Doe',
//         fourtname: 'Ali',
//         classId: '1A',
//         phone: '612345678',
//         phone2: '652345678',
//         gender: 'Male',
//         Age: '17',
//         fee: '300',
//         bus: 'Bus A',
//         address: 'Hargeisa, 26 June',
//         previousSchool: 'Hargeisa Secondary',
//         previousSchoolType: 'Public',
//         motherName: 'Amina Hassan',
//       },
//     ];
//     const instructions = [
//       ['Field', 'Description', 'Required'],
//       ['firstname', "Student's first name", 'Yes'],
//       ['middlename', "Student's middle name", 'No'],
//       ['lastname', "Student's last name", 'Yes'],
//       ['fourtname', "Fourth name (optional)", 'No'],
//       ['classId', "Class ID (e.g., 1A)", 'Yes'],
//       ['phone', "Primary phone number", 'Yes'],
//       ['phone2', "Secondary phone number", 'No'],
//       ['gender', "Male / Female", 'Yes'],
//       ['Age', "Student's age", 'Yes'],
//       ['fee', "Monthly fee", 'Yes'],
//       ['bus', "Bus name/route", 'No'],
//       ['address', "Home address", 'No'],
//       ['previousSchool', "Previous school name", 'No'],
//       ['previousSchoolType', "Public or Private", 'No'],
//       ['motherName', "Mother's full name", 'No'],
//     ];

//     const ws = XLSX.utils.json_to_sheet(sample);
//     const instructionWs = XLSX.utils.aoa_to_sheet(instructions);
//     const wb = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(wb, ws, 'Students');
//     XLSX.utils.book_append_sheet(wb, instructionWs, 'Instructions');

//     XLSX.writeFile(wb, 'Student_Upload_Template.xlsx');
//   }, []);

//   return (
//     <Container>
//       <Title>Student Bulk Upload</Title>

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <p className="text-gray-600 text-sm sm:text-base">
//           Upload an Excel file to register multiple students
//         </p>
//         <DownloadButton onClick={handleDownloadTemplate}>
//           <FiDownload /> Download Template
//         </DownloadButton>
//       </div>

//       <UploadBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//         <FileInput
//           id="file-upload"
//           type="file"
//           accept=".xlsx, .xls, .csv"
//           onChange={handleFileChange}
//         />
//         <UploadLabel htmlFor="file-upload">
//           <UploadIcon />
//           <div>
//             <p style={{ fontWeight: 600, color: '#6366f1' }}>
//               Drag & drop or click to upload Excel
//             </p>
//             <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//               Max file size: 5MB
//             </p>
//           </div>
//         </UploadLabel>
//       </UploadBox>

//       {file && (
//         <FileInfo>
//           <FiFile />
//           <span>{file.name}</span>
//           <span className="text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
//         </FileInfo>
//       )}

//       {error && (
//         <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <FiAlertCircle /> {error}
//         </ErrorMessage>
//       )}

//       {success && (
//         <SuccessMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <FiCheck /> Uploaded successfully!
//         </SuccessMessage>
//       )}

//       {studentsData.length > 0 && (
//         <>
//           <PreviewContainer>
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-base font-medium text-gray-900">
//                 Preview ({studentsData.length} students)
//               </h3>
//               <p className="text-xs text-gray-500">Showing first 5 records</p>
//             </div>
//             <Table>
//               <thead>
//                 <tr>
//                   <Th>First Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Middle Name</Th>
//                   <Th>Last Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Fourth Name</Th>
//                   <Th>Phone<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Phone2</Th>
//                   <Th>Gender<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Age<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Fee<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Class ID<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Bus</Th>
//                   <Th>Address</Th>
//                   <Th>Previous School</Th>
//                   <Th>School Type</Th>
//                   <Th>Mother Name</Th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentsData.slice(0, 5).map((student, index) => (
//                   <tr key={index}>
//                     <Td>{student.firstname || '-'}</Td>
//                     <Td>{student.middlename || '-'}</Td>
//                     <Td>{student.lastname || '-'}</Td>
//                     <Td>{student.fourtname || '-'}</Td>
//                     <Td>{student.phone || '-'}</Td>
//                     <Td>{student.phone2 || '-'}</Td>
//                     <Td>{student.gender || '-'}</Td>
//                     <Td>{student.Age || '-'}</Td>
//                     <Td>{student.fee || '-'}</Td>
//                     <Td>{student.classId || '-'}</Td>
//                     <Td>{student.bus || '-'}</Td>
//                     <Td>{student.address || '-'}</Td>
//                     <Td>{student.previousSchool || '-'}</Td>
//                     <Td>{student.previousSchoolType || '-'}</Td>
//                     <Td>{student.motherName || '-'}</Td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </PreviewContainer>

//           <div className="mt-6 flex justify-end">
//             <SubmitButton
//               onClick={handleSubmit}
//               disabled={isLoading}
//               whileHover={!isLoading ? { scale: 1.05 } : {}}
//               whileTap={!isLoading ? { scale: 0.95 } : {}}
//             >
//               {isLoading ? (
//                 <>
//                   <Spinner /> Uploading...
//                 </>
//               ) : (
//                 <>
//                   <FiUpload /> Upload Students
//                 </>
//               )}
//             </SubmitButton>
//           </div>
//         </>
//       )}
//     </Container>
//   );
// };

// export default UploadStudents;

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { AppDispatch } from '../../Redux/store';
import { uploadStudentsExcel } from '../../Redux/Auth/studentUploadSlice';
import { FiUpload, FiCheck, FiFile, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Student } from '@/types/Register';

// Styled components
const Container = styled.div``;
const Title = styled.h2``;
const UploadBox = styled(motion.div)``;
const FileInput = styled.input` display: none; `;
const UploadLabel = styled.label``;
const UploadIcon = styled(FiUpload)``;
const PreviewContainer = styled(motion.div)``;
const Table = styled.table``;
const Th = styled.th``;
const Td = styled.td``;
const ActionButton = styled(motion.button)``;
const SubmitButton = styled(ActionButton)``;
const DownloadButton = styled(ActionButton)``;
const Message = styled(motion.div)``;
const ErrorMessage = styled(Message)` background: #fee2e2; color: #b91c1c; `;
const SuccessMessage = styled(Message)` background: #dcfce7; color: #166534; `;
const FileInfo = styled.div``;
const Spinner = styled.div``;
const RequiredFieldIndicator = styled.span` color: #ef4444; margin-left: 2px; `;

const UploadStudents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setFile(file);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Student>(ws);

        if (data.length === 0) {
          setError('The file is empty');
          return;
        }

        const requiredFields = ['firstname', 'lastname', 'classId', 'phone', 'gender', 'Age', 'fee'];

        const rowsWithMissing: string[] = [];

        data.forEach((row, index) => {
          const missingFields = requiredFields.filter((field) => {
            const value = row[field as keyof Student];
            return value === undefined || value === null || value === '';
          });
          if (missingFields.length > 0) {
            rowsWithMissing.push(`Row ${index + 2}: ${missingFields.join(', ')}`);
          }
        });

        if (rowsWithMissing.length > 0) {
          setError(`Missing required fields:\n${rowsWithMissing.join('\n')}`);
          return;
        }

        const invalidFee = data.find((s) => {
          const fee = Number(s.fee);
          return isNaN(fee) || fee < 0;
        });
        if (invalidFee) {
          setError('One or more students have an invalid fee. Fee must be 0 or a positive number.');
          return;
        }

        setStudentsData(data);
      } catch {
        setError('Invalid file format. Please upload a valid Excel file.');
      }
    };
    reader.onerror = () => setError('Error reading file. Please try again.');
    reader.readAsBinaryString(file);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!studentsData.length || !file) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await dispatch(uploadStudentsExcel(formData)).unwrap();

      setSuccess(true);
      setStudentsData([]);
      setFile(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Upload failed. Please check the file and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, file, studentsData]);

  const handleDownloadTemplate = useCallback(() => {
    const sample = [
      {
        firstname: 'John',
        middlename: 'Michael',
        lastname: 'Doe',
        fourtname: 'Ali',
        classId: '1A',
        phone: '612345678',
        phone2: '652345678',
        gender: 'Male',
        Age: '17',
        fee: '300',
        bus: 'Bus A',
        address: 'Hargeisa, 26 June',
        previousSchool: 'Hargeisa Secondary',
        previousSchoolType: 'Public',
        motherName: 'Amina Hassan',
      },
    ];
    const instructions = [
      ['Field', 'Description', 'Required'],
      ['firstname', "Student's first name", 'Yes'],
      ['middlename', "Student's middle name", 'No'],
      ['lastname', "Student's last name", 'Yes'],
      ['fourtname', "Fourth name (optional)", 'No'],
      ['classId', "Class ID (e.g., 1A)", 'Yes'],
      ['phone', "Primary phone number", 'Yes'],
      ['phone2', "Secondary phone number", 'No'],
      ['gender', "Male / Female", 'Yes'],
      ['Age', "Student's age", 'Yes'],
      ['fee', "Monthly fee", 'Yes'],
      ['bus', "Bus name/route", 'No'],
      ['address', "Home address", 'No'],
      ['previousSchool', "Previous school name", 'No'],
      ['previousSchoolType', "Public or Private", 'No'],
      ['motherName', "Mother's full name", 'No'],
    ];

    const ws = XLSX.utils.json_to_sheet(sample);
    const instructionWs = XLSX.utils.aoa_to_sheet(instructions);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.utils.book_append_sheet(wb, instructionWs, 'Instructions');

    XLSX.writeFile(wb, 'Student_Upload_Template.xlsx');
  }, []);

  return (
    <Container>
      <Title>Student Bulk Upload</Title>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-600 text-sm sm:text-base">
          Upload an Excel file to register multiple students
        </p>
        <DownloadButton onClick={handleDownloadTemplate}>
          <FiDownload /> Download Template
        </DownloadButton>
      </div>

      <UploadBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <FileInput
          id="file-upload"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
        />
        <UploadLabel htmlFor="file-upload">
          <UploadIcon />
          <div>
            <p style={{ fontWeight: 600, color: '#6366f1' }}>
              Drag & drop or click to upload Excel
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Max file size: 5MB
            </p>
          </div>
        </UploadLabel>
      </UploadBox>

      {file && (
        <FileInfo>
          <FiFile />
          <span>{file.name}</span>
          <span className="text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
        </FileInfo>
      )}

      {error && (
        <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FiAlertCircle /> <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FiCheck /> Uploaded successfully!
        </SuccessMessage>
      )}

      {studentsData.length > 0 && (
        <>
          <PreviewContainer>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-gray-900">
                Preview ({studentsData.length} students)
              </h3>
              <p className="text-xs text-gray-500">Showing first 5 records</p>
            </div>
            <Table>
              <thead>
                <tr>
                  <Th>First Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Middle Name</Th>
                  <Th>Last Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Fourth Name</Th>
                  <Th>Phone<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Phone2</Th>
                  <Th>Gender<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Age<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Fee<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Class ID<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
                  <Th>Bus</Th>
                  <Th>Address</Th>
                  <Th>Previous School</Th>
                  <Th>School Type</Th>
                  <Th>Mother Name</Th>
                </tr>
              </thead>
              <tbody>
                {studentsData.slice(0, 5).map((student, index) => (
                  <tr key={index}>
                    <Td>{student.firstname || '-'}</Td>
                    <Td>{student.middlename || '-'}</Td>
                    <Td>{student.lastname || '-'}</Td>
                    <Td>{student.fourtname || '-'}</Td>
                    <Td>{student.phone || '-'}</Td>
                    <Td>{student.phone2 || '-'}</Td>
                    <Td>{student.gender || '-'}</Td>
                    <Td>{student.Age || '-'}</Td>
                    <Td>{student.fee || '-'}</Td>
                    <Td>{student.classId || '-'}</Td>
                    <Td>{student.bus || '-'}</Td>
                    <Td>{student.address || '-'}</Td>
                    <Td>{student.previousSchool || '-'}</Td>
                    <Td>{student.previousSchoolType || '-'}</Td>
                    <Td>{student.motherName || '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </PreviewContainer>

          <div className="mt-6 flex justify-end">
            <SubmitButton
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <>
                  <Spinner /> Uploading...
                </>
              ) : (
                <>
                  <FiUpload /> Upload Students
                </>
              )}
            </SubmitButton>
          </div>
        </>
      )}
    </Container>
  );
};

export default UploadStudents;
