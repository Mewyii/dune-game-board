import { Component, OnInit } from '@angular/core';
import { random } from 'lodash';

interface CardCoordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'dune-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.scss'],
})
export class ConflictsComponent implements OnInit {
  public currentCardCoordinates: CardCoordinates = { x: 0, y: 0 };

  public exclusions: CardCoordinates[] = [{ x: 5, y: 1 }];

  ngOnInit(): void {
    this.currentCardCoordinates = this.getRandomCardCoordinates();
  }

  getRandomCardCoordinates() {
    let randomX = 0;
    let randomY = 0;

    for (let i = 0; i <= 20; i++) {
      randomX = random(5);
      randomY = random(1);

      if (!this.exclusions.some((element) => element.x === randomX && element.y === randomY)) {
        break;
      }
    }

    return { x: randomX * -167, y: randomY * -255 };
  }
}
