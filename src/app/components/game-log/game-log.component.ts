import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType } from 'src/app/models';
import { LoggingService, PlayerActionLog } from 'src/app/services/log.service';

@Component({
    selector: 'dune-game-log',
    templateUrl: './game-log.component.html',
    styleUrl: './game-log.component.scss',
    standalone: false
})
export class GameLogComponent implements OnInit, AfterViewInit {
  @ViewChildren('rewardLogs') rewardLogElements!: QueryList<ElementRef>;

  public playerActionLog: PlayerActionLog[] = [];

  constructor(private logService: LoggingService) {}

  ngOnInit(): void {
    this.logService.playerActionLog$.subscribe((playerActionLog) => {
      this.playerActionLog = playerActionLog;
    });
  }

  ngAfterViewInit() {
    this.rewardLogElements.changes.subscribe((res) => {
      setTimeout(() => {
        if (res.last && res.last.nativeElement) {
          const parent = (res.last.nativeElement as HTMLDivElement).parentElement;
          if (parent) {
            parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
          }
        }
      });
    });
  }

  onDownloadLogClicked() {
    const jsonContent = JSON.stringify(this.playerActionLog, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'game_log.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
