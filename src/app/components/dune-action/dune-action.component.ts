import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionField, FactionType, RewardType } from 'src/app/models';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { boardSettings } from 'src/app/constants/board-settings';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager, PlayerTurnState } from 'src/app/services/player-manager.service';
import { TranslateService } from 'src/app/services/translate-service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { PlayerScore, PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getCardsFactionAndFieldAccess, getCardsFieldAccess } from 'src/app/helpers/cards';

@Component({
  selector: 'app-dune-action',
  templateUrl: './dune-action.component.html',
  styleUrls: ['./dune-action.component.scss'],
})
export class DuneActionComponent implements OnInit {
  @Input() action: ActionField = {
    title: { de: 'fremenkrieger', en: 'fremen warriors' },
    actionType: 'fremen',
    costs: [{ type: 'water', amount: 1 }],
    rewards: [{ type: 'troop', amount: 2 }],
    pathToImage: 'assets/images/fremen_warriors.jpeg',
  };

  @Input() backgroundColor: string = '';

  @Output() actionFieldClick = new EventEmitter<{ playerId: number }>();

  public transparentBackgroundColor: string = '';
  public pathToActionType = '';
  public boardSettings = boardSettings;

  public playerOnField: Player | undefined;
  public additionalPlayersOnField: Player[] = [];

  public accumulatedSpice = 0;
  public isHighCouncilField = false;

  public highCouncilSeats: string[] = [];

  public activePlayerId: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;

  public isAccessibleByPlayer = false;

  constructor(
    public gameManager: GameManager,
    public playerManager: PlayerManager,
    public ts: TranslateService,
    private audioManager: AudioManager,
    private cardsService: CardsService,
    private playerScoreManager: PlayerScoreManager
  ) {}

  ngOnInit(): void {
    this.pathToActionType = getActionTypePath(this.action.actionType);
    this.transparentBackgroundColor = this.backgroundColor.replace(')', ' / 50%)');

    this.gameManager.agentsOnFields$.subscribe((agentsOnFields) => {
      const playerIds = agentsOnFields.filter((x) => x.fieldId === this.action.title.en).map((x) => x.playerId);
      if (playerIds.length > 0) {
        const firstPlayerId = playerIds.shift()!;
        const players = this.playerManager.getPlayers();
        this.playerOnField = players.find((x) => x.id === firstPlayerId);

        this.additionalPlayersOnField = [];
        for (const playerId of playerIds) {
          const playerOnField = players.find((x) => x.id === playerId);
          if (playerOnField) {
            this.additionalPlayersOnField.push(playerOnField);
          }
        }
      } else {
        this.additionalPlayersOnField = [];
        this.playerOnField = undefined;
      }
    });

    this.gameManager.activePlayerId$.subscribe((playerId) => {
      this.activePlayerId = playerId;

      this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;

      this.isAccessibleByPlayer = this.getPlayerAccessibility();
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.isAccessibleByPlayer = this.getPlayerAccessibility();
    });

    this.playerManager.players$.subscribe((players) => {
      this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;
    });

    this.gameManager.accumulatedSpiceOnFields$.subscribe((accumulatedSpice) => {
      const spiceOnField = accumulatedSpice.find((x) => x.fieldId === this.action.title.en);
      this.accumulatedSpice = spiceOnField?.amount ?? 0;
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.isAccessibleByPlayer = this.getPlayerAccessibility();
    });

    this.isHighCouncilField = this.action.rewards.some(
      (x) => x.type === 'council-seat-small' || x.type === 'council-seat-large'
    );
    if (this.isHighCouncilField) {
      this.playerManager.players$.subscribe((players) => {
        this.highCouncilSeats = players.filter((x) => x.hasCouncilSeat).map((x) => x.color);
      });
    }
  }

  public onActionFieldClicked() {
    const currentPlayerId = this.gameManager.activePlayerId;

    if (currentPlayerId) {
      const playerAgentCount = this.gameManager.getAvailableAgentCountForPlayer(currentPlayerId);

      if (playerAgentCount > 0) {
        this.gameManager.addAgentToField(this.action);
        this.actionFieldClick.emit({ playerId: currentPlayerId });
        this.audioManager.playSound('click');
      }
    }
  }

  onPlayerMarkerRightClicked(playerId: number, fieldId: string) {
    this.gameManager.removePlayerAgentFromField(playerId, fieldId);
    this.audioManager.playSound('click');
    return false;
  }

  onRewardClicked(fieldId: string, rewardType: RewardType) {
    if (rewardType === 'spice-accumulation') {
      this.gameManager.increaseAccumulatedSpiceOnField(fieldId);
      this.audioManager.playSound('click-soft');
    }
  }

  onRewardRightClicked(fieldId: string, rewardType: RewardType) {
    if (rewardType === 'spice-accumulation') {
      this.gameManager.decreaseAccumulatedSpiceOnField(fieldId);
      this.audioManager.playSound('click-soft');
    }
    return false;
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  public trackPlayersOnField(index: number, playerOnField: Player) {
    return playerOnField.id;
  }

  public trackSpiceOnField(index: number, spiceOnField: number) {
    return spiceOnField;
  }

  private getPlayerAccessibility() {
    const factionRequiredType = this.action.requiresInfluence?.type;
    const playerHand = this.cardsService.getPlayerHand(this.activePlayerId);
    if (!playerHand) {
      return false;
    }

    if (!factionRequiredType || !isFactionScoreType(factionRequiredType)) {
      return getCardsFieldAccess(playerHand.cards).includes(this.action.actionType);
    } else {
      const playerScore = this.playerScoreManager.getPlayerScore(this.activePlayerId);
      if (playerScore) {
        if (playerScore[factionRequiredType] > 1) {
          return getCardsFieldAccess(playerHand.cards).includes(this.action.actionType);
        }
      }
      return getCardsFactionAndFieldAccess(playerHand.cards).some(
        (x) => x.faction === factionRequiredType && x.actionType.includes(this.action.actionType)
      );
    }
    return false;
  }
}
