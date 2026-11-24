import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dune-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AboutComponent {}
