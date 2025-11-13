import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount 
} from '../controllers/profile.js';

const router = express.Router();

// Protect all profile routes
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/change-password', changePassword);
router.delete('/', deleteAccount);

export default router;
