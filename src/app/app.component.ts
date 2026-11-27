import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GameSessionService } from './services/persistence/game-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent {
  private title = inject(Title);
  // Created at app start, so a game session that was active before a reload continues.
  private gameSessionService = inject(GameSessionService);

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Sands of Arrakis');
  }
}
