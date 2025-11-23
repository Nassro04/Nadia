import type { FormData, ReferenceData, Result, PersonnePhysique } from "@/types";

/**
 * Calculateur de risque LAB/FT - Personne Morale
 * Basé EXACTEMENT sur la présentation "Calculateur_de_Risque_LAB_FT_-_Personne_Morale.pdf"
 */
export function calculateRisk(formData: FormData, data: ReferenceData): Result {
  console.log("=== DÉBUT CALCUL DU RISQUE ===");
  console.log("FormData:", formData);
  
  try {
    // Fonction utilitaire pour obtenir un score
    const getScore = (
      list: Array<{ nom: string; score: number }> | undefined,
      value: string
    ): number => {
      if (!list || !value) return 2; // Score par défaut : moyen
      const item = list.find((i) => i.nom === value);
      return item ? item.score : 2;
    };

    // ========================================
    // ÉTAPE 1 : VÉRIFICATION SANCTIONS INTERNATIONALES
    // ========================================
    console.log("\n=== ÉTAPE 1: SANCTIONS INTERNATIONALES ===");
    
    const alerteSanctions =
      formData.sanctionsSociete === "Oui" ||
      (formData.dirigeants || []).some((d) => d.sanctions === "Oui") ||
      (formData.associes || []).some((a) => a.sanctions === "Oui") ||
      (formData.beneficiaires || []).some((b) => b.sanctions === "Oui");
    
    console.log("Sanctions détectées?", alerteSanctions);
    
    if (alerteSanctions) {
      console.log("⛔ SANCTIONS INTERNATIONALES → RISQUE ÉLEVÉ + ALERTE ROUGE");
      return {
        scoreZoneGeo: 4,
        scoreCaract: 4,
        scoreProduits: 4,
        scoreCanaux: 4,
        scoreFinal: 4,
        niveauRisque: formData.forcageActive ? formData.forcageNiveauRisque : "Élevé",
        niveauRisqueForce: formData.forcageActive ? formData.forcageNiveauRisque : undefined,
        alerteSanctions: true,
        alertePaysInterdits: false,
        critereRedhibitoire: true,
        critereFaibleAuto: false,
        critereElevéAuto: true,
        dateValidation: new Date().toISOString(),
      };
    }

    // ========================================
    // ÉTAPE 2 : VÉRIFICATION PAYS INTERDITS
    // ========================================
    console.log("\n=== ÉTAPE 2: PAYS INTERDITS ===");
    
    const paysInterdits = ["Iran", "Corée du Nord", "Myanmar"];
    const alertePaysInterdits =
      (formData.pays && paysInterdits.includes(formData.pays)) ||
      (formData.dirigeants || []).some((d) =>
        (d.nationalite && paysInterdits.includes(d.nationalite)) ||
        (d.paysResidence && paysInterdits.includes(d.paysResidence))
      ) ||
      (formData.associes || []).some((a) =>
        (a.nationalite && paysInterdits.includes(a.nationalite)) ||
        (a.paysResidence && paysInterdits.includes(a.paysResidence))
      ) ||
      (formData.beneficiaires || []).some((b) =>
        (b.nationalite && paysInterdits.includes(b.nationalite)) ||
        (b.paysResidence && paysInterdits.includes(b.paysResidence))
      );
    
    console.log("Pays interdits détectés?", alertePaysInterdits);
    
    if (alertePaysInterdits) {
      console.log("⛔ PAYS INTERDITS → RISQUE ÉLEVÉ");
      return {
        scoreZoneGeo: 4,
        scoreCaract: 4,
        scoreProduits: 4,
        scoreCanaux: 4,
        scoreFinal: 4,
        niveauRisque: formData.forcageActive ? formData.forcageNiveauRisque : "Élevé",
        niveauRisqueForce: formData.forcageActive ? formData.forcageNiveauRisque : undefined,
        alerteSanctions: false,
        alertePaysInterdits: true,
        critereRedhibitoire: true,
        critereFaibleAuto: false,
        critereElevéAuto: true,
        dateValidation: new Date().toISOString(),
      };
    }

    // ========================================
    // ÉTAPE 3 : CRITÈRES RISQUE ÉLEVÉ AUTOMATIQUE
    // ========================================
    console.log("\n=== ÉTAPE 3: CRITÈRES RISQUE ÉLEVÉ AUTOMATIQUE ===");
    
    // 3.1 - Personnes Physiques
    const hasPPE =
      (formData.dirigeants || []).some((d) => d.ppe === "Oui") ||
      (formData.associes || []).some((a) => a.ppe === "Oui") ||
      (formData.beneficiaires || []).some((b) => b.ppe === "Oui");
    
    const hasAntecedents =
      (formData.dirigeants || []).some((d) => d.antecedents === "Oui") ||
      (formData.associes || []).some((a) => a.antecedents === "Oui") ||
      (formData.beneficiaires || []).some((b) => b.antecedents === "Oui");
    
    const hasBlacklist =
      (formData.dirigeants || []).some((d) => d.blacklist === "Oui") ||
      (formData.associes || []).some((a) => a.blacklist === "Oui") ||
      (formData.beneficiaires || []).some((b) => b.blacklist === "Oui");
    
    // 3.2 - Âge du dirigeant (UNIQUEMENT DIRIGEANTS)
    const hasAgeRisque = (formData.dirigeants || []).some(
      (d) => d.age === "18-21 ans" || d.age === "Plus de 75 ans"
    );
    
    // 3.3 - Zone Géographique (Pays avec note 4)
    const paysRisqueEleve =
      (data.pays_risque_eleve && formData.pays && data.pays_risque_eleve.includes(formData.pays)) ||
      (formData.dirigeants || []).some((d) =>
        data.pays_risque_eleve && (
          (d.nationalite && data.pays_risque_eleve.includes(d.nationalite)) ||
          (d.paysResidence && data.pays_risque_eleve.includes(d.paysResidence))
        )
      ) ||
      (formData.associes || []).some((a) =>
        data.pays_risque_eleve && (
          (a.nationalite && data.pays_risque_eleve.includes(a.nationalite)) ||
          (a.paysResidence && data.pays_risque_eleve.includes(a.paysResidence))
        )
      ) ||
      (formData.beneficiaires || []).some((b) =>
        data.pays_risque_eleve && (
          (b.nationalite && data.pays_risque_eleve.includes(b.nationalite)) ||
          (b.paysResidence && data.pays_risque_eleve.includes(b.paysResidence))
        )
      );
    
    // 3.4 - Statut de résidence
    const societeNonResidente = formData.statutResidence === "Société non résidente";
    
    // 3.5 - Caractéristiques Société
    const formesJuridiquesRisque = [
      "Association à but non lucratif et ONG",
      "Société Civile Immobilière (SCI)",
      "Société en participation (SP)",
      "Trusts, Fiducies, Fondations (Construction Juridiques)",
    ];
    const formeJuridiqueRisque = formesJuridiquesRisque.includes(formData.formeJuridique);
    
    const structureComplexe = formData.structureActionnariat === "Structure Complexe";
    const negativeNews = formData.negativeNews === "Oui";
    
    const nombreAgences = parseInt(formData.nombreTotalAgences) || 0;
    const nombreAgencesEleve = nombreAgences >= 5;
    
    // 3.6 - Activités (note 3 ou 4)
    const scoreActivite = getScore(data.activites, formData.activite);
    const activiteRisqueEleve = scoreActivite === 3 || scoreActivite === 4;
    
    console.log("PPE?", hasPPE);
    console.log("Antécédents?", hasAntecedents);
    console.log("Blacklist?", hasBlacklist);
    console.log("Âge dirigeant risque?", hasAgeRisque);
    console.log("Pays note 4?", paysRisqueEleve);
    console.log("Société non résidente?", societeNonResidente);
    console.log("Forme juridique risque?", formeJuridiqueRisque);
    console.log("Structure complexe?", structureComplexe);
    console.log("Negative News?", negativeNews);
    console.log("Nombre d'agences >= 5?", nombreAgencesEleve, `(${nombreAgences} agences)`);
    console.log("Activité risque élevé?", activiteRisqueEleve, `(score: ${scoreActivite})`);
    
    const critereEleveAuto =
      hasPPE ||
      hasAntecedents ||
      hasBlacklist ||
      hasAgeRisque ||
      paysRisqueEleve ||
      societeNonResidente ||
      formeJuridiqueRisque ||
      structureComplexe ||
      negativeNews ||
      nombreAgencesEleve ||
      activiteRisqueEleve;
    
    console.log("→ Critère élevé automatique:", critereEleveAuto);

    // ========================================
    // ÉTAPE 4 : CRITÈRES RISQUE FAIBLE AUTOMATIQUE
    // ========================================
    console.log("\n=== ÉTAPE 4: CRITÈRES RISQUE FAIBLE AUTOMATIQUE ===");
    
    // 4.1 - Formes juridiques à risque faible
    const formesJuridiquesFaible = [
      "Les organismes publics (PUBL)",
      "OPCVM (SICAV)",
      "OPCVM (FCP)",
    ];
    const formeJuridiqueFaible = formesJuridiquesFaible.includes(formData.formeJuridique);
    
    // 4.2 - Statuts particuliers
    const cotationBourse = formData.cotationBourse === "Oui";
    const detentionGouvernementale = formData.detentionGouv === "Oui";
    
    // 4.3 - Activités financières réglementées (note 1)
    const activiteFaible = scoreActivite === 1;
    
    console.log("Forme juridique faible?", formeJuridiqueFaible, `(${formData.formeJuridique})`);
    console.log("Cotation bourse?", cotationBourse);
    console.log("Détention gouvernementale?", detentionGouvernementale);
    console.log("Activité note 1?", activiteFaible, `(score: ${scoreActivite})`);
    
    const critereFaibleAuto =
      formeJuridiqueFaible ||
      cotationBourse ||
      detentionGouvernementale ||
      activiteFaible;
    
    console.log("→ Critère faible automatique:", critereFaibleAuto);

    // ========================================
    // ÉTAPE 5 : DÉCISION RISQUE FAIBLE AUTOMATIQUE
    // ========================================
    console.log("\n=== ÉTAPE 5: DÉCISION RISQUE FAIBLE AUTOMATIQUE ===");
    console.log("Critère faible auto?", critereFaibleAuto);
    console.log("Critère élevé auto?", critereEleveAuto);
    
    // RÈGLE DE PRÉPONDÉRANCE : Risque faible automatique SAUF si critère élevé présent
    if (critereFaibleAuto && !critereEleveAuto) {
      console.log("✅ RISQUE FAIBLE AUTOMATIQUE (critère réglementaire)");
      return {
        scoreZoneGeo: 1,
        scoreCaract: 1,
        scoreProduits: 1,
        scoreCanaux: 1,
        scoreFinal: 1,
        niveauRisque: formData.forcageActive ? formData.forcageNiveauRisque : "Faible",
        niveauRisqueForce: formData.forcageActive ? formData.forcageNiveauRisque : undefined,
        alerteSanctions: false,
        alertePaysInterdits: false,
        critereRedhibitoire: false,
        critereFaibleAuto: true,
        critereElevéAuto: false,
        dateValidation: new Date().toISOString(),
      };
    }
    
    // Si critère élevé automatique → RISQUE ÉLEVÉ
    if (critereEleveAuto) {
      console.log("⚠️ RISQUE ÉLEVÉ AUTOMATIQUE (critère rédhibitoire)");
      return {
        scoreZoneGeo: 4,
        scoreCaract: 4,
        scoreProduits: 4,
        scoreCanaux: 4,
        scoreFinal: 4,
        niveauRisque: formData.forcageActive ? formData.forcageNiveauRisque : "Élevé",
        niveauRisqueForce: formData.forcageActive ? formData.forcageNiveauRisque : undefined,
        alerteSanctions: false,
        alertePaysInterdits: false,
        critereRedhibitoire: true,
        critereFaibleAuto: false,
        critereElevéAuto: true,
        dateValidation: new Date().toISOString(),
      };
    }

    // ========================================
    // ÉTAPE 6 : CALCUL PONDÉRÉ STANDARD
    // ========================================
    console.log("\n=== ÉTAPE 6: CALCUL PONDÉRÉ STANDARD ===");
    
    // 6.1 - Zone Géographique (35%)
    const scorePays = getScore(data.pays, formData.pays);
    const scoreVille = formData.ville === "Autre" ? 2 : getScore(data.villes, formData.ville);
    const scoreZoneGeoSociete = (scorePays + scoreVille) / 2;
    
    console.log("Score pays:", scorePays);
    console.log("Score ville:", scoreVille);
    console.log("Score zone géo société:", scoreZoneGeoSociete.toFixed(2));

    // Calcul pour les personnes physiques
    const calculatePersonneScores = (personnes: PersonnePhysique[]) => {
      if (personnes.length === 0) return { zoneGeo: 0, caract: 0 };

      const scores = personnes.map((p) => {
        const scoreNat = getScore(data.pays, p.nationalite);
        const scoreResidence = getScore(data.pays, p.paysResidence);
        const zoneGeo = (scoreNat + scoreResidence) / 2;

        const scorePPE = p.ppe === "Oui" ? 4 : 1;
        const scoreAntecedents = p.antecedents === "Oui" ? 4 : 1;
        const scoreBlacklist = p.blacklist === "Oui" ? 4 : 1;
        const scoreSanctions = p.sanctions === "Oui" ? 4 : 1;
        const caract = (scorePPE + scoreAntecedents + scoreBlacklist + scoreSanctions) / 4;

        return { zoneGeo, caract };
      });

      const avgZoneGeo = scores.reduce((sum, s) => sum + s.zoneGeo, 0) / scores.length;
      const avgCaract = scores.reduce((sum, s) => sum + s.caract, 0) / scores.length;

      return { zoneGeo: avgZoneGeo, caract: avgCaract };
    };

    const dirigeantsScores = calculatePersonneScores(formData.dirigeants || []);
    const associesScores = calculatePersonneScores(formData.associes || []);
    const beneficiairesScores = calculatePersonneScores(formData.beneficiaires || []);

    console.log("Scores dirigeants:", dirigeantsScores);
    console.log("Scores associés:", associesScores);
    console.log("Scores bénéficiaires:", beneficiairesScores);

    // Moyenne zone géo (société + toutes personnes)
    const allZoneGeo = [
      scoreZoneGeoSociete,
      dirigeantsScores.zoneGeo,
      associesScores.zoneGeo,
      beneficiairesScores.zoneGeo,
    ].filter((s) => s > 0);

    const scoreZoneGeo = allZoneGeo.reduce((sum, s) => sum + s, 0) / allZoneGeo.length;
    console.log("Score zone géo final:", scoreZoneGeo.toFixed(2));

    // 6.2 - Caractéristiques (35%)
    const scoreStatut = formData.statutResidence === "Société résidente" ? 1 : 4;
    const scoreDetention = formData.detentionGouv === "Oui" ? 1 : 2;
    const scoreCotation = formData.cotationBourse === "Oui" ? 1 : 2;
    const scoreStructure = formData.structureActionnariat === "Structure Simple" ? 1 : 4;
    const scoreNegNews = formData.negativeNews === "Oui" ? 4 : 1;
    const scoreSanctionsSoc = formData.sanctionsSociete === "Oui" ? 4 : 1;
    
    const scoreCaractSociete =
      (scoreStatut + scoreDetention + scoreCotation + scoreStructure + scoreNegNews + scoreSanctionsSoc) / 6;
    
    console.log("Score caractéristiques société:", scoreCaractSociete.toFixed(2));

    const allCaract = [
      scoreCaractSociete,
      dirigeantsScores.caract,
      associesScores.caract,
      beneficiairesScores.caract,
    ].filter((s) => s > 0);

    const scoreCaract = allCaract.reduce((sum, s) => sum + s, 0) / allCaract.length;
    console.log("Score caract final:", scoreCaract.toFixed(2));

    // 6.3 - Produits (20%)
    const scoreProduits = getScore(data.produits, formData.produits);
    console.log("Score produits:", scoreProduits);

    // 6.4 - Canaux (10%)
    const scoreCanaux = getScore(data.canaux, formData.canaux);
    console.log("Score canaux:", scoreCanaux);

    // Score final pondéré
    const scoreFinal =
      scoreZoneGeo * 0.35 +
      scoreCaract * 0.35 +
      scoreProduits * 0.2 +
      scoreCanaux * 0.1;

    console.log("Score final pondéré:", scoreFinal.toFixed(2));

    // ========================================
    // ÉTAPE 7 : DÉTERMINATION DU NIVEAU DE RISQUE
    // ========================================
    console.log("\n=== ÉTAPE 7: DÉTERMINATION DU NIVEAU DE RISQUE ===");
    
    let niveauRisque: "Faible" | "Moyen" | "Moyennement élevé" | "Élevé";
    
    if (scoreFinal <= 1.5) {
      niveauRisque = "Faible";
      console.log("→ RISQUE FAIBLE (score ≤ 1.5)");
    } else if (scoreFinal <= 2.5) {
      niveauRisque = "Moyen";
      console.log("→ RISQUE MOYEN (score ≤ 2.5)");
    } else if (scoreFinal <= 3.5) {
      niveauRisque = "Moyennement élevé";
      console.log("→ RISQUE MOYENNEMENT ÉLEVÉ (score ≤ 3.5)");
    } else {
      niveauRisque = "Élevé";
      console.log("→ RISQUE ÉLEVÉ (score > 3.5)");
    }

    const result: Result = {
      scoreZoneGeo: Math.round(scoreZoneGeo * 10) / 10,
      scoreCaract: Math.round(scoreCaract * 10) / 10,
      scoreProduits: Math.round(scoreProduits * 10) / 10,
      scoreCanaux: Math.round(scoreCanaux * 10) / 10,
      scoreFinal: Math.round(scoreFinal * 10) / 10,
      niveauRisque: formData.forcageActive ? formData.forcageNiveauRisque : niveauRisque,
      niveauRisqueForce: formData.forcageActive ? formData.forcageNiveauRisque : undefined,
      alerteSanctions: false,
      alertePaysInterdits: false,
      critereRedhibitoire: false,
      critereFaibleAuto: false,
      critereElevéAuto: false,
      dateValidation: new Date().toISOString(),
    };

    console.log("\n=== RÉSULTAT FINAL ===");
    console.log(result);
    return result;
  } catch (error) {
    console.error("❌ ERREUR DANS LE CALCUL:", error);
    throw error;
  }
}
