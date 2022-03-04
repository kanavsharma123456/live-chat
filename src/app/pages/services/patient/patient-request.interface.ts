export interface getRequest {
  page_size: number;
  page: number;
  firstName?: string;
  status?: string;
}

export interface Nurse {
  id: number;
  name: string;
  image: string;
}

export interface Datum {
  id: number;
  patient_id: number;
  type: string;
  reason: string;
  nurse_id: number;
  status: string;
  decline_reason?: any;
  created_at: Date;
  updated_at: Date;
  nurse: Nurse;
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}

export interface PatientRequests {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Data {
  patient_requests: PatientRequests;
}

export interface getRequestResponse {
  data: Data;
  message: string;
}

export interface PatientRequest {
  patient_id: number;
  reason: string;
  nurse_id: number;
  type: string;
  updated_at: Date;
  created_at: Date;
  id: number;
}

export interface Data2 {
  patient_request: PatientRequest;
}

export interface createRequestResponse {
  data: Data2;
  message: string;
}
