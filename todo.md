# TODO - Calculateur LAB/FT

## Fonctionnalités à implémenter

- [x] Interface de saisie pour les informations de la société
- [x] Interface de saisie pour les dirigeants
- [x] Interface de saisie pour les associés (optionnel)
- [x] Interface de saisie pour les bénéficiaires effectifs (optionnel)
- [x] Sélection des produits/services
- [x] Sélection des canaux de distribution
- [x] Calcul automatique du score par axe (Zone géo 35%, Produits 20%, Caractéristiques 35%, Canaux 10%)
- [x] Calcul du score final pondéré
- [x] Détection automatique des critères rédhibitoires
- [x] Affichage du niveau de risque (Faible/Moyen/Moyennement élevé/Élevé)
- [x] Alerte spéciale pour sanctions internationales
- [x] Export des résultats en PDF
- [ ] Sauvegarde locale des données (localStorage)

## Nouvelles fonctionnalités demandées

- [x] Ajouter champs: nom du chargé du traitement, numéro de référence, nombre d'agences
- [x] Risque automatique élevé si nombre d'agences >= 5
- [x] Support de plusieurs dirigeants, associés et bénéficiaires effectifs
- [x] Ajouter toutes les 651 activités
- [x] Risque automatique faible pour certaines formes juridiques (PUBL, SICAV, FCP)
- [x] Risque automatique faible pour certaines activités (assurance, fonds, etc.)
- [x] Risque automatique faible si cotation bourse = Oui
- [x] Risque automatique faible si détention gouvernementale = Oui
- [x] Risque automatique élevé pour pays avec note 4
- [x] Risque automatique élevé pour âge 18-21 ou >75 ans
- [x] Calcul automatique de l'âge à partir de la date de naissance
- [x] Champ "Autre" pour ville d'immatriculation avec saisie manuelle
- [x] Date de validation dans le PDF
- [x] Section forçage du risque (responsable uniquement) avec date, motif et validation

## Corrections à apporter

- [x] Mettre à jour la liste des activités avec le nouveau fichier (650 activités)
- [x] Corriger la règle du MAX : risque élevé automatique prioritaire sur risque faible automatique

## Bugs à corriger

- [x] Le calcul du risque ne fonctionne pas au clic sur le bouton "Calculer le Risque" (ajout de vérifications pour champs vides)

## URGENT - Problème critique

- [x] Le calcul du risque ne fonctionne toujours pas - CORRIGÉ (réécriture complète avec logs)
- [ ] Ajouter des messages d'erreur clairs pour les champs obligatoires manquants

## Nouvelles améliorations demandées

- [x] Afficher le warning pour Iran, Corée du Nord et Myanmar (nationalité, résidence, immatriculation)
- [x] L'âge à risque élevé ne doit s'appliquer QUE pour les dirigeants (pas associés ni bénéficiaires)
- [x] Ajouter export Excel en plus du PDF

## Bugs urgents

- [x] L'export Excel ne contient pas les associés et bénéficiaires effectifs (fonctionnel, apparaît seulement si ajoutés)
- [x] La liste des activités n'est pas complète (650 activités toutes présentes)

## Nouvelles améliorations

- [x] Ajouter une fonction de recherche/autocomplétion pour la liste des activités

## Bugs critiques

- [x] Erreur de clés dupliquées (Chypre apparaît deux fois) - CORRIGÉ
- [x] Le Combobox des activités ne fonctionne pas (problème de refs) - CORRIGÉ

## Problème urgent

- [x] Revenir à une liste déroulante standard pour les activités (sans recherche) - FAIT

## Problème activités

- [ ] Vérifier et ajouter toutes les 651 activités (actuellement 650)

## Bug critique en production

- [x] Les activités sont tronquées en production (seulement 98/650 affichées) - Remplacé par Input + datalist HTML natif

## Corrections urgentes

- [x] Supprimer le champ âge des sections Associés et Bénéficiaires effectifs (garder uniquement Dirigeants)
- [x] Importer les données directement dans le code au lieu de fetch pour résoudre le problème des activités en production

## Nouvelle règle activités

- [x] Activités avec note 1 → Risque Faible automatique
- [x] Activités avec note 3 ou 4 → Risque Élevé automatique

## Personnalisation Cash Plus

- [x] Intégrer le logo Cash Plus
- [x] Changer le titre en "Calculateur Risque LAB/FT - Personne Morale | Cash Plus"
- [x] Appliquer les couleurs Cash Plus (turquoise/cyan et vert)
- [x] Ajouter un pied de page professionnel avec copyright Cash Plus
- [x] Retirer toute mention ou trace d'IA

## Package de déploiement

- [x] Créer un fichier README avec instructions d'installation
- [x] Créer le package ZIP avec tous les fichiers sources

## Fichier HTML autonome

- [ ] Créer un fichier HTML unique avec tout intégré (CSS, JS, données, logo)

## Documentation pour la direction

