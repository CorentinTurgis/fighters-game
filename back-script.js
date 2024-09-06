const fs = require('fs');
const path = require('path');

// Fonction pour générer un tour de combat aléatoire
function generateRandomTurn(attackerName, opponentName, attackerHp, opponentHp) {
  const isSpecialAttack = Math.random() < (1 / 3); // 33.3% de chance pour une attaque spéciale
  let isHit = Math.random() >= (1 / 10); // 90% de chance de toucher (donc 10% de chance de rater)
  let damage = 0;

  // Si l'attaque est spéciale, elle ne peut pas rater (isHit = true)
  if (isSpecialAttack) {
    isHit = true;
    damage = Math.floor(Math.random() * 3) + 1 + 2; // Dégâts aléatoires entre 1 et 3 + 2 pour une attaque spéciale
  } else if (isHit) {
    damage = Math.floor(Math.random() * 3) + 1; // Dégâts aléatoires entre 1 et 3 pour une attaque normale
  }

  const updatedOpponentHp = opponentHp - damage;

  const fightTurn = {
    attackerName,
    opponentName,
    isHit,
    damage,
    attackerHp,
    opponentHp: Math.max(updatedOpponentHp, 0) // Empêche les HP d'être inférieurs à 0
  };

  // Ajouter le champ 'ability' si l'attaque est spéciale
  if (isSpecialAttack) {
    fightTurn.ability = 'special';
    console.log(`${attackerName} a lancé une attaque spéciale !`);
  }

  return fightTurn;
}

// Fonction pour générer un combat complet
function generateFight() {
  let attacker = { name: 'Bob', hp: 20 };
  let opponent = { name: 'Alice', hp: 20 };
  const fight = [];

  // Boucle jusqu'à ce qu'un des joueurs atteigne 0 HP
  while (attacker.hp > 0 && opponent.hp > 0) {
    const turn = generateRandomTurn(attacker.name, opponent.name, attacker.hp, opponent.hp);
    fight.push(turn);

    // Mise à jour des HP après chaque tour
    opponent.hp = turn.opponentHp;

    // Inverser les rôles (attacker <-> opponent)
    [attacker, opponent] = [opponent, attacker];
  }

  return fight;
}

// Fonction pour sauvegarder le combat généré dans un fichier JSON
function saveFightToFile(fight, fileName = 'fight1.json') {
  const filePath = path.join(__dirname, 'src', 'assets', fileName);

  // Sauvegarder le fichier JSON
  fs.writeFileSync(filePath, JSON.stringify(fight, null, 2), 'utf8');
  console.log(`Combat généré et sauvegardé dans ${filePath}`);
}

// Exemple d'utilisation
const fight = generateFight();
saveFightToFile(fight);