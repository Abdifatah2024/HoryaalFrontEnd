// import React, { useState, useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import * as XLSX from 'xlsx';
// import { AppDispatch } from '../../Redux/store';
// import  {uploadStudentsExcel}  from '../../Redux/Auth/studentUploadSlice';

// import { FiUpload, FiCheck,  FiFile, FiDownload, FiAlertCircle } from 'react-icons/fi';
// import { motion } from 'framer-motion';
// import styled from 'styled-components';
// import { Student } from '@/types/Register';

// // Styled Components with modern design
// const Container = styled.div`
//   max-width: 1200px;
//   margin: 2rem auto;
//   padding: 2rem;
//   background: white;
//   border-radius: 12px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
// `;

// const Title = styled.h2`
//   font-size: 1.75rem;
//   font-weight: 600;
//   color: #111827;
//   margin-bottom: 1.5rem;
// `;

// const UploadBox = styled(motion.div)`
//   border: 2px dashed #d1d5db;
//   border-radius: 8px;
//   padding: 3rem 2rem;
//   text-align: center;
//   cursor: pointer;
//   transition: all 0.2s;
//   background: #f9fafb;
//   margin-bottom: 1.5rem;

//   &:hover {
//     border-color: #6366f1;
//     background: #f0f0ff;
//   }
// `;

// const FileInput = styled.input`
//   display: none;
// `;

// const UploadLabel = styled.label`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 1rem;
//   cursor: pointer;
// `;

// const UploadIcon = styled(FiUpload)`
//   font-size: 2rem;
//   color: #6366f1;
// `;

// const PreviewContainer = styled(motion.div)`
//   margin-top: 2rem;
//   overflow-x: auto;
//   border-radius: 8px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   background: white;
//   min-width: 1000px;
// `;

// const Th = styled.th`
//   padding: 0.75rem 1rem;
//   text-align: left;
//   background: #f3f4f6;
//   color: #374151;
//   font-weight: 600;
//   font-size: 0.75rem;
//   text-transform: uppercase;
//   letter-spacing: 0.05em;
//   position: sticky;
//   top: 0;
// `;

// const Td = styled.td`
//   padding: 0.75rem 1rem;
//   border-bottom: 1px solid #e5e7eb;
//   font-size: 0.875rem;
//   color: #4b5563;
// `;

// const ActionButton = styled(motion.button)`
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.625rem 1.25rem;
//   border-radius: 6px;
//   font-weight: 500;
//   font-size: 0.875rem;
//   transition: all 0.2s;
//   cursor: pointer;
//   border: none;
//   outline: none;
// `;

// const SubmitButton = styled(ActionButton)`
//   background: #6366f1;
//   color: white;

//   &:hover {
//     background: #4f46e5;
//   }

//   &:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
// `;

// const DownloadButton = styled(ActionButton)`
//   background: #10b981;
//   color: white;

//   &:hover {
//     background: #059669;
//   }
// `;

// const Message = styled(motion.div)`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.75rem 1rem;
//   border-radius: 6px;
//   margin-bottom: 1rem;
//   font-size: 0.875rem;
// `;

// const ErrorMessage = styled(Message)`
//   background: #fee2e2;
//   color: #b91c1c;
// `;

// const SuccessMessage = styled(Message)`
//   background: #dcfce7;
//   color: #166534;
// `;

// const FileInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.75rem 1rem;
//   background: #f3f4f6;
//   border-radius: 6px;
//   margin-bottom: 1rem;
//   font-size: 0.875rem;
//   color: #4b5563;
// `;

// const Spinner = styled.div`
//   @keyframes spin {
//     to {
//       transform: rotate(360deg);
//     }
//   }
  
//   width: 1rem;
//   height: 1rem;
//   border: 2px solid rgba(255, 255, 255, 0.3);
//   border-radius: 50%;
//   border-top-color: white;
//   animation: spin 1s ease-in-out infinite;
// `;

// const RequiredFieldIndicator = styled.span`
//   color: #ef4444;
//   margin-left: 2px;
// `;

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

