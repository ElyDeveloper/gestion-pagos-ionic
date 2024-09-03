import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputMask]'
})
export class InputMaskDirective implements OnInit {
  @Input('appInputMask') maskPattern: string = '';
  private previousValue: string = '';

  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnInit() {
    this.applyMask(this.el.nativeElement.value);
  }

  @HostListener('ionInput', ['$event.target.value'])
  onInput(value: string) {
    this.applyMask(value);
  }

  private applyMask(value: string) {
    let newValue = value.replace(/\D/g, '');
    if (newValue === this.previousValue) return;

    let formatted = '';
    let maskIndex = 0;

    for (let i = 0; i < newValue.length && maskIndex < this.maskPattern.length; i++) {
      if (this.maskPattern[maskIndex] === '#') {
        formatted += newValue[i];
        maskIndex++;
      } else {
        formatted += this.maskPattern[maskIndex];
        maskIndex++;
        i--;
      }
    }

    this.previousValue = formatted;
    this.el.nativeElement.value = formatted;
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}