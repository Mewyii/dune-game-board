import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-soundcloud-player',
  templateUrl: './soundcloud-player.component.html',
  styleUrl: './soundcloud-player.component.scss',
  standalone: false,
})
export class SoundcloudPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() musicId = 0;
  @Input() type: 'tracks' | 'playlists' = 'tracks';
  @Input() volume = 50;
  @Input() autoplay: boolean = false;

  public baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/';
  public srcSettings =
    '&color=%23e49944&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true&visual=true&sharing=false&show_playcount=false&single_active=false';

  public playlistLength = 0;
  public widget: Widget | undefined;

  subscriptions: Subscription[] = [];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    const autoPlaySub = this.settingsService.autoplayMusic$.subscribe((value) => {
      if (value === true) {
        this.playRandomSound();
      } else {
        this.widget?.pause();
      }
    });
    this.subscriptions.push(autoPlaySub);
  }

  ngAfterViewInit(): void {
    this.widget = SC.Widget(this.musicId + '');
    if (this.autoplay && this.widget) {
      this.widget.bind('ready', () => {
        if (this.type === 'playlists') {
          this.widget?.setVolume(0);
          this.widget?.play();
          this.widget?.pause();

          this.widget?.getSounds((sounds) => {
            this.playlistLength = sounds.length;

            this.waitForSoundsToLoadAndPlayRandomSound();
          });
        } else {
          this.widget?.play();
          this.widget?.setVolume(33);
        }
      });

      this.widget.bind('finish', () => {
        if (this.type === 'playlists') {
          this.playRandomSound();
        }
      });
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private waitForSoundsToLoadAndPlayRandomSound() {
    setTimeout(() => {
      this.widget?.setVolume(33);
      this.playRandomSound();
    }, 5000);
  }

  private playRandomSound() {
    if (!this.widget) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.playlistLength);
    this.widget.skip(randomIndex);

    this.widget.isPaused((isPaused) => {
      if (isPaused) {
        this.waitForSoundsToLoadAndPlayRandomSound();
      } else {
        this.widget?.getCurrentSound((sound) => {
          console.log('Now playing: ' + sound.user.username + ': ' + sound.title);
        });
      }
    });
  }
}