//     // Validate file size (max 5MB)
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
//         const wsName = wb.SheetNames[0];
//         const ws = wb.Sheets[wsName];
//         const data = XLSX.utils.sheet_to_json<Student>(ws);
        
//         // Validate required fields
//         if (data.length === 0) {
//           setError('The file is empty');
//           return;
//         }
        
//         const requiredFields = ['firstname', 'lastname', 'classId'];
//         const missingFields = requiredFields.filter(field => !data[0][field as keyof Student]);
        
//         if (missingFields.length > 0) {
//           setError(`Missing required columns: ${missingFields.join(', ')}`);
//           return;
//         }
        
//         setStudentsData(data);
//       } catch (err) {
//         setError('Invalid file format. Please upload a valid Excel file.');
//       }
//     };
//     reader.onerror = () => {
//       setError('Error reading file. Please try again.');
//     };
//     reader.readAsBinaryString(file);
//   }, []);

//  const handleSubmit = useCallback(async () => {
//   if (!studentsData.length || !file) return;
  
//   setIsLoading(true);
//   setError(null);

//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     await dispatch(uploadStudentsExcel(formData)).unwrap();

//     setSuccess(true);
//     setStudentsData([]);
//     setFile(null);
//   } catch (err) {
//     if (err instanceof Error) {
//       setError(err.message);
//     } else {
//       setError("Upload failed. Please check the file and try again.");
//     }
//   } finally {
//     setIsLoading(false);
//   }
// }, [dispatch, file, studentsData]);


//   const handleDownloadTemplate = useCallback(() => {
//     const sample = [
//       {
//         firstname: 'John',
//         middlename: 'Michael',
//         lastname: 'Doe',
//         fullname: 'John Michael Doe',
//         classId: 'CS101',
//         phone: '1234567890',
//         phone2: '0987654321',
//         gender: 'Male',
//         Age: '18',
//         fee: '500',
//         bus: 'Bus A',
//         address: '123 Main St, City',
//         previousSchool: 'City High School',
//         motherName: 'Jane Doe',
//       },
//       {
//         firstname: 'Sarah',
//         middlename: '',
//         lastname: 'Smith',
//         fullname: 'Sarah Smith',
//         classId: 'CS102',
//         phone: '5551234567',
//         phone2: '',
//         gender: 'Female',
//         Age: '17',
//         fee: '500',
//         bus: 'Bus B',
//         address: '456 Oak Ave, Town',
//         previousSchool: 'Town High School',
//         motherName: 'Mary Smith',
//       }
//     ];

//     const ws = XLSX.utils.json_to_sheet(sample);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
//     // Add instructions as a second sheet
//     const instructions = [
//       ['Field', 'Description', 'Required'],
//       ['firstname', "Student's first name", 'Yes'],
//       ['lastname', "Student's last name", 'Yes'],
//       ['middlename', "Student's middle name", 'No'],
//       ['fullname', "Student's full name", 'No'],
//       ['classId', "Class ID the student belongs to", 'Yes'],
//       ['phone', "Primary phone number", 'Yes'],
//       ['phone2', "Secondary phone number", 'No'],
//       ['gender', "Student's gender", 'No'],
//       ['Age', "Student's age", 'No'],
//       ['fee', "Tuition fee", 'No'],
//       ['bus', "Bus route", 'No'],
//       ['address', "Home address", 'No'],
//       ['previousSchool', "Previous school attended", 'No'],
//       ['motherName', "Mother's name", 'No']
//     ];
//     const instructionWs = XLSX.utils.aoa_to_sheet(instructions);
//     XLSX.utils.book_append_sheet(wb, instructionWs, 'Instructions');
    
//     XLSX.writeFile(wb, 'Student_Template.xlsx');
//   }, []);

//   return (
//     <Container>
//       <Title>Student Bulk Upload</Title>
      
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <p className="text-gray-600 text-sm sm:text-base">
//           Upload an Excel file to register multiple students at once
//         </p>
//         <DownloadButton
//           onClick={handleDownloadTemplate}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <FiDownload />
//           Download Template
//         </DownloadButton>
//       </div>

