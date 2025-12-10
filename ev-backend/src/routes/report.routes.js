import { Router } from 'express';
import { getAllReports, getReportById, createReport, deleteReport } from '../controllers/report.controller.js';

const router = Router();

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.delete('/:id', deleteReport);

export default router;