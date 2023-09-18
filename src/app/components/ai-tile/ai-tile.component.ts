import { Component, OnInit } from '@angular/core';
import { AIDIfficultyTypes, AIManager, AIPlayer, AIVariableValues, AIVariables } from 'src/app/services/ai/ai.manager';
import { aiPersonalities } from 'src/app/services/ai/constants';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-ai-tile',
  templateUrl: './ai-tile.component.html',
  styleUrls: ['./ai-tile.component.scss'],
})
export class AITileComponent implements OnInit {
  public currentAIPlayerId: number = 0;
  public currentPlayer: Player | undefined;
  public currentAIPlayer: AIPlayer | undefined;
  public aiVariables: AIVariables | undefined;
  public aiDifficulty: AIDIfficultyTypes | undefined;
  public showDetails = false;

  constructor(
    public translateService: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayerManager,
    public aiManager: AIManager
  ) {}

  ngOnInit(): void {
    this.aiManager.currentAIPlayerId$.subscribe((playerId) => {
      this.currentAIPlayerId = playerId;

      this.currentPlayer = this.playerManager.getPlayer(playerId);
      this.currentAIPlayer = this.aiManager.getAIPlayer(playerId);
    });

    this.aiManager.aiPlayers$.subscribe((aiPlayers) => {
      this.currentAIPlayer = aiPlayers.find((x) => x.playerId === this.currentPlayer?.id);
    });

    this.aiManager.aiVariables$.subscribe((aiVariables) => {
      this.aiVariables = aiVariables;
    });

    this.aiManager.aiDifficulty$.subscribe((aiDifficulty) => {
      this.aiDifficulty = aiDifficulty;
    });

    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.currentAIPlayerId);
    });
  }

  onAddCardToDeckClicked(id: number) {
    this.playerManager.addCardsToPlayerDeck(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveCardFromDeckClicked(id: number) {
    this.playerManager.removeCardsFromPlayerDeck(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onBoughtCardClicked(id: number) {
    this.playerManager.boughtCardsFromImperiumRow(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onAddFocusTokenClicked(id: number) {
    this.playerManager.addFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveFocusTokenClicked(id: number) {
    this.playerManager.removeFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onTrimCardClicked(id: number) {
    this.playerManager.trimCardsFromPlayerDeck(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onAddIntrigueClicked(id: number) {
    this.playerManager.addIntriguesToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveIntrigueClicked(id: number) {
    this.playerManager.removeIntriguesFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onAddTechAgentClicked(id: number) {
    this.playerManager.addTechAgentsToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveTechAgentClicked(id: number) {
    this.playerManager.removeTechAgentsFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  getAIVariable(variableType: keyof AIVariables) {
    return this.aiVariables ? this.aiVariables[variableType] : undefined;
  }

  setAIVariable(variableType: keyof AIVariables, value: AIVariableValues) {
    this.aiManager.setAIVariable(variableType, value);

    this.gameManager.setPreferredFieldsForAIPlayer(this.currentAIPlayerId);
  }

  setAIDifficulty(aiDifficulty: AIDIfficultyTypes) {
    this.aiManager.setAIDifficulty(aiDifficulty);
  }

  onChangeFieldAccessClicked(canAccessBlockedFields: boolean) {
    this.aiManager.setAccessToBlockedFieldsForPlayer(this.currentAIPlayerId, canAccessBlockedFields);

    this.gameManager.setPreferredFieldsForAIPlayer(this.currentAIPlayerId);
  }

  onSetNextAIPersonalityClicked() {
    const personalityName = this.currentAIPlayer?.name;
    if (personalityName) {
      const keys = Object.keys(aiPersonalities);
      const nextIndex = keys.indexOf(personalityName) + 1;
      if (nextIndex < keys.length) {
        const nextPersonalityName = keys[nextIndex];

        const personality = (aiPersonalities as any)[nextPersonalityName];

        this.aiManager.setAIPersonalityToPlayer(this.currentAIPlayerId, nextPersonalityName, personality);
        this.gameManager.setPreferredFieldsForAIPlayer(this.currentAIPlayerId);
      }
    }
  }

  onSetPreviousAIPersonalityClicked() {
    const personalityName = this.currentAIPlayer?.name;
    if (personalityName) {
      const keys = Object.keys(aiPersonalities);
      const previousIndex = keys.indexOf(personalityName) - 1;
      if (previousIndex >= 0) {
        const previousPersonalityName = keys[previousIndex];

        const personality = (aiPersonalities as any)[previousPersonalityName];

        this.aiManager.setAIPersonalityToPlayer(this.currentAIPlayerId, previousPersonalityName, personality);
        this.gameManager.setPreferredFieldsForAIPlayer(this.currentAIPlayerId);
      }
    }
  }
}
