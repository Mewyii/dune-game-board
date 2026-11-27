import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  t = inject(TranslateService);

  public showAudioSelection = false;
  public autoplayMusic = false;

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const autoPlaySub = this.settingsService.autoplayMusic$.subscribe((value) => {
      this.autoplayMusic = value;
    });
    this.subscriptions.push(autoPlaySub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onAutoplayMusicClicked() {
    this.settingsService.setAutoplayMusic(!this.autoplayMusic);
  }
}
