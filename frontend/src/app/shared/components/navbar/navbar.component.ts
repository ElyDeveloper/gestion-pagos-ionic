import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  selectionProfile: any;
  private router = inject(Router);
  user = {
    name: "Gerson Rivera",
    email: "john@gmail.com",
  };

  isActionSheetOpen = false;

  public actionSheetButtons = [
    {
      text: "Cerrar Sesión",
      role: "destructive",
      handler: () => {
        this.logout();
      },
      data: {
        action: "logout",
      },
    },
    {
      text: "Cancel",
      role: "cancel",
      data: {
        action: "cancel",
      },
    },
  ];

  constructor() {}

  ionViewWillEnter() {
    this.selectionProfile = "";
  }

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  logout() {
    console.log("logout");
    this.router.navigate(["/login"]);
  }
}
