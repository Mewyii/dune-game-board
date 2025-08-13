import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getCardsFieldAccess } from 'src/app/helpers/cards';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getFieldIsBlocked, getModifiedCostsForField, getModifiedRewardsForField } from 'src/app/helpers/game-modifiers';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { getFlattenedEffectRewardArray } from 'src/app/helpers/rewards';
import { ActionField, EffectType, FactionType, Resource } from 'src/app/models';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { EffectWithModifier, GameModifiersService, RewardWithModifier } from 'src/app/services/game-modifier.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'app-dune-action',
  templateUrl: './dune-action.component.html',
  styleUrls: ['./dune-action.component.scss'],
  standalone: false,
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
  @Input() disabled = false;

  public transparentBackgroundColor: string = '';
  public backgroundGradient: string = '';
  public pathToActionType = '';
  public mouseHover = false;

  public playerOnField: Player | undefined;
  public additionalPlayersOnField: Player[] = [];

  public accumulatedSpice = 0;
  public isHighCouncilField = false;

  public highCouncilSeats: string[] = [];

  public activePlayerId: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;
  public activePlayerResources: Resource[] = [];
  public activePlayerIsAI = false;

  public isAccessibleByPlayer = false;

  public actionCosts: RewardWithModifier[] = [];

  public actionRewards: EffectWithModifier[] = [];

  public isBlocked = false;

  public canPlaceFieldMarkers = false;
  public playerFieldMarkers: { playerId: number; amount: number }[] = [];

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
    const gradientColor1 = this.adjustRGBColor(this.backgroundColor, -16);
    const gradientColor2 = this.adjustRGBColor(this.backgroundColor, -24);
    const gradientColor3 = this.adjustRGBColor(this.backgroundColor, -32);
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
      const player = this.playerManager.getPlayer(this.activePlayerId);

      this.activePlayerTurnState = player?.turnState;
      this.activePlayerResources = player?.resources ?? [];
      this.activePlayerIsAI = player?.isAI ?? false;

      this.isAccessibleByPlayer = this.activePlayerIsAI ? false : this.getPlayerAccessibility();

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

      this.canPlaceFieldMarkers = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'field-marker'
      );
      this.playerFieldMarkers = this.gameModifierService.getPlayerFieldMarkers(this.actionField.title.en);
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.isAccessibleByPlayer = this.activePlayerIsAI ? false : this.getPlayerAccessibility();
    });

    this.playerManager.players$.subscribe((players) => {
      const player = this.playerManager.getPlayer(this.activePlayerId);
      this.activePlayerIsAI = player?.isAI ?? false;

      this.activePlayerTurnState = player?.turnState;
      this.activePlayerResources = player?.resources ?? [];

      this.isAccessibleByPlayer = this.activePlayerIsAI ? false : this.getPlayerAccessibility();
    });

    this.gameManager.accumulatedSpiceOnFields$.subscribe((accumulatedSpice) => {
      const spiceOnField = accumulatedSpice.find((x) => x.fieldId === this.actionField.title.en);
      this.accumulatedSpice = spiceOnField?.amount ?? 0;
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.isAccessibleByPlayer = this.activePlayerIsAI ? false : this.getPlayerAccessibility();
    });

    this.gameModifierService.playerGameModifiers$.subscribe((x) => {
      const fieldCostModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldCost');
      this.actionCosts = getModifiedCostsForField(this.actionField, fieldCostModifiers);

      const fieldRewardModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldReward');
      this.actionRewards = getModifiedRewardsForField(this.actionField, fieldRewardModifiers);

      const fieldBlockModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'fieldBlock');
      this.isBlocked = getFieldIsBlocked(this.actionField, fieldBlockModifiers);

      this.canPlaceFieldMarkers = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'field-marker'
      );
      this.playerFieldMarkers = this.gameModifierService.getPlayerFieldMarkers(this.actionField.title.en);
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
    if (this.disabled) {
      return;
    }

    if (this.gameManager.activePlayerId) {
      this.gameManager.addAgentToField(this.actionField);
    }
  }

  onPlayerMarkerRightClicked(playerId: number, fieldId: string) {
    this.gameManager.removePlayerAgentFromField(playerId, fieldId);
    this.audioManager.playSound('click');
    return false;
  }

  onRewardClicked(fieldId: string, rewardType: EffectType) {
    if (this.disabled) {
      return;
    }

    if (rewardType === 'spice-accumulation') {
      this.gameManager.increaseAccumulatedSpiceOnField(fieldId);
      this.audioManager.playSound('click-soft');
    }
  }

  onRewardRightClicked(fieldId: string, rewardType: EffectType) {
    if (this.disabled) {
      return;
    }

    if (rewardType === 'spice-accumulation') {
      this.gameManager.decreaseAccumulatedSpiceOnField(fieldId);
      this.audioManager.playSound('click-soft');
    }
    return false;
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public trackSpiceOnField(index: number, spiceOnField: number) {
    return index * 100 + spiceOnField;
  }

  public onFieldMarkerChangeClicked(changeAmount: number) {
    this.audioManager.playSound('click-soft');
    this.gameModifierService.changeFieldMarkerModifier(this.activePlayerId, this.actionField.title.en, changeAmount);

    return false;
  }

  private getPlayerAccessibility() {
    const factionInfluenceRequired = this.actionField.requiresInfluence?.type;
    const costs = this.actionField.costs ?? [];
    const playerHand = this.cardsService.getPlayerHand(this.activePlayerId);
    if (!playerHand) {
      return false;
    }

    if (factionInfluenceRequired && isFactionScoreType(factionInfluenceRequired)) {
      const playerScore = this.playerScoreManager.getPlayerScore(this.activePlayerId);
      if (!playerScore || playerScore[factionInfluenceRequired] < 2) {
        return false;
      }
    }

    for (const cost of getFlattenedEffectRewardArray(costs)) {
      const costAmount = cost.amount ?? 1;
      const playerResourceAmount = this.activePlayerResources.find((x) => x.type === cost.type)?.amount ?? 0;
      if (playerResourceAmount < costAmount) {
        return false;
      }
    }

    return getCardsFieldAccess(playerHand.cards).includes(this.actionField.actionType);
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
