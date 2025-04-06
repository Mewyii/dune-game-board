import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { imperiumPlots } from 'src/app/constants/imperium-plots';
import { ImperiumPlot } from 'src/app/models/imperium-plot';
import { TranslateService } from '../translate-service';

@Injectable({
  providedIn: 'root',
})
export class PlotConfiguratorService {
  private imperiumPlotsSubject = new BehaviorSubject<ImperiumPlot[]>(imperiumPlots);
  public imperiumPlots$ = this.imperiumPlotsSubject.asObservable();

  constructor(public t: TranslateService) {
    const imperiumPlotsString = localStorage.getItem('imperiumPlots');
    if (imperiumPlotsString) {
      const imperiumPlots = JSON.parse(imperiumPlotsString) as ImperiumPlot[];
      this.imperiumPlotsSubject.next(imperiumPlots);
    }

    this.imperiumPlots$.subscribe((imperiumPlots) => {
      localStorage.setItem('imperiumPlots', JSON.stringify(imperiumPlots));
    });
  }

  public get imperiumPlots() {
    return cloneDeep(this.imperiumPlotsSubject.value);
  }

  addImperiumPlot(plot: ImperiumPlot) {
    this.imperiumPlotsSubject.next([...this.imperiumPlots, plot]);
  }

  editImperiumPlot(plot: ImperiumPlot) {
    const plotId = plot.name.en;

    const imperiumPlots = this.imperiumPlots;
    const plotIndex = imperiumPlots.findIndex((x) => x.name.en === plotId);
    imperiumPlots[plotIndex] = plot;

    this.imperiumPlotsSubject.next(imperiumPlots);
  }

  deleteImperiumPlot(id: string) {
    this.imperiumPlotsSubject.next(this.imperiumPlots.filter((x) => x.name.en !== id));
  }

  setImperiumPlots(imperiumPlots: ImperiumPlot[]) {
    this.imperiumPlotsSubject.next(imperiumPlots);
  }

  sortImperiumPlots(category: keyof ImperiumPlot, order: 'asc' | 'desc') {
    if (category === 'faction') {
      const orderedPlots = this.imperiumPlots.sort((a, b) => {
        const aFaction = a.faction ?? '';
        const bFaction = b.faction ?? '';
        if (order === 'asc') {
          return aFaction.localeCompare(bFaction);
        } else if (order === 'desc') {
          return bFaction.localeCompare(aFaction);
        }
        return 0;
      });
      this.imperiumPlotsSubject.next(orderedPlots);
    }
    if (category === 'persuasionCosts') {
      const orderedPlots = this.imperiumPlots.sort((a, b) => {
        const aCosts = a.persuasionCosts ?? 0;
        const bCosts = b.persuasionCosts ?? 0;
        if (order === 'asc') {
          return aCosts - bCosts;
        } else if (order === 'desc') {
          return bCosts - aCosts;
        }
        return 0;
      });
      this.imperiumPlotsSubject.next(orderedPlots);
    }
  }

  addImperiumPlots(imperiumPlots: ImperiumPlot[]) {
    const newPlots = imperiumPlots.filter((x) => !this.imperiumPlots.some((y) => y.name.en === x.name.en));
    this.imperiumPlotsSubject.next([...this.imperiumPlots, ...newPlots]);
  }
}
