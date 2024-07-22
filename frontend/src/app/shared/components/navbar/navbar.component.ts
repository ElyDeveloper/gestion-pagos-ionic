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
    name: "John Doe",
    email: "john@gmail.com",
  };

  segments: any[] = [];

  constructor() {}

  ionViewWillEnter() {
    this.selectionProfile = "";
  }

  ngOnInit() {}

  logout() {
    console.log("logout");
    this.router.navigate(["/login"]);
  }

  getSelection() {
    switch (this.selectionProfile) {
      case "logout":
        this.logout();
        break;
      default:
        break;
    }
  }
}
