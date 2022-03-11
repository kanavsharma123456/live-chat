import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { getDetailsResponse, ringResponse } from "./video-call.interface";
import { applicationUrls } from "../helpers/url.helpers";

@Injectable({
  providedIn: "root",
})
export class VideoCallService {
  constructor(private http: HttpClient) {}

  getDetails(id) {
    return this.http.get<getDetailsResponse>(
      applicationUrls.appPatientRequests + id + "/video-calls/details"
    );
  }

  ringVideoCall(id) {
    return this.http.get<ringResponse>(
      applicationUrls.appPatientRequests + id + "/video-calls/ring"
    );
  }
}
