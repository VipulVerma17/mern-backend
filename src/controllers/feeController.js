import { createFeeRecord, deleteFeeRecord, isDatabaseReady, listFees, updateFeeRecord } from '../dataStore.js';

export const getFees = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      return res.json(listFees());
    }
    return res.json(listFees());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFee = async (req, res) => {
  try {
    const record = createFeeRecord(req.body);
    return res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFee = async (req, res) => {
  try {
    const record = updateFeeRecord(req.params.id, req.body);
    return res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFee = async (req, res) => {
  try {
    deleteFeeRecord(req.params.id);
    return res.json({ message: 'Fee record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
