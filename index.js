const QRCode = require('qrcode');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Créer le dossier qrcodes s'il n'existe pas
const outputDir = 'qrcodes';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Interface pour les saisies
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour vérifier si un nom de fichier est unique
function nomUnique(nomPropose, callback) {
  const fichierPath = path.join(outputDir, `${nomPropose}.png`);
  if (fs.existsSync(fichierPath)) {
    console.log(`Le fichier "${nomPropose}.png" existe déjà. Choisissez un autre nom.`);
    rl.question('Entrez un nouveau nom du fichier (sans extension, ex: mon-qr) : ', (nouveauNom) => {
      if (!nouveauNom) {
        console.log('Erreur : Le nom ne peut pas être vide.');
        nomUnique(nomPropose, callback); // Relance si vide
        return;
      }
      nomUnique(nouveauNom, callback); // Vérifie le nouveau
    });
  } else {
    callback(nomPropose); // Nom OK, passe à la génération
  }
}

// Fonction pour générer et sauvegarder le QR code
function genererQRCode() {
  // Demander le lien
  rl.question('Entrez le lien (URL) à encoder en QR code : ', (lien) => {
    if (!lien) {
      console.log('Erreur : Le lien ne peut pas être vide.');
      rl.close();
      return;
    }

    // Demander le nom du fichier et vérifier l'unicité
    rl.question('Entrez le nom du fichier (sans extension, ex: mon-qr) : ', (nomFichier) => {
      if (!nomFichier) {
        console.log('Erreur : Le nom du fichier ne peut pas être vide.');
        rl.close();
        return;
      }

      // Vérifier et obtenir un nom unique
      nomUnique(nomFichier, (nomFinal) => {
        const fichierPath = path.join(outputDir, `${nomFinal}.png`);

        // Générer le QR code en PNG
        QRCode.toFile(fichierPath, lien, {
          width: 300,  // Largeur du QR code
          margin: 2,   // Marge autour
          color: {
            dark: '#000000',  // Couleur des pixels noirs
            light: '#FFFFFF'  // Couleur de fond
          }
        }, (err) => {
          if (err) {
            console.error('Erreur lors de la génération :', err);
          } else {
            console.log(`QR code généré et sauvegardé : ${fichierPath}`);
          }
          rl.close();
        });
      });
    });
  });
}

// Lancer le script
genererQRCode();