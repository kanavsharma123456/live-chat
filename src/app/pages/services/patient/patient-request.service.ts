import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  getRequest,
  createRequestResponse,
  getRequestResponse,
} from "./patient-request.interface";
import { applicationUrls } from "../helpers/url.helpers";
@Injectable({
  providedIn: "root",
})
export class PatientRequest {
  constructor(private http: HttpClient) {}

  getRequests(page = 1, page_size = 10, query?: string) {
    const request: getRequest = {
      page: page,
      page_size: page_size,
      status: "OPEN",
    };
    if (query) {
      request.firstName = query;
    }
    return this.http.get<getRequestResponse>(applicationUrls.patientRequests, {
      params: request as any,
    });
  }

  createPatientRequest(req) {
    return this.http.post<createRequestResponse>(
      applicationUrls.patientRequests,
      req
    );
  }
}
