import { Request, Response } from 'express';
import { crmCustomers, crmActivity } from '../../data/mockData.ts';

let serverCrmCustomers = [...crmCustomers];
let serverCrmActivity = [...crmActivity];

export function getCustomers(req: Request, res: Response) {
  res.json(serverCrmCustomers);
}

export function getActivity(req: Request, res: Response) {
  res.json(serverCrmActivity);
}

export function getCrmData() {
  return { customers: serverCrmCustomers, activity: serverCrmActivity };
}
