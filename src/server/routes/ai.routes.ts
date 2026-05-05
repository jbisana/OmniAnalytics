import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.ts';

const router = Router();

router.post('/marketing-insights', aiController.getMarketingInsights);
router.post('/product-recommendations', aiController.getProductRecommendations);
router.post('/detect-anomalies', aiController.detectAnomalies);
router.post('/procurement-insights', aiController.getProcurementInsights);
router.post('/partner-segments', aiController.getPartnerSegments);
router.post('/extract-contract', aiController.extractContract);

export default router;
