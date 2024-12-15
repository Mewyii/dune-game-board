import { Component, Input } from '@angular/core';

@Component({
  selector: 'dune-marker',
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss',
})
export class MarkerComponent {
  @Input({ required: true }) type!: 'ornithopter';
}
