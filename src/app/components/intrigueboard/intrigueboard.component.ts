import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-intrigueboard',
  templateUrl: './intrigueboard.component.html',
  styleUrls: ['./intrigueboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IntrigueboardComponent implements OnInit, OnDestroy {
  @Input() mode!: 'board' | 'game';

  showIntrigueDiscardPile = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
