import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "direct-msg",
    pathMatch: "full",
  },
  {
    path: "get-started",
    loadChildren: () =>
      import("./pages/get-started/get-started.module").then(
        (m) => m.GetStartedPageModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "direct-msg",
    loadChildren: () =>
      import("./pages/direct-msg/direct-msg.module").then(
        (m) => m.DirectMsgModule
      ),
  },
  {
    path: "sign-up",
    loadChildren: () =>
      import("./pages/sign-up/sign-up.module").then((m) => m.SignUpPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
