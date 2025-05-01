// import { createBrowserRouter } from 'react-router-dom';
// import MainRouter from './pages/main';
// import Home from './pages/Home';
// import NotFoundPage from './pages/NotFound';
// import Login from './pages/Auth/Login';
// import ForgotPassword from './Redux/Auth/ForgotPassword/ForgotPassword'; // ✅ new
// import ResetPassword from './Redux/Auth/ForgotPassword/ResetPassword';   // ✅ new
// import Logout from './Components/logout';
// import Register from './pages/Register';
// import UsersList from './pages/UserList';
// import UserSearch from './pages/userprofile';
// import SidebarLayout from './pages/sidebar';
// import StudentForm from './pages/Auth/StdReg';
// import StudentList from './Redux/Auth/StudentList';
// import ClassList from './pages/ClassList';
// import StudentSearch from './pages/GetOneStudent';
// import ChangePassword from './pages/ChangePassword';
// import PhotoUpload from './pages/PhotoUpload';
// import CreateClassForm from './pages/CreateClassForm';
// import StudentDetail from './pages/Auth/StudentDetail';
// import UpdateClassForm from './pages/Auth/UpdateClassForm';
// import DeleteStudent from './pages/Auth/SoftDeleteStudent';
// import ProtectedRoute from './components/ProtectedRoute';
// import Attendance from './pages/Auth/Attedence';
// import AbsentList from './pages/Auth/AbsentList';
// import MarkAbsentees from './pages/Auth/AbsentList';
// import AttendanceForm from './pages/Auth/DeleteAndUpdateAbsent';
// import UserProfile from './pages/Auth/UserPhoto';
// import AbsenceList from './pages/Auth/GetMostStudentAbsent';
// import RegisterMultipleStudents from './pages/Auth/RegisterMultipleStudents';
// import ClassLists from './pages/Auth/ClassStudentList';
// import DisciplinePage from './pages/Auth/Decipline/DisciplineList';
// import StudentDisciplinePage from './pages/Auth/Decipline/StudentDisciplinePage';
// import UploadStudents from './pages/Auth/UploadStudentFromExcel';
// import StudentAbsentRecorder from './pages/Attendence/StudentAbsentRecorderPerClass';
// import ExamPage from './pages/Exam/ExamPage';
// import RegisterTenSubjects from './pages/Exam/RegisterTenSubjects';

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainRouter />,
//     children: [
//       {
//         index: true,
//         element: <Home />
//       },
//       {
//         path: "auth",
//         children: [
//           {
//             path: "login",
//             element: <Login />
//           },
//           {
//             path: "forgot-password", // ✅ Added forgot password page
//             element: <ForgotPassword/>
//           },
//           {
//             path: "reset-password", // ✅ Added reset password page
//             element: <ResetPassword/>
//           }
//         ]
//       },
//       {
//         path: "logout",
//         element: <Logout />
//       },
//       {
//         path: "register",
//         element: <Register />
//       },
//             {
//         // Protected dashboard routes
//         element: <ProtectedRoute />,
//         children: [
//           { path: "RegisterTenSubjects", 
//             element: <RegisterTenSubjects/> },
//           {
//             path: "dashboard",
//             element: <SidebarLayout />,
//             children: [
//               { path: "user/list", element: <UsersList /> },
//               { path: "ClassListStd", element: <ClassLists /> },
//               { path: "userPhoto", element: <UserProfile /> },
//               { path: "DeleteStd", element: <DeleteStudent /> },
//               { path: "register", element: <Register /> },
//               { path: "Attedence", element: <Attendance /> },
//               { path: "GetTobAbsent", element: <AbsenceList /> },
//               { path: "AttendceList", element: <AbsentList /> },
//               { path: "AttendceListPerClass", element: <StudentAbsentRecorder /> },
//               { path: "DeleteAttendace", element: <AttendanceForm /> },
//               { path: "Markabsent", element: <MarkAbsentees /> },
//               { path: "Decipline", element: <DisciplinePage /> },
//               { path: "GetOneStudentDecipline", element: <StudentDisciplinePage /> },
//               { path: "logout", element: <Logout /> },
//               { path: "userinfo", element: <UserSearch /> },
//               { path: "regstd", element: <StudentForm /> },
//               { path: "UploadStudents", element: <UploadStudents/> },
//               { path: "RegisterMulti", element: <RegisterMultipleStudents /> },
//               { path: "ListStd", element: <StudentList /> },
//               { path: "ChangePassword", element: <ChangePassword /> },
//               { path: "upload/photo", element: <PhotoUpload /> },
//               { path: "CeateClass", element: <CreateClassForm /> },
//               { path: "UpdateClass", element: <UpdateClassForm /> },
//               { path: "GetOneStudent", element: <StudentDetail /> },
//               { path: "ExamRoute", element: <ExamPage /> },
//               { path: "RegisterTenSubjects", element: <RegisterTenSubjects/> },
//               { path: "RegisterTenSubjects", element: <RegisterTenSubjects/> }
              
