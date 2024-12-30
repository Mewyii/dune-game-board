import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dune-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
  showNavigationSelection = false;
  url = '';

  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      this.url = router.url;
    });
  }
}
