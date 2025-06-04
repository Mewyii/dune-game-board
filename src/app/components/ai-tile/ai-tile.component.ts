import { Component, Input, OnInit } from '@angular/core';
import { aiPersonalities } from 'src/app/constants/ai';
import { Player } from 'src/app/models/player';
import { AIManager, AIPlayer } from 'src/app/services/ai/ai.manager';
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

  public activeAIPlayerId: number = 0;
  public activePlayer: Player | undefined;
  public activeAIPlayer: AIPlayer | undefined;

  constructor(public t: TranslateService, public gameManager: GameManager, public aiManager: AIManager) {}

  ngOnInit(): void {
    this.aiManager.activeAIPlayerId$.subscribe((playerId) => {
      this.activeAIPlayerId = playerId;
      this.activeAIPlayer = this.aiManager.getAIPlayer(playerId);
    });

    this.aiManager.aiPlayers$.subscribe((aiPlayers) => {
      this.activeAIPlayer = aiPlayers.find((x) => x.playerId === this.activePlayer?.id);
    });

    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
    });
  }

  onChangeFieldAccessClicked(canAccessBlockedFields: boolean) {
    this.aiManager.setAccessToBlockedFieldsForPlayer(this.activeAIPlayerId, canAccessBlockedFields);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activeAIPlayerId);
  }

  onSetNextAIPersonalityClicked() {
    const personalityName = this.activeAIPlayer?.name;
    if (personalityName) {
      const keys = Object.keys(aiPersonalities);
      const nextIndex = keys.indexOf(personalityName) + 1;
      if (nextIndex < keys.length) {
        const nextPersonalityName = keys[nextIndex];

        const personality = (aiPersonalities as any)[nextPersonalityName];

        this.aiManager.setAIPersonalityToPlayer(this.activeAIPlayerId, nextPersonalityName, personality);
        this.gameManager.setPreferredFieldsForAIPlayer(this.activeAIPlayerId);
      }
    }
  }

  onSetPreviousAIPersonalityClicked() {
    const personalityName = this.activeAIPlayer?.name;
    if (personalityName) {
      const keys = Object.keys(aiPersonalities);
      const previousIndex = keys.indexOf(personalityName) - 1;
      if (previousIndex >= 0) {
        const previousPersonalityName = keys[previousIndex];

        const personality = (aiPersonalities as any)[previousPersonalityName];

        this.aiManager.setAIPersonalityToPlayer(this.activeAIPlayerId, previousPersonalityName, personality);
        this.gameManager.setPreferredFieldsForAIPlayer(this.activeAIPlayerId);
      }
    }
  }
}
