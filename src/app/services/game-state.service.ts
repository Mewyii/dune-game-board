import { Injectable } from '@angular/core';
import { flatten } from 'lodash';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { isFactionScoreType } from '../helpers/faction-score';
import {
  getMultipliedRewardEffects,
  isStructuredChoiceEffect,
  isStructuredConversionEffect,
  isStructuredRewardEffect,
} from '../helpers/rewards';
import { ActionType, EffectReward } from '../models';
import { GameState, PlayerGameElementFactions, PlayerGameElementFieldAccess, PlayerGameElementRewards } from '../models/ai';
import { Player } from '../models/player';
import { SpiceAccumulation } from './board-space.service';
import { CardsService } from './cards.service';
import { CombatManager } from './combat-manager.service';
import { ConflictsService } from './conflicts.service';
import { DuneEventsManager } from './dune-events.service';
import { GameModifiersService } from './game-modifier.service';
import { IntriguesService } from './intrigues.service';
import { LeadersService } from './leaders.service';
import { LocationManager } from './location-manager.service';
import { PlayerAgentsService } from './player-agents.service';
import { PlayerResourcesService } from './player-resources.service';
import { PlayerFactionScoreType, PlayerScore, PlayerScoreManager } from './player-score-manager.service';
import { PlayersService } from './players.service';
import { RoundPhaseType } from './round.service';
import { SettingsService } from './settings.service';
import { TechTilesService } from './tech-tiles.service';
import { TurnInfoService } from './turn-info.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  constructor(
    private settingsService: SettingsService,
    private cardsService: CardsService,
    private playerAgentsService: PlayerAgentsService,
    private turnInfoService: TurnInfoService,
    private combatManager: CombatManager,
    private gameModifiersService: GameModifiersService,
    private techTilesService: TechTilesService,
    private intriguesService: IntriguesService,
    private locationManager: LocationManager,
    private playerScoreManager: PlayerScoreManager,
    private playersService: PlayersService,
    private leadersService: LeadersService,
    private conflictsService: ConflictsService,
    private duneEventsManager: DuneEventsManager,
    private playersResourcesService: PlayerResourcesService,
  ) {}

  getGameState(
    player: Player,
    currentRound: number,
    currentRoundPhase: RoundPhaseType,
    isFinale: boolean,
    accumulatedSpiceOnFields: SpiceAccumulation[],
  ): GameState {
    const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(player.id);
    const enemyAgentsOnFields = this.playerAgentsService.getEnemyAgentsOnFields(player.id);
    const playerAgentPlacedOnFieldThisTurn = this.turnInfoService.getPlayerTurnInfo(player.id, 'agentPlacedOnFieldId');

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id)!;
    const playerDreadnoughtCount = getPlayerdreadnoughtCount(playerCombatUnits);

    const playerDeckCards = this.cardsService.getPlayerDeck(player.id)?.cards ?? [];
    const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards ?? [];
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(player.id)?.cards ?? [];
    const playerTrashPileCards = this.cardsService.getPlayerTrashPile(player.id)?.cards;
    const playerCardsTrashed = playerTrashPileCards?.length ?? 0;

    const playerCards = [...playerDeckCards, ...playerHandCards, ...playerDiscardPileCards];

    const playerCardsFactions = this.getInitialFactions();
    const playerCardsFieldAccess: ActionType[] = [];
    const playerCardsFieldAccessCounts = this.getInitialGameElementFieldAccess();
    const playerCardsRewards = this.getInitialGameElementRewards();
    const playerCardsConnectionEffects = this.getInitialFactions();

    const playerHandCardsFactions = this.getInitialFactions();
    const playerHandCardsFieldAccess: ActionType[] = [];
    const playerHandCardsFieldAccessCounts = this.getInitialGameElementFieldAccess();
    const playerHandCardsRewards = this.getInitialGameElementRewards();
    const playerHandCardsConnectionAgentEffects = this.getInitialFactions();
    const playerHandCardsConnectionRevealEffects = this.getInitialFactions();

    const playerGameModifiers = this.gameModifiersService.getPlayerGameModifiers(player.id);

    for (const playerCard of playerCards) {
      if (playerCard.faction) {
        playerCardsFactions[playerCard.faction] += 1;
      }
      if (playerCard.fieldAccess) {
        for (const access of playerCard.fieldAccess) {
          if (!playerCardsFieldAccess.includes(access)) {
            playerCardsFieldAccess.push(access);
          }
          playerCardsFieldAccessCounts[access] += 1;
        }
      }
      if (playerCard.structuredAgentEffects) {
        for (const agentEffect of playerCard.structuredAgentEffects) {
          if (agentEffect.condition) {
            if (agentEffect.condition.type === 'condition-connection') {
              playerCardsConnectionEffects[agentEffect.condition.faction] += 1;
            }
          }
          if (!agentEffect.condition && isStructuredRewardEffect(agentEffect)) {
            for (const reward of agentEffect.effectRewards) {
              playerCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
      if (playerCard.structuredRevealEffects) {
        for (const revealEffect of playerCard.structuredRevealEffects) {
          if (revealEffect.condition) {
            if (revealEffect.condition.type === 'condition-connection') {
              playerCardsConnectionEffects[revealEffect.condition.faction] += 1;
            }
          }
          if (!revealEffect.condition && isStructuredRewardEffect(revealEffect)) {
            for (const reward of revealEffect.effectRewards) {
              playerCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
    }

    const playerCardsFactionsInPlay = this.getInitialFactions();
    for (const playerCard of playerDiscardPileCards) {
      if (playerCard.faction) {
        playerCardsFactionsInPlay[playerCard.faction] += 1;
      }
    }

    for (const playerHandCard of playerHandCards) {
      if (playerHandCard.faction) {
        playerHandCardsFactions[playerHandCard.faction] += 1;
      }
      if (playerHandCard.fieldAccess) {
        for (const access of playerHandCard.fieldAccess) {
          if (!playerHandCardsFieldAccess.includes(access)) {
            playerHandCardsFieldAccess.push(access);
          }
          playerHandCardsFieldAccessCounts[access] += 1;
        }
      }
      if (playerHandCard.structuredAgentEffects) {
        for (const agentEffect of playerHandCard.structuredAgentEffects) {
          if (agentEffect.condition) {
            if (agentEffect.condition.type === 'condition-connection') {
              playerHandCardsConnectionAgentEffects[agentEffect.condition.faction] += 1;
            }
          }
          if (!agentEffect.condition && isStructuredRewardEffect(agentEffect)) {
            for (const reward of agentEffect.effectRewards) {
              playerHandCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
      if (playerHandCard.structuredRevealEffects) {
        for (const revealEffect of playerHandCard.structuredRevealEffects) {
          if (revealEffect.condition) {
            if (revealEffect.condition.type === 'condition-connection') {
              playerHandCardsConnectionRevealEffects[revealEffect.condition.faction] += 1;
            }
          }
          if (!revealEffect.condition && isStructuredRewardEffect(revealEffect)) {
            for (const reward of revealEffect.effectRewards) {
              playerHandCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
    }

    const playerTechTilesFactions = this.getInitialFactions();
    const playerTechTilesRewards = this.getInitialGameElementRewards();
    const playerTechTilesConversionCosts = this.getInitialGameElementRewards();
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id).map((x) => x.techTile);

    const partialGameStateForEffectMultipliers = {
      playerAgentsOnFields,
      playerCombatUnits,
      playerHandCardsRewards,
      playerHandCardsFactions,
      playerCardsFactionsInPlay,
      enemyAgentsOnFields,
      playerAgentPlacedOnFieldThisTurn,
    };

    for (const techTile of playerTechTiles) {
      if (techTile.faction) {
        playerTechTilesFactions[techTile.faction] += 1;
      }
      if (techTile.structuredEffects) {
        const rewards: EffectReward[] = [];
        const conversionCosts: EffectReward[] = [];

        for (const effect of techTile.structuredEffects) {
          if (isStructuredRewardEffect(effect)) {
            rewards.push(...getMultipliedRewardEffects(effect, partialGameStateForEffectMultipliers));
          } else if (isStructuredChoiceEffect(effect)) {
          } else if (isStructuredConversionEffect(effect)) {
            conversionCosts.push(...getMultipliedRewardEffects(effect.effectCosts, partialGameStateForEffectMultipliers));
            rewards.push(...getMultipliedRewardEffects(effect.effectConversions, partialGameStateForEffectMultipliers));
          }
        }

        for (const reward of rewards) {
          playerTechTilesRewards[reward.type] += reward.amount ?? 1;
        }
        for (const cost of conversionCosts) {
          playerTechTilesConversionCosts[cost.type] += cost.amount ?? 1;
        }
      }
    }

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id) ?? [];
    const playerIntriguesRewards = this.getInitialGameElementRewards();
    const playerIntriguesConversionCosts = this.getInitialGameElementRewards();
    for (const intrigue of playerIntrigues) {
      if (intrigue.structuredPlotEffects) {
        const rewards: EffectReward[] = [];
        const conversionCosts: EffectReward[] = [];

        for (const effect of intrigue.structuredPlotEffects) {
          if (isStructuredRewardEffect(effect)) {
            rewards.push(...getMultipliedRewardEffects(effect, partialGameStateForEffectMultipliers));
          } else if (isStructuredChoiceEffect(effect)) {
          } else if (isStructuredConversionEffect(effect)) {
            conversionCosts.push(...getMultipliedRewardEffects(effect.effectCosts, partialGameStateForEffectMultipliers));
            rewards.push(...getMultipliedRewardEffects(effect.effectConversions, partialGameStateForEffectMultipliers));
          }
        }

        for (const reward of rewards) {
          playerIntriguesRewards[reward.type] += reward.amount ?? 1;
        }
        for (const cost of conversionCosts) {
          playerIntriguesConversionCosts[cost.type] += cost.amount ?? 1;
        }
      }
    }

    const playerCardsBought =
      (playerDeckCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerHandCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerDiscardPileCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerTrashPileCards?.filter((x) => x.persuasionCosts).length ?? 0);

    const playerScore = this.playerScoreManager.getPlayerScore(player.id)!;
    const playerFactionFriendships = this.getFactionFriendships(playerScore);
    const playerFieldUnlocksForFactions = this.gameModifiersService.getPlayerFieldUnlocksForFactions(player.id) ?? [];
    const playerFieldUnlocksForIds = this.gameModifiersService.getPlayerFieldUnlocksForIds(player.id) ?? [];
    const playerEnemyFieldTypeAcessTroughCards = flatten(
      playerHandCards.filter((x) => x.fieldAccess && x.canInfiltrate).map((x) => x.fieldAccess),
    ) as ActionType[];
    const playerEnemyFieldTypeAcessTroughGameModifiers =
      this.gameModifiersService.getPlayerFieldEnemyAcessForActionTypes(player.id) ?? [];

    const playerBlockedFieldsForActionTypes =
      this.gameModifiersService.getPlayerBlockedFieldsForActionTypes(player.id) ?? [];
    const playerBlockedFieldsForIds = this.gameModifiersService.getPlayerBlockedFieldsForIds(player.id) ?? [];

    const playerCombatIntrigues = playerIntrigues.filter((x) => x.type === 'combat');
    const playerIntrigueCount = playerIntrigues.length;
    const playerCombatIntrigueCount = playerCombatIntrigues.length;
    const playerIntrigueStealAmount = this.intriguesService
      .getEnemyIntrigues(player.id)
      .filter((x) => x.intrigues.length > 3).length;

    const enemyIntrigues = this.intriguesService.getEnemyIntrigues(player.id);
    const enemyIntrigueCounts = enemyIntrigues.map((x) => ({ playerId: x.playerId, intrigueCount: x.intrigues.length }));

    const playerLocations = this.locationManager.ownedLocations
      .filter((x) => x.playerId === player.id)
      .map((x) => x.locationId);
    const enemyLocations = this.locationManager.ownedLocations.filter((x) => x.playerId !== player.id);
    const freeLocations = this.settingsService.controllableLocations.filter(
      (x) => !playerLocations.includes(x) && !enemyLocations.some((y) => y.locationId === x),
    );

    const enemyScore = this.playerScoreManager.getEnemyScore(player.id)!;

    const rivalId = enemyScore.sort((a, b) => b.victoryPoints - a.victoryPoints)[0];
    const rival = currentRound > 4 ? this.playersService.getPlayer(rivalId.playerId) : undefined;

    const playerLeader = this.leadersService.getLeader(player.id);
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(player.id);

    return {
      playersCount: this.playersService.getPlayerCount(),
      currentRound: currentRound,
      currentRoundPhase: currentRoundPhase,
      accumulatedSpiceOnBoardSpaces: accumulatedSpiceOnFields,
      playerAgentsAvailable: this.playerAgentsService.getAvailablePlayerAgentCount(player.id),
      enemyAgentsAvailable: this.playerAgentsService.getAvailableEnemyPlayerAgents(player.id),
      playerScore: playerScore,
      enemyScore,
      playerCombatUnits,
      enemyCombatUnits: this.combatManager.getEnemyCombatUnits(player.id),
      agentsOnFields: this.playerAgentsService.getPlayersAgentsOnFields(),
      playerAgentsOnFields,
      enemyAgentsOnFields,
      isOpeningTurn: this.isOpeningTurn(player.id, currentRound),
      isFinale: isFinale,
      enemyPlayers: this.playersService.getEnemyPlayers(player.id),
      playerLeader: playerLeader!,
      conflict: this.conflictsService.currentConflict,
      availableTechTiles: this.techTilesService.buyableTechTiles,
      currentEvent: this.duneEventsManager.eventDeck[currentRound - 1],
      playerDeckSizeTotal:
        (playerDeckCards?.length ?? 0) + (playerHandCards?.length ?? 0) + (playerDiscardPileCards?.length ?? 0),
      playerHandCards,
      playerDeckCards,
      playerDiscardPileCards,
      playerTrashPileCards,
      playerCardsBought,
      playerCardsTrashed,
      playerDreadnoughtCount,
      imperiumRowCards: this.cardsService.imperiumRow,
      imperiumDeckCards: this.cardsService.imperiumDeck,
      playerFactionFriendships,
      playerFieldUnlocksForFactions,
      playerFieldUnlocksForIds,
      playerEnemyFieldTypeAcessTroughCards,
      playerEnemyFieldTypeAcessTroughGameModifiers,
      blockedFieldsForActionTypes: playerBlockedFieldsForActionTypes,
      blockedFieldsForIds: playerBlockedFieldsForIds,
      playerIntrigues,
      playerIntriguesRewards,
      playerIntriguesConversionCosts,
      playerCombatIntrigues,
      playerIntrigueCount,
      playerCombatIntrigueCount,
      playerIntrigueStealAmount,
      playerLocations,
      enemyLocations,
      freeLocations,
      rival,
      playerTurnInfos,
      playerCardsFactions,
      playerCardsFieldAccess,
      playerCardsFieldAccessCounts,
      playerCardsRewards,
      playerCardsConnectionEffects,
      playerHandCardsFactions,
      playerHandCardsFieldAccess,
      playerHandCardsFieldAccessCounts,
      playerHandCardsRewards,
      playerHandCardsConnectionAgentEffects,
      playerHandCardsConnectionRevealEffects,
      playerCardsFactionsInPlay,
      playerGameModifiers,
      playerTechTiles,
      playerTechTilesFactions,
      playerTechTilesRewards,
      playerTechTilesConversionCosts,
      enemyIntrigues,
      enemyIntrigueCounts,
      gameSettings: {
        combatMaxDeployableUnits: this.settingsService.getCombatMaxDeployableUnits(),
        troopCombatStrength: this.settingsService.getTroopStrength(),
        dreadnoughtCombatStrength: this.settingsService.getDreadnoughtStrength(),
        factionInfluenceMaxScore: this.settingsService.getFactionInfluenceMaxScore(),
        factionInfluenceAllianceTreshold: this.settingsService.getFactionInfluenceAllianceTreshold(),
      },
      boardSpaces: this.settingsService.boardFields,
      playerAgentPlacedOnFieldThisTurn,
      playerResources: this.playersResourcesService.getPlayerResources(player.id),
    } as GameState;
  }

  private getFactionFriendships(playerScore: PlayerScore) {
    const result: PlayerFactionScoreType[] = [];
    for (const [index, value] of Object.entries(playerScore)) {
      if (value > 1 && isFactionScoreType(index)) {
        result.push(index);
      }
    }
    return result;
  }

  private isOpeningTurn(playerId: number, currentRound: number) {
    if (currentRound === 1) {
      return this.playerAgentsService.getAvailablePlayerAgentCount(playerId) === 2;
    }
    return false;
  }

  private getInitialFactions(): PlayerGameElementFactions {
    return {
      bene: 0,
      emperor: 0,
      fremen: 0,
      guild: 0,
    };
  }

  private getInitialGameElementFieldAccess(): PlayerGameElementFieldAccess {
    return {
      fremen: 0,
      bene: 0,
      guild: 0,
      emperor: 0,
      spice: 0,
      landsraad: 0,
      choam: 0,
      town: 0,
    };
  }

  private getInitialGameElementRewards(): PlayerGameElementRewards {
    return {
      spice: 0,
      water: 0,
      solari: 0,
      troop: 0,
      dreadnought: 0,
      agent: 0,
      'agent-lift': 0,
      'card-destroy': 0,
      'card-discard': 0,
      'card-draw': 0,
      'card-draw-or-destroy': 0,
      combat: 0,
      'council-seat-large': 0,
      'council-seat-small': 0,
      'faction-influence-down-bene': 0,
      'faction-influence-down-choice': 0,
      'faction-influence-down-emperor': 0,
      'faction-influence-down-fremen': 0,
      'faction-influence-down-guild': 0,
      'faction-influence-up-bene': 0,
      'faction-influence-up-choice': 0,
      'faction-influence-up-emperor': 0,
      'faction-influence-up-fremen': 0,
      'faction-influence-up-guild': 0,
      'faction-influence-up-twice-choice': 0,
      focus: 0,
      foldspace: 0,
      intrigue: 0,
      'intrigue-draw': 0,
      'intrigue-trash': 0,
      'location-control-choice': 0,
      'location-control': 0,
      'loose-troop': 0,
      mentat: 0,
      persuasion: 0,
      placeholder: 0,
      shipping: 0,
      'signet-ring': 0,
      signet: 0,
      'spice-accumulation': 0,
      sword: 0,
      'sword-master': 0,
      tech: 0,
      'tech-tile': 0,
      'tech-tile-flip': 0,
      'tech-tile-trash': 0,
      'victory-point': 0,
      'trash-self': 0,
      'recruitment-emperor': 0,
      'recruitment-fremen': 0,
      'recruitment-bene': 0,
      'recruitment-guild': 0,
      research: 0,
      specimen: 0,
      beetle: 0,
      'troop-insert': 0,
      'troop-insert-or-retreat': 0,
      'troop-retreat': 0,
      'dreadnought-insert': 0,
      'dreadnought-insert-or-retreat': 0,
      'dreadnought-retreat': 0,
      'enemies-card-discard': 0,
      'enemies-troop-destroy': 0,
      'enemies-intrigue-trash': 0,
      'enemies-leader-assassinate': 0,
      'card-return-to-hand': 0,
      'turn-pass': 0,
      'leader-heal': 0,
      'leader-wound': 0,
    };
  }
}
