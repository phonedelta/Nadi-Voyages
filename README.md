# Agence de Voyage — ABDESALAM NADI

Application React + TypeScript + Vite, avec React Router, icônes Lucide et traductions françaises, arabes et anglaises. Les photographies, polices et logos sont servis localement. Le PDF fourni est la source des logos vectoriels, de leurs variantes transparentes et du favicon.

Version publiée sur Hostinger : [ouvrir le site Nadi](https://darkblue-woodpecker-800512.hostingersite.com/). Déploiement et contrôles du 2 octobre 2026 : [docs/deployment.md](docs/deployment.md).

## Lancer le projet

Node.js 22.12 ou supérieur est requis.

```powershell
npm ci
npm run dev
```

Ouvrir http://localhost:5173. Pour la production :

```powershell
npm run check
npm run build
npm run preview
```

Le dossier `dist/` est le livrable statique. L’hébergement doit renvoyer `index.html` pour les routes internes. Les fichiers `.htaccess` (Apache) et `_redirects` (hébergements compatibles) sont fournis. Sur Nginx : `try_files $uri $uri/ /index.html;`. Le site suppose une installation à la racine du domaine.

## Pages et organisation

- Accueil, voyages, destinations, hôtels et séjours, services, présentation de l’agence, contact, conditions générales, confidentialité et page 404.
- Six fiches voyages : Istanbul, Égypte, Thaïlande, Dubaï, Bali et Maldives.
- Six fiches destinations : Istanbul, Dubaï, Marrakech, Bali, Paris et Thaïlande.
- `src/config.ts` : identité et coordonnées ; `src/catalogue.json` : contenus et programmes ; `src/translations.json` et `src/i18n.tsx` : langues ; `src/styles.css` : palette et styles ; `src/criteria.ts` : critères et validation des dates.
- Composants réutilisés : navigation, recherche, cartes, galeries, sections d’accueil, formulaires et pied de page.

Les filtres et tris agissent sur les résultats et sont conservés dans l’URL. Les critères de recherche sont transmis aux fiches puis au contact. Les recherches hôtels et vols préparent une demande pour un conseiller ; aucune disponibilité en temps réel n’est annoncée. Le choix de langue persiste localement ; la recherche et le brouillon du contact sont conservés dans la session du navigateur. Le bouton Réinitialiser efface le brouillon. Aucun paiement, outil publicitaire, espace client ou back-office n’est ajouté.

## Mise à jour du 9 novembre 2026

- Langue par défaut : arabe (le choix du visiteur est ensuite mémorisé sous la clé `nadi-lang`).
- Nom affiché : « Agence de voyage ABDESALAM NADI » (AR : « وكالة الأسفار عبد السلام نادي », EN : « ABDESALAM NADI Travel Agency »).
- Accueil : hero animé (diaporama, avion, apparition du texte) ; section « Avis voyageurs ».
- Pages de services avec formulaire de réservation dédié : `/services/voyages-organises`, `/services/billetterie-aerienne`, `/services/hotels-sejours`, `/services/voyages-sur-mesure`, `/services/transferts-activites`. La carte « Accompagnement voyage » mène à `/contact`.
- `/contact` : coordonnées (deux téléphones, WhatsApp) et formulaire de contact. L’ancien formulaire de demande de voyage est désormais sur `/reservation`.
- Envoi des formulaires : si `VITE_FORM_ENDPOINT` n’est pas configuré, la demande est rédigée automatiquement dans WhatsApp vers `VITE_AGENCY_WHATSAPP` (par défaut +212 6 61 53 72 11) ; le visiteur n’a plus qu’à appuyer sur « Envoyer ».
- Avis : `/avis`. En production, `api/reviews.php` (PHP, compatible Hostinger) stocke les avis dans `api/data/reviews.json` (dossier protégé). Pour supprimer un avis, retirer son entrée du fichier ; pour modérer avant publication, passer `AUTO_PUBLISH` à `false` dans le PHP. En local (`npm run dev`), un équivalent Node stocke les avis dans `.data/reviews.json`. `VITE_REVIEWS_ENDPOINT` permet de pointer vers un autre service.
- Lors d’un redéploiement, ne pas écraser `api/data/` sur le serveur (sinon les avis publiés sont perdus).

## Coordonnées et réception des demandes

Copier `.env.example` vers `.env`, puis renseigner les valeurs de l’agence. Redémarrer Vite après modification ; reconstruire le site pour la production.

| Variable | Usage |
| --- | --- |
| `VITE_AGENCY_PHONE` | Téléphone valide, 8 à 15 chiffres ; indicatif international conseillé |
| `VITE_AGENCY_WHATSAPP` | Numéro WhatsApp complet avec indicatif ; prépare une conversation |
| `VITE_AGENCY_EMAIL` | Adresse de contact affichée et lien email |
| `VITE_AGENCY_ADDRESS` | Adresse physique affichée |
| `VITE_AGENCY_INSTAGRAM`, `VITE_AGENCY_FACEBOOK` | URL HTTPS officielle |
| `VITE_FORM_ENDPOINT` | Chemin du service de réception, par exemple `/api/enquiries`, ou URL HTTPS |

Aucune coordonnée opérationnelle Nadi ni destination d’envoi n’a été fournie. Les liens téléphone, WhatsApp et email restent absents tant qu’une valeur valide n’est pas configurée. Le formulaire est entièrement utilisable pour préparer une demande, mais signale explicitement l’absence d’envoi si le service n’est pas configuré. Le stockage du brouillon ne constitue jamais un envoi.

Le service de réception n’est pas inclus : il faut connecter un backend ou service existant. Contrat attendu :

```http
POST /api/enquiries
Content-Type: application/json
```

```json
{
  "name": "Nom du voyageur",
  "phone": "+212…",
  "email": "",
  "destination": "istanbul",
  "trip": "istanbul",
  "type": "voyages",
  "startDate": "2026-11-01",
  "endDate": "2026-11-05",
  "travelers": "2",
  "origin": "",
  "cabin": "economy",
  "service": "",
  "message": "",
  "consent": true,
  "language": "fr",
  "source": "nadi-website"
}
```

La réponse doit être un statut HTTP 2xx avec `{"success":true}`, **uniquement après réception réelle** de la demande par le service. Une erreur HTTP, une réponse négative/non JSON, une erreur réseau ou un délai supérieur à 15 secondes déclenchent un état d’échec. Le bouton est désactivé pendant l’envoi. Le backend doit valider les champs, traiter le consentement et gérer la limitation des envois ; il doit autoriser l’origine du site si son domaine est différent.

Les identifiants SMTP, clés privées et secrets du service restent côté serveur. Toutes les variables `VITE_*` sont publiques et incluses dans le navigateur.

## Informations nécessaires avant la mise en service

1. Coordonnées et URL officielles de l’agence.
2. Service de réception fonctionnel et testé avec une vraie demande.
3. Catalogue commercial validé, si des prix ou prestations fermes doivent être publiés. Pour le moment, les six itinéraires sont des propositions à personnaliser, avec « Tarif sur demande ». Chaque programme comporte exactement le nombre de jours annoncé, avec une nuit de moins.
4. Identité juridique de l’exploitant et conditions contractuelles validées ; responsable des données, prestataire de réception, durée de conservation et contact pour les droits. Les pages légales décrivent les fonctions actuelles et indiquent les données encore manquantes.

## Inspection et vérification

Le site de référence a été inspecté avec Chromium via Playwright, sur ses pages publiques, ses listes et fiches, dans les trois langues et en desktop/mobile. L’outil web textuel ne pouvait pas l’ouvrir ; l’inspection réelle dans Chromium et les téléchargements HTTPS ont fonctionné. Aucune page prévue n’était inaccessible. `docs/reference/` conserve l’inventaire, les textes observés, les captures et les contrôles des onglets/filtres/menu. Les anciens prix ne sont pas repris dans l’application.

```powershell
npx playwright install chromium
# Le site doit être lancé dans un autre terminal
npm run dev
npm test
```

Le test ouvre les 22 routes (404 incluse), dans les trois langues à 390, 768 et 1440 px. Il contrôle accès direct, images, débordement, identité et erreurs navigateur ; il vérifie les filtres, tris, onglets, dates, préremplissage, galerie, langues, menu mobile et formulaire. Il démarre aussi un serveur de test temporaire sur 5174 pour intercepter les réponses du backend et vérifier chargement, échec HTTP, accusé négatif et succès confirmé. **Ces réponses sont simulées pour tester l’interface ; elles ne valident aucun envoi réel.**

`NADI_BASE_URL` peut modifier l’URL testée. `docs/result/verification.json` donne le dernier résultat réellement exécuté ; `docs/result/` contient les captures. Les captures du site livré sont comparées visuellement aux captures de référence. Les différences intentionnelles concernent l’identité Nadi, les couleurs du PDF, les tarifs sur demande, les programmes cohérents, le texte juridique et l’état honnête des formulaires.

## Ressources

Structure et cadrages observés : https://anfaltravel.ma/. Sources et identifiants Unsplash : liste dans `docs/assets.json`. Les trois photographies de la Kaaba proviennent des ressources publiques de la référence. Les familles Manrope et Alexandria sont stockées localement avec leurs licences. Aucun logo de la référence n’est utilisé dans le site livré. Les fichiers d’inspection dans `docs/reference` restent des preuves de comparaison, séparées du site de production.
