import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NavigationBarComponent {
  private router = inject(Router);
  t = inject(TranslateService);

  showNavigationSelection = false;
  url = '';

  constructor() {
    const router = this.router;

    this.router.events.subscribe((val) => {
      this.url = router.url;
    });
  }
}
