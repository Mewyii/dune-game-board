import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player';
import { AIManager, AIPlayer, AIVariableValues, AIVariables } from 'src/app/services/ai/ai.manager';
import { aiPersonalities } from 'src/app/services/ai/constants';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayersService } from 'src/app/services/players.service';
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

  public showDetails = false;

  constructor(
    public translateService: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayersService,
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

    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.currentAIPlayerId);
    });
  }

  getAIVariable(variableType: keyof AIVariables) {
    return this.aiVariables ? this.aiVariables[variableType] : undefined;
  }

  setAIVariable(variableType: keyof AIVariables, value: AIVariableValues) {
    this.aiManager.setAIVariable(variableType, value);

    this.gameManager.setPreferredFieldsForAIPlayer(this.currentAIPlayerId);
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
