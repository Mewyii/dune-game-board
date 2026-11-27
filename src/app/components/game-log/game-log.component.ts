import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { LoggingService, PlayerActionLog } from 'src/app/services/log.service';

@Component({
  selector: 'dune-game-log',
  templateUrl: './game-log.component.html',
  styleUrl: './game-log.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GameLogComponent implements OnInit, AfterViewInit {
  private logService = inject(LoggingService);

  @ViewChildren('rewardLogs') rewardLogElements!: QueryList<ElementRef>;

  public playerActionLog: PlayerActionLog[] = [];

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
}
