const fs = require('fs');
const path = require('path');

// Fonction pour générer un tour de combat aléatoire
function generateRandomTurn(attackerName, opponentName, attackerHp, opponentHp) {
  const isHit = Math.random() > 0.5;
  const damage = isHit ? Math.floor(Math.random() * 5) + 1 : 0;
  const updatedOpponentHp = opponentHp - damage;

  return {
    attackerName,
    opponentName,
    isHit,
    damage,
    attackerHp,
    opponentHp: Math.max(updatedOpponentHp, 0),
  };
}

// Fonction pour générer un combat complet
function generateFight() {
  let attacker = { name: 'Bob', hp: 20 };
  let opponent = { name: 'Alice', hp: 20 };
  const fight = [];

  while (attacker.hp > 0 && opponent.hp > 0) {
    const turn = generateRandomTurn(attacker.name, opponent.name, attacker.hp, opponent.hp);
    fight.push(turn);

    // Mise à jour des points de vie
    opponent.hp = turn.opponentHp;

    // Inverser les rôles pour le prochain tour
    [attacker, opponent] = [opponent, attacker];
  }

  return fight;
}

// Générer le combat
const fight = generateFight();

// Chemin pour sauvegarder le fichier fight1.json
const filePath = path.join(__dirname, 'src', 'assets', 'fight1.json');

// Sauvegarder le fichier JSON
fs.writeFileSync(filePath, JSON.stringify(fight, null, 2), 'utf8');

console.log('Combat généré et sauvegardé dans /src/assets/fight1.json');