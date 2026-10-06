import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-conflictboard',
  templateUrl: './conflictboard.component.html',
  styleUrls: ['./conflictboard.component.scss'],
  standalone: false,
})
export class ConflictboardComponent implements OnInit, OnDestroy {
  @Input() mode!: 'board' | 'game';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
