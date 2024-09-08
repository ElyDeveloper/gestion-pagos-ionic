import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private loaderActionSubject = new Subject<"show" | "hide">();

  loaderAction$ = this.loaderActionSubject.asObservable();

  show() {
    this.loaderActionSubject.next("show");
  }

  hide() {
    this.loaderActionSubject.next("hide");
  }
}
