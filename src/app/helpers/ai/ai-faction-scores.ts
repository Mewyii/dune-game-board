import { ActiveFactionType, activeFactionTypes } from 'src/app/models';
import { PlayerFactionScoreType, PlayerScore } from 'src/app/services/player-score-manager.service';

export function getMostDesiredFactionScoreType(
  playerId: number,
  playerScores: PlayerScore[],
  influenceGainAmount: number,
  factionAllianceTreshold: number,
  maxFactionInfluence: number,
  exclusions?: PlayerFactionScoreType[],
): PlayerFactionScoreType | undefined {
  const playerScore = playerScores.find((x) => x.playerId === playerId);
  if (!playerScore) {
    return;
  }

  const enemyScores = playerScores.filter((x) => x.playerId !== playerId);

  const factionDesires = {
    emperor: 0,
    guild: 0,
    bene: 0,
    fremen: 0,
  };

  for (const factionType of activeFactionTypes) {
    if (!exclusions?.includes(factionType)) {
      const playerFactionScore = playerScore[factionType];
      if (playerFactionScore < maxFactionInfluence) {
        factionDesires[factionType] += 1;

        if (playerFactionScore >= factionAllianceTreshold) {
          if (
            enemyScores.some(
              (x) =>
                x[factionType] > playerFactionScore &&
                x[factionType] < maxFactionInfluence &&
                playerFactionScore + influenceGainAmount === x[factionType],
            )
          ) {
            factionDesires[factionType] += 5;
          }
          if (
            enemyScores.some(
              (x) =>
                x[factionType] >= playerFactionScore &&
                x[factionType] < maxFactionInfluence &&
                playerFactionScore + influenceGainAmount > x[factionType],
            )
          ) {
            factionDesires[factionType] += 10;
          }
        } else if (playerFactionScore < factionAllianceTreshold) {
          factionDesires[factionType] += 1 + playerFactionScore + influenceGainAmount;

          if (enemyScores.some((x) => x[factionType] >= factionAllianceTreshold)) {
            factionDesires[factionType] -= 1;
          }
          if (playerFactionScore + influenceGainAmount > factionAllianceTreshold) {
            factionDesires[factionType] += 5;
          }
        }
      }
    }
  }

  let mostDesiredFaction: PlayerFactionScoreType | undefined = undefined;
  let highestFactionValue = -1;
  for (const [faction, value] of Object.entries(factionDesires)) {
    if (value > highestFactionValue || (value === highestFactionValue && Math.random() > 0.66)) {
      highestFactionValue = value;
      mostDesiredFaction = faction as ActiveFactionType;
    }
  }

  return mostDesiredFaction;
}

export function getLeastDesiredFactionScoreType(
  playerScores: PlayerScore,
  exclusions?: PlayerFactionScoreType[],
): PlayerFactionScoreType | undefined {
  let desiredFactionScoreType: PlayerFactionScoreType | undefined;
  let desiredFactionScoreAmount = 100;

  for (const factionType of activeFactionTypes) {
    if (!exclusions?.includes(factionType)) {
      if (playerScores[factionType] < desiredFactionScoreAmount && playerScores[factionType] > 0) {
        desiredFactionScoreType = factionType;
        desiredFactionScoreAmount = playerScores[factionType];
      }
    }
  }

  return desiredFactionScoreType;
}
