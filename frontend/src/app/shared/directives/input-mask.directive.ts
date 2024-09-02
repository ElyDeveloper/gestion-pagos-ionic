import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputMask]'
})
export class InputMaskDirective {
  @Input('appInputMask') maskPattern: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    let formatted = '';
    let maskIndex = 0;

    for (let i = 0; i < value.length && maskIndex < this.maskPattern.length; i++) {
      if (this.maskPattern[maskIndex] === '#') {
        formatted += value[i];
        maskIndex++;
      } else {
        formatted += this.maskPattern[maskIndex];
        maskIndex++;
        i--;
      }
    }

    input.value = formatted;
  }
}