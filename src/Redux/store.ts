import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Auth/LoginSlice";
import registerSlice from "./Auth/RegisterSlice";
import studentSlice from "./Auth/RegstdSlice";
import passwordSlice from "./passwordSlice";
import photoSlice from "./PhotouploadSlice";
import classSlice from "./Auth/classSlice";
import studentReducer from "./Auth/GetOneStudentsSlice";
import attendanceReducer from "./Auth/AttedenceSlice";
import UpdateClass from "./Auth/updateClassSlice";
import studentClassReducer from "../Redux/Auth/GetOneStudentsSlice";
import deleteStudentReducer from "../Redux/Auth/SofteDeleteSlice";
import studentUodateDelete from "../Redux/Auth/studentSlice";
import AbsentList from "../Redux/Auth/absentListSlice";
import attendReducer from "../Redux/Auth/DeleteAndUpdateSlice";
import userReducer from "../Redux/Auth/userPhotoSlice"; // ✅ this is your user photo slice
import absenceReducer from "../Redux/Auth/GetMostStudentAbsentSlice";
// import classReducer from "../Redux/Auth/ClassStudentListSlice";
import registerStudentsReducer from "../Redux/Auth/RegisterMultiStudentsSlice";
import classReducer from "../Redux/Auth/ClassStudentListSlice";
import disciplineReducer from "../Redux/Auth/Decipline/disciplineSlice";
import studentDiscipline from "../Redux/Auth/Decipline/studentDisciplineSlice";
import authReducer from "../pages/Auth/ResetPassword/authSlice";
import studentDisciplineSlice from "../Redux/Auth/studentUploadSlice";
import attendanceReducerPerClass from "../Redux/Attedence/AttendancePeClassSlice";
import examReducer from "../Redux/Exam/examSlice";
import registerTenSubjects from "../Redux/Exam/registerTenSubjectsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import studentExamsReducer from "../Redux/Exam/studentExamsSlice";
import examReportReducer from "../Redux/Exam/examReportSlice";
import examMidtermReportReducer from "../Redux/Exam/ExamMidtermReportSlice";
import studentScoreReducer from "../Redux/Exam/studentScoreSlice";
import progressReportReducer from "../Redux/Exam/progressReportSlice";
import employeeReducer from "../Redux/Epmloyee/employeeSlice";
import employeeListReducer from "../Redux/Epmloyee/employeeListSlice";
import ListStdinClass from "../Redux/Classes/ListStdInClassSlice";
import registerClassExamReducer from "../Redux/Exam/RegisterExamSlice";
import paymentReducer from "../Redux/Payment/paymentSlice";
import studentListReducer from "../Redux/Auth/Decipline/studentDisciplineSlice";
import studentScoreUpdate from "../Redux/Exam/studentScoreUpdateSlice";

