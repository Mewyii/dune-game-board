import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-techboard',
  templateUrl: './techboard.component.html',
  styleUrls: ['./techboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TechboardComponent implements OnInit, OnDestroy {
  @Input() useTechTiles = false;
  @Input() mode!: 'board' | 'game';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
