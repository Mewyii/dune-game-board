import { Component, OnInit } from '@angular/core';
import { random } from 'lodash';
import { CardCell, CardCoordinates, ConflictSet, ConflictsService } from 'src/app/services/conflicts.service';

@Component({
  selector: 'dune-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.scss'],
})
export class ConflictsComponent implements OnInit {
  constructor(public conflictsService: ConflictsService) {}

  public currentConflictSet: ConflictSet | undefined;

  public currentCardCoordinates: CardCoordinates = { x: 0, y: 0 };

  ngOnInit(): void {
    this.conflictsService.currentConflictSet$.subscribe((currentConflictSet) => {
      this.currentConflictSet = currentConflictSet;
    });

    this.conflictsService.currentCardCoordinates$.subscribe((currentCardCoordinates) => {
      this.currentCardCoordinates = currentCardCoordinates;
    });
  }
}
