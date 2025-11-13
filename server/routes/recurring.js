import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  scheduleRecurringExpense,
  getRecurringExpenses,
  updateRecurring,
  deleteRecurring 
} from '../controllers/recurring.js';

const router = express.Router();
router.use(protect);

router.post('/', scheduleRecurringExpense);
router.get('/', getRecurringExpenses);
router.put('/:id', updateRecurring);
router.delete('/:id', deleteRecurring);
export default router;