- [x] Rédiger le rapport détaillé sur la méthodologie du calculateur
- [x] Créer la présentation PowerPoint pour la direction conformité

## Nouvelles améliorations V2

- [x] Ajouter le champ "Pourcentage de détention" pour les associés
- [x] Ajouter le champ "Pourcentage de détention" pour les bénéficiaires effectifs
- [x] Ajouter le champ "Nature de détention" pour les bénéficiaires (liste déroulante: détention par capital, détention par notion de contrôle, représentant(s) légaux)
- [x] Ajouter un champ "Autre" pour les activités non listées
- [x] Duplication automatique des associés avec >25% de détention vers les bénéficiaires effectifs (avec nature = "détention par capital")
- [x] Ajouter le logo Cash Plus dans le PDF
- [x] Appliquer les couleurs Cash Plus aux titres du PDF

## Amélioration V3

- [x] Ajouter le champ "Adresse" pour les dirigeants dans le formulaire
- [x] Inclure le champ adresse dans l'export PDF
- [x] Inclure le champ adresse dans l'export Excel

## Amélioration V4

- [x] Ajouter le champ "Adresse du siège social" dans la section Société
- [x] Inclure le champ adresse du siège social dans l'export PDF
- [x] Inclure le champ adresse du siège social dans l'export Excel

## Amélioration V5

- [x] Ajouter le champ "Numéro du RC" dans la section Société
- [x] Ajouter le champ "Numéro d'ICE" dans la section Société
- [x] Ajouter le champ "Numéro d'IF" dans la section Société
- [x] Ajouter le champ "Date d'immatriculation" dans la section Société
- [x] Inclure ces 4 champs dans l'export PDF
- [x] Inclure ces 4 champs dans l'export Excel

## Refonte majeure V6

### 1. Refonte section Métadonnées
- [x] Supprimer les champs "Numéro de référence" et "Nombre d'agences"
- [x] Ajouter le champ "Date de réception de la demande"
- [x] Renommer "Chargé du traitement" en "Affectation"
- [x] Ajouter le champ "Date de traitement de la demande"
- [x] Ajouter le champ "Type de demande" avec valeur par défaut "Éntrée en relation"

### 2. Ajout champs Société
- [x] Ajouter le champ "Montant du capital social"
- [x] Ajouter le champ "Numéro de la taxe professionnelle"

### 3. Rendre Associés/Bénéficiaires obligatoires
- [x] Modifier l'interface pour rendre les sections obligatoires
- [x] Initialiser avec 1 associé et 1 bénéficiaire par défaut
- [x] Changer les descriptions de "optionnel" à "obligatoire"

