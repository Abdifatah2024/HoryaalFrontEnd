// types/index.ts
export interface User {
  fullName: string;
}

export interface Student {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  fullname: string;
  classId: number;
  phone: string;
  gender: string;
  Age: number;
  fee: number;
  Amount: number;
  status: string;
  absentCount: number;
  lastWarningDate: string | null;
  isdeleted: boolean;
  userid: number;
  user: User;
}

export interface ClassItem {
  id: number;
  name: string;
  userid: number;
  Student: Student[];
}
