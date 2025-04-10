import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { techTiles } from 'src/app/constants/tech-tiles';
import { TechTileCard } from 'src/app/models/tech-tile';

@Injectable({
  providedIn: 'root',
})
export class TechTileConfiguratorService {
  private techTilesSubject = new BehaviorSubject<TechTileCard[]>(techTiles);
  public techTiles$ = this.techTilesSubject.asObservable();

  constructor() {
    const techTilesString = localStorage.getItem('techTiles');
    if (techTilesString) {
      const techTiles = JSON.parse(techTilesString) as TechTileCard[];
      this.techTilesSubject.next(techTiles);
    }

    this.techTiles$.subscribe((techTiles) => {
      localStorage.setItem('techTiles', JSON.stringify(techTiles));
    });
  }

  public get techTiles() {
    return cloneDeep(this.techTilesSubject.value);
  }

  addTechTile(card: TechTileCard) {
    this.techTilesSubject.next([...this.techTiles, card]);
  }

  editTechTile(card: TechTileCard) {
    const cardId = card.name.en;

    const techTiles = this.techTiles;
    const cardIndex = techTiles.findIndex((x) => x.name.en === cardId);
    techTiles[cardIndex] = card;

    this.techTilesSubject.next(techTiles);
  }

  deleteTechTile(id: string) {
    this.techTilesSubject.next(this.techTiles.filter((x) => x.name.en !== id));
  }

  setTechTiles(techTiles: TechTileCard[]) {
    this.techTilesSubject.next(techTiles);
  }

  sortTechTiles(category: keyof TechTileCard, order: 'asc' | 'desc') {
    if (category === 'name') {
      const orderedTechTiles = this.techTiles.sort((a, b) => {
        const aName = a.name.en;
        const bName = b.name.en;
        if (order === 'asc') {
          return aName.localeCompare(bName);
        } else if (order === 'desc') {
          return bName.localeCompare(aName);
        }
        return 0;
      });
      this.techTilesSubject.next(orderedTechTiles);
    }
    if (category === 'costs') {
      const orderedTechTiles = this.techTiles.sort((a, b) => {
        const aCosts = a.costs ?? 0;
        const bCosts = b.costs ?? 0;
        if (order === 'asc') {
          return aCosts - bCosts;
        } else if (order === 'desc') {
          return bCosts - aCosts;
        }
        return 0;
      });
      this.techTilesSubject.next(orderedTechTiles);
    }
  }
}
