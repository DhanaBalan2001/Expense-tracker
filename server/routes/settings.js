import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getSettings, 
  updateSettings, 
  updateSetting 
} from '../controllers/settings.js';

const router = express.Router();

// Protect all settings routes
router.use(protect);

router.get('/', getSettings);
router.put('/', updateSettings);
router.patch('/', updateSetting);

export default router;
