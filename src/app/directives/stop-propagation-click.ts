import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[stopPropagationClick]',
  standalone: false,
})
export class StopPropagationClickDirective {
  private el = inject(ElementRef);

  @HostListener('click', ['$event']) onClick(event: any): void {
    event.stopPropagation();
  }
}
