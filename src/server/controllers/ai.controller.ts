import { Request, Response } from 'express';
import * as aiService from '../services/ai.service.ts';
import { 
  MarketingInsightsSchema, 
  ProductRecommendationsSchema, 
  AnomalyDetectionSchema, 
  ProcurementInsightsSchema, 
  PartnerSegmentsSchema, 
  ExtractContractSchema 
} from '../../types/api.ts';

export async function getMarketingInsights(req: Request, res: Response) {
  try {
    const validated = MarketingInsightsSchema.parse(req.body);
    const insights = await aiService.generateMarketingInsights(validated.salesData, validated.kpiData);
    res.json(insights);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function getProductRecommendations(req: Request, res: Response) {
  try {
    const validated = ProductRecommendationsSchema.parse(req.body);
    const recommendations = await aiService.generateProductRecommendations(validated.inventoryData);
    res.json(recommendations);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function detectAnomalies(req: Request, res: Response) {
  try {
    const validated = AnomalyDetectionSchema.parse(req.body);
    const anomalies = await aiService.detectAnomalies(validated.kpiData);
    res.json(anomalies);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function getProcurementInsights(req: Request, res: Response) {
  try {
    const validated = ProcurementInsightsSchema.parse(req.body);
    const insights = await aiService.generateProcurementInsights(validated.procurementData);
    res.json(insights);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function getPartnerSegments(req: Request, res: Response) {
  try {
    const validated = PartnerSegmentsSchema.parse(req.body);
    const segments = await aiService.generatePartnerSegments(validated.partnerData, validated.rfmParams);
    res.json(segments);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function extractContract(req: Request, res: Response) {
  try {
    const validated = ExtractContractSchema.parse(req.body);
    const terms = await aiService.extractContractTerms(validated.contractText);
    res.json(terms);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
}
