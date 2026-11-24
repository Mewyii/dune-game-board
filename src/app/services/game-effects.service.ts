import { Injectable } from '@angular/core';
import { getRandomElementFromArray } from '../helpers/common';
import { getFactionScoreTypeFromCost, getFactionScoreTypeFromReward } from '../helpers/faction-score';
import { getFactionInfluenceModifier, getModifiedLocationTakeoverTroopCosts } from '../helpers/game-modifiers';
import { isResourceType } from '../helpers/resources';
import {
  getMultipliedRewardEffects,
  getStructuredEffectTargets,
  isChoiceEffectType,
  isConversionEffectType,
  isEffectConditionFullfilled,
  isEffectTimingFullfilled,
  isFactionScoreCostType,
  isFactionScoreRewardType,
  isStructuredChoiceEffect,
  isStructuredConversionEffect,
  isStructuredRewardEffect,
} from '../helpers/rewards';
import {
  EffectPlayerTurnTiming,
  EffectReward,
  StructuredChoiceEffect,
  StructuredConversionEffect,
  StructuredEffect,
} from '../models';

import { GameState } from '../models/ai';
import { Player } from '../models/player';
import { AudioManager } from './audio-manager.service';
import { BoardSpacesService } from './board-spaces.service';
import { CardsService } from './cards.service';
import { CombatManager } from './combat-manager.service';
import { ConflictsService } from './conflicts.service';
import { GameElement } from './game-manager.service';
import { GameModifiersService } from './game-modifier.service';
import { IntriguesService } from './intrigues.service';
import { LeadersService } from './leaders.service';
import { LocationsService } from './location-manager.service';
import { LoggingService } from './log.service';
import { PlayerAgentsService } from './player-agents.service';
import { PlayerResourcesService } from './player-resources.service';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { PlayerFactionScoreType, PlayerScoreManager } from './player-score-manager.service';
import { TurnInfoService } from './player-turn-info.service';
import { PlayersService } from './players.service';
import { RoundService } from './round.service';
import { SettingsService } from './settings.service';
import { TechTilesService } from './tech-tiles.service';
import { TranslateService } from './translate-service';

@Injectable({
  providedIn: 'root',
})
export class EffectsService {
  constructor(
    private playerScoreManager: PlayerScoreManager,
    private playersService: PlayersService,
    private combatManager: CombatManager,
    private boardSpacesService: BoardSpacesService,
    private locationsService: LocationsService,
    private loggingService: LoggingService,
    private leadersService: LeadersService,
    private conflictsService: ConflictsService,
    private techTilesService: TechTilesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private cardsService: CardsService,
    private gameModifiersService: GameModifiersService,
    private t: TranslateService,
    private intriguesService: IntriguesService,
    private turnInfoService: TurnInfoService,
    private playerAgentsService: PlayerAgentsService,
    private playersResourcesService: PlayerResourcesService,
    private roundService: RoundService,
    private playerRewardChoicesService: PlayerRewardChoicesService,
  ) {}

  resolveStructuredEffects(
    structuredEffects: StructuredEffect[],
    player: Player,
    gameState: GameState,
    gameElement?: GameElement,
    timing?: EffectPlayerTurnTiming,
  ) {
    const effects = structuredEffects;
    for (const effect of effects) {
      this.resolveStructuredEffect(effect, player, gameState, gameElement, timing);
    }
  }

  resolveStructuredEffect(
    structuredEffect: StructuredEffect,
    player: Player,
    gameState: GameState,
    gameElement?: GameElement,
    timing?: EffectPlayerTurnTiming,
  ) {
    let timingFullfilled = true;
    let conditionFullfilled = true;
    if (structuredEffect.timing) {
      timingFullfilled = isEffectTimingFullfilled(structuredEffect.timing.type, player, gameState);
    }
    if (structuredEffect.condition) {
      conditionFullfilled = isEffectConditionFullfilled(structuredEffect.condition, player, gameState, timing, gameElement);
    }

    if (timingFullfilled && conditionFullfilled) {
      if (isStructuredRewardEffect(structuredEffect)) {
        const players: Player[] = getStructuredEffectTargets(structuredEffect, player, gameState);
        for (const player of players) {
          const rewards = getMultipliedRewardEffects(structuredEffect, gameState, timing);

          for (const reward of rewards) {
            this.addRewardToPlayer(player.id, reward, { gameElement, source: gameElement?.type });
          }
        }
      } else if (isStructuredChoiceEffect(structuredEffect)) {
        this.resolveStructuredChoiceEffect(structuredEffect, player.id, gameElement);
      } else if (isStructuredConversionEffect(structuredEffect)) {
        this.resolveStructuredConversionEffect(structuredEffect, player.id, gameElement);
      }
    }
  }

