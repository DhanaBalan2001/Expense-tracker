import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createSharedExpense,
  getSharedExpenses,
  updateSharedExpense,
  deleteSharedExpense,
  settleExpense 
} from '../controllers/sharedexpense.js';

const router = express.Router();
router.use(protect);

router.post('/', createSharedExpense);
router.get('/', getSharedExpenses);
router.put('/:id', updateSharedExpense);
router.delete('/:id', deleteSharedExpense);
router.post('/:id/settle', settleExpense);
export default router;