//       <UploadBox 
//         whileHover={{ scale: 1.02 }} 
//         whileTap={{ scale: 0.98 }}
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.2 }}
//       >
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
//               Drag & drop your file here or click to browse
//             </p>
//             <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
//               Max file size: 5MB (.xlsx, .xls, .csv)
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
//         <ErrorMessage 
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <FiAlertCircle />
//           {error}
//         </ErrorMessage>
//       )}

//       {success && (
//         <SuccessMessage 
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <FiCheck />
//           {studentsData.length} students uploaded successfully!
//         </SuccessMessage>
//       )}

//       {studentsData.length > 0 && (
//         <>
//           <PreviewContainer
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-base font-medium text-gray-900">
//                 Preview ({studentsData.length} {studentsData.length === 1 ? 'student' : 'students'})
//               </h3>
//               <p className="text-xs text-gray-500">
//                 Showing first 5 records
//               </p>
//             </div>
//             <Table>
//               <thead>
//                 <tr>
//                   <Th>First Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Middle Name</Th>
//                   <Th>Last Name<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Full Name</Th>
//                   <Th>Phone<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Phone2</Th>
//                   <Th>Gender</Th>
//                   <Th>Age</Th>
//                   <Th>Fee</Th>
//                   <Th>Class ID<RequiredFieldIndicator>*</RequiredFieldIndicator></Th>
//                   <Th>Bus</Th>
//                   <Th>Address</Th>
//                   <Th>Previous School</Th>
//                   <Th>Mother Name</Th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentsData.slice(0, 5).map((student, index) => (
//                   <tr key={index}>
//                     <Td>{student.firstname || '-'}</Td>
//                     <Td>{student.middlename || '-'}</Td>
//                     <Td>{student.lastname || '-'}</Td>
//                     <Td>{student.fullname || '-'}</Td>
//                     <Td>{student.phone || '-'}</Td>
//                     <Td>{student.phone2 || '-'}</Td>
//                     <Td>{student.gender || '-'}</Td>
//                     <Td>{student.Age || '-'}</Td>
//                     <Td>{student.fee || '-'}</Td>
//                     <Td>{student.classId || '-'}</Td>
//                     <Td>{student.bus || '-'}</Td>
//                     <Td>{student.address || '-'}</Td>
//                     <Td>{student.previousSchool || '-'}</Td>
//                     <Td>{student.motherName || '-'}</Td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             {studentsData.length > 5 && (
//               <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
//                 + {studentsData.length - 5} more records not shown
//               </div>
//             )}
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
//                   <Spinner />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <FiUpload />
//                   Upload Students
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

// Styled components omitted here for brevity (same as previous)
const Container = styled.div` /* ... */ `;
const Title = styled.h2` /* ... */ `;
const UploadBox = styled(motion.div)` /* ... */ `;
const FileInput = styled.input` display: none; `;
const UploadLabel = styled.label` /* ... */ `;
const UploadIcon = styled(FiUpload)` /* ... */ `;
const PreviewContainer = styled(motion.div)` /* ... */ `;
const Table = styled.table` /* ... */ `;
const Th = styled.th` /* ... */ `;
const Td = styled.td` /* ... */ `;
const ActionButton = styled(motion.button)` /* ... */ `;
const SubmitButton = styled(ActionButton)` /* ... */ `;
const DownloadButton = styled(ActionButton)` /* ... */ `;
const Message = styled(motion.div)` /* ... */ `;
const ErrorMessage = styled(Message)` background: #fee2e2; color: #b91c1c; `;
const SuccessMessage = styled(Message)` background: #dcfce7; color: #166534; `;
const FileInfo = styled.div` /* ... */ `;
const Spinner = styled.div` /* ... */ `;
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
        const missingFields = requiredFields.filter(field => !data[0][field as keyof Student]);

        if (missingFields.length > 0) {
          setError(`Missing required columns: ${missingFields.join(', ')}`);
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
          <FiAlertCircle /> {error}
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
