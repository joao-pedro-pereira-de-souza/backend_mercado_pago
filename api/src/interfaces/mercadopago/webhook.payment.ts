export interface BodyWebhookPayment {
  action: string;
  api_version: string;
  data: Data;
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
}

interface Data {
  id: string;
}
