import {
  BoardSpaceSelectorData,
  BoardSpaceSelectorDialogComponent,
} from '../components/_common/dialogs/board-space-selector-dialog/board-space-selector-dialog.component';
import {
  ImperiumCardSelectorData,
  ImperiumCardsPreviewDialogComponent,
} from '../components/_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import {
  TechTileSelectorData,
  TechTileSelectorDialogComponent,
} from '../components/_common/dialogs/tech-tile-selector-dialog/tech-tile-selector-dialog.component';
import { getPlayerCombatStrength } from '../helpers/ai';
import { getPlayerPersuasion } from '../helpers/player';
import { playerCanPayCosts } from '../helpers/rewards';
import { ActionField, DuneLocation, StructuredEffect } from '../models';
import { AIAdjustments, GameCommands, GameState, TimedFunction } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard, ImperiumRowCard } from '../services/cards.service';
import { GameModifiers } from '../services/game-modifier.service';
import { TechTileDeckCard } from '../services/tech-tiles.service';

export interface LeaderGameAdjustments {
  id: string;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
  customSignetEffects?: StructuredEffect[];
  customSignetFunction?: (player: Player, gameState: GameState, game: GameCommands) => void;
  customSignetAIFunction?: (player: Player, gameState: GameState, game: GameCommands) => void;
  customTimedActivatedFunctions?: TimedFunction[];
  customTimedFunctions?: TimedFunction[];
  customTimedAIFunctions?: TimedFunction[];
  signetRingValue?: (player: Player, gameState: GameState, targetBoardSpace?: ActionField) => number;
  signetTokenOrFieldMarkerValue?: (player: Player, gameState: GameState, targetBoardSpace?: ActionField) => number;
}

