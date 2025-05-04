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
import studentUodateDelete from "../Redux/Auth/StudentSlice";
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
import progressReportReducer from "../Redux/Exam/progressReportSlice";
import employeeReducer from "../Redux/Epmloyee/employeeSlice";
import employeeListReducer from "../Redux/Epmloyee/employeeListSlice";
import ListStdinClass from "../Redux/Classes/ListStdInClassSlice";
export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice,
    StdRegSlice: studentSlice,
    passwordSlice: passwordSlice,
    photoSlice: photoSlice,
    classSlice: classSlice,
    studentReducer: studentReducer,
    attendance: attendanceReducer,
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
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
