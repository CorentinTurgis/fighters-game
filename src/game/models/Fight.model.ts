export type FightTurn = {
  attackerName: string,
  opponentName: string,
  ability?: string,
  isHit: boolean,
  damage: number,
  attackerHp: number,
  opponentHp: number,
}