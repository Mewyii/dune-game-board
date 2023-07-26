import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DuneFactionComponent } from './components/dune-faction/dune-faction.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { DuneCombatComponent } from './components/dune-combat/dune-combat.component';
import { DuneActionComponent } from './components/dune-action/dune-action.component';
import { DuneLocationComponent } from './components/dune-location/dune-location.component';
import { CardAreasComponent } from './components/card-areas/card-areas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerboardComponent } from './components/playerboard/playerboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TechboardComponent } from './components/techboard/techboard.component';
import { EventsComponent } from './components/events/events.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeworldTileComponent } from './components/homeworld-tile/homeworld-tile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AITileComponent } from './components/ai-tile/ai-tile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    DuneFactionComponent,
    ScoreboardComponent,
    DuneCombatComponent,
    DuneActionComponent,
    DuneLocationComponent,
    CardAreasComponent,
    PlayerboardComponent,
    TechboardComponent,
    EventsComponent,
    HomeworldTileComponent,
    AITileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DragDropModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
