import { Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HttpIntercepterService {
  router: Router;
  constructor(private inj: Injector) {
    this.router = this.inj.get(Router);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWQ0Y2Q5MjEwY2ViODM0NjczMzZiYTNmMDg2YTVjMTNjZTJmZWFmNjVlMmU3NGU4YmQyYjg2ODk0YmQ5NTcxMzY1MmY0ZDNhOTdmOTllMGIiLCJpYXQiOjE2NDYzMTIxNzguNDQwMjE4LCJuYmYiOjE2NDYzMTIxNzguNDQwMjIyLCJleHAiOjE2Nzc4NDgxNzguNDM1Mjk0LCJzdWIiOiI4Iiwic2NvcGVzIjpbXX0.RI3ljkED98k-W-M1tmf39A03E7rwyt_QJDX-54QieXQv3NiW9DdpkO5SqVYPtTt705sTbkmByxk17pu_ppBqgDW70n4h1k3nE7xU5QFj-Q0FFI9dIm0Isz17Qtwz0uvIFN01pdjU4ZvngET2jNO1Xawyz1vNQJTB6br9d7KMW4ysZcVON69cNysbDQID2kczcQrJ8T2WjXww-2nE-pDaIlLlXmhTvAR0_vPnVHnGt3FiQDC_TrSRreizk-GGCnetjtmjboGlKP6oGvFR9s9d4k2NeN7F1IS84iCRsfTKpRAqYgUWJO5myPZeCsynA6LKzTHTI0cjxELmCGgSggn6pXtG3E8EPDKFwPaHFL2HROVhnu2PyPcqZista18elAUIiqAnG2JCrQoIItU5iiOUra-e9FuMvJVTEiarGH2ripAjsBdvo3bUkDts1qciVb5VacamePj_c8MqP7SrJFyOpT_ssk1nYQN1npdGfN1KbkvPkjZOFHEKVDPPILv28A4vufQnpYgpqH7L556xoqEz9ucZjbZ_s7kJpTpl_MoInwqwC0Rl1Zp3DzLR1l5FmVBMwlBb8MOF2WWy8eqbsOAS3DMnV9qmrU_iJK-5NhINVD_iAkJwrAunHHdmHhxrOi0oYQec3XPlAHOfT9wBpvIlwiCi4vCLg_CFPgKbH_SBNcE";
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handle401(request);
        } else if (error.error instanceof ErrorEvent) {
          this.presentToast(error.error.message);
        }
        return throwError(error);
      })
    );
  }

  presentToast(msg) {
    console.log("msg");
  }

  handle401(req) {
    this.presentToast("Logged Out!");
  }
}
