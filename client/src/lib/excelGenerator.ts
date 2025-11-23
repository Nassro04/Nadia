import * as XLSX from "xlsx";
import type { FormData, Result } from "@/types";

export function generateExcel(formData: FormData, result: Result) {
  // Créer un nouveau workbook
  const wb = XLSX.utils.book_new();

  // Feuille 1: Métadonnées
  const metadonnees = [
    ["FICHE D'ÉVALUATION DU RISQUE LAB/FT"],
    [""],
    ["Code de référence", formData.codeReference || "Non généré"],
    ["Date de réception", formData.dateReception ? new Date(formData.dateReception).toLocaleDateString("fr-FR") : ""],
    ["Affectation", formData.affectation],
    ["Date de traitement", formData.dateTraitement ? new Date(formData.dateTraitement).toLocaleDateString("fr-FR") : ""],
    ["Nature de relation", formData.natureRelation],
    ["Type de demande", formData.typeDemande],
    ["Date de validation", new Date(result.dateValidation).toLocaleDateString("fr-FR")],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(metadonnees);
  XLSX.utils.book_append_sheet(wb, ws1, "Métadonnées");

  // Feuille 2: Société
  const societe = [
    ["INFORMATIONS SOCIÉTÉ"],
    [""],
    ["Raison sociale", formData.raisonSociale],
    ["Forme juridique", formData.formeJuridique],
    ["Adresse du siège social", formData.adresseSiegeSocial],
    ["Numéro du RC", formData.numeroRC],
    ["Numéro d'ICE", formData.numeroICE],
    ["Numéro d'IF", formData.numeroIF],
    ["Date d'immatriculation", formData.dateImmatriculation ? new Date(formData.dateImmatriculation).toLocaleDateString("fr-FR") : ""],
    ["Montant du capital social", formData.montantCapitalSocial],
    ["Numéro de la taxe professionnelle", formData.numeroTaxeProfessionnelle],
    ["Pays d'immatriculation", formData.pays],
    ["Ville d'immatriculation", formData.ville === "Autre" ? formData.villeAutre : formData.ville],
    ["Activité", formData.activite],
    ["Statut de résidence", formData.statutResidence],
    ["Détention gouvernementale", formData.detentionGouv],
    ["Cotation en bourse", formData.cotationBourse],
    ["Structure d'actionnariat", formData.structureActionnariat],
    ["Négatives News", formData.negativeNews],
    ["Sanctions internationales", formData.sanctionsSociete],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(societe);
  XLSX.utils.book_append_sheet(wb, ws2, "Société");

  // Feuille 3: Dirigeants
  const dirigeants = [
    ["DIRIGEANTS"],
    [""],
    ["Nom", "Date de naissance", "Âge", "Adresse", "Nationalité", "Pays de résidence", "PPE", "Antécédents", "Blacklist", "Sanctions"],
  ];
  formData.dirigeants.forEach((d) => {
    dirigeants.push([
      d.nom,
      d.dateNaissance,
      d.age || "",
      d.adresse || "",
      d.nationalite,
      d.paysResidence,
      d.ppe,
      d.antecedents,
      d.blacklist,
      d.sanctions,
    ]);
  });
  const ws3 = XLSX.utils.aoa_to_sheet(dirigeants);
  XLSX.utils.book_append_sheet(wb, ws3, "Dirigeants");

  // Feuille 4: Associés
  if (formData.associes.length > 0) {
    const associes = [
      ["ASSOCIÉS"],
      [""],
      ["Nom", "Nationalité", "Pays de résidence", "PPE", "Antécédents", "Blacklist", "Sanctions"],
    ];
    formData.associes.forEach((a) => {
      associes.push([
        a.nom,
        a.nationalite,
        a.paysResidence,
        a.ppe,
        a.antecedents,
        a.blacklist,
        a.sanctions,
      ]);
    });
    const ws4 = XLSX.utils.aoa_to_sheet(associes);
    XLSX.utils.book_append_sheet(wb, ws4, "Associés");
  }

  // Feuille 5: Bénéficiaires effectifs
  if (formData.beneficiaires.length > 0) {
    const beneficiaires = [
      ["BÉNÉFICIAIRES EFFECTIFS"],
      [""],
      ["Nom", "Nationalité", "Pays de résidence", "PPE", "Antécédents", "Blacklist", "Sanctions"],
    ];
    formData.beneficiaires.forEach((b) => {
      beneficiaires.push([
        b.nom,
        b.nationalite,
        b.paysResidence,
        b.ppe,
        b.antecedents,
        b.blacklist,
        b.sanctions,
      ]);
    });
    const ws5 = XLSX.utils.aoa_to_sheet(beneficiaires);
    XLSX.utils.book_append_sheet(wb, ws5, "Bénéficiaires");
  }
  // Feuille 6: Agences
  if (formData.agences && formData.agences.length > 0) {
    const agences = [
      ["AGENCES"],
      [""],
      ["Nombre total d'agences", formData.nombreTotalAgences],
      [""],
      ["Type", "Numéro référence", "Code agence", "Nom agence", "Adresse", "Type changement", "Info changement"],
    ];
    formData.agences.forEach((a) => {
      let infoChangement = "";
      if (a.typeChangement === "Cession" && a.nomSocieteCessionnaire) {
        infoChangement = `${a.nomSocieteCessionnaire} (${a.codeSocieteCessionnaire})`;
      } else if (a.typeChangement === "Transfert" && a.nomSocieteBeneficiaire) {
        infoChangement = `${a.nomSocieteBeneficiaire} (${a.codeSocieteBeneficiaire})`;
      }
      
      agences.push([
        a.type,
        a.numeroReference,
        a.codeAgence,
        a.nomAgence,
        a.adresseAgence,
        a.typeChangement || "",
        infoChangement,
      ]);
    });
    const ws6 = XLSX.utils.aoa_to_sheet(agences);
    XLSX.utils.book_append_sheet(wb, ws6, "Agences");
  }

  // Feuille 7: Produits et Canaux
  const produitsCanaux = [
    ["PRODUITS ET CANAUX"],
    [""],
    ["Produits/Services", formData.produits],
    ["Canaux de distribution", formData.canaux],
  ];
  const ws7_produits = XLSX.utils.aoa_to_sheet(produitsCanaux);
  XLSX.utils.book_append_sheet(wb, ws7_produits, "Produits et Canaux");

  // Feuille 8: Résultats
  const resultats = [
    ["RÉSULTATS DE L'ÉVALUATION"],
    [""],
    ["SCORES PAR AXE"],
    ["Zone géographique (35%)", result.scoreZoneGeo.toFixed(2)],
    ["Caractéristiques client (35%)", result.scoreCaract.toFixed(2)],
    ["Produits/Services (20%)", result.scoreProduits.toFixed(2)],
    ["Canaux de distribution (10%)", result.scoreCanaux.toFixed(2)],
    [""],
    ["SCORE FINAL", result.scoreFinal.toFixed(2)],
    ["NIVEAU DE RISQUE", result.niveauRisque],
    [""],
    ["ALERTES"],
    ["Sanctions internationales", result.alerteSanctions ? "OUI" : "NON"],
    ["Pays interdits (Iran, Corée du Nord, Myanmar)", result.alertePaysInterdits ? "OUI" : "NON"],
    ["Critère rédhibitoire", result.critereRedhibitoire ? "OUI" : "NON"],
    ["Critère faible automatique", result.critereFaibleAuto ? "OUI" : "NON"],
    ["Critère élevé automatique", result.critereElevéAuto ? "OUI" : "NON"],
  ];

  if (formData.forcageActive) {
    resultats.push(
      [""],
      ["FORÇAGE DU RISQUE"],
      ["Niveau forcé", formData.forcageNiveauRisque],
      ["Responsable", formData.forcageResponsable],
      ["Date", formData.forcageDate],
      ["Motif", formData.forcageMotif]
    );
  }

  const ws8_resultats = XLSX.utils.aoa_to_sheet(resultats);
  XLSX.utils.book_append_sheet(wb, ws8_resultats, "Résultats");

  // Générer et télécharger le fichier
  const filename = `Fiche_Risque_LAB_FT_${formData.raisonSociale || "Societe"}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
