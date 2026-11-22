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
import { getPlayerCombatStrength } from '../helpers/combat';
import { isResourceType } from '../helpers/resources';
import { playerCanPayCosts } from '../helpers/rewards';
import { ActionField, DuneLocation, StructuredConversionEffect, StructuredEffect } from '../models';
import { AIAdjustments, CardGameAdjustmentsGameInterface, GameState, TimedFunction } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard, ImperiumRowCard } from '../services/cards.service';
import {
  FieldCostsModifier,
  FieldMarkerModifier,
  FieldRewardsModifier,
  GameModifiers,
} from '../services/game-modifier.service';
import { TechTileDeckCard } from '../services/tech-tiles.service';

export interface LeaderGameAdjustments {
  id: string;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
  customSignetEffects?: StructuredEffect[];
  customSignetFunction?: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => void;
  customSignetAIFunction?: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => void;
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
      fieldReward: [
        { id: 'paul-fremen-signet-reward', rewardType: 'signet', amount: 1, actionType: 'fremen' },
        { id: 'paul-fremen-signet-reward', rewardType: 'signet', amount: 1, actionType: 'spice' },
      ],
    },
    customSignetFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      const signetCount = gameState.playerResources.signet;
      if (signetCount > 3) {
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
        game.addRewardToPlayer(player.id, { type: 'agent-lift' });
        game.resolveRewardChoices();
      } else if (signetCount > 1) {
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
        game.addRewardToPlayer(player.id, { type: 'troop' });
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
      let value = 0;
      const signetCount = gameState.playerResources.signet;
      if (signetCount > 3) {
        if (gameState.playerAgentsOnFields.length > 0) {
          value += 5.0;
        } else {
          value -= 1.0;
        }
      } else if (signetCount > 1) {
        value += 3.0;
      }
      return value;
    },
    signetTokenOrFieldMarkerValue: (player, gameState, targetBoardSpace) => {
      const signetCount = gameState.playerResources.signet;
      if (signetCount > 3) {
        return 0;
      } else {
        return 1.25;
      }
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
            game.resolveRewardChoices();
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
      if (player.isAI || !gameState.playerLeader) return;

      const locations = gameState.locations.filter((location) =>
        gameState.playerAgentsOnFields.some((agent) => location.actionField.title.en === agent.fieldId),
      );
      const greenBoardSpaces: DuneLocation[] = gameState.boardSpaces
        .filter((x) => x.actionType === 'landsraad' && x.costs)
        .map((x) => ({ actionField: x, color: 'rgb(72, 89, 71)', position: { marginLeft: 0, marginTop: 0 } }));

      const locationChoices = [...locations, ...greenBoardSpaces];

      if (locationChoices.length < 1) {
        return;
      }

      const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationOrBoardSpaceChoice')}`,
          playerId: player.id,
          locations: locationChoices,
          mode: 'select',
          colorScheme: 'positive',
        } as BoardSpaceSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((location: DuneLocation) => {
        game.playSound('click-soft');
        game.changeFieldMarkerModifier(player.id, location.actionField.title.en, 1);
        const fieldCosts = location.actionField.costs?.shift();
        if (fieldCosts && isResourceType(fieldCosts.type)) {
          game.addPlayerGameModifiers(player.id, {
            fieldCost: [
              {
                id: 'leto-field-cost-modifier-' + location.actionField.title.en,
                fieldId: location.actionField.title.en,
                costType: fieldCosts.type,
                amount: -1,
              },
            ],
          });
        }
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      const locations = gameState.locations
        .filter((location) =>
          gameState.playerAgentsOnFields.some((agent) => location.actionField.title.en === agent.fieldId),
        )
        .map((x) => ({
          id: x.actionField.title.en,
          boardSpace: x.actionField,
          weight: x.actionField.costs?.some((c) => c.type === 'spice') ? 2.25 : 1.25,
        }));
      const greenBoardSpaces = gameState.boardSpaces
        .filter((x) => x.actionType === 'landsraad' && x.costs)
        .map((x) => ({ id: x.title.en, boardSpace: x, weight: x.costs ? 0.5 : 1.5 }));

      const locationChoices = [...locations, ...greenBoardSpaces];

      if (locationChoices.length < 1) {
        return;
      }

      const totalWeight = locationChoices.reduce((sum, choice) => sum + choice.weight, 0);
      let roll = Math.random() * totalWeight;
      const chosen =
        locationChoices.find((choice) => (roll -= choice.weight) < 0) ?? locationChoices[locationChoices.length - 1];

      game.changeFieldMarkerModifier(player.id, chosen.id, 1);
      const fieldCosts = chosen.boardSpace.costs?.shift();
      if (fieldCosts && isResourceType(fieldCosts.type)) {
        game.addPlayerGameModifiers(player.id, {
          fieldCost: [
            {
              id: 'leto-field-cost-modifier-' + chosen.id,
              fieldId: chosen.id,
              costType: fieldCosts.type,
              amount: -1,
            },
          ],
        });
      }
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      return 1.75;
    },
    signetTokenOrFieldMarkerValue: (player, gameState, targetBoardSpace) => {
      if (targetBoardSpace?.actionType === 'landsraad') {
        return 0.25;
      } else {
        return 2.0;
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const fieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
          const locationsWithAgentsAndFieldMarkers = gameState.locations.filter((location) =>
            fieldMarkers?.some((marker) => marker.amount > 0 && location.actionField.title.en === marker.fieldId),
          );
          if (locationsWithAgentsAndFieldMarkers.length > 0) {
            game.addRewardToPlayer(player.id, { type: 'persuasion', amount: locationsWithAgentsAndFieldMarkers.length });
          }
        },
      },
    ],
  },
  {
    id: 'Feyd-Rautha Harkonnen',
    customSignetFunction: (player, gameState, game) => {
      if (player.isAI) {
        return;
      }

      const imperiumRowCards = gameState.imperiumRowCards.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[];
      if (imperiumRowCards.length < 1 || !gameState.playerLeader) {
        return;
      }

      const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardChoice')}`,
          playerId: player.id,
          imperiumCards: imperiumRowCards,
          mode: 'select',
          colorScheme: 'neutral',
        } as ImperiumCardSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((chosenImperiumRowCard: ImperiumRowCard) => {
        if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
          game.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
          game.removeCardFromImperiumRow(chosenImperiumRowCard);
        }
      });
    },
    customSignetAIFunction: (player, gameState, game) => {
      const imperiumRowCards = gameState.imperiumRowCards.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[];
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
        game.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
        game.removeCardFromImperiumRow(chosenImperiumRowCard);
      }
    },
    customTimedActivatedFunctions: [
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const exclusiveID = crypto.randomUUID();
          for (let i = 1; i <= gameState.playerResources.signet; i++) {
            game.addPlayerConversionChoice(player.id, {
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
              effectConversionRewards: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'sword',
                    amount: i,
                  },
                ],
              },
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
            });
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
  },
  {
    id: 'Count Glossu Rabban',
    customSignetFunction: (player, gameState, game) => {
      if (player.isAI || !gameState.playerLeader) return;

      const playerLocations = gameState.locations.filter((location) =>
        gameState.playerLocations.includes(location.actionField.title.en),
      );
      if (playerLocations.length < 1) {
        return;
      }

      const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
          playerId: player.id,
          locations: playerLocations,
          mode: 'select',
          colorScheme: 'positive',
          minSelected: 1,
          maxSelected: 2,
        } as BoardSpaceSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((locations: DuneLocation[]) => {
        game.playSound('click-soft');
        for (const location of locations) {
          if (location.actionField.ownerReward) {
            game.addRewardToPlayer(player.id, location.actionField.ownerReward);
          }
        }
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      const resourceOptions = gameState.boardSpaces
        .filter((bs) => gameState.playerLocations.includes(bs.title.en))
        .map((x) => x.ownerReward)
        .filter((x) => x !== undefined);

      const resourceChoices = game.ai.getDesiredRewardEffects(player, resourceOptions, gameState, 2);
      for (const choice of resourceChoices) {
        game.addRewardToPlayer(player.id, choice);
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-game-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          game.setLocationOwner('Carthag', player.id);
          game.logPlayerGainedLocationControl(player.id, 1, 'Carthag');
          game.addRewardToPlayer(player.id, { type: 'victory-point' });
        },
      },
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const randomCard = gameState.playerHandCards[Math.floor(Math.random() * gameState.playerHandCards.length)];
          game.discardPlayerHandCard(player.id, randomCard);
        },
      },
    ],
    signetRingValue: (player, gameState) => {
      return gameState.playerLocations.length * 2;
    },
  },
  {
    id: 'Baron Vladimir Harkonnen',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerHandCards.length < 1 || !gameState.playerLeader) return;

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
            game.resolveRewardChoices();
          });
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (
            gameState.playerDeckCards.length + gameState.playerHandCards.length > 8 &&
            gameState.playerIntrigueCount < 2 &&
            Math.random() > 0.5
          ) {
            game.addRewardToPlayer(player.id, { type: 'card-trash' });
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.addRewardToPlayer(player.id, { type: 'intrigue' });
            game.payCostForPlayer(player.id, { type: 'intrigue-trash' });
          }
        },
      },
    ],
  },
  {
    id: 'Chani Kynes',
    customTimedFunctions: [
      {
        timing: 'timing-game-start',
        function: (player, gameState, game) => {
          const spiceBoardSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'spice' && x.costs);
          const townBoardSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'town' && x.costs);

          const chaniCostModifiers: FieldCostsModifier[] = [
            { id: 'chani-spice-field-costs', actionType: 'spice', costType: 'water', amount: -1 },
            { id: 'chani-town-field-costs', actionType: 'town', costType: 'water', amount: -1 },
          ];

          const chaniRewardModifiers: FieldRewardsModifier[] = [];

          for (const spiceBoardSpace of spiceBoardSpaces) {
            chaniRewardModifiers.push({
              id: 'chani-spice-field-costs-' + spiceBoardSpace.title.en,
              fieldId: spiceBoardSpace.title.en,
              rewardType: 'spice',
              amount: -1,
            });
          }
          for (const townBoardSpace of townBoardSpaces) {
            chaniRewardModifiers.push({
              id: 'chani-town-field-costs-' + townBoardSpace.title.en,
              fieldId: townBoardSpace.title.en,
              rewardType: 'troop',
              amount: -1,
            });
          }

          game.addPlayerGameModifiers(player.id, {
            fieldCost: chaniCostModifiers,
            fieldReward: chaniRewardModifiers,
          });
        },
      },
    ],
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1 || !gameState.playerLeader) {
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

          const availablePersuasion = gameState.playerResources.persuasion;

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
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const availableSignetTokens = gameState.playerResources.signet;
          if (availableSignetTokens < 1) {
            return;
          }

          const availablePersuasion = gameState.playerResources.persuasion;
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
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
          if (playerCombatScore < 1) {
            return;
          }

          const exclusiveID = crypto.randomUUID();
          for (let i = 1; i <= gameState.playerResources.signet; i++) {
            game.addPlayerConversionChoice(player.id, {
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
              effectConversionRewards: {
                type: 'reward',
                effectRewards: [
                  {
                    type: 'sword',
                    amount: i * 4,
                  },
                ],
              },
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
            });
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-combat',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }

          const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
          if (playerCombatScore < 1) {
            return;
          }

          const playerCombatIntrigues = gameState.playerCombatIntrigues;
          const maxAdditionalScoreTroughSignets = gameState.playerResources.signet * 4;

          const sortedEnemyCombatScores = gameState.enemyCombatUnits
            .map((x) => getPlayerCombatStrength(x, gameState))
            .sort((a, b) => b - a);
          const currentCombatRank = sortedEnemyCombatScores.filter((x) => x >= playerCombatScore).length + 1;

          const { playableIntriguesWithSwords } = game.getPlayableCombatIntrigues(player, gameState, playerCombatIntrigues);

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
            game.addRewardToPlayer(player.id, { type: 'sword', amount: signetsToBePlayed * 4 });
          }
        },
      },
    ],
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1 || gameState.playerCombatUnits.troopsInGarrison < 1) {
          return 1;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 1.05 : 1;
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
      if (player.isAI) return;

      const exclusiveID = crypto.randomUUID();
      let hasOptions = false;
      if (gameState.playerResources.water > 1) {
        hasOptions = true;
        game.addPlayerConversionChoice(player.id, {
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
          effectConversionRewards: {
            type: 'reward',
            effectRewards: [
              {
                type: 'signet',
                amount: 3,
              },
            ],
          },
          exlusiveChoiceOfMultipleEffectsId: exclusiveID,
        });
      }
      if (gameState.playerResources.signet > 2) {
        hasOptions = true;
        game.addPlayerConversionChoice(player.id, {
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
          effectConversionRewards: {
            type: 'reward',
            effectRewards: [
              {
                type: 'victory-point',
              },
            ],
          },
          exlusiveChoiceOfMultipleEffectsId: exclusiveID,
        });
      }
      if (hasOptions) {
        game.addPlayerConversionChoice(player.id, {
          type: 'helper-trade',
          effectCosts: {
            type: 'reward',
            effectRewards: [],
          },
          effectConversionRewards: {
            type: 'reward',
            effectRewards: [
              {
                type: 'signet',
              },
            ],
          },
          exlusiveChoiceOfMultipleEffectsId: exclusiveID,
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
    },
    customSignetFunction: (player, gameState, game) => {
      if (player.isAI) return;

      const possibleNewMarkerLocations = gameState.locations.filter((x) =>
        gameState.playerAgentsOnFields.some((y) => y.fieldId === x.actionField.title.en),
      );

      if (possibleNewMarkerLocations.length < 1 || !gameState.playerLeader) {
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
        const boardSpaceID = location.actionField.title.en;
        game.changeFieldMarkerModifier(player.id, boardSpaceID, 1);
        game.updatePlayerTurnInfo(player.id, { boardSpaceMarkersPlacedThisTurn: [boardSpaceID] });
      });
    },
    customSignetAIFunction: (player, gameState, game) => {
      const possibleNewMarkerLocations = gameState.playerAgentsOnFields.map((x) => x.fieldId);

      if (possibleNewMarkerLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleNewMarkerLocations.length);
        const boardSpaceID = possibleNewMarkerLocations[randomIndex];
        game.changeFieldMarkerModifier(player.id, boardSpaceID, 1);
        game.updatePlayerTurnInfo(player.id, { boardSpaceMarkersPlacedThisTurn: [boardSpaceID] });
      }
    },
    customTimedFunctions: [
      {
        timing: 'timing-agent-placed',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const playerFieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
          const turnInfos = gameState.playerTurnInfos;
          if (!playerFieldMarkers || playerFieldMarkers.length < 1 || !turnInfos) {
            return;
          }

          const agentPlacedOnFieldId = turnInfos.agentPlacedOnFieldId;
          const boardSpaceMarkersPlacedThisTurn = turnInfos.boardSpaceMarkersPlacedThisTurn;

          const viableMarker = playerFieldMarkers.find(
            (x) =>
              x.fieldId === agentPlacedOnFieldId && (x.amount > 1 || !boardSpaceMarkersPlacedThisTurn.includes(x.fieldId)),
          );

          if (viableMarker) {
            game.changeFieldMarkerModifier(player.id, viableMarker.fieldId, -1);
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
    signetTokenOrFieldMarkerValue: (player, gameState) => 4.0,
  },
  {
    id: 'Lady Margot Fenring',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          game.addPlayerConversionChoice(player.id, {
            type: 'helper-trade',
            effectCosts: {
              type: 'reward',
              effectRewards: [{ type: 'card-discard' }],
            },
            effectConversionRewards: {
              type: 'reward',
              effectRewards: [{ type: 'card-draw' }, { type: 'turn-pass' }],
            },
          });
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-round-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          game.addPlayerConversionChoice(player.id, {
            type: 'helper-trade',
            effectCosts: {
              type: 'reward',
              effectRewards: [{ type: 'card-discard' }],
            },
            effectConversionRewards: {
              type: 'reward',
              effectRewards: [{ type: 'card-draw' }, { type: 'turn-pass' }],
            },
          });
        },
      },
    ],
    customSignetFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      if (player.isAI || !gameState.playerLeader) return;

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
    customSignetAIFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
          return 1;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 1.05 : 1;
        }
      },
    },
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1) {
            return;
          }
          game.resolveStructuredEffect(
            {
              type: 'helper-or',
              effectLeft: {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                effectConversionRewards: { type: 'reward', effectRewards: [{ type: 'sword', amount: 3 }] },
              },
              effectRight: {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                effectConversionRewards: {
                  type: 'reward',
                  effectRewards: [{ type: 'persuasion', amount: 1 }, { type: 'intrigue' }],
                },
              },
            },
            player,
            gameState,
          );
        },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) =>
      3.5 - 0.02 * gameState.playerCardsBought - 0.02 * gameState.playerCardsTrashed,
  },
  {
    id: 'Tessia Vernius',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerTechTiles.length < 1 || !gameState.playerLeader) {
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
            game.resolveRewardChoices();
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
              effectConversionRewards: { type: 'reward', effectRewards: [{ type: 'faction-influence-up-choice' }] },
            },
            player,
            gameState,
          );
        },
      },
    ],
  },
  {
    id: 'Earl Rhombur Vernius',
    customTimedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          game.addRewardToPlayer(player.id, { type: 'tech' });
        },
      },
    ],
    customTimedActivatedFunctions: [
      {
        timing: 'timing-agent-placed',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1 || !gameState.playerTurnInfos?.canBuyTech || !gameState.playerLeader) {
            return;
          }

          const buyableTechTiles = game.getBuyableTechTiles();

          const costReductionPerSignet = 2;
          const maxCostReduction = gameState.playerResources.signet * costReductionPerSignet;

          const reducedTechTiles = buyableTechTiles.map((x) => {
            const costReduction =
              x.costs >= maxCostReduction ? maxCostReduction : x.costs - (x.costs % costReductionPerSignet);

            return {
              ...x,
              costs: x.costs - costReduction,
            };
          });

          const availableSolari = gameState.playerResources.solari;

          const affordableTechTiles = reducedTechTiles.filter((card) => card.costs <= availableSolari);

          if (affordableTechTiles.length < 1) {
            return;
          }

          const dialogRef = game.dialog.open(TechTileSelectorDialogComponent, {
            data: {
              title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectTechTileAcquire')}`,
              playerId: player.id,
              techTiles: affordableTechTiles,
              mode: 'select',
              colorScheme: 'positive',
            } as TechTileSelectorData,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((pickedCard: TechTileDeckCard) => {
            const originalCardCosts = buyableTechTiles.find((x) => x.id === pickedCard.id)?.costs ?? 0;
            const costReduction = originalCardCosts - pickedCard.costs;
            game.payCostForPlayer(player.id, { type: 'signet', amount: costReduction / 2 });
            game.acquireTechTile(player.id, pickedCard);
          });
        },
      },
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources.signet < 1 || !gameState.playerTurnInfos?.canBuyTech || !gameState.playerLeader) {
            return;
          }

          const buyableTechTiles = game.getBuyableTechTiles();

          const costReductionPerSignet = 2;
          const maxCostReduction = gameState.playerResources.signet * costReductionPerSignet;

          const reducedTechTiles = buyableTechTiles.map((x) => {
            const costReduction =
              x.costs > maxCostReduction ? maxCostReduction : x.costs - (x.costs % costReductionPerSignet);

            return {
              ...x,
              costs: x.costs - costReduction,
            };
          });

          const availableSolari = gameState.playerResources.solari;

          const affordableTechTiles = reducedTechTiles.filter((card) => card.costs <= availableSolari);

          if (affordableTechTiles.length < 1) {
            return;
          }

          const dialogRef = game.dialog.open(TechTileSelectorDialogComponent, {
            data: {
              title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectTechTileAcquire')}`,
              playerId: player.id,
              techTiles: affordableTechTiles,
              mode: 'select',
              colorScheme: 'positive',
            } as TechTileSelectorData,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((pickedCard: TechTileDeckCard) => {
            const originalCardCosts = buyableTechTiles.find((x) => x.id === pickedCard.id)?.costs ?? 0;
            const costReduction = originalCardCosts - pickedCard.costs;
            game.payCostForPlayer(player.id, { type: 'signet', amount: costReduction / 2 });
            game.acquireTechTile(player.id, pickedCard);
          });
        },
      },
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerResources.signet < 1 || !gameState.playerLeader) {
            return;
          }

          game.resolveStructuredEffect(
            {
              type: 'helper-trade',
              effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
              effectConversionRewards: { type: 'reward', effectRewards: [{ type: 'sword' }, { type: 'sword' }] },
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
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const availableSignetTokens = gameState.playerResources.signet;
          if (availableSignetTokens < 1) {
            return;
          }

          const availablePersuasion = gameState.playerResources.persuasion;
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
      {
        timing: 'timing-reveal-turn',
        function: (player, gameState, game) => {
          if (gameState.playerResources.signet < 1 || !gameState.playerLeader) {
            return;
          }

          game.resolveStructuredEffect(
            {
              type: 'helper-trade',
              effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
              effectConversionRewards: { type: 'reward', effectRewards: [{ type: 'sword' }, { type: 'sword' }] },
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
    gameModifiers: {
      imperiumRow: [{ id: 'august-metulli-imperium-row-block', isBlocked: true }],
    },
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some(
          (x) => x.type === 'persuasion' || x.type === 'council-seat-small' || x.type === 'council-seat-large',
        )
          ? 0.95
          : 1,
    },
    customSignetFunction: (player, gameState, game) => {
      if (player.isAI) {
        return;
      }

      const imperiumRowCards = gameState.imperiumRowCards as ImperiumRowCard[];
      if (imperiumRowCards.length < 1 || !gameState.playerLeader) {
        return;
      }

      const dialogRef = game.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectCardChoice')}`,
          playerId: player.id,
          imperiumCards: imperiumRowCards,
          mode: 'select',
          colorScheme: 'neutral',
        } as ImperiumCardSelectorData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((chosenImperiumRowCard: ImperiumDeckCard) => {
        if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
          const structuredAgentEffectsWithConnectionActivation: StructuredEffect[] =
            chosenImperiumRowCard.structuredAgentEffects.map((x) => {
              if (x.condition?.type === 'condition-connection') {
                x.condition = undefined;
                return {
                  type: 'helper-trade',
                  effectCosts: { type: 'reward', effectRewards: [{ type: 'card-discard' }] },
                  effectConversionRewards: x,
                } as StructuredConversionEffect;
              }
              return x;
            });
          game.resolveStructuredEffects(structuredAgentEffectsWithConnectionActivation, player, gameState);
        }
      });
    },
    customSignetAIFunction: (player, gameState, game) => {
      const imperiumRowCards = gameState.imperiumRowCards as ImperiumRowCard[];
      if (imperiumRowCards.length < 1) {
        return;
      }

      let chosenImperiumRowCard: ImperiumRowCard | undefined;
      let cardEffect: StructuredEffect[] = [];
      let bestEffectValue = 0;
      for (const card of imperiumRowCards) {
        if (card.structuredAgentEffects) {
          const structuredAgentEffectsWithConnectionActivation: StructuredEffect[] = card.structuredAgentEffects.map((x) => {
            if (x.condition?.type === 'condition-connection') {
              x.condition = undefined;
              return {
                type: 'helper-trade',
                effectCosts: { type: 'reward', effectRewards: [{ type: 'card-discard' }] },
                effectConversionRewards: x,
              } as StructuredConversionEffect;
            }
            return x;
          });
          const effectEvaluation = game.ai.getStructuredEffectUsefulnesAndCosts(
            structuredAgentEffectsWithConnectionActivation,
            player,
            gameState,
          );
          if (
            effectEvaluation.usefullness > bestEffectValue &&
            playerCanPayCosts(effectEvaluation.costs, player, gameState)
          ) {
            chosenImperiumRowCard = card;
            cardEffect = structuredAgentEffectsWithConnectionActivation;
            bestEffectValue = effectEvaluation.usefullness;
          }
        }
      }

      if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
        game.resolveStructuredEffects(cardEffect, player, gameState);
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
          return 1;
        } else {
          return field.rewards.some((x) => x.type === 'water' || x.type === 'spice') ? 1.05 : 1;
        }
      },
    },
    customTimedFunctions: [
      {
        timing: 'timing-game-start',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          game.addRewardToPlayer(player.id, { type: 'leadermarker' });
        },
      },
      {
        timing: 'timing-resource-gained',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          if (gameState.playerResources['leadermarker'] < 1) {
            return;
          }

          if (gameState.playerResources.solari > 3) {
            game.payCostForPlayer(player.id, { type: 'solari', amount: 4 });
            game.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
            game.resolveRewardChoices();
          }
        },
      },
    ],
    customTimedActivatedFunctions: [
      {
        timing: 'timing-agent-placed',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
                    effectConversionRewards: { type: 'reward', effectRewards: [{ type: reward.type }] },
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
        timing: 'timing-agent-placed',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
  {
    id: 'Eva Moritani',
    customTimedActivatedFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const playerFieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
          if (!playerFieldMarkers || playerFieldMarkers.length < 1 || !gameState.playerLeader) {
            return;
          }

          const selectableLocations: DuneLocation[] = [];
          for (const fieldMarker of playerFieldMarkers) {
            const location = gameState.locations.find((x) => x.actionField.title.en === fieldMarker.fieldId);
            if (location) {
              for (let i = 0; i < fieldMarker.amount; i++) {
                selectableLocations.push(location);
              }
            }
          }

          if (playerFieldMarkers.length === 1) {
            const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
              data: {
                title: `${game.translation.translateLS(gameState.playerLeader.name)}: ${game.translation.translate('commonEffectLocationChoice')}`,
                playerId: player.id,
                locations: selectableLocations,
                mode: 'select',
                colorScheme: 'positive',
              } as BoardSpaceSelectorData,
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe((location: DuneLocation) => {
              game.changeFieldMarkerModifier(player.id, location.actionField.title.en, -1);
              game.addRewardToPlayer(player.id, { type: 'troop' });
            });
          } else {
            const dialogRef = game.dialog.open(BoardSpaceSelectorDialogComponent, {
              data: {
                title: `${game.translation.translateLS(gameState.playerLeader.name)}: 1-2 ${game.translation.translate('commonEffectLocationChoice')}`,
                playerId: player.id,
                locations: selectableLocations,
                mode: 'select',
                colorScheme: 'positive',
                minSelected: 1,
                maxSelected: 2,
              } as BoardSpaceSelectorData,
              disableClose: true,
            });

            dialogRef.afterClosed().subscribe((locations: DuneLocation[]) => {
              if (locations.length < 2) {
                game.changeFieldMarkerModifier(player.id, locations[0].actionField.title.en, -1);
                game.addRewardToPlayer(player.id, { type: 'troop' });
              } else {
                for (const location of locations) {
                  game.changeFieldMarkerModifier(player.id, location.actionField.title.en, -1);
                }
                game.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
                game.resolveRewardChoices();
              }
            });
          }
        },
      },
    ],
    customTimedAIFunctions: [
      {
        timing: 'timing-reveal-turn',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
          const playerFieldMarkers = gameState.playerGameModifiers?.fieldMarkers;
          if (!playerFieldMarkers || playerFieldMarkers.length < 1) {
            return;
          }
          const singleFieldMarkers: FieldMarkerModifier[] = [];
          for (const fieldMarker of playerFieldMarkers) {
            for (let i = 0; i < fieldMarker.amount; i++) {
              singleFieldMarkers.push(fieldMarker);
            }
          }

          if (singleFieldMarkers.length < 2) {
            if (Math.random() < 0.8) {
              return;
            }

            game.changeFieldMarkerModifier(player.id, singleFieldMarkers[0].fieldId, -1);
            game.addRewardToPlayer(player.id, { type: 'troop' });
          } else {
            for (const fieldMarker of singleFieldMarkers.slice(0, 2)) {
              game.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, -1);
            }
            game.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
            game.resolveRewardChoices();
          }
        },
      },
    ],
    customSignetFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      if (player.isAI) return;
      game.addRewardToPlayer(player.id, { type: 'solari' });

      const possibleNewMarkerLocations = gameState.locations.filter(
        (x) =>
          (x.actionField.actionType === 'town' || x.actionField.actionType === 'spice') &&
          gameState.playerAgentsOnFields.some((y) => y.fieldId === x.actionField.title.en),
      );

      if (possibleNewMarkerLocations.length < 1 || !gameState.playerLeader) {
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
        const fieldId = location.actionField.title.en;
        game.changeFieldMarkerModifier(player.id, fieldId, 1);
        game.addPlayerGameModifiers(player.id, {
          fieldReward: [{ id: `eva-moritani-labor-camps-${fieldId}`, fieldId: fieldId, rewardType: 'solari', amount: 1 }],
        });
        for (const enemy of gameState.enemyPlayers) {
          game.addPlayerGameModifiers(enemy.id, {
            fieldReward: [{ id: `eva-moritani-labor-camps-${fieldId}`, fieldId: fieldId, rewardType: 'solari', amount: 1 }],
          });
        }
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
      game.addRewardToPlayer(player.id, { type: 'solari' });

      const spiceOrTownFieldIds = gameState.boardSpaces
        .filter((x) => x.actionType === 'spice' || x.actionType === 'town')
        .map((x) => x.title.en);
      const agentsOnSpiceOrTownFields = gameState.playerAgentsOnFields.filter((x) =>
        spiceOrTownFieldIds.includes(x.fieldId),
      );
      if (agentsOnSpiceOrTownFields.length > 0) {
        const fieldId = agentsOnSpiceOrTownFields[0].fieldId;
        game.changeFieldMarkerModifier(player.id, fieldId, 1);
        game.addPlayerGameModifiers(player.id, {
          fieldReward: [{ id: 'eva-moritani-labor-camps', fieldId: fieldId, rewardType: 'solari', amount: 1 }],
        });
        for (const enemy of gameState.enemyPlayers) {
          game.addPlayerGameModifiers(enemy.id, {
            fieldReward: [{ id: 'eva-moritani-labor-camps', fieldId: fieldId, rewardType: 'solari', amount: 1 }],
          });
        }
      }
    },
  },
  {
    id: 'Dara Moritani',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'sword-master') ? 1.1 : 1,
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
    customSignetFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
          return 1;
        } else {
          return field.actionType === 'landsraad' ? 1.05 : 1;
        }
      },
    },
    customTimedFunctions: [
      {
        timing: 'timing-agent-placed',
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
                effectConversionRewards: { type: 'reward', effectRewards: [{ type: 'troop' }] },
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
    customSignetFunction: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
        function: (player: Player, gameState: GameState, game: CardGameAdjustmentsGameInterface) => {
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
