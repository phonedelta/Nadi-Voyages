# Inspection de la référence

Référence : https://anfaltravel.ma/. Captures Chromium et inventaire dans ce dossier, réalisés le 2 octobre 2026.

## Routes observées

| Routes | Structure observée |
| --- | --- |
| `/` | Header, hero photographique de la Kaaba (96vh), recherche en chevauchement, quatre voyages, agence avec deux photos superposées, six destinations en mosaïque, six services, quatre arguments de réassurance, voyage sur mesure, quatre étapes, CTA final, footer |
| `/voyages` | Hero de la Kaaba, filtres région/type, tri par durée, compteur, six cartes, état vide et réinitialisation |
| `/voyages/{istanbul,egypte,thailande,dubai,bali,maldives}` | Hero propre à la destination, galerie en mosaïque, expérience, informations essentielles, programme, prestations, demande et voyages associés. Galerie déroulante et bloc demande placé avant le programme sur mobile |
| `/destinations` | Hero, recherche texte, filtres régionaux, six destinations |
| `/destinations/{istanbul,dubai,marrakech,bali,paris,thailande}` | Hero, introduction, encadrés raisons/période, trois lieux illustrés, voyage associé lorsqu’il existe, informations utiles |
| `/hotels` | Hero, recherche, destinations populaires, trois séjours, accompagnement et demande |
| `/services` | Hero, six présentations illustrées alternées, bénéfices et demande |
| `/a-propos` | Hero, présentation de l’agence, approche et quatre valeurs, CTA |
| `/contact` | Hero, bloc coordonnées illustré, formulaire détaillé ; envoi désactivé sur la référence |
| `/conditions`, `/confidentialite` | Titre, texte légal provisoire et retour à l’accueil |

Aucune page demandée n’était inaccessible dans Chromium. L’ouverture par l’outil web textuel avait échoué ; cela n’a pas empêché l’inspection dans le navigateur.

## Interactions et responsive

Le sélecteur de langue présente Français, العربية et English. Les versions arabe et latines utilisent Alexandria et Manrope. La mise en page arabe est RTL. Le header devient un menu plein écran sur mobile. Les cartes, formulaires et blocs s’empilent. La galerie des voyages se déroule horizontalement dans son propre conteneur.

Les trois onglets de recherche sont des demandes suivies par un conseiller. Vols ajoute une origine ; Hôtels remplace les dates aller/retour par arrivée/départ. Le filtre Europe produit effectivement zéro voyage et permet une réinitialisation. La liste affiche six voyages. Les destinations Paris et Marrakech n’ont pas de voyage associé dans le catalogue observé.

## Adaptations nécessaires

- Remplacer l’identité, les coordonnées et les métadonnées par celles de Nadi, sans attribuer à Nadi les informations commerciales de la référence.
- Remplacer les prix par « Tarif sur demande » et signaler que les programmes sont personnalisables.
- Compléter les programmes de la référence qui comportaient moins de journées que la durée annoncée.
- Fournir un état honnête sans service d’envoi ; préparer un POST configurable avec validation et confirmation explicite de réception.
- Rédiger les pages légales selon les fonctions réellement disponibles, sans inventer l’identité juridique de l’agence.
- Conserver l’orientation photographique lors d’un changement de langue ; le cadrage de l’accueil reste identique dans les trois langues.
