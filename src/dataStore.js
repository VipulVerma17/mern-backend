import mongoose from 'mongoose';

const memoryStore = {
  users: [],
  students: [],
  faculty: [],
  courses: [],
  attendance: [],
  fees: [],
  notices: []
};

let databaseReady = false;

export const setDatabaseReady = (value) => {
  databaseReady = value;
};

export const isDatabaseReady = () => databaseReady;

export const listUsers = () => memoryStore.users;
export const findUserByEmail = (email) => memoryStore.users.find((user) => user.email === email);
export const createUserRecord = (user) => {
  const record = { ...user, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.users.unshift(record);
  return record;
};

export const listStudents = () => memoryStore.students;
export const createStudentRecord = (student) => {
  const record = { ...student, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.students.unshift(record);
  return record;
};
export const updateStudentRecord = (id, updates) => {
  const index = memoryStore.students.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.students[index] = { ...memoryStore.students[index], ...updates };
  return memoryStore.students[index];
};
export const deleteStudentRecord = (id) => {
  memoryStore.students = memoryStore.students.filter((item) => item._id !== id);
};

export const listFaculty = () => memoryStore.faculty;
export const createFacultyRecord = (faculty) => {
  const record = { ...faculty, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.faculty.unshift(record);
  return record;
};
export const updateFacultyRecord = (id, updates) => {
  const index = memoryStore.faculty.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.faculty[index] = { ...memoryStore.faculty[index], ...updates };
  return memoryStore.faculty[index];
};
export const deleteFacultyRecord = (id) => {
  memoryStore.faculty = memoryStore.faculty.filter((item) => item._id !== id);
};

export const listCourses = () => memoryStore.courses;
export const createCourseRecord = (course) => {
  const record = { ...course, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.courses.unshift(record);
  return record;
};
export const updateCourseRecord = (id, updates) => {
  const index = memoryStore.courses.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.courses[index] = { ...memoryStore.courses[index], ...updates };
  return memoryStore.courses[index];
};
export const deleteCourseRecord = (id) => {
  memoryStore.courses = memoryStore.courses.filter((item) => item._id !== id);
};

export const listAttendance = () => memoryStore.attendance;
export const createAttendanceRecord = (entry) => {
  const record = { ...entry, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.attendance.unshift(record);
  return record;
};
export const updateAttendanceRecord = (id, updates) => {
  const index = memoryStore.attendance.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.attendance[index] = { ...memoryStore.attendance[index], ...updates };
  return memoryStore.attendance[index];
};
export const deleteAttendanceRecord = (id) => {
  memoryStore.attendance = memoryStore.attendance.filter((item) => item._id !== id);
};

export const listFees = () => memoryStore.fees;
export const createFeeRecord = (entry) => {
  const record = { ...entry, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.fees.unshift(record);
  return record;
};
export const updateFeeRecord = (id, updates) => {
  const index = memoryStore.fees.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.fees[index] = { ...memoryStore.fees[index], ...updates };
  return memoryStore.fees[index];
};
export const deleteFeeRecord = (id) => {
  memoryStore.fees = memoryStore.fees.filter((item) => item._id !== id);
};

export const listNotices = () => memoryStore.notices;
export const createNoticeRecord = (entry) => {
  const record = { ...entry, _id: String(Date.now()), createdAt: new Date() };
  memoryStore.notices.unshift(record);
  return record;
};
export const updateNoticeRecord = (id, updates) => {
  const index = memoryStore.notices.findIndex((item) => item._id === id);
  if (index === -1) return null;
  memoryStore.notices[index] = { ...memoryStore.notices[index], ...updates };
  return memoryStore.notices[index];
};
export const deleteNoticeRecord = (id) => {
  memoryStore.notices = memoryStore.notices.filter((item) => item._id !== id);
};
