import {
  BoardSpaceSelectorData,
  BoardSpaceSelectorDialogComponent,
} from '../components/_common/dialogs/board-space-selector-dialog/board-space-selector-dialog.component';
import {
  ImperiumCardSelectorData,
  ImperiumCardsPreviewDialogComponent,
} from '../components/_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { getPlayerPersuasion } from '../helpers/player';
import { getFlattenedEffectRewardArray } from '../helpers/rewards';
import { DuneLocation } from '../models';
import { GameCommands, GameState, TimedFunctionWithGameElement } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard } from '../services/cards.service';
import { GameModifiers } from '../services/game-modifier.service';

export interface TechTileGameAdjustments {
  id: string;
  aiEvaluation?: (player: Player, gameState: GameState) => number; //Only for custom effect texts. Keep costs in mind, Max value should be 20, min 0
  gameModifiers?: GameModifiers;
  customTimedActivatedFunction?: TimedFunctionWithGameElement;
  customTimedFunction?: TimedFunctionWithGameElement;
  customTimedAIFunction?: TimedFunctionWithGameElement;
  onTrashFunction?: (player: Player, gameState: GameState, game: GameCommands) => void;
}

export const techTilesGameAdjustments: TechTileGameAdjustments[] = [
  {
    id: 'Upgraded Carryall Suspensors',
    aiEvaluation: (player, gameState) => 16 - 1.25 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'carryall-suspensors',
          actionType: 'spice',
          costType: 'water',
          amount: -1,
        },
      ],
    },
    onTrashFunction: (player, gameState, game) => {
      game.removeGameModifier(player.id, 'fieldCost', 'carryall-suspensors');
    },
  },
  {
    id: 'Enhanced Sandcrawler Engines',
    aiEvaluation: (player, gameState) => 18 - 1 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldReward: [
        {
          id: 'sandcrawler-engines',
          actionType: 'spice',
          rewardType: 'spice',
          amount: 1,
        },
      ],
    },
    onTrashFunction: (player, gameState, game) => {
      game.removeGameModifier(player.id, 'fieldReward', 'sandcrawler-engines');
    },
  },
  {
    id: 'Trade Port',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.guild + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const playerGuildCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'guild').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'guild').length ?? 0);

        if (playerGuildCardAmount > 2) {
          game.addRewardToPlayer(player.id, { type: 'tech', amount: 2 });
          game.addRewardToPlayer(player.id, { type: 'solari' });
        } else if (playerGuildCardAmount > 1) {
          game.addRewardToPlayer(player.id, { type: 'tech' });
        } else if (playerGuildCardAmount > 0) {
          game.addRewardToPlayer(player.id, { type: 'solari' });
        }
      },
    },
  },
  {
    id: 'Botanical Research Station',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.fremen + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const playerFremenCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'fremen').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'fremen').length ?? 0);

        if (playerFremenCardAmount > 2) {
          game.addRewardToPlayer(player.id, { type: 'focus' });
          game.addRewardToPlayer(player.id, { type: 'persuasion' });
        } else if (playerFremenCardAmount > 1) {
          game.addRewardToPlayer(player.id, { type: 'focus' });
        } else if (playerFremenCardAmount > 0) {
          game.addRewardToPlayer(player.id, { type: 'persuasion' });
        }
      },
    },
  },
  {
    id: 'Sardaukar Commando Post',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.emperor + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const playerEmperorCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'emperor').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'emperor').length ?? 0);

        if (playerEmperorCardAmount > 2) {
          game.addRewardToPlayer(player.id, { type: 'sword', amount: 2 });
          game.addRewardToPlayer(player.id, { type: 'intrigue' });
        } else if (playerEmperorCardAmount > 1) {
          game.addRewardToPlayer(player.id, { type: 'sword', amount: 2 });
        } else if (playerEmperorCardAmount > 0) {
          game.addRewardToPlayer(player.id, { type: 'sword' });
        }
      },
    },
  },
  {
    id: 'Missionaria Protectiva',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.bene + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const playerBeneCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'bene').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'bene').length ?? 0);

        if (playerBeneCardAmount > 2) {
          game.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
        } else if (playerBeneCardAmount > 1) {
          game.addRewardToPlayer(player.id, { type: 'intrigue' });
        } else if (playerBeneCardAmount > 0) {
          game.addRewardToPlayer(player.id, { type: 'intrigue-trash' });
          game.addRewardToPlayer(player.id, { type: 'intrigue' });
        }
      },
    },
  },
  {
    id: 'Spice Refineries',
    aiEvaluation: (player, gameState) => 15 - 0.33 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'spice-refineries',
          costType: 'spice',
          amount: -1,
          minCosts: 1,
        },
      ],
    },
    onTrashFunction: (player, gameState, game) => {
      game.removeGameModifier(player.id, 'fieldCost', 'spice-refineries');
    },
  },
  {
    id: 'Planetary Surveillance',
    aiEvaluation: (player, gameState) => 2 + 0.5 * (gameState.currentRound - 1),
    gameModifiers: {
      locationTakeoverTroopCosts: [
        {
          id: 'planetary-surveillance-conquering-cost-town',
          locationType: 'town',
          amount: -1,
        },
        {
          id: 'planetary-surveillance-conquering-cost-spice',
          locationType: 'spice',
          amount: -1,
        },
      ],
    },
    onTrashFunction: (player, gameState, game) => {
      game.removeGameModifier(player.id, 'locationTakeoverTroopCosts', 'planetary-surveillance-conquering-cost-town');
      game.removeGameModifier(player.id, 'locationTakeoverTroopCosts', 'planetary-surveillance-conquering-cost-spice');
    },
  },
  {
    id: 'Deployment Ship',
    aiEvaluation: (player, gameState) => 5 + 1.5 * (gameState.currentRound - 1),
    customTimedActivatedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const { allCards, imperiumRowCards, recruitableCards } = game.getAllBuyableCards(
          gameState.playerTurnInfos?.factionRecruitment,
        );

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? x.persuasionCosts - 1 : undefined,
          };
        });

        const availablePersuasion = getPlayerPersuasion(player);

        const buyableUniqueCards = reducedCards.filter(
          (card, index, self) =>
            (!card.persuasionCosts || card.persuasionCosts <= availablePersuasion) &&
            index === self.findIndex((c) => c.name.en === card.name.en),
        );

        if (buyableUniqueCards.length < 1) {
          return;
        }

        const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
          data: {
            title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardAcquire')}`,
            playerId: player.id,
            imperiumCards: buyableUniqueCards,
            mode: 'select',
            colorScheme: 'positive',
          } as ImperiumCardSelectorData,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((pickedCard: ImperiumDeckCard) => {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === pickedCard.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === pickedCard.id)) {
            source = 'deck';
          }

          game.acquireImperiumCard(player.id, pickedCard, source);
          if (pickedCard.structuredRevealEffects) {
            game.resolveStructuredEffects(pickedCard.structuredRevealEffects, player, gameState);
          } else if (pickedCard.customRevealEffect) {
            // TODO
          }

          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const { allCards, imperiumRowCards, recruitableCards } = game.getAllBuyableCards(
          gameState.playerTurnInfos?.factionRecruitment,
        );

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? x.persuasionCosts - 1 : undefined,
          };
        });

        const availablePersuasion = getPlayerPersuasion(player);
        const cardToBuy = game.ai.getImperiumCardToBuy(availablePersuasion, reducedCards, player, gameState, []);
        if (cardToBuy) {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
            source = 'deck';
          }

          game.acquireImperiumCard(player.id, cardToBuy, source);
          if (cardToBuy.structuredRevealEffects) {
            game.resolveStructuredEffects(cardToBuy.structuredRevealEffects, player, gameState);
          } else if (cardToBuy.customRevealEffect) {
            // TODO
          }

          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Recruitment Hub',
    aiEvaluation: (player, gameState) =>
      15 - 1.5 * (gameState.currentRound - 1) + 1 * gameState.playerHandCardsRewards.solari,
    customTimedActivatedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        if (gameState.playerResources.solari < 1) {
          return;
        }
        const availablePersuasion = getPlayerPersuasion(player);
        const { allCards, imperiumRowCards, recruitableCards } = game.getAllBuyableCards(
          gameState.playerTurnInfos?.factionRecruitment,
        );

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? (x.persuasionCosts > 2 ? x.persuasionCosts - 2 : 0) : undefined,
          };
        });

        const buyableUniqueCards = reducedCards.filter(
          (card, index, self) =>
            (!card.persuasionCosts || card.persuasionCosts <= availablePersuasion) &&
            index === self.findIndex((c) => c.name.en === card.name.en),
        );

        if (buyableUniqueCards.length < 1) {
          return;
        }

        const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
          data: {
            title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardAcquire')}`,
            playerId: player.id,
            imperiumCards: buyableUniqueCards,
            mode: 'select',
            colorScheme: 'positive',
          } as ImperiumCardSelectorData,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((pickedCard: ImperiumDeckCard) => {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === pickedCard.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === pickedCard.id)) {
            source = 'deck';
          }

          game.acquireImperiumCard(player.id, pickedCard, source, { acquireLocation: 'above-deck' });

          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
          game.payCostForPlayer(player.id, { type: 'solari' }, { gameElement });
        });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        if (gameState.playerResources.solari < 1) {
          return;
        }
        const availablePersuasion = getPlayerPersuasion(player);
        const { allCards, imperiumRowCards, recruitableCards } = game.getAllBuyableCards(
          gameState.playerTurnInfos?.factionRecruitment,
        );

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? (x.persuasionCosts > 2 ? x.persuasionCosts - 2 : 0) : undefined,
          };
        });

        const cardToBuy = game.ai.getImperiumCardToBuy(availablePersuasion, reducedCards, player, gameState, []);
        if (cardToBuy) {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
            source = 'deck';
          }

          game.acquireImperiumCard(player.id, cardToBuy, source, { acquireLocation: 'above-deck' });

          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
          game.payCostForPlayer(player.id, { type: 'solari' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Controlled Spice Explosions',
    aiEvaluation: (player, gameState) => 5 - 1 * gameState.playerHandCardsRewards.spice,
    customTimedActivatedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const spiceSpaces = gameState.locations.filter((x) => x.actionField.actionType === 'spice');

        if (spiceSpaces.length < 1) {
          return;
        }

        const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
          data: {
            title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
            playerId: player.id,
            locations: spiceSpaces,
            mode: 'select',
            colorScheme: 'neutral',
          } as BoardSpaceSelectorData,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((location: DuneLocation) => {
          game.increaseAccumulatedSpiceOnBoardSpace(location.actionField.title.en);
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const spiceSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'spice');
        const waterAmount = gameState.playerResources.water;

        let targetSpace = undefined;
        let targetSpaceWaterCosts = 0;

        for (const spiceSpace of spiceSpaces) {
          let waterCostAmount = 0;
          if (spiceSpace.costs) {
            const waterCosts = spiceSpace.costs.filter((x) => x.type === 'water');
            if (waterCosts.length > 0) {
              const combinedWaterCosts = getFlattenedEffectRewardArray(waterCosts);
              waterCostAmount = combinedWaterCosts[0].amount ?? 1;
            }
          }

          if (waterCostAmount <= waterAmount && waterCostAmount >= targetSpaceWaterCosts) {
            targetSpace = spiceSpace;
            targetSpaceWaterCosts = waterCostAmount;
          }
        }

        if (targetSpace) {
          game.increaseAccumulatedSpiceOnBoardSpace(targetSpace.title.en);
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Barrage Rockets',
    aiEvaluation: (player, gameState) => 2 + 0.25 * (gameState.currentRound - 1) + 1 * gameState.playerLocations.length,
    customTimedActivatedFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        const boardSpaces = gameState.boardSpaces;
        const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
          data: {
            title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
            playerId: player.id,
            locations: boardSpaces.map((x) => ({ actionField: x, color: game.getBoardSpaceColor(x.actionType) })),
            mode: 'select',
            colorScheme: 'neutral',
          } as BoardSpaceSelectorData,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((location: DuneLocation) => {
          game.addPlayerGameModifiers(player.id, {
            fieldBlock: [
              { id: 'barrage-rockets-field-block', fieldId: location.actionField.title.en, currentRoundOnly: true },
            ],
          });
          for (const enemyPlayer of gameState.enemyPlayers) {
            game.addPlayerGameModifiers(enemyPlayer.id, {
              fieldBlock: [
                { id: 'barrage-rockets-field-block', fieldId: location.actionField.title.en, currentRoundOnly: true },
              ],
            });
          }
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        const playerLocations = gameState.playerLocations;

        if (playerLocations.length < 1) {
          return;
        }

        let activatedEffect = false;
        for (const location of playerLocations) {
          if (activatedEffect) {
            break;
          }

          const locationHasAgentOnIt = gameState.agentsOnFields.some((x) => x.fieldId === location);
          if (!locationHasAgentOnIt) {
            const playerHasAvailableShips =
              gameState.playerCombatUnits.shipsInCombat > 0 || gameState.playerCombatUnits.shipsInGarrison > 0;
            if (!playerHasAvailableShips || Math.random() > 0.5) {
              game.addPlayerGameModifiers(player.id, {
                fieldBlock: [{ id: 'barrage-rockets-field-block', fieldId: location, currentRoundOnly: true }],
              });
              for (const enemyPlayer of gameState.enemyPlayers) {
                game.addPlayerGameModifiers(enemyPlayer.id, {
                  fieldBlock: [{ id: 'barrage-rockets-field-block', fieldId: location, currentRoundOnly: true }],
                });
              }
              game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
              activatedEffect = true;
            }
          }
        }
      },
    },
  },
  {
    id: 'Shieldbreakers',
    aiEvaluation: (player, gameState) =>
      0 +
      0.25 * (gameState.currentRound - 1) +
      2 * gameState.enemyCombatUnits.filter((x) => getPlayerdreadnoughtCount(x) > 0).length,
    customTimedActivatedFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        if (gameState.playerResources.tech < 1) {
          return;
        }

        for (const enemy of gameState.enemyPlayers) {
          game.removePlayerShipsFromCombat(enemy.id, 1);
        }
        game.payCostForPlayer(player.id, { type: 'tech' });
        game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        const enemiesWithDreadnoughtsInCombat = gameState.enemyCombatUnits.filter((x) => x.shipsInCombat > 0).length;
        if (
          enemiesWithDreadnoughtsInCombat < 1 ||
          gameState.playerResources.tech < 1 ||
          gameState.playerAgentsAvailable > 0
        ) {
          return;
        }

        if (Math.random() + 0.075 * (gameState.currentRound - 1) > 0.5) {
          for (const enemy of gameState.enemyPlayers) {
            game.removePlayerShipsFromCombat(enemy.id, 1);
          }
          game.payCostForPlayer(player.id, { type: 'tech' });
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Heavy Lasguns',
    aiEvaluation: (player, gameState) => 1 + 0.25 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 2 : 0),
    customTimedActivatedFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        const boardSpaces = gameState.boardSpaces.filter((boardSpace) =>
          gameState.enemyAgentsOnFields.some((agent) => boardSpace.title.en === agent.fieldId),
        );

        const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
          data: {
            title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
            playerId: player.id,
            locations: boardSpaces.map((x) => ({ actionField: x, color: game.getBoardSpaceColor(x.actionType) })),
            mode: 'select',
            colorScheme: 'neutral',
          } as BoardSpaceSelectorData,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((location: DuneLocation) => {
          const enemyAgents = gameState.enemyAgentsOnFields.filter((x) => x.fieldId === location.actionField.title.en);
          for (const enemyAgent of enemyAgents) {
            game.setPlayerAgentInTimeout(enemyAgent.playerId, location.actionField.title.en);
          }
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player, gameState, game, gameElement) => {
        if (gameState.enemyAgentsOnFields.length < 1 || gameState.playerAgentsOnFields.length < 1) {
          return;
        }
        const locationThreat = gameState.enemyAgentsOnFields.find((x) =>
          gameState.playerLocations.some((fieldId) => fieldId === x.fieldId),
        );
        if (locationThreat && Math.random() > 0.33) {
          const enemyAgents = gameState.enemyAgentsOnFields.filter((x) => x.fieldId === locationThreat.fieldId);
          for (const enemyAgent of enemyAgents) {
            game.setPlayerAgentInTimeout(enemyAgent.playerId, locationThreat.fieldId);
          }
          game.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Stilltents',
    aiEvaluation: (player, gameState) =>
      14 -
      0.5 * (gameState.currentRound - 1) +
      (player.hasSwordmaster ? 2 : 0) -
      0.1 * gameState.playerResources.spice -
      0.25 * gameState.playerCardsTrashed,
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const spiceSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'spice');

        const hasSpiceSpacesWithPlayerAgents = spiceSpaces.some((boardSpace) =>
          gameState.agentsOnFields.some((agent) => boardSpace.title.en === agent.fieldId),
        );
        if (hasSpiceSpacesWithPlayerAgents) {
          game.addRewardToPlayer(player.id, { type: 'persuasion', amount: 1 }, { gameElement });
          game.addRewardToPlayer(player.id, { type: 'focus' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Armored Spice Harvesters',
    aiEvaluation: (player, gameState) => 8 + 0.75 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 2 : 0),
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, game, gameElement) => {
        const spiceSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'spice');

        const playerAgentsOnSpiceSpaces = gameState.agentsOnFields.filter((agent) =>
          spiceSpaces.some((boardSpace) => agent.fieldId === boardSpace.title.en),
        );

        if (playerAgentsOnSpiceSpaces.length > 0) {
          game.addRewardToPlayer(
            player.id,
            { type: 'sword', amount: 2 * playerAgentsOnSpiceSpaces.length },
            { gameElement },
          );
        }
      },
    },
  },
];
