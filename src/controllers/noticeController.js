import { createNoticeRecord, deleteNoticeRecord, listNotices, updateNoticeRecord } from '../dataStore.js';

export const getNotices = async (_req, res) => {
  try {
    return res.json(listNotices());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const record = createNoticeRecord(req.body);
    return res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const record = updateNoticeRecord(req.params.id, req.body);
    return res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    deleteNoticeRecord(req.params.id);
    return res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
