import { Component, Input, OnInit } from '@angular/core';
import { aiPersonalities } from 'src/app/constants/ai';
import { Player } from 'src/app/models/player';
import { AIPlayer, AIPlayersService } from 'src/app/services/ai/ai-players.service';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-ai-tile',
  templateUrl: './ai-tile.component.html',
  styleUrls: ['./ai-tile.component.scss'],
  standalone: false,
})
export class AITileComponent implements OnInit {
  @Input() showDetails = false;

  activeAIPlayerId: number = 0;
  activePlayer: Player | undefined;
  activeAIPlayer: AIPlayer | undefined;

  constructor(
    public t: TranslateService,
    private gameManager: GameManager,
    private aiManager: AIManager,
    private aIPlayersService: AIPlayersService,
  ) {}

  ngOnInit(): void {
    this.aIPlayersService.activeAIPlayerId$.subscribe((playerId) => {
      this.activeAIPlayerId = playerId;
      this.activeAIPlayer = this.aIPlayersService.getAIPlayer(playerId);
    });

    this.aIPlayersService.aiPlayers$.subscribe((aiPlayers) => {
      this.activeAIPlayer = aiPlayers.find((x) => x.playerId === this.activePlayer?.id);
    });

    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
    });
  }

  onChangeFieldAccessClicked(canAccessBlockedFields: boolean) {
    if (!this.activePlayer) {
      return;
    }

    this.aIPlayersService.setAccessToBlockedFieldsForPlayer(this.activeAIPlayerId, canAccessBlockedFields);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onSetNextAIPersonalityClicked() {
    if (!this.activePlayer || !this.activeAIPlayer) {
      return;
    }

    const personalityName = this.activeAIPlayer.name;
    const keys = Object.keys(aiPersonalities);
    const nextIndex = keys.indexOf(personalityName) + 1;
    if (nextIndex < keys.length) {
      const nextPersonalityName = keys[nextIndex];

      const personality = (aiPersonalities as any)[nextPersonalityName];

      this.aIPlayersService.setAIPersonalityToPlayer(this.activeAIPlayerId, nextPersonalityName, personality);
      this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
    }
  }

  onSetPreviousAIPersonalityClicked() {
    if (!this.activePlayer || !this.activeAIPlayer) {
      return;
    }

    const personalityName = this.activeAIPlayer.name;
    const keys = Object.keys(aiPersonalities);
    const previousIndex = keys.indexOf(personalityName) - 1;
    if (previousIndex >= 0) {
      const previousPersonalityName = keys[previousIndex];

      const personality = (aiPersonalities as any)[previousPersonalityName];

      this.aIPlayersService.setAIPersonalityToPlayer(this.activeAIPlayerId, previousPersonalityName, personality);
      this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
    }
  }
}
