export interface DMRequest {
  page_size: number;
  page: number;
  firstName?: string;
}

export interface PatientRequest {
  id: number;
  patient_id: number;
  type: string;
  reason: string;
  nurse_id: number;
  status: string;
  decline_reason?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  data: string;
  type: string;
}

export interface Datum {
  id: number;
  patient_request_id: number;
  message: Message;
  sender_id: number;
  receiver_id: number;
  seen: number;
  created_at: Date;
  updated_at: Date;
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}

export interface Messages {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: string;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Data {
  patient_request: PatientRequest;
  messages: Messages;
}

export interface getMessagesResponse {
  data: Data;
  message: string;
}

export interface upload {
  path: string;
}

export interface uploadResponse {
  data: upload;
  message: string;
}
