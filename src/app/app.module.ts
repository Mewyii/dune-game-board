import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AITileComponent } from './components/ai-tile/ai-tile.component';
import { CardAreasComponent } from './components/card-areas/card-areas.component';
import { DuneActionComponent } from './components/dune-action/dune-action.component';
import { DuneCombatComponent } from './components/dune-combat/dune-combat.component';
import { DuneFactionComponent } from './components/dune-faction/dune-faction.component';
import { DuneLocationComponent } from './components/dune-location/dune-location.component';
import { EventsComponent } from './components/events/events.component';
import { HomeworldTileComponent } from './components/homeworld-tile/homeworld-tile.component';
import { ParticleEffectsComponent } from './components/particle-effects/particle-effects.component';
import { PlayerboardComponent } from './components/playerboard/playerboard.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { TechboardComponent } from './components/techboard/techboard.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxParticlesModule } from '@tsparticles/angular';
import { AllianceTokenComponent } from './components/_common/alliance-token/alliance-token.component';
import { ConflictCardComponent } from './components/_common/conflict-card/conflict-card.component';
import { AdditionalPlayerActionsDialogComponent } from './components/_common/dialogs/additional-player-actions-dialog/additional-player-actions-dialog.component';
import { ConflictsPreviewDialogComponent } from './components/_common/dialogs/conflicts-preview-dialog/conflicts-preview-dialog.component';
import { GameSummaryDialogComponent } from './components/_common/dialogs/game-summary-dialog/game-summary-dialog.component';
import { ImperiumCardsPreviewDialogComponent } from './components/_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import { IntriguesPreviewDialogComponent } from './components/_common/dialogs/intrigues-preview-dialog/intrigues-preview-dialog.component';
import { HighlightingComponent } from './components/_common/effects/highlighting/highlighting.component';
import { EventCardComponent } from './components/_common/event-card/event-card.component';
import { ImperiumRowCardComponent } from './components/_common/imperium-row-card/imperium-row-card.component';
import { IntrigueCardComponent } from './components/_common/intrigue-card/intrigue-card.component';
import { LeaderCardComponent } from './components/_common/leader-card/leader-card.component';
import { MarkerComponent } from './components/_common/marker/marker.component';
import { MinorHouseCardComponent } from './components/_common/minor-house-card/minor-house-card.component';
import { PlotCardComponent } from './components/_common/plot-card/plot-card.component';
import { RewardArrayComponent } from './components/_common/reward-array/reward-array.component';
import { TechTileComponent } from './components/_common/tech-tile/tech-tile.component';
import { AlwaysBuyableCardsComponent } from './components/always-buyable-cards/always-buyable-cards.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { SoundcloudPlayerComponent } from './components/audio-player/soundcloud-player/soundcloud-player.component';
import { BoardEvaluationComponent } from './components/board-evaluation/board-evaluation.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConflictsComponent } from './components/conflicts/conflicts.component';
import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';
import { DuneVersionUpdaterComponent } from './components/dune-version-updater/dune-version-updater.component';
import { GameLogComponent } from './components/game-log/game-log.component';
import { ImperiumRowComponent } from './components/imperium-row/imperium-row.component';
import { IntriguesComponent } from './components/intrigues/intrigues.component';
import { LeadersComponent } from './components/leaders/leaders.component';
import { DialogGameManualComponent } from './components/manual/dialog-game-manual/dialog-game-manual.component';
import { ManualComponent } from './components/manual/manual.component';
import { MinorHousesComponent } from './components/minor-houses/minor-houses.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PlayerHandComponent } from './components/player-hand/player-hand.component';
import { PlayerEffectChoiceComponent } from './components/player-reward-choices/player-effect-choice/player-effect-choice.component';
import { PlayerEffectConversionComponent } from './components/player-reward-choices/player-effect-conversion/player-effect-conversion.component';
import { PlayerRewardChoicesComponent } from './components/player-reward-choices/player-reward-choices.component';
import { TechTilesComponent } from './components/tech-tiles/tech-tiles.component';
import { TranslationComponent } from './components/translation/translation.component';
import { TurnInfosComponent } from './components/turn-infos/turn-infos.component';
import { StopPropagationClickDirective } from './directives/stop-propagation-click';
import { AboutComponent } from './pages/about/about.component';
import { CardEditorComponent } from './pages/card-configurator/card-editor/card-editor.component';
import { DialogCardEditorComponent } from './pages/card-configurator/dialog-card-editor/dialog-card-editor.component';
import { ImperiumCardConfiguratorComponent } from './pages/card-configurator/imperium-card-configurator.component';
import { DialogEventEditorComponent } from './pages/event-configurator/dialog-event-editor/dialog-event-editor.component';
import { EventConfiguratorComponent } from './pages/event-configurator/event-configurator.component';
import { EventEditorComponent } from './pages/event-configurator/event-editor/event-editor.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { GameManualComponent } from './pages/game-board/game-manual/game-manual.component';
import { DialogIntrigueEditorComponent } from './pages/intrigue-configurator/dialog-intrigue-editor/dialog-intrigue-editor.component';
import { IntrigueConfiguratorComponent } from './pages/intrigue-configurator/intrigue-configurator.component';
import { IntrigueEditorComponent } from './pages/intrigue-configurator/intrigue-editor/intrigue-editor.component';
import { DialogLeaderEditorComponent } from './pages/leader-configurator/dialog-leader-editor/dialog-leader-editor.component';
import { LeaderConfiguratorComponent } from './pages/leader-configurator/leader-configurator.component';
import { LeaderEditorComponent } from './pages/leader-configurator/leader-editor/leader-editor.component';
import { DialogPlotEditorComponent } from './pages/plot-configurator/dialog-plot-editor/dialog-plot-editor.component';
import { PlotConfiguratorComponent } from './pages/plot-configurator/plot-configurator.component';
import { PlotEditorComponent } from './pages/plot-configurator/plot-editor/plot-editor.component';
import { StartingCardConfiguratorComponent } from './pages/starting-card-configurator/starting-card-configurator.component';
import { DialogTechTileEditorComponent } from './pages/tech-tile-configurator/dialog-tech-tile-editor/dialog-tech-tile-editor.component';
import { TechTileConfiguratorComponent } from './pages/tech-tile-configurator/tech-tile-configurator.component';
import { TechTileEditorComponent } from './pages/tech-tile-configurator/tech-tile-editor/tech-tile-editor.component';
import { DuneSymbolsPipe } from './pipes/dune-symbols';
import { NumberToArrayPipe } from './pipes/number-to-array';
import { SafeUrlPipe } from './pipes/safe-url';

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
    SafeUrlPipe,
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
    TranslationComponent,
    RewardArrayComponent,
    MarkerComponent,
    ConflictCardComponent,
    SoundcloudPlayerComponent,
    NavigationBarComponent,
    TurnInfosComponent,
    GameSummaryDialogComponent,
    PlotCardComponent,
    PlotConfiguratorComponent,
    PlotEditorComponent,
    DialogPlotEditorComponent,
    GameLogComponent,
    AdditionalPlayerActionsDialogComponent,
    DuneVersionUpdaterComponent,
    PlayerEffectChoiceComponent,
    PlayerEffectConversionComponent,
    ManualComponent,
    DialogGameManualComponent,
    HighlightingComponent,
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
    NgxParticlesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
