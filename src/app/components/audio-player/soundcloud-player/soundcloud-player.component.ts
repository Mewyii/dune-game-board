import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'dune-soundcloud-player',
    templateUrl: './soundcloud-player.component.html',
    styleUrl: './soundcloud-player.component.scss',
    standalone: false
})
export class SoundcloudPlayerComponent implements AfterViewInit {
  @Input() musicId = 0;
  @Input() type: 'tracks' | 'playlists' = 'tracks';
  @Input() volume = 50;
  @Input() autoplay: boolean = false;

  public baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/';
  public srcSettings =
    '&color=%23e49944&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true&visual=true&sharing=false&show_playcount=false&single_active=false';

  public playlistLength = 0;
  public widget: Widget | undefined;

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