import teacherRegisterReducer from "../Redux/Epmloyee/teacherRegisterSlice";
import teacherManagementReducer from "../Redux/Exam/teacherManagementSlice";
import teacherDashboardReducer from "../Redux/Exam/teacherDashboardSlice";
import attendanceClassPerday from "../Redux/Attedence/AttendancePeClassSlice";
import generateFeesReducer from "../Redux/Payment/FeegenerateSlice";
import studentParent from "../Redux/Parent/ParentstudentSlice";
import advanceReducer from "../Redux/Payment/advanceSlice";
import expenseReducer from "../Redux/Expense/ExpenseSlice";
import financialReducer from "../pages/Financial Reports/financialSlice";
import studentBusReducer from "../Redux/studentBusSlice";
import pdfUploadReducer from "../pages/PdfFiles/PdfUploadSlice";
import employeeAdvanceReducer from "../Redux/Epmloyee/employeeAdvanceSlice";
import familyPaymentReducer from "../Redux/Payment/familyPaymentSlice";
import announcementReducer from "../pages/announcement/announcementSlice";
import workPlanReducer from "../pages/WorkPlan/workPlanSlice";
import assetReducer from "../Redux/Auth/Asset/assetSlice";
import voucherReducer from "../pages/Financial Reports/VoucherSlice";
import busFeeReducer from "../Redux/Auth/busFeeSlice";
import studentSoftDeleteReducer from "../Redux/Student/studentSoftDeleteSlice";
import discountLimitReducer from "../Redux/Payment/discountLimitSlice";
import employeeAttendanceReducer from "../pages/Employee/EmployeeAttendanceSlice";
import profitLogReducer from "../Redux/AccountingFiles/profitLogSlice";
import studentBalanceReducer from "../Redux/Payment/studentBalanceSlice";
import lastPaymentReducer from "../Redux/Payment/lastPaymentSlice";
import profitLogSlice from "../Redux/Epmloyee/payRemainSalarySlice";
import examUploadReducer from "../Redux/Exam/examUploadSlice";
import classListReducer from "../Redux/Auth/studentSlice";
import unpaidFamilyReducer from "../pages/Payment/unpaidFamilySlice";
import paymentNumberHistoryReducer from "../Redux/Payment/paymentNumberHistorySlice"

export const store = configureStore({
  reducer: {
    employeeAttendance: employeeAttendanceReducer,
    studentSoftDelete: studentSoftDeleteReducer,
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice,
    StdRegSlice: studentSlice,
    passwordSlice: passwordSlice,
    photoSlice: photoSlice,
    classSlice: classSlice,
    studentReducer: studentReducer,
    attendance: attendanceClassPerday,
    studentClassUpdate: UpdateClass,
    studentClass: studentClassReducer,
    ListStdinClass: ListStdinClass,
    deleteStudent: deleteStudentReducer,
    studentSlice: studentUodateDelete,
    attendanceSlice: attendanceReducer,
    absentList: AbsentList,
    attend: attendReducer,
    user: userReducer, // ✅ referenced in your component as state.user
    absence: absenceReducer,
    // class: classReducer,
    registerStudents: registerStudentsReducer,
    class: classReducer,
    discipline: disciplineReducer,
    studentDiscipline,
    auth: authReducer,
    studentDisciplineSlice: studentDisciplineSlice,
    attendancePerClass: attendanceReducerPerClass,
    exam: examReducer,
    registerTenSubjects,
    studentExams: studentExamsReducer,
    examReport: examReportReducer,
    midtermReport: examMidtermReportReducer, // register midterm
    progressReport: progressReportReducer,
    employee: employeeReducer,
    employeeList: employeeListReducer,
    registerClassExam: registerClassExamReducer,
    payment: paymentReducer,
    studentList: studentListReducer,
    studentScores: studentScoreReducer,

    teacherRegister: teacherRegisterReducer,

    teacherManagement: teacherManagementReducer,
    studentScore: studentScoreUpdate,
    teacherDashboard: teacherDashboardReducer,
    attendanceClassPerDay: attendanceClassPerday,
    generateFees: generateFeesReducer,
    students: studentParent,
    paymentAdvance: advanceReducer,
    employeeAdvance: employeeAdvanceReducer,
    expenses: expenseReducer,
    financial: financialReducer,
    studentBus: studentBusReducer,
    pdfUpload: pdfUploadReducer,
    familyPayment: familyPaymentReducer,
    announcement: announcementReducer,
    workPlan: workPlanReducer,
    assets: assetReducer,
    voucher: voucherReducer,
    busFee: busFeeReducer,
    discountLimit: discountLimitReducer,
    profitLog: profitLogReducer,
    studentBalance: studentBalanceReducer,
    lastPayment: lastPaymentReducer,
    salaryManagement: profitLogSlice,
    examUpload: examUploadReducer,
    classList: classListReducer,
    unpaidFamily: unpaidFamilyReducer,
      paymentNumberHistory: paymentNumberHistoryReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
