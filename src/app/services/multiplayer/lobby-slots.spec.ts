import { Player } from 'src/app/models/player';
import { SessionSeat } from '../persistence/session-api.client';
import { canStartMultiplayerGame, createLobbySlots, LobbyDevices } from './lobby-slots';

const devices: LobbyDevices = {
  thisDeviceId: 'b7e4c0de-0000-4000-8000-000000000002',
  hostDeviceId: 'b7e4c0de-0000-4000-8000-000000000001',
};
const joinedPlayerDeviceId = 'b7e4c0de-0000-4000-8000-000000000003';

describe('lobby slots', () => {
  it('describes who occupies each slot', () => {
    const players = [createPlayer(1), createPlayer(2, true), createPlayer(3), createPlayer(4)];
    const seats = [createSeat(1, devices.hostDeviceId), createSeat(3, devices.thisDeviceId)];

    const slots = createLobbySlots(players, seats, devices);

    expect(slots.map((slot) => slot.occupant)).toEqual(['other-device', 'ai', 'this-device', 'free']);
    expect(slots.map((slot) => slot.isHostSeat)).toEqual([true, false, false, false]);
  });

  it('allows starting when every human slot is taken and all joined players are ready', () => {
    const players = [createPlayer(1), createPlayer(2), createPlayer(3, true)];
    const seats = [createSeat(1, devices.hostDeviceId), createSeat(2, joinedPlayerDeviceId, true)];

    expect(canStartMultiplayerGame(createLobbySlots(players, seats, devices))).toBe(true);
  });

  it('prevents starting while a joined player is not ready', () => {
    const players = [createPlayer(1), createPlayer(2)];
    const seats = [createSeat(1, devices.hostDeviceId), createSeat(2, joinedPlayerDeviceId, false)];

    expect(canStartMultiplayerGame(createLobbySlots(players, seats, devices))).toBe(false);
  });

  it('prevents starting while a human slot is free', () => {
    const players = [createPlayer(1), createPlayer(2)];
    const seats = [createSeat(1, devices.hostDeviceId)];

    expect(canStartMultiplayerGame(createLobbySlots(players, seats, devices))).toBe(false);
  });
});

function createPlayer(id: number, isAI = false): Player {
  return {
    id,
    agents: 2,
    turnNumber: 0,
    turnState: 'agent-placement',
    color: '#c4302b',
    hasSwordmaster: false,
    hasCouncilSeat: false,
    cardsDrawnAtRoundStart: 5,
    permanentPersuasion: 0,
    isAI,
  };
}

function createSeat(playerId: number, deviceId: string, isReady = false): SessionSeat {
  return { playerId, deviceId, isReady };
}
