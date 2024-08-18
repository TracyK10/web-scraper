import express from "express";
import { Data } from "../models/Data";
import { error } from "console";

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const data = await Data.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Data.countDocuments();

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical data', error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Scrape data not found', error: 'Scrape data not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scrape data', error: (err as Error).message });
  }
});

export default router;