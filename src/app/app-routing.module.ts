import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { ImperiumCardConfiguratorComponent } from './pages/card-configurator/imperium-card-configurator.component';
import { LeaderConfiguratorComponent } from './pages/leader-configurator/leader-configurator.component';
import { AboutComponent } from './pages/about/about.component';
import { EventConfiguratorComponent } from './pages/event-configurator/event-configurator.component';
import { StartingCardConfiguratorComponent } from './pages/starting-card-configurator/starting-card-configurator.component';
import { TechTileConfiguratorComponent } from './pages/tech-tile-configurator/tech-tile-configurator.component';
import { IntrigueConfiguratorComponent } from './pages/intrigue-configurator/intrigue-configurator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'game-board',
    pathMatch: 'full',
  },
  {
    title: 'Dune Imperium: Sands of Arrakis',
    path: 'game-board',
    component: GameBoardComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Imperium Card-Configurator',
    path: 'imperium-card-configurator',
    component: ImperiumCardConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Starting Card-Configurator',
    path: 'starting-card-configurator',
    component: StartingCardConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Tech-Tile-Configurator',
    path: 'tech-tile-configurator',
    component: TechTileConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Leader-Configurator',
    path: 'leader-configurator',
    component: LeaderConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Intrigue-Configurator',
    path: 'intrigue-configurator',
    component: IntrigueConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'Dune Event-Configurator',
    path: 'event-configurator',
    component: EventConfiguratorComponent,
    pathMatch: 'full',
  },
  {
    title: 'About',
    path: 'about',
    component: AboutComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
