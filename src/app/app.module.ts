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
import { ParticleEffectsComponent } from './components/particle-effects/particle-effects.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { NgParticlesModule } from 'ng-particles';
import { LeadersComponent } from './components/leaders/leaders.component';
import { ConflictsComponent } from './components/conflicts/conflicts.component';
import { AllianceTokenComponent } from './components/_common/alliance-token/alliance-token.component';
import { DuneSymbolsPipe } from './pipes/dune-symbols';
import { MinorHousesComponent } from './components/minor-houses/minor-houses.component';
import { MinorHouseCardComponent } from './components/_common/minor-house-card/minor-house-card.component';
import { ImperiumRowCardComponent } from './components/_common/imperium-row-card/imperium-row-card.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { LeaderConfiguratorComponent } from './pages/leader-configurator/leader-configurator.component';
import { CardConfiguratorComponent } from './pages/card-configurator/card-configurator.component';
import { CardEditorComponent } from './pages/card-configurator/card-editor/card-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogCardEditorComponent } from './pages/card-configurator/dialog-card-editor/dialog-card-editor.component';

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
    ParticleEffectsComponent,
    LeadersComponent,
    ConflictsComponent,
    AllianceTokenComponent,
    DuneSymbolsPipe,
    MinorHousesComponent,
    MinorHouseCardComponent,
    ImperiumRowCardComponent,
    GameBoardComponent,
    LeaderConfiguratorComponent,
    CardConfiguratorComponent,
    CardEditorComponent,
    DialogCardEditorComponent,
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
    MatDialogModule,
    NgParticlesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
