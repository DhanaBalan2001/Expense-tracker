import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget,
  getBudgetOverview
} from '../controllers/budget.js';

const router = express.Router();

// Protect all budget routes
router.use(protect);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.get('/overview', getBudgetOverview);

export default router;
