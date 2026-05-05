import { z } from 'zod';

export const MarketingInsightsSchema = z.object({
  salesData: z.array(z.any()),
  kpiData: z.any(),
});

export const ProductRecommendationsSchema = z.object({
  inventoryData: z.array(z.any()),
});

export const AnomalyDetectionSchema = z.object({
  kpiData: z.any(),
});

export const ProcurementInsightsSchema = z.object({
  procurementData: z.any(),
});

export const PartnerSegmentsSchema = z.object({
  partnerData: z.any(),
  rfmParams: z.object({
    recency: z.string(),
    frequency: z.string(),
    monetary: z.string(),
  }).optional(),
});

export const ExtractContractSchema = z.object({
  contractText: z.string(),
});

export type MarketingInsightsInput = z.infer<typeof MarketingInsightsSchema>;
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsSchema>;
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionSchema>;
export type ProcurementInsightsInput = z.infer<typeof ProcurementInsightsSchema>;
export type PartnerSegmentsInput = z.infer<typeof PartnerSegmentsSchema>;
export type ExtractContractInput = z.infer<typeof ExtractContractSchema>;
