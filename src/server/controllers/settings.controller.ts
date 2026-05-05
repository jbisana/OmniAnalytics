import { Request, Response } from 'express';

let serverAlertSettings = {
  criticalStock: true,
  lowStock: true,
  newCustomer: false,
  anomalies: true,
};

export function getAlertSettings(req: Request, res: Response) {
  res.json(serverAlertSettings);
}

export function updateAlertSettings(req: Request, res: Response) {
  serverAlertSettings = { ...serverAlertSettings, ...req.body };
  res.json({ success: true, settings: serverAlertSettings });
}

export function getInternalSettings() {
  return serverAlertSettings;
}