export const leadersGameAdjustments: LeaderGameAdjustments[] = [
  {
    id: 'Paul Atreides',
    gameModifiers: {
      fieldBlock: [{ id: 'paul-fremen-access', actionType: 'fremen' }],
    },
    customSignetFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const fremenInfluence = gameState.playerScore['fremen'];
      if (fremenInfluence > 3) {
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
        game.addRewardToPlayer(player.id, { type: 'troop' });
      } else if (fremenInfluence > 1) {
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
        game.addRewardToPlayer(player.id, { type: 'agent-lift' });
      }
      game.addPlayerGameModifiers(player.id, {
        customActions: [
          {
            id: 'paul-vision-intrigues',
            action: 'vision-intrigues',
            currentRoundOnly: true,
          },
          {
            id: 'paul-vision-deck',
            action: 'vision-deck',
            currentRoundOnly: true,
          },
        ],
      });
    },
    signetRingValue: (player, gameState) => {
      let value = 1;
      const fremenInfluence = gameState.playerScore['fremen'];
      if (fremenInfluence > 3) {
        if (gameState.playerAgentsOnFields.length > 0) {
          value += 5.0;
        }
      } else if (fremenInfluence > 1) {
        value += 3.5;
      }
      return value;
    },
  },
  {
    id: 'Alia Atreides',
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerHandCards.some((card) => card.agentEffects?.some((x) => x.type === 'signet-ring'))) {
            game.addRewardToPlayer(player.id, { type: 'faction-influence-down-choice' });
          }
        },
      },
    ],
    signetRingValue: (player, gameState) => 5,
  },
  {
    id: 'Duke Leto Atreides',
    gameModifiers: {
      customActions: [
        {
          id: 'leto-inspiring-loyalty',
          action: 'field-marker',
        },
      ],
    },
    customSignetFunction: (player, gameState, game) => {
      const fieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
      const locationChoices = gameState.locations.filter(
        (location) =>
          fieldMarkers?.some((marker) => marker.amount > 1 && location.actionField.title.en === marker.fieldId) ||
          gameState.playerAgentsOnFields.some((agent) => location.actionField.title.en === agent.fieldId),
      );

      const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
          playerId: player.id,
          locations: locationChoices,
          mode: 'select',
          colorScheme: 'positive',
        } as BoardSpaceSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((location: DuneLocation) => {
        const fieldMarker = fieldMarkers?.find((x) => x.fieldId === location.actionField.title.en);
        if (fieldMarker && fieldMarker.amount > 1) {
          game.playSound('location-control');
          game.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, -2);
          game.setLocationOwner(fieldMarker.fieldId, player.id);
          game.logPlayerGainedLocationControl(player.id, gameState.currentRound, fieldMarker.fieldId);
        } else {
          game.playSound('click-soft');
          game.changeFieldMarkerModifier(player.id, location.actionField.title.en, 1);
        }
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const possibleNewMarkerLocations = gameState.locations.filter((x) =>
        gameState.playerAgentsOnFields.some((agent) => agent.fieldId === x.actionField.title.en),
      );
      const playerOwnedLocations = gameState.playerLocations;
      const fieldMarkers = gameState.playerGameModifiers?.fieldMarkers;

      if (fieldMarkers) {
        fieldMarkers.sort((a, b) => a.amount - b.amount);
        for (const fieldMarker of fieldMarkers) {
          if (fieldMarker.amount > 1 && !playerOwnedLocations.some((locationId) => locationId === fieldMarker.fieldId)) {
            game.playSound('location-control');
            game.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, -2);
            game.setLocationOwner(fieldMarker.fieldId, player.id);
            game.logPlayerGainedLocationControl(player.id, gameState.currentRound, fieldMarker.fieldId);
          } else {
            if (possibleNewMarkerLocations.some((x) => x.actionField.title.en === fieldMarker.fieldId)) {
              game.playSound('click-soft');
              game.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, 1);
            }
          }
        }
      } else if (possibleNewMarkerLocations.length > 0) {
        game.changeFieldMarkerModifier(player.id, possibleNewMarkerLocations[0].actionField.title.en, 1);
      }
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      let value = 0;
      if (gameState.playerGameModifiers?.fieldMarkers?.some((x) => x.amount > 1)) {
        value += 6;
      } else if (playerAgentsOnFields.length > 0) {
        value += 3;
      }
      return value;
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 3,
  },
  {
    id: 'Feyd-Rautha Harkonnen',
    customSignetEffects: [{ type: 'reward', effectRewards: [{ type: 'signet' }] }],
    customTimedActivatedFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
            data: {
              title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardTrash')}`,
              playerId: player.id,
              imperiumCards: gameState.playerHandCards,
              mode: 'select',
              colorScheme: 'negative',
            } as ImperiumCardSelectorData,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((cardToTrash: ImperiumDeckCard) => {
            game.trashImperiumCard(player.id, cardToTrash, 'hand');
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.payCostForPlayer(player.id, { type: 'intrigue-trash' });
          });
        },
      },
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const exclusiveID = crypto.randomUUID();
          for (let i = 1; i <= gameState.playerResources.signet; i++) {
            game.updatePlayerTurnInfo(player.id, {
              effectConversions: [
                {
                  type: 'helper-trade',
                  effectCosts: {
                    type: 'reward',
                    effectRewards: [
                      {
                        type: 'signet',
                        amount: i,
                      },
                    ],
                  },
                  effectConversions: {
                    type: 'reward',
                    effectRewards: [
                      {
                        type: 'sword',
                        amount: i,
                      },
                    ],
                  },
                  exlusiveChoiceOfMultipleEffectsId: exclusiveID,
                },
              ],
            });
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (
            gameState.playerDeckCards.length + gameState.playerHandCards.length > 8 &&
            gameState.playerIntrigueCount < 2 &&
            Math.random() > 0.33
          ) {
            game.addRewardToPlayer(player.id, { type: 'card-destroy' });
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.payCostForPlayer(player.id, { type: 'intrigue-trash' });
          }
        },
      },
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const playerCombatIntrigues = gameState.playerCombatIntrigues;
          const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
          const maxAdditionalScoreTroughSignets = gameState.playerResources.signet;

          const sortedEnemyCombatScores = gameState.enemyCombatUnits
            .map((x) => getPlayerCombatStrength(x, gameState))
            .sort((a, b) => b - a);
          const currentCombatRank = sortedEnemyCombatScores.filter((x) => x >= playerCombatScore).length + 1;

          const { playableIntriguesWithSwords, playableIntriguesWithoutSwords } = game.getPlayableCombatIntrigues(
            player,
            gameState,
            playerCombatIntrigues,
          );

          const maxAdditionalScoreThroughIntrigues = playableIntriguesWithSwords.reduce((sum, x) => sum + x.addedScore, 0);
          const maxAdditionalCombatScore = maxAdditionalScoreTroughSignets + maxAdditionalScoreThroughIntrigues;

          const potentialCombatRank =
            sortedEnemyCombatScores.filter((x) => x >= playerCombatScore + maxAdditionalCombatScore).length + 1;

          if (potentialCombatRank < currentCombatRank) {
            const targetEnemyCombatScore = sortedEnemyCombatScores.find(
              (x) => playerCombatScore + maxAdditionalCombatScore > x,
            )!;

            const signetsToBePlayed = Math.min(targetEnemyCombatScore - playerCombatScore, maxAdditionalScoreTroughSignets);

            game.payCostForPlayer(player.id, { type: 'signet', amount: signetsToBePlayed });
            game.addRewardToPlayer(player.id, { type: 'sword', amount: signetsToBePlayed });
          }
        },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) => 0.75,
  },
  {
    id: 'Count Glossu Rabban',
    customSignetAIFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const resourceOptions = gameState.boardSpaces
        .filter((bs) => gameState.playerLocations.includes(bs.title.en))
        .map((x) => x.ownerReward)
        .filter((x) => x !== undefined);

      const resourceChoices = game.ai.getDesiredRewardEffects(player, resourceOptions, gameState);
      for (const choice of resourceChoices) {
        game.addRewardToPlayer(player.id, choice);
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-game-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          game.setLocationOwner('Carthag', player.id);
          game.logPlayerGainedLocationControl(player.id, 1, 'Carthag');
          game.addRewardToPlayer(player.id, { type: 'victory-point' });
        },
      },
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          game.addRewardToPlayer(player.id, { type: 'card-discard' });
        },
      },
    ],
    signetRingValue: (player, gameState) => {
      return gameState.playerLocations.length * 2;
    },
  },
  {
    id: 'Chani Kynes',
    gameModifiers: {
      fieldCost: [{ id: 'chani-spice-field-costs', actionType: 'spice', costType: 'water', amount: -1 }],
      fieldReward: [{ id: 'chani-spice-field-rewards', actionType: 'spice', rewardType: 'spice', amount: -1 }],
    },
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const { allCards, imperiumRowCards, recruitableCards, alwaysBuyableCards } = game.getAllBuyableCards(
            gameState.playerTurnInfos?.factionRecruitment,
          );

          const reducedFremenCards = allCards
            .filter((x) => x.faction === 'fremen')
            .map((x) => {
              const costs = x.persuasionCosts ?? 0;
              const costReduction = costs > gameState.playerResources.signet ? gameState.playerResources.signet : costs;

              return {
                ...x,
                persuasionCosts: costs - costReduction,
              };
            });

          const availablePersuasion = getPlayerPersuasion(player);

          const buyableUniqueCards = reducedFremenCards.filter(
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
            const reducedCardCosts = pickedCard.persuasionCosts ?? 0;

            if (imperiumRowCards.some((x) => x.id === pickedCard.id)) {
              source = 'row';
            } else if (recruitableCards.some((x) => x.id === pickedCard.id)) {
              source = 'deck';
            }

            const originalCardCosts = allCards.find((x) => x.id === pickedCard.id)?.persuasionCosts ?? 0;
            const costReduction = originalCardCosts - reducedCardCosts;
            game.payCostForPlayer(player.id, { type: 'signet', amount: costReduction });
            game.acquireImperiumCard(player.id, pickedCard, source);
          });
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          const availableSignetTokens = gameState.playerResources.signet;
          if (availableSignetTokens < 1) {
            return;
          }

          const availablePersuasion = getPlayerPersuasion(player);
          const { allCards, imperiumRowCards, recruitableCards } = game.getAllBuyableCards(
            gameState.playerTurnInfos?.factionRecruitment,
          );

          const reducedFremenCards: (ImperiumDeckCard & { originalPersuasionCosts?: number })[] = allCards.map((x) => {
            if (x.faction !== 'fremen') {
              return x;
            } else {
              return {
                ...x,
                persuasionCosts: x.persuasionCosts
                  ? x.persuasionCosts >= availableSignetTokens
                    ? x.persuasionCosts - availableSignetTokens
                    : 0
                  : 0,
                originalPersuasionCosts: x.persuasionCosts ?? 0,
              };
            }
          });

          const cardToBuy = game.ai.getImperiumCardToBuy(availablePersuasion, reducedFremenCards, player, gameState, []);
          if (cardToBuy?.faction === 'fremen' && cardToBuy.originalPersuasionCosts) {
            let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
            if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
              source = 'row';
            } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
              source = 'deck';
            }

            const usedSignetTokens =
              cardToBuy.originalPersuasionCosts < availableSignetTokens
                ? cardToBuy.originalPersuasionCosts
                : availableSignetTokens;

            game.acquireImperiumCard(player.id, cardToBuy, source);
            game.payCostForPlayer(player.id, { type: 'signet', amount: usedSignetTokens });
          }
        },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) => 1.75,
  },
  {
    id: 'Stilgar',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const exclusiveID = crypto.randomUUID();
          for (let i = 1; i <= gameState.playerResources.signet; i++) {
            game.updatePlayerTurnInfo(player.id, {
              effectConversions: [
                {
                  type: 'helper-trade',
                  effectCosts: {
                    type: 'reward',
                    effectRewards: [
                      {
                        type: 'signet',
                        amount: i,
                      },
                    ],
                  },
                  effectConversions: {
                    type: 'reward',
                    effectRewards: [
                      {
                        type: 'sword',
                        amount: i * 3,
                      },
                    ],
                  },
                  exlusiveChoiceOfMultipleEffectsId: exclusiveID,
                },
              ],
            });
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const playerCombatIntrigues = gameState.playerCombatIntrigues;
          const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
          const maxAdditionalScoreTroughSignets = gameState.playerResources.signet * 3;

          const sortedEnemyCombatScores = gameState.enemyCombatUnits
            .map((x) => getPlayerCombatStrength(x, gameState))
            .sort((a, b) => b - a);
          const currentCombatRank = sortedEnemyCombatScores.filter((x) => x >= playerCombatScore).length + 1;

          const { playableIntriguesWithSwords, playableIntriguesWithoutSwords } = game.getPlayableCombatIntrigues(
            player,
            gameState,
            playerCombatIntrigues,
          );

          const maxAdditionalScoreThroughIntrigues = playableIntriguesWithSwords.reduce((sum, x) => sum + x.addedScore, 0);
          const maxAdditionalCombatScore = maxAdditionalScoreTroughSignets + maxAdditionalScoreThroughIntrigues;

          const potentialCombatRank =
            sortedEnemyCombatScores.filter((x) => x >= playerCombatScore + maxAdditionalCombatScore).length + 1;

          if (potentialCombatRank < currentCombatRank) {
            const targetEnemyCombatScore = sortedEnemyCombatScores.find(
              (x) => playerCombatScore + maxAdditionalCombatScore > x,
            )!;

            const signetsToBePlayed = Math.min(targetEnemyCombatScore - playerCombatScore, maxAdditionalScoreTroughSignets);

            game.payCostForPlayer(player.id, { type: 'signet', amount: signetsToBePlayed });
            game.addRewardToPlayer(player.id, { type: 'sword', amount: signetsToBePlayed * 3 });
          }
        },
      },
    ],
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1 || gameState.playerCombatUnits.troopsInGarrison < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 0.05 : 0;
        }
      },
    },
    gameModifiers: {
      fieldFactionAccess: [
        {
          id: 'liet-fremen',
          fieldId: 'Sietch Tabr',
        },
      ],
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 3,
  },
  {
    id: 'Liet Kynes',
    gameModifiers: {
      factionInfluence: [
        {
          id: 'liet',
          factionType: 'fremen',
          noInfluence: true,
          alternateReward: {
            type: 'water',
          },
        },
      ],
      fieldFactionAccess: [
        {
          id: 'liet-fremen',
          factionType: 'fremen',
        },
      ],
    },
    customSignetFunction: (player, gameState, game) => {
      const exclusiveID = crypto.randomUUID();
      let hasOptions = false;
      if (gameState.playerResources.water > 1) {
        hasOptions = true;
        game.updatePlayerTurnInfo(player.id, {
          effectConversions: [
            {
              type: 'helper-trade',
              effectCosts: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'water',
                  },
                  {
                    type: 'water',
                  },
                ],
              },
              effectConversions: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'signet',
                    amount: 3,
                  },
                ],
              },
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
            },
          ],
        });
      }
      if (gameState.playerResources.signet > 2) {
        hasOptions = true;
        game.updatePlayerTurnInfo(player.id, {
          effectConversions: [
            {
              type: 'helper-trade',
              effectCosts: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'signet',
                    amount: 3,
                  },
                ],
              },
              effectConversions: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'victory-point',
                  },
                ],
              },
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
            },
          ],
        });
      }
      if (hasOptions) {
        game.updatePlayerTurnInfo(player.id, {
          effectConversions: [
            {
              type: 'helper-trade',
              effectCosts: {
                type: 'reward',
                effectRewards: [],
              },
              effectConversions: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'signet',
                  },
                ],
              },
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
            },
          ],
        });
      } else {
        game.addRewardToPlayer(player.id, { type: 'signet' });
      }
    },
    customSignetAIFunction(player, gameState, game) {
      if (gameState.playerResources.signet > 2) {
        game.addRewardToPlayer(player.id, { type: 'victory-point' });
        game.payCostForPlayer(player.id, { type: 'signet', amount: 3 });
      } else if (gameState.playerResources.water > 1) {
        game.payCostForPlayer(player.id, { type: 'water', amount: 2 });
        game.addRewardToPlayer(player.id, { type: 'signet', amount: 3 });
      } else {
        game.addRewardToPlayer(player.id, { type: 'signet' });
      }
    },
    signetRingValue: (player, gameState) => {
      let value = 2.5;
      if (gameState.playerResources.signet > 2) {
        value += 10;
      } else {
        value += 1 * gameState.playerResources.signet;
      }
      return value;
    },
  },
  {
    id: 'Princess Irulan Corrino',
    gameModifiers: {
      factionInfluence: [
        {
          id: 'irulan',
          factionType: 'emperor',
          noInfluence: true,
          alternateReward: {
            type: 'solari',
          },
        },
      ],
      fieldFactionAccess: [
        {
          id: 'irulan-emperor',
          factionType: 'emperor',
        },
      ],
      customActions: [
        {
          id: 'irulan-field-history',
          action: 'field-marker',
        },
      ],
    },
    customSignetFunction: (player, gameState, game) => {
      const possibleNewMarkerLocations = gameState.locations.filter(
        (x) => !gameState.playerAgentsOnFields.some((y) => y.fieldId === x.actionField.title.en),
      );

      if (possibleNewMarkerLocations.length < 1) {
        return;
      }

      const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
          playerId: player.id,
          locations: possibleNewMarkerLocations,
          mode: 'select',
          colorScheme: 'positive',
        } as BoardSpaceSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((location: DuneLocation) => {
        game.changeFieldMarkerModifier(player.id, location.actionField.title.en, 1);
      });
    },
    customSignetAIFunction: (player, gameState, game) => {
      const possibleNewMarkerLocations = gameState.playerAgentsOnFields.map((x) => x.fieldId);

      if (possibleNewMarkerLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleNewMarkerLocations.length);
        game.changeFieldMarkerModifier(player.id, possibleNewMarkerLocations[randomIndex], 1);
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-agent-placement',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          const playerFieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
          if (!playerFieldMarkers) {
            return;
          }

          const fieldWithMarker = gameState.playerAgentsOnFields.find((x) =>
            playerFieldMarkers.some((marker) => marker.fieldId === x.fieldId && marker.amount > 0),
          );
          if (fieldWithMarker) {
            game.changeFieldMarkerModifier(player.id, fieldWithMarker.fieldId, -1);
            game.addRewardToPlayer(player.id, { type: 'card-draw', amount: 2 });
          }
        },
      },
    ],
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      return playerAgentsOnFields.length > 0 ? 2.75 : 0;
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 4.5,
  },
  {
    id: 'Lady Margot Fenring',
    customTimedFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          game.updatePlayerTurnInfo(player.id, {
            effectConversions: [
              {
                type: 'helper-trade',
                effectCosts: {
                  type: 'reward',
                  effectRewards: [{ type: 'card-discard' }],
                },
                effectConversions: {
                  type: 'reward',
                  effectRewards: [{ type: 'card-draw' }, { type: 'turn-pass' }],
                },
              },
            ],
          });
        },
      },
    ],
    customSignetFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const { allCards, imperiumRowCards, recruitableCards, alwaysBuyableCards } = game.getAllBuyableCards(
        gameState.playerTurnInfos?.factionRecruitment,
      );

      const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardAcquire')}`,
          playerId: player.id,
          imperiumCards: [...imperiumRowCards, ...recruitableCards],
          mode: 'select',
          colorScheme: 'positive',
        } as ImperiumCardSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((pickedCard: ImperiumDeckCard) => {
        game.addPlayerImperiumRowModifier(player.id, {
          cardId: pickedCard.id,
          persuasionAmount: -1,
        });
        const enemyPlayers = gameState.enemyPlayers;
        for (const player of enemyPlayers) {
          game.addPlayerImperiumRowModifier(player.id, {
            cardId: pickedCard.id,
            persuasionAmount: 1,
          });
        }
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      let targetCard: ImperiumRowCard | undefined;
      const handCardAmount = gameState.playerHandCards.length;
      const buyableCards = gameState.imperiumRowCards.filter(
        (x) => x.type === 'imperium-card' && x.persuasionCosts && x.persuasionCosts <= handCardAmount,
      );
      if (buyableCards.length > 0) {
        buyableCards.sort((a, b) => (b.persuasionCosts ?? 0) - (a.persuasionCosts ?? 0));
        targetCard = buyableCards[0] as ImperiumRowCard;
      } else {
        const nonBuyableCards = gameState.imperiumRowCards.filter(
          (x) => x.persuasionCosts && x.persuasionCosts > handCardAmount,
        );
        if (nonBuyableCards.length > 0) {
          nonBuyableCards.sort((a, b) => (b.persuasionCosts ?? 0) - (a.persuasionCosts ?? 0));
          targetCard = nonBuyableCards[0] as ImperiumRowCard;
        }
      }
      if (targetCard) {
        game.addPlayerImperiumRowModifier(player.id, {
          cardId: targetCard.id,
          persuasionAmount: -1,
        });
        const enemyPlayers = gameState.enemyPlayers;
        for (const player of enemyPlayers) {
          game.addPlayerImperiumRowModifier(player.id, {
            cardId: targetCard.id,
            persuasionAmount: 1,
          });
        }
      }
    },
    signetRingValue: (player, gameState) => 2.5,
  },
  {
    id: 'Count Hasimir Fenring',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1 || gameState.playerCombatUnits.troopsInGarrison < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 0.05 : 0;
        }
      },
    },
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          game.resolveStructuredEffect(
            {
              type: 'helper-or',
              effectLeft: {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                effectConversions: { type: 'reward', effectRewards: [{ type: 'sword', amount: 2 }] },
              },
              effectRight: {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                effectConversions: { type: 'reward', effectRewards: [{ type: 'intrigue' }] },
              },
            },
            player,
            gameState,
          );
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          for (let i = 0; i < gameState.playerResources.signet; i++) {
            game.resolveStructuredEffects(
              [
                {
                  type: 'helper-or',
                  effectLeft: {
                    type: 'helper-trade',
                    effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                    effectConversions: { type: 'reward', effectRewards: [{ type: 'sword', amount: 2 }] },
                  },
                  effectRight: {
                    type: 'helper-trade',
                    effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                    effectConversions: { type: 'reward', effectRewards: [{ type: 'intrigue' }] },
                  },
                },
              ],
              player,
              gameState,
            );
          }
        },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) => 2.5 - 1.0 * gameState.playerResources.signet,
  },
  {
    id: 'Tessia Vernius',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerTechTiles.length < 1) {
            return;
          }

          const dialogRef = game.dialog.open(TechTileSelectorDialogComponent, {
            data: {
              title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectTechTileTrash')}`,
              playerId: player.id,
              techTiles: gameState.playerTechTiles,
              mode: 'select',
              colorScheme: 'negative',
            } as TechTileSelectorData,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((pickedCard: TechTileDeckCard) => {
            game.trashPlayerTechTile(player.id, pickedCard);
            game.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
            game.resolveRewardChoices(player);
          });
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerTechTiles.length < 1) {
            return;
          }

          game.resolveStructuredEffect(
            {
              type: 'helper-trade',
              effectCosts: { type: 'reward', effectRewards: [{ type: 'tech-tile-trash' }] },
              effectConversions: { type: 'reward', effectRewards: [{ type: 'faction-influence-up-choice' }] },
            },
            player,
            gameState,
          );
        },
      },
    ],
  },
  {
    id: 'Count August Metulli',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'high-council', modifier: -0.2 }],
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'persuasion') ? -0.05 : 0.0,
    },
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          const playerVictoryPoints = gameState.playerScore.victoryPoints;
          const playerPersuasion =
            player.permanentPersuasion + player.persuasionGainedThisRound - player.persuasionSpentThisRound;

          game.addRewardToPlayer(player.id, { type: 'signet', amount: playerVictoryPoints + playerPersuasion });
          game.removePersuasionFromPlayer(player.id, player.permanentPersuasion + player.persuasionGainedThisRound);
        },
      },
    ],
    customSignetFunction: (player, gameState, game) => {
      if (gameState.playerResources.signet < 1) {
        return;
      }

      const imperiumRowCards = gameState.imperiumRowCards.filter(
        (x) => x.type === 'imperium-card' && (x.persuasionCosts ?? 0) <= gameState.playerResources.signet,
      ) as ImperiumRowCard[];
      if (imperiumRowCards.length < 1) {
        return;
      }

      const discardPileCards = gameState.enemyDiscardPiles.flatMap((x) => x.cards);

      const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardChoice')}`,
          playerId: player.id,
          imperiumCards: [...imperiumRowCards, ...discardPileCards],
          mode: 'select',
          colorScheme: 'neutral',
        } as ImperiumCardSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((chosenImperiumRowCard: ImperiumDeckCard) => {
        if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
          if (chosenImperiumRowCard.persuasionCosts) {
            game.payCostForPlayer(player.id, {
              type: 'signet',
              amount: chosenImperiumRowCard.persuasionCosts,
            });
          }
          game.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
        }
      });
    },
    customSignetAIFunction: (player, gameState, game) => {
      if (gameState.playerResources.signet < 1) {
        return;
      }

      const imperiumRowCards = gameState.imperiumRowCards.filter(
        (x) => x.type === 'imperium-card' && (x.persuasionCosts ?? 0) <= gameState.playerResources.signet,
      ) as ImperiumRowCard[];
      if (imperiumRowCards.length < 1) {
        return;
      }

      let chosenImperiumRowCard: ImperiumRowCard | undefined;
      let bestEffectValue = 0;
      for (const card of imperiumRowCards) {
        if (card.structuredAgentEffects) {
          const effectEvaluation = game.ai.getStructuredEffectUsefulnesAndCosts(
            card.structuredAgentEffects,
            player,
            gameState,
          );
          if (
            effectEvaluation.usefullness > bestEffectValue &&
            playerCanPayCosts(effectEvaluation.costs, player, gameState)
          ) {
            chosenImperiumRowCard = card;
            bestEffectValue = effectEvaluation.usefullness;
          }
        }
      }

      if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
        if (chosenImperiumRowCard.persuasionCosts) {
          game.payCostForPlayer(player.id, {
            type: 'signet',
            amount: chosenImperiumRowCard.persuasionCosts,
          });
        }
        game.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
      }
    },
    signetRingValue: (player, gameState) => {
      const potentialImperiumRowCards = gameState.imperiumRowCards.filter(
        (x) =>
          x.type === 'imperium-card' &&
          x.structuredAgentEffects &&
          gameState.playerResources.signet >= (x.persuasionCosts ?? 0),
      );
      return potentialImperiumRowCards.length > 0 ? 2.5 + 1.0 * potentialImperiumRowCards.length : 0;
    },
  },
  {
    id: 'Lunara Metulli',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'water' || x.type === 'spice') ? 0.05 : 0;
        }
      },
    },
    customTimedFunctions: [
      {
        timing: 'timing-game-start',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          game.addRewardToPlayer(player.id, { type: 'solari', amount: -2 }, { valuesCanBeNegative: true });
        },
      },
    ],
    customTimedActivatedFunctions: [
      {
        timing: 'timing-agent-placement',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const boardSpace = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
          if (boardSpace) {
            for (const reward of boardSpace.rewards) {
              if (reward.type === 'solari' || reward.type === 'water' || reward.type === 'spice') {
                game.resolveStructuredEffect(
                  {
                    type: 'helper-trade',
                    effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                    effectConversions: { type: 'reward', effectRewards: [{ type: reward.type }] },
                  },
                  player,
                  gameState,
                );
              }
            }
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-agent-placement',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const boardSpace = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
          if (boardSpace) {
            for (const reward of boardSpace.rewards) {
              if (reward.type === 'water' || reward.type === 'spice') {
                game.addRewardToPlayer(player.id, { type: reward.type });
                game.payCostForPlayer(player.id, { type: 'signet' });
                break;
              }
              if (reward.type === 'solari' && gameState.playerResources.signet > 1) {
                game.addRewardToPlayer(player.id, { type: reward.type });
                game.payCostForPlayer(player.id, { type: 'signet' });
                break;
              }
            }
          }
        },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) => 2.75,
  },
  // {
  //   id: 'Eva Moritani',
  //   gameModifiers: {
  //     customActions: [
  //       {
  //         id: 'eva-labour-camps',
  //         action: 'field-marker',
  //       },
  //     ],
  //   },
  // },
  {
    id: 'Dara Moritani',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'swordmaster', modifier: 0.2 }],
    },
    gameModifiers: {
      fieldEnemyAgentAccess: [
        {
          id: 'dara-enemy-access',
          actionTypes: ['bene', 'choam', 'emperor', 'fremen', 'guild', 'landsraad', 'spice', 'town'],
        },
      ],
      fieldCost: [{ id: 'dara-landsraad-costs', actionType: 'landsraad', costType: 'solari', amount: 2 }],
    },
    customSignetFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const rewardAmount = gameState.playerAgentsOnFields.filter((pa) =>
        gameState.enemyAgentsOnFields.some((ea) => ea.fieldId === pa.fieldId),
      ).length;

      game.addRewardToPlayer(player.id, { type: 'spice', amount: rewardAmount });
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      return (
        1 +
        2.0 *
          gameState.enemyAgentsOnFields.filter((enemy) =>
            playerAgentsOnFields.some((player) => player.fieldId === enemy.fieldId),
          ).length
      );
    },
  },
  {
    id: 'Earl Memnon Thorvald',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.solari < 1) {
          return 0;
        } else {
          return field.actionType === 'landsraad' ? 0.05 : 0;
        }
      },
    },
    customTimedFunctions: [
      {
        timing: 'timing-agent-placement',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          if (gameState.playerResources.solari < 1) {
            return;
          }

          const field = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
          if (!field || field.actionType !== 'landsraad') {
            return;
          }

          if (!player.isAI) {
            game.resolveStructuredEffect(
              {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'solari' }] },
                effectConversions: { type: 'reward', effectRewards: [{ type: 'troop' }] },
              },
              player,
              gameState,
            );
          } else {
            if (!player.hasSwordmaster && gameState.currentRound < 4) {
              return;
            }

            if (gameState.playerCombatUnits.troopsInGarrison < 6) {
              game.payCostForPlayer(player.id, { type: 'solari' });
              game.addRewardToPlayer(player.id, { type: 'troop' });
            }
          }
        },
      },
    ],
  },
  {
    id: 'The Preacher',
    gameModifiers: {
      fieldEnemyAgentAccess: [
        {
          id: 'preacher-enemy-access',
          actionTypes: ['town'],
        },
      ],
    },
    customSignetFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const enemyLocation = gameState.enemyLocations.find(
        (x) => x.locationId === gameState.playerAgentPlacedOnFieldThisTurn,
      );
      if (enemyLocation) {
        game.payCostForPlayer(enemyLocation.playerId, { type: 'card-discard' });
      } else {
        game.addRewardToPlayer(player.id, { type: 'focus' });
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: GameCommands) => {
          for (const agentOnField of gameState.playerAgentsOnFields) {
            const isEnemyLocation = gameState.enemyLocations.some((x) => x.locationId === agentOnField.fieldId);
            if (isEnemyLocation) {
              game.addRewardToPlayer(player.id, { type: 'persuasion' });
            }
          }
        },
      },
    ],
    signetRingValue: (player, gameState) => 2,
  },
];
