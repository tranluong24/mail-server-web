import express from 'express';
import { saveAccount } from '../controllers/accountController.js'; // chỉnh lại đúng path

const router = express.Router();

// Route POST /api/register
router.post('/register', saveAccount);

export default router;
