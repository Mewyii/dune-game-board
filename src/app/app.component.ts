import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent {
  private title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Sands of Arrakis');
  }
}
