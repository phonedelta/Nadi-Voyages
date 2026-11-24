# Déploiement Hostinger

Publié le 2 octobre 2026 sur un nouveau site PHP/HTML avec un domaine temporaire généré par Hostinger :

[https://darkblue-woodpecker-800512.hostingersite.com/](https://darkblue-woodpecker-800512.hostingersite.com/)

Le site a été créé dans hPanel, puis le contenu de `dist/` a été transféré par SSH. Le fichier d’accueil par défaut du nouveau site a été conservé dans une sauvegarde hors du répertoire public. Le `.htaccess` fourni permet l’ouverture et le rechargement des routes React. HTTPS fonctionne avec un certificat valide.

Les 56 fichiers présents sur le serveur ont été comparés au build local par SHA-256 : aucune différence. Hostinger optimise trois PNG à la livraison HTTP ; les logos SVG utilisés dans l’interface conservent leurs fichiers originaux.

La vérification publique a réussi : 189 contrôles, 22 routes ouvertes directement, images chargées, identité Nadi, français/anglais/arabe, direction RTL, affichage à 390 et 1440 px, absence de débordement horizontal et fonctionnement du menu mobile. Aucune erreur navigateur. Six captures sont disponibles dans `docs/result/deployment-*.png`.

Rapport détaillé : [deployment-verification.json](result/deployment-verification.json).

Pour relancer le contrôle depuis la racine du projet :

```powershell
node tools/verify-deployment.mjs https://darkblue-woodpecker-800512.hostingersite.com
```

Les coordonnées de l’agence et le service de réception du formulaire restent à renseigner selon les variables documentées dans le README. Le formulaire ne confirme aucun envoi tant que ce service n’est pas configuré.

Aucun identifiant d’hébergement n’est enregistré dans le projet.

## Mise à jour du 5 octobre 2026

La section « Sur mesure » de l’accueil affiche désormais la photographie de Santorini en fond, avec un dégradé vert sur ordinateur et un voile uniforme sur mobile pour préserver la lisibilité. Le build a été reconstruit, les fichiers JavaScript/CSS et l’accueil transférés, puis le cache Hostinger vidé.

Le contrôle public a réussi en français et en arabe, à 390 et 1440 px : photographie chargée, bouton de contact correct, direction RTL, absence de débordement et d’erreur navigateur. [Rapport](result/custom-bg-live.json) et captures `docs/result/custom-bg-live-*.png`.
