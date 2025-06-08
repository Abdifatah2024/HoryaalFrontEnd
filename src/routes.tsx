
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainRouter from './pages/main';
import SidebarLayout from './pages/sidebar';
import {ProtectedRoute} from './Components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import NotFoundPage from './pages/NotFound';
import Login from './pages/Auth/Login';
import ForgotPassword from './Redux/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './Redux/Auth/ForgotPassword/ResetPassword';
import Logout from './Components/logout';
import Register from './pages/Register';

// User & Profile
import UsersList from './pages/UserList';
import UserSearch from './pages/userprofile';
import UserProfile from './pages/Auth/UserPhoto';
import ChangePassword from './pages/ChangePassword';
import PhotoUpload from './pages/PhotoUpload';

// Student Management
import StudentForm from './pages/Auth/StdReg';
import RegisterMultipleStudents from './pages/Auth/RegisterMultipleStudents';
import UploadStudents from './pages/Auth/UploadStudentFromExcel';
import StudentList from './Redux/Auth/StudentList';
import StudentSearch from './pages/GetOneStudent';
import StudentDetail from './pages/Auth/StudentDetail';
import DeleteStudent from './pages/Auth/SoftDeleteStudent';
import PaymentForm from './pages/Payment/PaymentForm';

// Class Management
import ClassLists from './pages/Auth/ClassStudentList';
import CreateClassForm from './pages/CreateClassForm';
import UpdateClassForm from './pages/Auth/UpdateClassForm';
import ClassList from './pages/Auth/ClassStudentList';

// Attendance
import Attendance from './pages/Auth/Attedence';
import MarkAbsentees from './pages/Auth/AbsentList';
import AttendanceForm from './pages/Auth/DeleteAndUpdateAbsent';
import AbsenceList from './pages/Auth/GetMostStudentAbsent';
import StudentAbsentRecorder from './pages/Attendence/StudentAbsentRecorderPerClass';

// Discipline
import DisciplinePage from './pages/Auth/Decipline/DisciplineList';
import StudentDisciplinePage from './pages/Auth/Decipline/StudentDisciplinePage';

// Exams
import ExamPage from './pages/Exam/ExamPage';
import RegisterTenSubjects from './pages/Exam/RegisterTenSubjects';
import StudentExams from './pages/Exam/StudentExams';
import ExamReport from './pages/Exam/ExamReport';
import ExamReportFinal from './pages/Exam/ExamFinalreport';
import ExamMidtermReport from './pages/Exam/ExamReportMidterm';
import YearlyProgressReport from './pages/Exam/YearlyProgressReport';
import RegisterExam from './pages/Exam/RegisterExam';
import UpdateStudentScores from './pages/Exam/UpdateStudentScores';
import RegisterExamFoTeacher from './pages/Exam/RegisterExam For Teacher';
import TeacherAssignmentManager from './pages/Exam/TeacherAssignmentManager';
import TeacherManagementPanel from './pages/Exam/TeacherManagementPanel';
import UpdateStudentScoreForm from './pages/Exam/UpdateStudentScorePanel';
import TeacherDashboard from './pages/Employee/teacherDashboard';

// Employees
import EmployeeForm from './pages/Employee/EmployeeForm';
import AllEmployeesList from './pages/Employee/AllEmployeesList';
import RegisterTeacher from './pages/Employee/RegisterTeacher';

// Class-based student views
import StudentClassListStd from './pages/Classes/GetStudentInsideClass';
import StudentClassListStd2 from './pages/Attendence/StudentClassListStd';

// Dashboard
import Dashboard from './pages/dashboard';

// Attendance views
import AbsentStudentsByDate from './pages/Attendence/AbsentStudentsByDate';

// Parent
import ParentDashboard from './pages/Auth/ParentDashboard';

