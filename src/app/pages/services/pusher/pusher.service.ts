import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import Pusher from "pusher-js";
import { applicationUrls } from "src/app/pages/services/helpers/url.helpers";

@Injectable({
  providedIn: "root",
})
export class PusherService {
  private subject: Subject<any> = new Subject<any>();
  members = new BehaviorSubject<any>([]);
  pusher: Pusher;
  channel;
  constructor() {}

  initiatePusher(PatientRequest) {
    // Pusher.logToConsole = true;
    this.pusher = new Pusher("2cec543218016ca21c80", {
      cluster: "mt1",
      forceTLS: true,
      authEndpoint: applicationUrls.pusherAuth,
      auth: {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWQ0Y2Q5MjEwY2ViODM0NjczMzZiYTNmMDg2YTVjMTNjZTJmZWFmNjVlMmU3NGU4YmQyYjg2ODk0YmQ5NTcxMzY1MmY0ZDNhOTdmOTllMGIiLCJpYXQiOjE2NDYzMTIxNzguNDQwMjE4LCJuYmYiOjE2NDYzMTIxNzguNDQwMjIyLCJleHAiOjE2Nzc4NDgxNzguNDM1Mjk0LCJzdWIiOiI4Iiwic2NvcGVzIjpbXX0.RI3ljkED98k-W-M1tmf39A03E7rwyt_QJDX-54QieXQv3NiW9DdpkO5SqVYPtTt705sTbkmByxk17pu_ppBqgDW70n4h1k3nE7xU5QFj-Q0FFI9dIm0Isz17Qtwz0uvIFN01pdjU4ZvngET2jNO1Xawyz1vNQJTB6br9d7KMW4ysZcVON69cNysbDQID2kczcQrJ8T2WjXww-2nE-pDaIlLlXmhTvAR0_vPnVHnGt3FiQDC_TrSRreizk-GGCnetjtmjboGlKP6oGvFR9s9d4k2NeN7F1IS84iCRsfTKpRAqYgUWJO5myPZeCsynA6LKzTHTI0cjxELmCGgSggn6pXtG3E8EPDKFwPaHFL2HROVhnu2PyPcqZista18elAUIiqAnG2JCrQoIItU5iiOUra-e9FuMvJVTEiarGH2ripAjsBdvo3bUkDts1qciVb5VacamePj_c8MqP7SrJFyOpT_ssk1nYQN1npdGfN1KbkvPkjZOFHEKVDPPILv28A4vufQnpYgpqH7L556xoqEz9ucZjbZ_s7kJpTpl_MoInwqwC0Rl1Zp3DzLR1l5FmVBMwlBb8MOF2WWy8eqbsOAS3DMnV9qmrU_iJK-5NhINVD_iAkJwrAunHHdmHhxrOi0oYQec3XPlAHOfT9wBpvIlwiCi4vCLg_CFPgKbH_SBNcE",
        },
      },
    });

    this.channel = this.pusher.subscribe(
      `presence-patientrequests.${PatientRequest}`
    );

    this.channel.bind("pusher:subscription_succeeded", (members) => {
      const arr = [];

      arr.push(members.members);
      this.members.next(arr);
    });

    this.channel.bind("pusher:member_added", (member) => {
      let arr = this.members.getValue();
      let idx = arr.findIndex((a) => a.id == member.id);
      if (idx == -1) {
        arr.push(member);
        this.members.next(arr);
      }
    });

    this.channel.bind("pusher:member_removed", (member) => {
      let arr = this.members.getValue();
      let idx = arr.findIndex((a) => a.id == member.id);
      if (idx != -1) {
        arr.splice(idx, 1);
        this.members.next(arr);
      }
    });

    this.channel.bind(`App\\Events\\PatientRequestMessageEvent`, (data) => {
      this.subject.next(data.message);
    });
  }

  initiatePusher1(PatientRequest) {
    Pusher.logToConsole = true;
    const pusher = new Pusher("2cec543218016ca21c80", {
      cluster: "mt1",
      forceTLS: true,
      authEndpoint: applicationUrls.pusherAuth,
      auth: {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFmNjlkNjc2NmU1NzMzMzY2Y2NlMTU0NmVlZGMzYTA0ZmQxZTBiOGUyMmRhMzZjODgyZDBjOWY1ZWNkNzQ4MTQ5ZmY4NjFhM2UyNWYxNWMiLCJpYXQiOjE2NDY4MDM5MjkuMDE2NTgzLCJuYmYiOjE2NDY4MDM5MjkuMDE2NTg2LCJleHAiOjE2NzgzMzk5MjkuMDEzNzYsInN1YiI6IjE3Iiwic2NvcGVzIjpbXX0.HUdaMfPWTmJMX5NxweE52odKXJR5lmXvDJiU3jEBwuNMgYRc7XP2B5_Kj7hZrrT9NU1rmp3aigFEl_ekn5X4kF865Pp6WxKfy8NAtLTJCc_OO-JFC6hVnhlOhx9ofaKGkNY0jNArtPT4wL_kHE-dZyD2_LQFWw-RiKPm6ExXO8Tt-YS3eex-ntQWPYus8amwwPKsQcLicSIL4BaTIelCSfYCC_90nLZpo9BSbfe5g_VRDpZU3vfhV9gYcYvEURO5fC8GGuZHPaZOiEXv9hWrFPPgmwczlyBP9wWzQd8lo2ydCUklo3CSjxfWvwHW2vxBucBYntoB3Pm2F9m_kWSg-aiWifz-wpREZf2LjMF4gDKOHtilf3CH2DjqKV-Mq_9K4c3Kh8I7b85h2mOK-0Sh4JOmWqw0helTN3_DbSUc9ote0BHGVy9V8MEsrAJL2XPKQwk2HrPB0xfDYRkx4wR8cSYv93cDtd8abRGE6dVGxLJDRnSBz7IvFXJXHNdxlHgu1muP89gNwzhN5f1AhPdTz9muIrwerZVb-s_69Z3s7Kw_3vsHuo_IldNzlt_7j1XNtBuffJ096ZVUMXCXwVkFTRxyGVJxNwmFSNHUVKT-oiPro_2y9OA2BbE06OrWa3SWVQRpSqO1L0v_yYCcnjAuMnTNGOdujj0Limv0UQQ2Ank",
        },
      },
    });
    const channel: any = pusher.subscribe(
      `presence-patientrequests.${PatientRequest}`
    );

    channel.bind("pusher:subscription_succeeded", (members) => {
      console.log("members", members);
      const me = members.me;
      console.log("me", me);
    });

    channel.bind("pusher:member_added", (member) => {
      console.log(member.id, member.info);
    });

    channel.bind(`App\\Events\\PatientRequestMessageEvent`, (data) => {
      this.subject.next(data.message);
    });
  }

  getFeedItems(): Observable<any> {
    return this.subject.asObservable();
  }

  getMembers(): Observable<any> {
    return this.members.asObservable();
  }
}

// pusher.connection.bind("connected", (data) => {
//   this.socketId = data.socket_id;
//   channel.trigger("client-message", {
//     type: "TXT",
//     data: "hello world!",
//   });
// });
