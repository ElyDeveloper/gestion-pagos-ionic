import { Component, inject } from "@angular/core";
import { Platform } from "@ionic/angular";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  darkMode: boolean = true;

  public appPages = [
    { title: "Inbox", url: "/home/inbox", icon: "mail" },
    { title: "Outbox", url: "/home/outbox", icon: "paper-plane" },
    { title: "Favorites", url: "/home/favorites", icon: "heart" },
    { title: "Archived", url: "/home/archived", icon: "archive" },
    { title: "Trash", url: "/home/trash", icon: "trash" },
    { title: "Spam", url: "/home/spam", icon: "warning" },
  ];
  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkDarkMode();
    });
  }

  checkDarkMode() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    this.darkMode = prefersDark.matches;
    if (prefersDark.matches) {
      document.body.classList.toggle("dark");
    }
  }

  cambioApariencia() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark");
  }
}