// Types
import { Role } from '../src/types/Login';
import UpdateParentForm from './Redux/Epmloyee/updateParent';
import EmployeeAdvancePage from './pages/Employee/EmployeeAdvancePage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import FinancialReportsPage from './pages/Financial Reports/FinancialReportsPage';
import UnpaidStudentsList from './pages/Payment/UnpaidStudentsList';
import SameBusStudents from './pages/Auth/SameBusStudents';
import ExpenseSummaryPage from './pages/Expenses/ExpenseSummaryPage';
import FamilyFeePayment from './pages/Payment/FamilyFeePayment';
import DiscountList from './pages/Payment/DiscountList';
import PaymentAllocationList from './pages/Payment/PaymentAllocationList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainRouter />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <Login /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password', element: <ResetPassword /> },
           { path: '/auth/reset-password', element: <ResetPassword/> },
        ],
      },
      { path: 'logout', element: <Logout /> },
      {
        path: 'parent-dashboard',
        element: <ProtectedRoute allowedRoles={[Role.PARENT]} />,
        children: [
          { index: true, element: <ParentDashboard /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher, Role.USER]} />,
        children: [
          {
            path: 'dashboard',
            element: <SidebarLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
                children: [
                  { path: 'register', element: <Register /> },
                  { path: 'user/list', element: <UsersList /> },
                  { path: 'DeleteStd', element: <DeleteStudent /> },
                  { path: 'CeateClass', element: <CreateClassForm /> },
                  { path: 'UpdateClass', element: <UpdateClassForm /> },
                  { path: 'ExamPerformance', element: <ExamReport /> },
                  { path: 'CustomReports', element: <UserSearch /> },
                  { path: 'CreateEmployee', element: <EmployeeForm /> },
                  { path: 'AllEmployeesList', element: <AllEmployeesList /> },
                  { path: 'DeleteAttendace', element: <AttendanceForm /> },
                  { path: 'RegisterTenSubjects', element: <RegisterTenSubjects /> },
                  { path: 'ExamRoute', element: <ExamPage /> },
                  { path: 'GetTobAbsent', element: <AbsenceList /> },
                  { path: 'AssignTeacherClass', element: <TeacherAssignmentManager /> },
                  { path: 'RegisterTeacher', element: <RegisterTeacher /> },
                  { path: 'TeacherManagement', element: <TeacherManagementPanel/> },
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.Teacher]} />,
                children: [
                  { path: 'RegiterExamForTeacher', element: <RegisterExamFoTeacher /> },
                  { path: 'updateScore', element: <UpdateStudentScoreForm/>},
                  { path: 'Permissions', element: <TeacherDashboard/>}
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher]} />,
                children: [
                  { path: 'getExam', element: <StudentExams /> },
                  { path: 'GetOneStudent', element: <StudentDetail /> },
                  { path: 'ClassListStd', element: <ClassLists /> },
                  { path: 'RegisterTenSubjects', element: <RegisterTenSubjects /> },
                  { path: 'ExamRoute', element: <ExamPage /> },
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
                children: [
                  { path: 'regstd', element: <StudentForm /> },
                  { path: 'UploadStudents', element: <UploadStudents /> },
                  { path: 'RegisterMulti', element: <RegisterMultipleStudents /> },
                  { path: 'GetOneStudent', element: <StudentDetail /> },
                  { path: 'AttendceListPerClass', element: <StudentAbsentRecorder /> },
                  { path: 'Attedence', element: <Attendance /> },
                  { path: 'GetTobAbsent', element: <AbsenceList /> },
                  { path: 'Decipline', element: <DisciplinePage /> },
                  { path: 'GetOneStudentDecipline', element: <StudentDisciplinePage /> },
                  { path: 'MarkAtetendenceClass', element: <StudentClassListStd2 /> },
                  { path: 'PaidFee', element: <PaymentForm /> },
                  { path: 'AbsentByDate', element: <AbsentStudentsByDate /> },
                  { path: 'UpdateExam', element: <UpdateStudentScores /> },
                  { path: 'UpdateStudentParent', element: <UpdateParentForm /> },
                  { path: 'EmolpoyeeAdvacne', element: <EmployeeAdvancePage/> },
                  { path: 'ExpensesManagement', element: <ExpensesPage/> },
                  { path: 'StudentWithBalance', element: <UnpaidStudentsList/> },
                  { path: 'StudentWithSameBus', element: <SameBusStudents/> },
                  { path: 'ExpensesSummary', element: <ExpenseSummaryPage/> },
                  { path: 'FamilyPayment', element: <FamilyFeePayment/> },
                  { path: 'DiscountList', element: <DiscountList/> },
                  { path: 'UpdatedPayment', element: <PaymentAllocationList/> },

                  { path: 'FinancialReport', element: <FinancialReportsPage
/> },


                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher, Role.USER]} />,
                children: [
                  { path: 'systemInfo', element: <Dashboard /> },
                  { path: 'userinfo', element: <UserSearch /> },
                  { path: 'ChangePassword', element: <ChangePassword /> },
                  { path: 'userPhoto', element: <UserProfile /> },
                  { path: 'upload/photo', element: <PhotoUpload /> },
                  { path: 'Final Student', element: <YearlyProgressReport /> },
                  { path: 'GetReportMidterm', element: <ExamMidtermReport /> },
                  { path: 'FinalReport', element: <ExamReportFinal /> },
                  { path: 'ListStd', element: <StudentList /> },
                  { path: 'GetStudentInclass', element: <StudentClassListStd/> },
                  { path: 'ClassListStd', element: <ClassList /> },
                  { path: 'ClassReports', element: <ClassLists /> },
                  { path: 'DisciplinaryReports', element: <DisciplinePage /> },
                  { path: 'RegiterExam', element: <RegisterExam /> },
                  { path: 'TodayAbsent', element: <AbsentStudentsByDate/> },
                 
                ],
              }
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
