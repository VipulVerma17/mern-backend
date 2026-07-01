import { createAttendanceRecord, deleteAttendanceRecord, isDatabaseReady, listAttendance, updateAttendanceRecord } from '../dataStore.js';

export const getAttendance = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      return res.json(listAttendance());
    }
    return res.json(listAttendance());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const record = createAttendanceRecord(req.body);
    return res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const record = updateAttendanceRecord(req.params.id, req.body);
    return res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    deleteAttendanceRecord(req.params.id);
    return res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
