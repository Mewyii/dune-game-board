import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  standalone: false,
})
export class NavigationBarComponent {
  showNavigationSelection = false;
  url = '';

  constructor(private router: Router, public t: TranslateService) {
    this.router.events.subscribe((val) => {
      this.url = router.url;
    });
  }
}
