import { FightTurn } from '../models/Fight.model';
import { Player } from '../Player/Player.class';
import { take, tap } from 'rxjs';

export function animateTurn(turnDetail: FightTurn, p1: Player, p2: Player) {
  const { opponentName, attackerName } = turnDetail;
  const opponent = getPlayerByName(opponentName, p1, p2);
  const attacker = getPlayerByName(attackerName, p1, p2);

  if (!opponent || !attacker) {
    throw new Error(`Invalid opponent or attacker name: ${opponentName} ${attackerName}`);
  }

  console.log('before attack');

  return attacker.attack$(opponent, turnDetail.isHit).pipe(
    tap(x => console.log('test')),
  );
}

export function getPlayerByName(name: string, p1: Player, p2: Player): Player | null {
  return p1.name === name ? p1
    : p2.name === name ? p2
      : null;
}