  private resolveStructuredChoiceEffect(
    structuredChoiceEffect: StructuredChoiceEffect,
    playerId: number,
    element?: GameElement,
  ) {
    if (isChoiceEffectType(structuredChoiceEffect.type)) {
      this.playerRewardChoicesService.addPlayerEitherOrChoice(playerId, { ...structuredChoiceEffect, element });
    }
  }

  private resolveStructuredConversionEffect(
    structuredChoiceEffect: StructuredConversionEffect,
    playerId: number,
    element?: GameElement,
  ) {
    if (isConversionEffectType(structuredChoiceEffect.type)) {
      this.playerRewardChoicesService.addPlayerConversionChoice(playerId, { ...structuredChoiceEffect, element });
    }
  }

  addRewardToPlayer(
    playerId: number,
    reward: EffectReward,
    additionalInfos?: { gameElement?: GameElement; source?: string; valuesCanBeNegative?: boolean },
  ) {
    const playerGameModifier = this.gameModifiersService.getPlayerGameModifiers(playerId);

    const rewardType = reward.type;
    const rewardAmount = reward.amount ?? 1;
    const gameElement = additionalInfos?.gameElement;
    if (isResourceType(rewardType)) {
      if (rewardType === 'solari') {
        this.audioManager.playSound('solari', rewardAmount);
      } else if (rewardType === 'water') {
        this.audioManager.playSound('water', rewardAmount);
      } else if (rewardType === 'spice') {
        this.audioManager.playSound('spice', rewardAmount);
      } else if (rewardType === 'focus') {
        this.audioManager.playSound('focus');
      } else if (rewardType === 'leader-heal') {
        this.audioManager.playSound('leader-heal');
      } else if (rewardType === 'signet') {
        this.audioManager.playSound('signet');
      }

      this.playersResourcesService.addResourceToPlayer(
        playerId,
        rewardType,
        rewardAmount,
        additionalInfos?.valuesCanBeNegative,
      );
    } else if (rewardType === 'tech') {
      this.audioManager.playSound('tech-agent', rewardAmount);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { canBuyTech: true });
    } else if (rewardType == 'tech-or-solari') {
      const choiceEffect: StructuredChoiceEffect = {
        type: 'helper-or',
        effectLeft: {
          type: 'reward',
          effectRewards: [{ type: 'tech' }],
        },
        effectRight: {
          type: 'reward',
          effectRewards: [{ type: 'solari' }],
        },
      };
      this.playerRewardChoicesService.addPlayerEitherOrChoice(playerId, choiceEffect);
    } else if (rewardType === 'shipping') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'shipping',
        amount: rewardAmount,
      });
    } else if (isFactionScoreRewardType(rewardType)) {
      this.audioManager.playSound('influence');

      const scoreType = getFactionScoreTypeFromReward(reward);
      const factionInfluenceModifier = getFactionInfluenceModifier(playerGameModifier, scoreType);
      if (factionInfluenceModifier) {
        if (factionInfluenceModifier.noInfluence) {
          if (factionInfluenceModifier.alternateReward) {
            this.addRewardToPlayer(playerId, factionInfluenceModifier.alternateReward);
          }
        }
      } else {
        const factionRewards = this.playerScoreManager.addFactionScore(
          playerId,
          scoreType as PlayerFactionScoreType,
          1,
          this.roundService.currentRound,
        );

        for (const reward of factionRewards) {
          this.addRewardToPlayer(playerId, reward, { gameElement, source: 'Influence' });
        }
      }
    } else if (rewardType === 'faction-influence-up-choice') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'faction-influence-up-choice',
        amount: rewardAmount,
      });
    } else if (rewardType === 'faction-influence-up-twice-choice') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'faction-influence-up-twice-choice',
        amount: rewardAmount,
      });
    } else if (isFactionScoreCostType(rewardType)) {
      this.audioManager.playSound('fog');

      const scoreType = getFactionScoreTypeFromCost(reward);

      this.playerScoreManager.removePlayerScore(
        playerId,
        scoreType as PlayerFactionScoreType,
        1,
        this.roundService.currentRound,
      );
    } else if (rewardType === 'faction-influence-down-choice') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'faction-influence-down-choice',
        amount: rewardAmount,
      });
    } else if (rewardType === 'intrigue') {
      this.audioManager.playSound('intrigue', rewardAmount);
      this.intriguesService.drawPlayerIntriguesFromDeck(playerId, rewardAmount);

      const maxPlayerIntrigueCount = this.settingsService.getMaxPlayerIntrigueCount();
      const newPlayerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(playerId);
      if (maxPlayerIntrigueCount && newPlayerIntrigueCount > maxPlayerIntrigueCount) {
        this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
          type: 'intrigue-trash',
          amount: rewardAmount,
        });
      }
    } else if (rewardType === 'intrigue-trash') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'intrigue-trash',
        amount: rewardAmount,
      });
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', rewardAmount);
      this.combatManager.addPlayerTroopsToGarrison(playerId, rewardAmount);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGained: rewardAmount });
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(playerId, 1);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { dreadnoughtsGained: rewardAmount });
    } else if (rewardType === 'card-draw') {
      this.audioManager.playSound('card-draw');
      this.cardsService.drawPlayerCardsFromDeck(playerId, rewardAmount);
    } else if (rewardType === 'card-trash') {
      this.audioManager.playSound('sword');
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, { type: 'card-trash', amount: rewardAmount });
    } else if (rewardType === 'card-trash-from-hand') {
      this.audioManager.playSound('sword');
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'card-trash-from-hand',
        amount: rewardAmount,
      });
    } else if (rewardType === 'card-trash-in-play') {
      this.audioManager.playSound('sword');
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, { type: 'card-trash-in-play', amount: rewardAmount });
    } else if (rewardType == 'card-draw-or-destroy') {
      const choiceEffect: StructuredChoiceEffect = {
        type: 'helper-or',
        effectLeft: {
          type: 'reward',
          effectRewards: [{ type: 'card-draw' }],
        },
        effectRight: {
          type: 'reward',
          effectRewards: [{ type: 'focus' }],
        },
      };
      this.playerRewardChoicesService.addPlayerEitherOrChoice(playerId, choiceEffect);
    } else if (rewardType === 'card-discard') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'card-discard',
        amount: rewardAmount,
      });
    } else if (rewardType == 'sword') {
      this.audioManager.playSound('sword');
      this.combatManager.addAdditionalCombatPowerToPlayer(playerId, rewardAmount);
    } else if (rewardType === 'council-seat-small' || rewardType === 'council-seat-large') {
      this.addHighCouncilSeatIfPossible(playerId);
    } else if (rewardType === 'sword-master' || rewardType === 'agent') {
      this.addSwordmasterIfPossible(playerId);
      this.playerAgentsService.addPlayerAgent(playerId);
    } else if (rewardType === 'mentat') {
      this.playerAgentsService.addPlayerAgent(playerId);
    } else if (rewardType === 'agent-lift') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'agent-lift',
        amount: rewardAmount,
      });
    } else if (rewardType === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(playerId, 'victoryPoints', rewardAmount, this.roundService.currentRound);
      this.loggingService.logPlayerGainedVictoryPoint(playerId, this.roundService.currentRound, additionalInfos?.source);
      return;
    } else if (rewardType === 'foldspace') {
      this.audioManager.playSound('card-draw');
      const foldspaceCard = this.settingsService.getCustomCards()?.find((x) => x.type === 'foldspace');

      if (foldspaceCard) {
        const acquireLocation = this.settingsService.getCardAcquiringRuleFoldspace();
        if (acquireLocation === 'discard-pile') {
          this.cardsService.addCardToPlayerDiscardPile(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        } else if (acquireLocation === 'below-deck') {
          this.cardsService.addCardUnderPlayerDeck(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        } else if (acquireLocation === 'above-deck') {
          this.cardsService.addCardOnTopOfPlayerDeck(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        } else {
          this.cardsService.addCardToPlayerHand(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        }
      }
    } else if (rewardType === 'location-control') {
      const currentConflict = this.conflictsService.currentConflict;
      if (currentConflict && currentConflict.boardSpaceId) {
        const playerLocation = this.locationsService.ownedLocations.find(
          (x) => x.locationId === currentConflict.boardSpaceId,
        );
        if (!playerLocation) {
          this.audioManager.playSound('location-control');
          this.locationsService.setLocationOwner(currentConflict.boardSpaceId, playerId);
          this.addRewardToPlayer(playerId, { type: 'victory-point' }, { source: 'Location' });
          this.loggingService.logPlayerGainedLocationControl(
            playerId,
            this.roundService.currentRound,
            currentConflict.boardSpaceId,
          );
        } else if (playerLocation.playerId !== playerId) {
          const garrisonedTroops = this.combatManager.getPlayerTroopsInGarrison(playerId);
          const effectiveTakeOverTroopCosts = getModifiedLocationTakeoverTroopCosts(
            this.settingsService.getLocationTakeoverTroopCosts(),
            this.boardSpacesService.getBoardSpace(currentConflict.boardSpaceId),
            this.gameModifiersService.getPlayerGameModifier(playerId, 'locationTakeoverTroopCosts'),
          );

          if (garrisonedTroops >= effectiveTakeOverTroopCosts) {
            this.audioManager.playSound('location-control');
            if (effectiveTakeOverTroopCosts > 0) {
              this.payCostForPlayer(playerId, { type: 'loose-troop', amount: effectiveTakeOverTroopCosts });
            }
            this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' }, { source: 'Location-Loss' });
            this.locationsService.setLocationOwner(currentConflict.boardSpaceId, playerId);
            this.addRewardToPlayer(playerId, { type: 'victory-point' }, { source: 'Location' });
            this.loggingService.logPlayerGainedLocationControl(
              playerId,
              this.roundService.currentRound,
              currentConflict.boardSpaceId,
            );
          }
        }
      }
    } else if (rewardType === 'location-control-choice') {
      this.audioManager.playSound('location-control');
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'location-control-choice',
        amount: rewardAmount,
      });
    } else if (rewardType === 'signet-ring') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'signet-ring',
        amount: rewardAmount,
      });
    } else if (rewardType === 'trash-self') {
      if (gameElement && gameElement.type === 'imperium-card') {
        this.cardsService.trashPlayerHandCard(playerId, gameElement.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(gameElement.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [gameElement.object] });
      } else if (gameElement && gameElement.type === 'tech-tile') {
        this.techTilesService.trashPlayerTechTile(gameElement.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (rewardType === 'tech-tile-flip') {
      if (gameElement && gameElement.type === 'tech-tile') {
        this.techTilesService.flipTechTile(gameElement.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [gameElement.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (rewardType === 'combat') {
      this.audioManager.playSound('combat');

      let deployableUnits = this.settingsService.getCombatMaxDeployableUnits();
      const combatModifier = this.gameModifiersService.getPlayerGameModifier(playerId, 'combat');
      if (combatModifier && combatModifier.combatMaxDeployableUnits) {
        deployableUnits = combatModifier.combatMaxDeployableUnits;
      }

      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: true, deployableUnits });
    } else if (rewardType === 'intrigue-draw') {
      const enemiesIntrigues = this.intriguesService.getEnemyIntrigues(playerId).filter((x) => x.intrigues.length > 3);
      for (const enemyIntrigues of enemiesIntrigues) {
        const stolenIntrigue = getRandomElementFromArray(enemyIntrigues.intrigues);
        this.intriguesService.trashPlayerIntrigue(enemyIntrigues.playerId, stolenIntrigue.id);
        this.intriguesService.addPlayerIntrigue(playerId, stolenIntrigue);
        this.loggingService.logPlayerStoleIntrigue(playerId, enemyIntrigues.playerId);
      }
    } else if (rewardType === 'recruitment-bene') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['bene'] });
    } else if (rewardType === 'recruitment-fremen') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['fremen'] });
    } else if (rewardType === 'recruitment-guild') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['guild'] });
    } else if (rewardType === 'recruitment-emperor') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['emperor'] });
    } else if (rewardType === 'troop-insert') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableTroops: rewardAmount });
    } else if (rewardType === 'troop-insert-or-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableTroops: rewardAmount });
    } else if (rewardType === 'troop-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { retreatableTroops: rewardAmount });
    } else if (rewardType === 'dreadnought-insert') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableDreadnoughts: rewardAmount });
    } else if (rewardType === 'dreadnought-insert-or-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableDreadnoughts: rewardAmount });
    } else if (rewardType === 'dreadnought-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { retreatableDreadnoughts: rewardAmount });
    } else if (rewardType === 'card-return-to-hand') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'card-return-to-hand',
        amount: rewardAmount,
      });
    } else if (rewardType === 'leader-wound') {
      this.audioManager.playSound('leader-wound');
      this.leadersService.flipLeader(playerId);
    } else if (rewardType === 'turn-pass') {
      this.turnInfoService.setPlayerTurnInfo(playerId, { needsToPassTurn: true });
    }
    this.loggingService.logPlayerResourceGained(playerId, rewardType, rewardAmount);
  }

  payCostForPlayer(playerId: number, cost: EffectReward, additionalInfos?: { gameElement?: GameElement; source?: string }) {
    const costType = cost.type;
    const costAmount = cost.amount ?? 1;
    const gameElement = additionalInfos?.gameElement;
    const source = additionalInfos?.source;
    if (isResourceType(costType)) {
      this.playersResourcesService.removeResourceFromPlayer(playerId, costType, costAmount);
    } else if (costType === 'shipping') {
      // this.playersService.removeResourceFromPlayer(playerId, 'water', costAmount);
    } else if (isFactionScoreRewardType(costType)) {
      const scoreType = getFactionScoreTypeFromReward(cost);

      this.playerScoreManager.removePlayerScore(
        playerId,
        scoreType as PlayerFactionScoreType,
        costAmount,
        this.roundService.currentRound,
      );
    } else if (costType === 'leader-wound') {
      this.leadersService.flipLeader(playerId);
    } else if (costType === 'tech-tile-trash') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'tech-tile-trash',
        amount: costAmount,
      });
    } else if (costType === 'faction-influence-down-choice') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'faction-influence-down-choice',
        amount: costAmount,
      });
    } else if (costType === 'intrigue') {
      this.audioManager.playSound('intrigue', costAmount);
      this.intriguesService.drawPlayerIntriguesFromDeck(playerId, costAmount);
    } else if (costType === 'intrigue-trash') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'intrigue-trash',
        amount: costAmount,
      });
    } else if (costType === 'sword') {
      this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, costAmount);
    } else if (costType === 'troop' || costType === 'loose-troop') {
      this.combatManager.removePlayerTroopsFromGarrison(playerId, costAmount);
    } else if (costType === 'dreadnought') {
      this.combatManager.removePlayerShipsFromGarrison(playerId, costAmount);
    } else if (costType === 'dreadnought-retreat') {
      this.combatManager.retreatPlayerShipsFromCombat(playerId, costAmount);
    } else if (costType === 'card-discard') {
      for (let i = 0; i < costAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
          type: 'card-discard',
        });
      }
    } else if (costType === 'card-trash') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, { type: 'card-trash', amount: costAmount });
    } else if (costType === 'card-trash-from-hand') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'card-trash-from-hand',
        amount: costAmount,
      });
    } else if (costType === 'card-trash-in-play') {
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'card-trash-in-play',
        amount: costAmount,
      });
    } else if (costType === 'victory-point') {
      this.playerScoreManager.removePlayerScore(playerId, 'victoryPoints', costAmount, this.roundService.currentRound);
      this.loggingService.logPlayerLostVictoryPoint(playerId, this.roundService.currentRound, source);
    } else if (costType === 'trash-self' && gameElement) {
      if (gameElement.type === 'imperium-card') {
        this.cardsService.trashPlayerHandCard(playerId, gameElement.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(gameElement.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [gameElement.object] });
      } else if (gameElement.type === 'tech-tile') {
        this.techTilesService.trashPlayerTechTile(gameElement.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (costType === 'tech-tile-flip' && gameElement) {
      if (gameElement.type === 'tech-tile') {
        this.techTilesService.flipTechTile(gameElement.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [gameElement.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (costType === 'turn-pass') {
      this.turnInfoService.setPlayerTurnInfo(playerId, { needsToPassTurn: true });
    }

    this.loggingService.logPlayerResourcePaid(playerId, costType, cost.amount);
  }

  private addSwordmasterIfPossible(playerId: number) {
    const player = this.playersService.getPlayer(playerId);

    if (player && !player.hasSwordmaster) {
      this.audioManager.playSound('swordmaster');
      this.playersService.addPermanentAgentToPlayer(playerId);
    }
  }

  addTroopsToPlayer(playerId: number, amount: number) {
    this.audioManager.playSound('troops');
    this.combatManager.addPlayerTroopsToGarrison(playerId, amount);
    this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGained: amount });
  }

  addDreadnoughtToPlayer(playerId: number) {
    this.audioManager.playSound('dreadnought');
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);
    this.turnInfoService.updatePlayerTurnInfo(playerId, { dreadnoughtsGained: 1 });
  }

  private addHighCouncilSeatIfPossible(playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (player && !player.hasCouncilSeat) {
      let highCouncilPersuasionAmount = 1;

      for (const boardSpace of this.boardSpacesService.boardSpaces) {
        const highCouncilReward = boardSpace.rewards.find(
          (reward) => reward.type === 'council-seat-large' || reward.type === 'council-seat-small',
        );
        if (highCouncilReward) {
          highCouncilPersuasionAmount = highCouncilReward.amount ?? 1;
          break;
        }
      }

      this.audioManager.playSound('high-council');
      this.playersService.addCouncilSeatToPlayer(playerId, highCouncilPersuasionAmount);
      this.playerRewardChoicesService.addPlayerRewardChoice(playerId, {
        type: 'faction-influence-up-choice',
      });
    }
  }

  addUnitsToCombatIfPossible(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(playerId);
    if (!playerTurnInfos) {
      return 0;
    }

    let deployedAmount = 0;

    if (unitType === 'troop') {
      const deployableTroops = playerTurnInfos.deployableTroops - playerTurnInfos.deployedTroops;
      const troopsToDeploy = deployableTroops >= amount ? amount : deployableTroops;

      if (troopsToDeploy > 0) {
        this.combatManager.addPlayerTroopsToCombat(playerId, troopsToDeploy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedTroops: troopsToDeploy });
        deployedAmount += troopsToDeploy;
      }
    } else if (unitType === 'dreadnought') {
      const deployableDreadnoughts = playerTurnInfos.deployableDreadnoughts - playerTurnInfos.deployedDreadnoughts;
      const dreadnoughtsToDeploy = deployableDreadnoughts >= amount ? amount : deployableDreadnoughts;

      if (dreadnoughtsToDeploy > 0) {
        this.combatManager.addPlayerShipsToCombat(playerId, dreadnoughtsToDeploy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedDreadnoughts: dreadnoughtsToDeploy });
        deployedAmount += dreadnoughtsToDeploy;
      }
    }
    if (deployedAmount < amount) {
      const deployableUnits = playerTurnInfos.deployableUnits - playerTurnInfos.deployedUnits;
      const unitsToDeploy = deployableUnits >= amount ? amount : deployableUnits;

      if (unitsToDeploy > 0) {
        if (unitType === 'troop') {
          this.combatManager.addPlayerTroopsToCombat(playerId, unitsToDeploy);
        } else {
          this.combatManager.addPlayerShipsToCombat(playerId, unitsToDeploy);
        }
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedUnits: unitsToDeploy });
        deployedAmount += unitsToDeploy;
      }
    }

    return deployedAmount;
  }

  retreatUnitsIfPossible(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(playerId);
    if (!playerTurnInfos) {
      return;
    }

    const canRetreatUnits = playerTurnInfos.canRetreatUnits;
    if (!canRetreatUnits) {
      return;
    }

    let retreatedAmount = 0;

    if (unitType === 'troop') {
      this.combatManager.retreatPlayerTroopsFromCombat(playerId, amount);
      retreatedAmount += amount;
    } else if (unitType === 'dreadnought') {
      this.combatManager.retreatPlayerShipsFromCombat(playerId, amount);
      retreatedAmount += amount;
    }
  }
}
