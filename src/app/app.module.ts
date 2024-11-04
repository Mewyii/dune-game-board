import { NgModule, isDevMode } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { ImperiumCardConfiguratorComponent } from './pages/card-configurator/imperium-card-configurator.component';
import { StartingCardConfiguratorComponent } from './pages/starting-card-configurator/starting-card-configurator.component';
import { CardEditorComponent } from './pages/card-configurator/card-editor/card-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogCardEditorComponent } from './pages/card-configurator/dialog-card-editor/dialog-card-editor.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LeaderCardComponent } from './components/_common/leader-card/leader-card.component';
import { DialogLeaderEditorComponent } from './pages/leader-configurator/dialog-leader-editor/dialog-leader-editor.component';
import { LeaderEditorComponent } from './pages/leader-configurator/leader-editor/leader-editor.component';
import { AboutComponent } from './pages/about/about.component';
import { GameManualComponent } from './pages/game-board/game-manual/game-manual.component';
import { TechTilesComponent } from './components/tech-tiles/tech-tiles.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { EventConfiguratorComponent } from './pages/event-configurator/event-configurator.component';
import { EventCardComponent } from './components/_common/event-card/event-card.component';
import { NumberToArrayPipe } from './pipes/number-to-array';
import { EventEditorComponent } from './pages/event-configurator/event-editor/event-editor.component';
import { DialogEventEditorComponent } from './pages/event-configurator/dialog-event-editor/dialog-event-editor.component';
import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';
import { BoardEvaluationComponent } from './components/board-evaluation/board-evaluation.component';
import { PlayerHandComponent } from './components/player-hand/player-hand.component';
import { ImperiumRowComponent } from './components/imperium-row/imperium-row.component';
import { AlwaysBuyableCardsComponent } from './components/always-buyable-cards/always-buyable-cards.component';
import { StopPropagationClickDirective } from './directives/stop-propagation-click';
import { TechTileConfiguratorComponent } from './pages/tech-tile-configurator/tech-tile-configurator.component';
import { TechTileComponent } from './components/_common/tech-tile/tech-tile.component';
import { DialogTechTileEditorComponent } from './pages/tech-tile-configurator/dialog-tech-tile-editor/dialog-tech-tile-editor.component';
import { TechTileEditorComponent } from './pages/tech-tile-configurator/tech-tile-editor/tech-tile-editor.component';
import { ImperiumCardsPreviewDialogComponent } from './components/_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import { PlayerRewardChoicesComponent } from './components/player-reward-choices/player-reward-choices.component';
import { ConflictsPreviewDialogComponent } from './components/_common/dialogs/conflicts-preview-dialog/conflicts-preview-dialog.component';
import { IntrigueEditorComponent } from './pages/intrigue-configurator/intrigue-editor/intrigue-editor.component';
import { DialogIntrigueEditorComponent } from './pages/intrigue-configurator/dialog-intrigue-editor/dialog-intrigue-editor.component';
import { IntrigueConfiguratorComponent } from './pages/intrigue-configurator/intrigue-configurator.component';
import { IntrigueCardComponent } from './components/_common/intrigue-card/intrigue-card.component';
import { IntriguesComponent } from './components/intrigues/intrigues.component';
import { IntriguesPreviewDialogComponent } from './components/_common/dialogs/intrigues-preview-dialog/intrigues-preview-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    NumberToArrayPipe,
    MinorHousesComponent,
    MinorHouseCardComponent,
    ImperiumRowCardComponent,
    TechTileComponent,
    GameBoardComponent,
    LeaderConfiguratorComponent,
    ImperiumCardConfiguratorComponent,
    CardEditorComponent,
    DialogCardEditorComponent,
    NotificationComponent,
    LeaderCardComponent,
    DialogLeaderEditorComponent,
    LeaderEditorComponent,
    AboutComponent,
    GameManualComponent,
    TechTilesComponent,
    ConfirmDialogComponent,
    AudioPlayerComponent,
    EventConfiguratorComponent,
    EventCardComponent,
    EventEditorComponent,
    DialogEventEditorComponent,
    DialogSettingsComponent,
    BoardEvaluationComponent,
    StartingCardConfiguratorComponent,
    PlayerHandComponent,
    ImperiumRowComponent,
    AlwaysBuyableCardsComponent,
    StopPropagationClickDirective,
    TechTileConfiguratorComponent,
    DialogTechTileEditorComponent,
    TechTileEditorComponent,
    ImperiumCardsPreviewDialogComponent,
    PlayerRewardChoicesComponent,
    ConflictsPreviewDialogComponent,
    IntrigueConfiguratorComponent,
    DialogIntrigueEditorComponent,
    IntrigueEditorComponent,
    IntrigueCardComponent,
    IntriguesComponent,
    IntriguesPreviewDialogComponent,
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
    MatTooltipModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
