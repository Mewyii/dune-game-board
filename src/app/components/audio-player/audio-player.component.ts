import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  public showAudioSelection = false;
  public autoplayMusic = false;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.autoplayMusic$.subscribe((value) => {
      this.autoplayMusic = value;
    });
  }

  onAutoplayMusicClicked() {
    this.settingsService.setAutoplayMusic(!this.autoplayMusic);
  }
}
