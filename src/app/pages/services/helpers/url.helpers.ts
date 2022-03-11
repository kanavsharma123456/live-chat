import { environment } from "src/environments/environment";

class Urls {
  serverUrl: string;

  constructor() {
    this.serverUrl = `${environment.serverUrl}/api/v${environment.apiVersion}`;
  }

  get authBase() {
    return this.serverUrl + "/auth";
  }
  get userBase() {
    return this.serverUrl + "/user";
  }

  get Patient() {
    return this.serverUrl + "/patient";
  }

  get Nurse() {
    return this.serverUrl + "/nurse";
  }

  // Auth
  get uploadfile() {
    return this.userBase + "/upload";
  }

  get appPatientRequests() {
    return this.serverUrl + "/patient-requests/";
  }

  get patientRequests() {
    return this.Patient + "/patient-requests/";
  }
  get nursePatientRequests() {
    return this.Nurse + "/patient-requests/";
  }
  get pusherAuth() {
    return `${environment.serverUrl}/api/broadcasting/auth`;
  }
}

export const applicationUrls = new Urls();
