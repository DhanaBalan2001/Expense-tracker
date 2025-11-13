import express from 'express';
import { protect } from '../middleware/auth.js';
import { setFinancialGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goal.js';

const router = express.Router();
router.use(protect);

router.post('/', setFinancialGoal);
router.get('/', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
export default router;
