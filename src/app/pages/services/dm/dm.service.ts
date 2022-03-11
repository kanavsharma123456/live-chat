import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DMRequest, getMessagesResponse, uploadResponse } from "./dm.interface";
import { applicationUrls } from "../helpers/url.helpers";
@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getMessages(id: number, page = 1, page_size = 10, query?: string) {
    const request: DMRequest = {
      page: page,
      page_size: page_size,
    };
    if (query) {
      request.firstName = query;
    }
    return this.http.get<getMessagesResponse>(
      applicationUrls.appPatientRequests + id + "/messages",
      {
        params: request as any,
      }
    );
  }

  uploadMessages(id, req) {
    return this.http.post<any>(
      applicationUrls.appPatientRequests + id + "/messages",
      req
    );
  }

  uploadFile(id, file) {
    var req = new FormData();
    req.append("file", file);
    return this.http.post<uploadResponse>(
      applicationUrls.appPatientRequests + id + "/messages/upload",
      req
    );
  }

  seenMessage(patientRequestId, id) {
    return this.http.get<getMessagesResponse>(
      applicationUrls.appPatientRequests +
        patientRequestId +
        "/messages/" +
        id +
        "/seen"
    );
  }
}
