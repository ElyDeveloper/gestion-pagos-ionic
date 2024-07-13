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
    { title: "Inbox", url: "/layout/home", icon: "mail" },
    { title: "Outbox", url: "/layout/outbox", icon: "paper-plane" },
    { title: "Favorites", url: "/layout/favorites", icon: "heart" },
    { title: "Archived", url: "/layout/archived", icon: "archive" },
    { title: "Trash", url: "/layout/trash", icon: "trash" },
    { title: "Spam", url: "/layout/spam", icon: "warning" },
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
    console.log(prefersDark);
    this.darkMode = prefersDark.matches;
    //Verificar si hay una configuración previa
    const darkMode = localStorage.getItem("themeApp");
    if (darkMode) {
      this.darkMode = darkMode === "dark";
      console.log(this.darkMode);
    }

    if (this.darkMode) {
      document.body.classList.toggle("dark");
    }
  }

  cambioApariencia() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark");
    //Guardar en localstorage
    localStorage.setItem("themeApp", this.darkMode ? "dark" : "light");

  }
}