//             ]
//           }
//         ]
//       },
//       {
//         path: "*",
//         element: <NotFoundPage />
//       }
//     ]
//   }
// ]);
import { createBrowserRouter } from 'react-router-dom';
import MainRouter from './pages/main';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFound';
import Login from './pages/Auth/Login';
import ForgotPassword from './Redux/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './Redux/Auth/ForgotPassword/ResetPassword';
import Logout from './Components/logout';
import Register from './pages/Register';
import UsersList from './pages/UserList';
import UserSearch from './pages/userprofile';
import SidebarLayout from './pages/sidebar';
import StudentForm from './pages/Auth/StdReg';
import StudentList from './Redux/Auth/StudentList';
import ClassLists from './pages/Auth/ClassStudentList';
import StudentSearch from './pages/GetOneStudent';
import ChangePassword from './pages/ChangePassword';
import PhotoUpload from './pages/PhotoUpload';
import CreateClassForm from './pages/CreateClassForm';
import StudentDetail from './pages/Auth/StudentDetail';
import UpdateClassForm from './pages/Auth/UpdateClassForm';
import DeleteStudent from './pages/Auth/SoftDeleteStudent';
import ProtectedRoute from './components/ProtectedRoute';
import Attendance from './pages/Auth/Attedence';
import AbsentList from './pages/Auth/AbsentList';
import MarkAbsentees from './pages/Auth/AbsentList';
import AttendanceForm from './pages/Auth/DeleteAndUpdateAbsent';
import UserProfile from './pages/Auth/UserPhoto';
import AbsenceList from './pages/Auth/GetMostStudentAbsent';
import RegisterMultipleStudents from './pages/Auth/RegisterMultipleStudents';
import DisciplinePage from './pages/Auth/Decipline/DisciplineList';
import StudentDisciplinePage from './pages/Auth/Decipline/StudentDisciplinePage';
import UploadStudents from './pages/Auth/UploadStudentFromExcel';
import StudentAbsentRecorder from './pages/Attendence/StudentAbsentRecorderPerClass';
import ExamPage from './pages/Exam/ExamPage';
import RegisterTenSubjects from './pages/Exam/RegisterTenSubjects';
import ClassList from './pages/ClassList'; // ✅ NEW
import StudentExams from './pages/Exam/StudentExams'; // ✅ NEW
import ExamReport from './pages/Exam/ExamReport';
import ExamReportFinal from './pages/Exam/ExamFinalreport';
import ExamMidtermReport from './pages/Exam/ExamReportMidterm';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "auth",
        children: [
          { path: "login", element: <Login /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password", element: <ResetPassword /> },
        ]
      },
      { path: "logout", element: <Logout /> },
      { path: "register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "RegisterTenSubjects", element: <RegisterTenSubjects /> },
          {
            path: "dashboard",
            element: <SidebarLayout />,
            children: [
              { path: "user/list", element: <UsersList /> },
              { path: "ClassListStd", element: <ClassLists /> },
              { path: "userPhoto", element: <UserProfile /> },
              { path: "DeleteStd", element: <DeleteStudent /> },
              { path: "register", element: <Register /> },
              { path: "Attedence", element: <Attendance /> },
              { path: "GetTobAbsent", element: <AbsenceList /> },
              { path: "AttendceList", element: <AbsentList /> },
              { path: "AttendceListPerClass", element: <StudentAbsentRecorder /> },
              { path: "DeleteAttendace", element: <AttendanceForm /> },
              { path: "Markabsent", element: <MarkAbsentees /> },
              { path: "Decipline", element: <DisciplinePage /> },
              { path: "GetOneStudentDecipline", element: <StudentDisciplinePage /> },
              { path: "userinfo", element: <UserSearch /> },
              { path: "regstd", element: <StudentForm /> },
              { path: "UploadStudents", element: <UploadStudents /> },
              { path: "RegisterMulti", element: <RegisterMultipleStudents /> },
              { path: "ListStd", element: <StudentList /> },
              { path: "ChangePassword", element: <ChangePassword /> },
              { path: "upload/photo", element: <PhotoUpload /> },
              { path: "CeateClass", element: <CreateClassForm /> },
              { path: "UpdateClass", element: <UpdateClassForm /> },
              { path: "GetOneStudent", element: <StudentDetail /> },
              { path: "ExamRoute", element: <ExamPage /> },

              // ✅ NEW Routes added for listing classes and exams
              { path: "ClassList", element: <ClassLists /> },
              { path: "getExam", element: <StudentExams /> },
              { path: "GetReportMidterm", element: <ExamMidtermReport /> },
              { path: "ExamReport", element: <ExamReport /> },
              { path: "RegisterTenSubjects", element: <RegisterTenSubjects /> },
              { path: "FinalReport", element: <ExamReportFinal /> },
            ]
          }
        ]
      },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
