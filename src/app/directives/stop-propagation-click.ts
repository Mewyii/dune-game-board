import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[stopPropagationClick]',
    standalone: false
})
export class StopPropagationClickDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event']) onClick(event: any): void {
    event.stopPropagation();
  }
}
