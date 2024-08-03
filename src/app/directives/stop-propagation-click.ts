import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropagationClick]',
})
export class StopPropagationClickDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event']) onClick(event: any): void {
    event.stopPropagation();
    console.log('Hi');
  }
}
