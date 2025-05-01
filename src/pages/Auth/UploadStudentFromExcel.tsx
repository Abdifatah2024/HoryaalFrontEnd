// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { uploadStudentsExcel } from '../../Redux/Auth/studentUploadSlice';
// import * as XLSX from 'xlsx';
// import { AppDispatch } from '../../Redux/store';
// import { Student } from '../../Redux/Auth/studentUploadSlice'; // 👈 Reuse the type

// const UploadStudents = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [studentsData, setStudentsData] = useState<Student[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setFile(file);
//     setError(null);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const bstr = evt.target?.result;
//       const wb = XLSX.read(bstr, { type: 'binary' });
//       const wsName = wb.SheetNames[0];
//       const ws = wb.Sheets[wsName];
//       const data = XLSX.utils.sheet_to_json<Student>(ws); // 👈 Typed parsing
//       setStudentsData(data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSubmit = async () => {
//     if (!studentsData.length || !file) return;
//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await dispatch(uploadStudentsExcel(formData)).unwrap();
//     } catch (err) {
//       setError("Upload failed. Please check the file and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Upload Students Excel</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

//       {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

//       {studentsData.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <h3>Preview ({studentsData.length} students)</h3>
//           <div style={{ overflowX: 'auto' }}>
//             <table border={1} cellPadding={5} cellSpacing={0}>
//               <thead>
//                 <tr>
//                   <th>Firstname</th>
//                   <th>Middlename</th>
//                   <th>Lastname</th>
//                   <th>Phone</th>
//                   <th>Gender</th>
//                   <th>Age</th>
//                   <th>Fee</th>
//                   <th>Amount</th>
//                   <th>Class ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentsData.map((student, index) => (
//                   <tr key={index}>
//                     <td>{student.firstname}</td>
//                     <td>{student.middlename || '-'}</td>
//                     <td>{student.lastname}</td>
//                     <td>{student.phone}</td>
//                     <td>{student.gender}</td>
//                     <td>{student.Age}</td>
//                     <td>{student.fee ? 'Yes' : 'No'}</td>
//                     <td>{student.Amount}</td>
//                     <td>{student.classId}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button 
//             onClick={handleSubmit} 
//             disabled={isLoading}
//             style={{ marginTop: 20 }}
//           >
//             {isLoading ? 'Uploading...' : 'Confirm Upload'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadStudents;
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadStudentsExcel } from '../../Redux/Auth/studentUploadSlice';
import * as XLSX from 'xlsx';
import { AppDispatch } from '../../Redux/store';
import { Student } from '../../Redux/Auth/studentUploadSlice';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiX, FiFile } from 'react-icons/fi';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #4f46e5;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const UploadBox = styled(motion.div)`
  border: 2px dashed #c7d2fe;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8fafc;
  margin-bottom: 2rem;

  &:hover {
    border-color: #4f46e5;
    background: #f0f4ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const UploadIcon = styled(FiUpload)`
  font-size: 2.5rem;
  color: #4f46e5;
`;

const PreviewTable = styled(motion.div)`
  overflow-x: auto;
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  padding: 1rem;
  background: #4f46e5;
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const SubmitButton = styled(motion.button)`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #c7d2fe;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ef4444;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  color: #10b981;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #64748b;
`;

const UploadStudents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFile(file);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json<Student>(ws);
      setStudentsData(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (!studentsData.length || !file) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await dispatch(uploadStudentsExcel(formData)).unwrap();
      setSuccess(true);
    } catch (err) {
      setError("Upload failed. Please check the file and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Upload Student Data</Title>
      
      <UploadBox
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FileInput 
          id="file-upload"
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileChange} 
        />
        <UploadLabel htmlFor="file-upload">
          <UploadIcon />
          <div>
            <p style={{ fontWeight: 600, color: '#4f46e5' }}>Click to upload or drag and drop</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Excel files only (.xlsx, .xls)</p>
          </div>
        </UploadLabel>
      </UploadBox>

      {file && (
        <FileInfo>
          <FiFile />
          <span>{file.name}</span>
        </FileInfo>
      )}

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiX />
          {error}
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiCheck />
          File uploaded successfully!
        </SuccessMessage>
      )}

      {studentsData.length > 0 && (
        <>
          <PreviewTable
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Preview ({studentsData.length} students)</h3>
            <Table>
              <thead>
                <tr>
                  <Th>First Name</Th>
                  <Th>Middle Name</Th>
                  <Th>Last Name</Th>
                  <Th>Phone</Th>
                  <Th>Gender</Th>
                  <Th>Age</Th>
                </tr>
              </thead>
              <tbody>
                {studentsData.slice(0, 5).map((student, index) => (
                  <tr key={index}>
                    <Td>{student.firstname}</Td>
                    <Td>{student.middlename || '-'}</Td>
                    <Td>{student.lastname}</Td>
                    <Td>{student.phone}</Td>
                    <Td>{student.gender}</Td>
                    <Td>{student.Age}</Td>
                  </tr>
                ))}
                {studentsData.length > 5 && (
                  <tr>
                    <Td colSpan={6} style={{ textAlign: 'center', color: '#64748b' }}>
                      + {studentsData.length - 5} more records
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </PreviewTable>

          <SubmitButton
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload />
                Confirm Upload
              </>
            )}
          </SubmitButton>
        </>
      )}
    </Container>
  );
};

export default UploadStudents;
