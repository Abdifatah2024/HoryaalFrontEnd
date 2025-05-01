export interface AttendanceData {
  studentId: number;
  present: boolean;
  remark: string;
}

export interface AttendanceResponse {
  id: number;
  date: string; // or use Date if you'll parse it to a Date object
  present: boolean;
  remark: string;
  studentId: number;
  userId: number;
  user: {
    fullName: string;
  };
}

export interface AttendanceState {
  loading: boolean;
  error: string | null;
  attendance: AttendanceResponse | null;
}
