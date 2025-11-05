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

// Fonction pour générer et sauvegarder le QR code
function genererQRCode() {
  // Demander le lien
  rl.question('Entrez le lien (URL) à encoder en QR code : ', (lien) => {
    if (!lien) {
      console.log('Erreur : Le lien ne peut pas être vide.');
      rl.close();
      return;
    }

    // Demander le nom du fichier
    rl.question('Entrez le nom du fichier (sans extension, ex: mon-qr) : ', (nomFichier) => {
      if (!nomFichier) {
        console.log('Erreur : Le nom du fichier ne peut pas être vide.');
        rl.close();
        return;
      }

      // Nom complet du fichier avec extension PNG
      const fichierPath = path.join(outputDir, `${nomFichier}.png`);

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
}

// Lancer le script
genererQRCode();