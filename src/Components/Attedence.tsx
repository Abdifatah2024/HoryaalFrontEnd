import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import {
  markAttendance,
  fetchAttendanceRecords,
  updateAttendanceRecord,
  clearAttendanceRecords,
  selectAttendanceRecords,
  selectAttendanceMarkStatus
} from '../Redux/Auth/AttedenceSlice'; // <-- make sure filename is correct

const AttendanceComponent = ({ studentId }: { studentId: number }) => {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAttendanceRecords);
  const markStatus = useAppSelector(selectAttendanceMarkStatus);

  useEffect(() => {
    // dispatch(fetchAttendanceRecords(studentId));
    dispatch(fetchAttendanceRecords({ studentId }));

    return () => {
      dispatch(clearAttendanceRecords());
    };
  }, [dispatch, studentId]);

  const handleMarkAttendance = (present: boolean, remark: string) => {
    dispatch(markAttendance({ studentId, present, remark }));
  };

  const handleUpdateRecord = (id: number, present: boolean, remark: string) => {
    dispatch(updateAttendanceRecord({ id, present, remark }));
  };

  return (
    <div>
      <h3>Attendance Records</h3>
      {markStatus === 'loading' && <p>Marking attendance...</p>}
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            Date: {record.date} | Present: {record.present ? 'Yes' : 'No'} | Remark: {record.remark}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceComponent;
