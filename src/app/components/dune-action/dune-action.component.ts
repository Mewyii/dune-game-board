import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActionField, FactionType, RewardType } from 'src/app/models';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { boardSettings } from 'src/app/constants/board-settings';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getCardsFactionAndFieldAccess, getCardsFieldAccess } from 'src/app/helpers/cards';
import { GameModifiersService, RewardWithModifier } from 'src/app/services/game-modifier.service';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { PlayersService } from 'src/app/services/players.service';
import { getFieldIsBlocked, getModifiedCostsForField, getModifiedRewardsForField } from 'src/app/helpers/game-modifiers';

@Component({
  selector: 'app-dune-action',
  templateUrl: './dune-action.component.html',
  styleUrls: ['./dune-action.component.scss'],
})
export class DuneActionComponent implements OnInit, OnChanges {
  @Input() actionField: ActionField = {
    title: { de: 'fremenkrieger', en: 'fremen warriors' },
    actionType: 'fremen',
    costs: [{ type: 'water', amount: 1 }],
    rewards: [{ type: 'troop', amount: 2 }],
    pathToImage: 'assets/images/fremen_warriors.jpeg',
  };

  @Input() backgroundColor: string = '';

  @Output() actionFieldClick = new EventEmitter<{ playerId: number }>();

  public transparentBackgroundColor: string = '';
  public backgroundGradient: string = '';
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

  public actionCosts: RewardWithModifier[] = [];

  public actionRewards: RewardWithModifier[] = [];

  public isBlocked = false;

  public canWriteFieldHistory = false;
  public fieldHistoryAmount: number | undefined;

  constructor(
    public gameManager: GameManager,
    public playerManager: PlayersService,
    public ts: TranslateService,
    private audioManager: AudioManager,
    private cardsService: CardsService,
    private playerScoreManager: PlayerScoreManager,
    private gameModifierService: GameModifiersService
  ) {}

  ngOnInit(): void {
    this.actionCosts = this.actionField.costs ?? [];
    this.actionRewards = this.actionField.rewards ?? [];
    this.pathToActionType = getActionTypePath(this.actionField.actionType);
    this.transparentBackgroundColor = this.backgroundColor.replace(')', ' / 50%)');
    const gradientColor1 = this.adjustRGBColor(this.backgroundColor, -15);
    const gradientColor2 = this.adjustRGBColor(this.backgroundColor, -20);
    const gradientColor3 = this.adjustRGBColor(this.backgroundColor, -30);
    this.backgroundGradient =
      'linear-gradient(' + gradientColor1 + ', 5%, ' + gradientColor2 + ', 70%, ' + gradientColor3 + ')';

    this.gameManager.agentsOnFields$.subscribe((agentsOnFields) => {
      const playerIds = agentsOnFields.filter((x) => x.fieldId === this.actionField.title.en).map((x) => x.playerId);
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

      const fieldCostModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldCost');
      this.actionCosts = getModifiedCostsForField(this.actionField, fieldCostModifiers);

      if (this.actionField.title.en.includes('Imperial')) {
        const fieldRewardModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldReward');
        this.actionRewards = getModifiedRewardsForField(this.actionField, fieldRewardModifiers);
      }
      const fieldRewardModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldReward');
      this.actionRewards = getModifiedRewardsForField(this.actionField, fieldRewardModifiers);

      const fieldBlockModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldBlock');
      this.isBlocked = getFieldIsBlocked(this.actionField, fieldBlockModifiers);

      this.canWriteFieldHistory = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'field-history'
      );
      this.fieldHistoryAmount = this.gameModifierService.getPlayerFieldHistoryModifier(
        this.activePlayerId,
        this.actionField.title.en
      )?.changeAmount;
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.isAccessibleByPlayer = this.getPlayerAccessibility();
    });

    this.playerManager.players$.subscribe((players) => {
      this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;
    });

    this.gameManager.accumulatedSpiceOnFields$.subscribe((accumulatedSpice) => {
      const spiceOnField = accumulatedSpice.find((x) => x.fieldId === this.actionField.title.en);
      this.accumulatedSpice = spiceOnField?.amount ?? 0;
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.isAccessibleByPlayer = this.getPlayerAccessibility();
    });

    this.gameModifierService.playerGameModifiers$.subscribe((x) => {
      const fieldCostModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldCost');
      this.actionCosts = getModifiedCostsForField(this.actionField, fieldCostModifiers);

      const fieldRewardModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldReward');
      this.actionRewards = getModifiedRewardsForField(this.actionField, fieldRewardModifiers);

      const fieldBlockModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldBlock');
      this.isBlocked = getFieldIsBlocked(this.actionField, fieldBlockModifiers);

      this.canWriteFieldHistory = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'field-history'
      );
      this.fieldHistoryAmount = this.gameModifierService.getPlayerFieldHistoryModifier(
        this.activePlayerId,
        this.actionField.title.en
      )?.changeAmount;
    });

    this.isHighCouncilField = this.actionField.rewards.some(
      (x) => x.type === 'council-seat-small' || x.type === 'council-seat-large'
    );
    if (this.isHighCouncilField) {
      this.playerManager.players$.subscribe((players) => {
        this.highCouncilSeats = players.filter((x) => x.hasCouncilSeat).map((x) => x.color);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.actionCosts = this.actionField.costs ?? [];
    this.actionRewards = this.actionField.rewards ?? [];
  }

  public onActionFieldClicked() {
    const currentPlayerId = this.gameManager.activePlayerId;

    if (currentPlayerId) {
      const playerAgentCount = this.gameManager.getAvailableAgentCountForPlayer(currentPlayerId);

      if (playerAgentCount > 0 && !this.isBlocked) {
        this.gameManager.addAgentToField(this.actionField);
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

  public onFieldHistoryChangeClicked(changeAmount: number) {
    this.audioManager.playSound('click-soft');
    this.gameModifierService.changeFieldHistoryModifier(this.activePlayerId, this.actionField.title.en, changeAmount);

    return false;
  }

  private getPlayerAccessibility() {
    const factionRequiredType = this.actionField.requiresInfluence?.type;
    const playerHand = this.cardsService.getPlayerHand(this.activePlayerId);
    if (!playerHand) {
      return false;
    }

    if (!factionRequiredType || !isFactionScoreType(factionRequiredType)) {
      return getCardsFieldAccess(playerHand.cards).includes(this.actionField.actionType);
    } else {
      const playerScore = this.playerScoreManager.getPlayerScore(this.activePlayerId);
      if (playerScore) {
        if (playerScore[factionRequiredType] > 1) {
          return getCardsFieldAccess(playerHand.cards).includes(this.actionField.actionType);
        }
      }
      return getCardsFactionAndFieldAccess(playerHand.cards).some(
        (x) => x.faction === factionRequiredType && x.actionType.includes(this.actionField.actionType)
      );
    }
    return false;
  }

  private adjustRGBColor(rgb: string, amount: number) {
    const regex = /rgb\((\d+), (\d+), (\d+)\)/;
    const match = rgb.match(regex);

    if (match) {
      let r = parseInt(match[1], 10);
      let g = parseInt(match[2], 10);
      let b = parseInt(match[3], 10);

      r = Math.max(0, r + amount);
      g = Math.max(0, g + amount);
      b = Math.max(0, b + amount);

      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return rgb;
    }
  }
}
