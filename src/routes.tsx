
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
import StudentForm from './pages/Auth/StudentRegister';
import RegisterMultipleStudents from './pages/Auth/RegisterMultipleStudents';
import UploadStudents from './pages/Auth/UploadStudentFromExcel';
import StudentList from './Redux/Auth/StudentList';
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
// import MarkAbsentees from './pages/Auth/AbsentList';
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
import StudentBusList from './pages/Auth/StudentBusList';
import PdfUpload from './pages/PdfFiles/PdfUpload';
import PdfDocumentsList from './pages/PdfFiles/DocumentsPage';
import EmployeeAdvanceComponent from './pages/Employee/EmployeeAdvanceComponent';
import FamilyPayment from './pages/Payment/FamilyPayment';
import ManageAnnouncements from './pages/ManageAnnouncements';
import AdminAnnouncements from './pages/announcement/AdminAnnouncements';
import WorkPlanList from './pages/WorkPlan/WorkPlanList';
import WorkPlanCommentsPage from './pages/WorkPlan/WorkPlanCommentsPage';
import ManageTransfer from './pages/Auth/Students/ManageTransfer';
import EmployeeAdvanceBalance from './pages/Employee/EmployeeAdvanceBalance';
import AllEmployeeAdvances from './pages/Employee/AllEmployeeAdvances';
import AttendanceReport from './pages/Attendence/AttendanceReport';
import { DailyAttendanceOverview } from './pages/Attendence/DailyAttendanceOverview';
import { ClassAbsentDashboard } from './pages/Attendence/ClassAttendanceSummary';
import { ClassMonthlyAttendanceSummary } from './pages/Attendence/ClassMonthlyAttendanceSummary';
import AssetManager from './Redux/Auth/Asset/AssetManager';
import AssetReport from './Redux/Auth/Asset/AssetReport';
import VoucherList from './pages/Financial Reports/VoucherList';
import UserPaymentCollection from './pages/Financial Reports/UserPaymentCollection';
import BusFeeExemptions from './pages/BusFeeExemptions';
import BusFeeSummaryPage from './pages/Bus/BusIncomeSummary';
import BusManagementPage from './pages/Bus/Busmanagement';
import AssignStudentToBus from './pages/Bus/AssignStudentToBus';
import Unauthorized from './Components/NonAuht';
import TeacherSchemeUpload from './pages/WorkPlan/TeacherSchemeUpload';
import SoftDeletedStudents from './Redux/Student/SoftDeletedStudents';
import RestoredStudentsPage from './Redux/Student/RestoredStudentsPage';
import DiscountLimitManager from './pages/Payment/DiscountLimitManager';
import EmployeeAttendance from './pages/Employee/EmployeeAttendance';
import EmployeeAttendanceReport from './pages/Employee/Employee Attendance Report';
import EmployeeYearlyAttendanceOnly from './pages/Employee/EmployeeYearlyReportAtt';
import ProfitLogManager from './Redux/AccountingFiles/ProfitAndLedger';
import CashLedgerList from './Redux/AccountingFiles/CashLedgerList';
import StudentBalanceList from './pages/Payment/StudentBalanceList';
import LastGlobalPayment from './Redux/Payment/LastGlobalPayment';
import PayRemainingSalaries from './pages/Employee/PayRemainingSalaries';
import UploadExamScoresShort from './pages/Exam/UploadExamScoresShort';

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
      { path: 'unauthorized', element: <Unauthorized/> },
      {
        path: 'parent-dashboard',
        element: <ProtectedRoute allowedRoles={[Role.PARENT]} />,
        children: [
          { index: true, element: <ParentDashboard /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher, Role.USER, Role.ACADEMY]} />,
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
                  { path: 'CreateEmployee', element: <EmployeeForm /> },
                  { path: 'user/list', element: <UsersList /> },
                  { path: 'DeleteStd', element: <DeleteStudent /> },
                  { path: 'CeateClass', element: <CreateClassForm /> },
                  { path: 'UpdateClass', element: <UpdateClassForm /> },
                
                  { path: 'CustomReports', element: <UserSearch /> },
                  { path: 'CreateEmployee', element: <EmployeeForm /> },
                 
                  { path: 'DeleteAttendace', element: <AttendanceForm /> },
                  { path: 'RegisterTenSubjects', element: <RegisterTenSubjects /> },
                  { path: 'ExamRoute', element: <ExamPage /> },
                 
                  { path: 'AssignTeacherClass', element: <TeacherAssignmentManager /> },
                  { path: 'RegisterTeacher', element: <RegisterTeacher /> },
                  { path: 'TeacherManagement', element: <TeacherManagementPanel/> },
                  { path: 'DropOut', element: <SoftDeletedStudents/> },
                  { path: 'Restored', element: <RestoredStudentsPage/> },
                  { path: 'DiscountManagement', element: <DiscountLimitManager/> },
                  { path: 'ProfitManager', element: <ProfitLogManager/> },
                  { path: 'Ledger', element: <CashLedgerList/> },
                  

                ],
              },
              {
  element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.USER, Role.ACADEMY]} />,
  children: [
     { path: 'Announcements', element: <ManageAnnouncements/> },
      { path: 'AllEmployeesList', element: <AllEmployeesList /> },
     { path: 'AnnouncementsList', element: <AdminAnnouncements/> },
      { path: 'EmployeeAttendance', element: <EmployeeAttendance /> },
          { path: 'getExam', element: <StudentExams /> },
           { path: 'RegisterTenSubjects', element: <RegisterTenSubjects /> },
                  { path: 'ExamRoute', element: <ExamPage /> },
                    { path: 'ListStd', element: <StudentList /> },
                     { path: 'CheckTransfer', element: < ManageTransfer/> },
                        { path: 'FinalReport', element: <ExamReportFinal /> },
            { path: 'DisciplinaryReports', element: <DisciplinePage /> },
              { path: 'AbsentByDate', element: <AbsentStudentsByDate /> },
                { path: 'ExamPerformance', element: <ExamReport /> },
                  { path: 'EmployeAttReport', element: <EmployeeAttendanceReport/> },       
                  { path: 'AllEmployeesList', element: <AllEmployeesList /> },
                   { path: 'EmployeeAttendance', element: <EmployeeAttendance /> },
                  { path: 'UploadStudents', element: <UploadStudents /> },
                  { path: 'RegisterMulti', element: <RegisterMultipleStudents /> },
                  { path: 'GetOneStudent', element: <StudentDetail /> },
                  { path: 'AttendceListPerClass', element: <StudentAbsentRecorder /> },
                  { path: 'Attedence', element: <Attendance /> },
                  { path: 'GetTobAbsent', element: <AbsenceList /> },
                  { path: 'Decipline', element: <DisciplinePage /> },
                  { path: 'GetOneStudentDecipline', element: <StudentDisciplinePage /> },
                  { path: 'MarkAtetendenceClass', element: <StudentClassListStd2 /> },
                    { path: 'AbsentReport', element: <AttendanceReport /> },
                      { path: 'MonthAttendceReport', element: <ClassAbsentDashboard /> },
                       { path: 'ClassAttendenceReport', element: <ClassMonthlyAttendanceSummary/> },
                  { path: 'UpdateExam', element: <UpdateStudentScores /> },
                   { path: 'GetTobAbsent', element: <AbsenceList /> },
                    { path: 'StudentWithSameBus', element: <SameBusStudents/> },
                        { path: 'StudentBusses', element: <StudentBusList/> },
                          { path: 'BusIncomeSummary', element: <BusFeeSummaryPage/> },
                            { path: 'BusCrud', element: <BusManagementPage/> },
                              { path: 'AssignStudentBus', element: <AssignStudentToBus/> },
                                 { path: 'busfeeWithNoPayment', element: <BusFeeExemptions/> },
                
    // ⬇️ Add shared routes here
  ],
},
{
  element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ACADEMY]} />,
  children: [
    // ⬇️ Add admin + academy only routes here
      { path: 'RegiterExam', element: <RegisterExam /> },
       { path: 'GetReportMidterm', element: <ExamMidtermReport /> },
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
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher, Role.ACADEMY]} />,
                children: [
                   { path: 'GetStudentInclass', element: <StudentClassListStd/> },
              
                  { path: 'GetOneStudent', element: <StudentDetail /> },
                  { path: 'ClassListStd', element: <ClassLists /> },
                 
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
                children: [
                 
                  { path: 'regstd', element: <StudentForm /> },
                  { path: 'LastPayment', element: <LastGlobalPayment/> },
                  { path: 'BalancePerMonth', element: <StudentBalanceList /> },
                  { path: 'PayRemainSalary', element: <PayRemainingSalaries /> },
                     { path: 'UploadExam', element: <UploadExamScoresShort/> },
                
                  { path: 'AttendeceYearlyReport', element: <EmployeeYearlyAttendanceOnly/> },
                
                  { path: 'PaidFee', element: <PaymentForm /> },
                
                  { path: 'DailyAttendceReport', element: <DailyAttendanceOverview /> },
                
                 
                  { path: 'UpdateStudentParent', element: <UpdateParentForm /> },
                  { path: 'EmolpoyeeAdvacne', element: <EmployeeAdvancePage/> },
                  { path: 'AllEmployeeAdvance', element: <AllEmployeeAdvances/> },
                  { path: 'ExpensesManagement', element: <ExpensesPage/> },
                  { path: 'StudentWithBalance', element: <UnpaidStudentsList/> },
                 
                  { path: 'ExpensesSummary', element: <ExpenseSummaryPage/> },
                  { path: 'FamilyPayment', element: <FamilyFeePayment/> },
                  { path: 'DiscountList', element: <DiscountList/> },
                  { path: 'UpdatedPayment', element: <PaymentAllocationList/> },
              
                  { path: 'UploadPdf', element: <PdfUpload/> },
                  { path: 'AdvanceDetail', element: <EmployeeAdvanceComponent/> },
                  { path: 'FamilyPaypayment', element: <FamilyPayment/> },
                  { path: 'WorkPlan', element: <WorkPlanList/> },
                { path: 'WorkPlanAndComment', element: < WorkPlanCommentsPage/> },
               
                { path: 'EmployeeAvanceRemainder', element: < EmployeeAdvanceBalance/> },
                { path: 'AssetManager', element: < AssetManager/> },
                { path: 'AssetReport', element: <AssetReport/> },
                { path: 'VoucherList', element: <VoucherList/> },
                { path: 'UserCollection', element: <UserPaymentCollection/> },
             
              
              
              

               

                  { path: 'FinancialReport', element: <FinancialReportsPage
/> },


                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.Teacher, Role.USER]} />,
                children: [
                  { path: 'systemInfo', element: <Dashboard /> },
                   { path: 'UploadScheme', element: <TeacherSchemeUpload /> },
                  { path: 'userinfo', element: <UserSearch /> },
                  { path: 'ChangePassword', element: <ChangePassword /> },
                  { path: 'userPhoto', element: <UserProfile /> },
                  { path: 'upload/photo', element: <PhotoUpload /> },
                  { path: 'Final Student', element: <YearlyProgressReport/> },
                  { path: 'GetReportMidterm', element: <ExamMidtermReport /> },
               
                
                 
                  { path: 'ClassListStd', element: <ClassList /> },
                  { path: 'ClassReports', element: <ClassLists /> },
                
                
                  { path: 'TodayAbsent', element: <AbsentStudentsByDate/> },
                     { path: 'Rules', element: <PdfDocumentsList/> },
                     
                 
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
