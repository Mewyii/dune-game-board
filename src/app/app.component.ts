import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Sands of Arrakis');
  }
}
