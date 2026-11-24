# Vérification exécutée

Le build de production a été compilé avec succès puis contrôlé dans Chromium sur http://localhost:4173.

- 22 routes, en français, anglais et arabe, aux largeurs 390, 768 et 1440 px.
- 1217 assertions réussies et 75 captures.
- Accès direct, identité, images, absence de débordement et absence d’erreurs navigateur.
- Filtres région/type, tris, état vide et réinitialisation.
- Trois onglets de recherche, dates invalides et transmission des critères.
- Préremplissage des demandes depuis les voyages, hôtels et vols.
- Galerie, changement de fiche, persistance de langue, RTL et menu mobile.
- Validation des champs et état honnête du formulaire sans réception configurée.
- Réception configurable : chargement, erreur HTTP, réponse négative et succès confirmé, via interception de réponses de test.
- Cohérence des jours, nuits et programmes pour les six voyages.

Aucun envoi réel à une agence n’a été testé. Les captures de référence et du résultat ont été comparées visuellement, notamment pour l’accueil, les fiches voyages et destinations.

Rapport machine détaillé : [verification.json](result/verification.json).
