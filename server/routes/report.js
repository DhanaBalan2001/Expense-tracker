import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateReport } from '../controllers/report.js';

const router = express.Router();
router.use(protect);
router.get('/generate', generateReport);
export default router;