### 4. Création section Agence
- [x] Créer nouvelle section "Agence" dans le formulaire
- [x] Ajouter champ "Nombre total d'agences" (séparé, avec condition risque si ≥5)
- [x] Créer formulaire pour chaque agence avec : Numéro de référence, Code agence, Numéro d'agence, Adresse
- [x] Implémenter ajout/suppression d'agences
- [x] Nommer automatiquement : "Agence principale", "Succursale 1", "Succursale 2", etc.
- [x] Ajouter liste déroulante "Type de changement" par agence (Changement d'adresse, Cession, Transfert)
- [x] Ajouter champs conditionnels selon le type de changement
- [x] Inclure les agences dans l'export PDF
- [x] Inclure les agences dans l'export Excel

## Réorganisation V7

- [x] Déplacer l'onglet Agence pour qu'il apparaisse entre Métadonnées et Société

## Amélioration V8 - Affichages conditionnels

- [x] Ajouter champ "Nature de relation" dans Métadonnées (liste déroulante)
- [x] Options : Agent de paiement principal, Correspondant, Partenaire B2B, Marchant TPE/E-Commerce
- [x] Masquer l'onglet Agence si Nature ≠ "Agent de paiement principal"
- [x] Transformer "Type de demande" en liste déroulante
- [x] Options Type de demande : Entrée en relation, Revue exceptionnelle (Changement), Revue périodique
- [x] Afficher "Type de changement" dans Agence uniquement si Type de demande = Revue exceptionnelle ou Revue périodique
- [x] Mettre à jour les exports PDF/Excel avec le nouveau champ Nature de relation
- [x] Corriger "Agent de paiement principal" (sans E)
- [x] Remplacer "Numéro d'agence" par "Nom d'agence"

## Correction orthographique V9

- [x] Corriger "Marchant" en "Marchand" (avec D)

## Bug critique calcul de risque V10

- [ ] URGENT: Tous les calculs retournent systématiquement "Risque Élevé"
- [ ] Analyser la logique complète du calcul de risque
- [ ] Corriger les critères rédhibitoires (trop restrictifs?)
- [ ] Corriger la logique de risque faible automatique
- [ ] Corriger la logique de calcul des scores pondérés
- [ ] Corriger la détermination du niveau de risque final
- [ ] Tester tous les scénarios: Faible, Moyen, Moyennement élevé, Élevé

## Correction complète V11 - URGENT

- [x] Lire le rapport PDF fourni avec les règles de calcul exactes
- [x] Réécrire complètement le moteur de calcul selon le rapport PDF
- [x] Corriger le PDF final : retirer date de naissance et âge pour associés et bénéficiaires
- [x] Simplifier Type de demande : garder uniquement "Entrée en relation"
- [x] Retirer le champ "Type de changement" de la section Agence
- [ ] Tester tous les scénarios de calcul (Faible, Moyen, Moyennement élevé, Élevé)

## Correction URGENTE V12 - Retour aux règles du PDF original

- [x] Lire attentivement la présentation PDF originale (Calculateur_de_Risque_LAB_FT_-_Personne_Morale.pdf)
- [x] Identifier TOUTES les règles de calcul définies dans le PDF
- [x] Corriger le moteur de calcul pour respecter EXACTEMENT ces règles
- [ ] Tester tous les scénarios : Faible, Moyen, Moyennement élevé, Élevé

## Système de sauvegarde V13

- [x] Créer un service localStorage pour gérer les fiches
- [x] Générer automatiquement un code de référence unique (format: LABFT-YYYY-NNNN)
- [x] Ajouter le code de référence dans FormData et l'interface
- [x] Implémenter la sauvegarde automatique après calcul
- [x] Créer une interface de liste des fiches sauvegardées
- [x] Ajouter une fonction de recherche par code de référence
- [x] Implémenter le chargement d'une fiche existante
- [x] Ajouter la possibilité de modifier une fiche existante
- [x] Implémenter la suppression de fiches
- [x] Mettre à jour les exports PDF/Excel pour inclure le code de référence

## Système d'historique V14

- [x] Créer le modèle de données pour l'historique des modifications
- [x] Ajouter un champ utilisateur dans FormData pour tracer qui fait les modifications
- [x] Implémenter la détection automatique des modifications (comparaison avant/après)
- [x] Enregistrer chaque modification avec date, utilisateur, champs modifiés, anciennes et nouvelles valeurs
- [x] Créer un composant d'affichage de l'historique avec timeline
- [x] Ajouter un onglet "Historique" dans l'interface
- [x] Intégrer l'historique dans l'export PDF
- [ ] Intégrer l'historique dans l'export Excel
- [ ] Ajouter des filtres pour l'historique (par date, par utilisateur, par type de modification)

## Corrections urgentes V15

- [x] Ajouter "Trust, fiducie, fondations (constructions juridiques)" comme critère rédhibitoire → Risque ÉLEVÉ automatique
- [x] Corriger l'historique : il ne détecte pas actuellement les modifications des champs
- [x] Implémenter la détection en temps réel des modifications avec useEffect
- [x] Afficher les champs réellement modifiés dans l'onglet Historique
- [ ] Tester l'historique avec des modifications réelles de champs

## BUGS CRITIQUES V16

- [x] Trust/Fiducie/Fondations ne déclenche PAS le risque élevé automatique (corrigé : nom exact utilisé)
- [x] L'historique ne détecte TOUJOURS PAS les modifications de champs (corrigé : useEffect réécrit)
- [x] Vérifier si "Trust, fiducie, fondations (constructions juridiques)" existe dans la liste des formes juridiques
- [x] Corriger le useEffect de détection des modifications (boucle infinie résolue)
- [ ] Tester manuellement les deux fonctionnalités après correction

## BUGS CRITIQUES V17

- [x] Rendre le champ "Utilisateur courant" obligatoire avec astérisque rouge et message d'avertissement
- [x] L'historique crée 19 modifications pour 1 seul changement (corrigé : useEffect supprimé)
- [x] Corriger la logique de détection des modifications pour éviter les doublons
- [x] Utiliser recordChange dans updateFormData au lieu de useEffect avec dépendances multiples
- [ ] Tester que l'historique n'enregistre QUE les vrais changements (1 modification = 1 entrée)

## BUGS CRITIQUES V18

- [x] Corriger recordChange pour qu'il enregistre les modifications (passage de currentUser en paramètre)
- [x] Bloquer le calcul de risque si utilisateur courant est vide (validation avec toast)
- [x] Renommer le PDF en "FICHE CLIENT PERSONNE MORALE"
- [x] Corriger le sélecteur du logo Cash Plus dans le PDF
- [x] Utiliser setTimeout dans updateFormData pour enregistrer l'historique après la mise à jour

## Simplification historique V19

- [x] Retirer complètement recordChange et la détection automatique des modifications de champs
- [x] L'historique doit enregistrer UNIQUEMENT les calculs de risque (changements de niveau)
- [x] Ne PAS enregistrer les saisies initiales d'une nouvelle fiche
- [x] Ne PAS enregistrer chaque frappe de touche (N, a, d, i, a...)
- [x] Garder uniquement HistoryService.recordCalculation dans handleCalculate
