import { Player } from 'src/app/models/player';
import { SessionSeat } from '../persistence/session-api.client';

export type LobbySlotOccupant = 'ai' | 'free' | 'this-device' | 'other-device';

export interface LobbySlot {
  playerId: number;
  color: string;
  occupant: LobbySlotOccupant;
  isHostSeat: boolean;
  isReady: boolean;
}

export interface LobbyDevices {
  thisDeviceId: string;
  hostDeviceId: string;
}

/** AI players and seats of the host count as ready, joined players have to confirm it themselves. */
export function createLobbySlots(players: Player[], seats: SessionSeat[], devices: LobbyDevices): LobbySlot[] {
  return players.map((player) => {
    const seat = seats.find((seat) => seat.playerId === player.id);
    const isHostSeat = seat?.deviceId === devices.hostDeviceId;
    const occupant = getSlotOccupant(player, seat, devices.thisDeviceId);

    return {
      playerId: player.id,
      color: player.color,
      occupant,
      isHostSeat,
      isReady: isSlotReady(occupant, seat, isHostSeat),
    };
  });
}

export function canStartMultiplayerGame(slots: LobbySlot[]) {
  const minimumPlayerCount = 2;
  return slots.length >= minimumPlayerCount && slots.every((slot) => slot.isReady);
}

function getSlotOccupant(player: Player, seat: SessionSeat | undefined, thisDeviceId: string): LobbySlotOccupant {
  if (player.isAI) {
    return 'ai';
  }
  if (!seat) {
    return 'free';
  }
  return seat.deviceId === thisDeviceId ? 'this-device' : 'other-device';
}

function isSlotReady(occupant: LobbySlotOccupant, seat: SessionSeat | undefined, isHostSeat: boolean) {
  if (occupant === 'ai') {
    return true;
  }
  if (!seat) {
    return false;
  }
  return isHostSeat || seat.isReady;
}
