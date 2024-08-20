import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BackdropFixService {
  private observer: MutationObserver | null = null;

  startObserving() {
    if (!this.observer) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (
                node instanceof HTMLElement &&
                node.tagName.toLowerCase() === "ion-backdrop"
              ) {
                this.fixBackdropAccessibility(node as HTMLElement);
              }
            });
          }
        });
      });

      this.observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private fixBackdropAccessibility(backdrop: HTMLElement) {
    backdrop.removeAttribute("aria-hidden");
    backdrop.setAttribute("aria-label", "Fondo modal");

    const focusableElements = backdrop.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((el: Element) => {
      (el as HTMLElement).setAttribute("tabindex", "-1");
    });
  }
}
