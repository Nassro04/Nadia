import { jsPDF } from "jspdf";
import { FormData, Result, PersonnePhysique, Agence } from "@/types";

export function generatePDF(formData: FormData, result: Result) {
  const doc = new jsPDF();
  
  let y = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  
  const checkPageBreak = () => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };
  
  // Logo Cash Plus en haut à gauche
  try {
    const logo = document.querySelector('img[alt="Cash Plus"]') as HTMLImageElement;
    if (logo && logo.complete) {
      doc.addImage(logo.src, 'PNG', 15, 10, 40, 10);
      y = 25; // Ajuster la position du titre pour laisser de la place au logo
    }
  } catch (e) {
    console.log('Logo non disponible:', e);
  }
  
  // En-tête
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 188, 212); // Turquoise Cash Plus
  doc.text("FICHE CLIENT PERSONNE MORALE", 105, y, { align: "center" });
  doc.setTextColor(0, 0, 0); // Retour au noir
  y += 15;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateValidation = new Date(result.dateValidation).toLocaleDateString("fr-FR");
  doc.text(`Date de validation: ${dateValidation}`, 105, y, { align: "center" });
  y += 7;
  
  // Code de référence
  if (formData.codeReference) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(`Code de reference: ${formData.codeReference}`, 105, y, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 10;
  } else {
    y += 3;
  }
  
  // Métadonnées
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Date de reception: `, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formData.dateReception ? new Date(formData.dateReception).toLocaleDateString("fr-FR") : "Non renseigne", 80, y);
  y += lineHeight;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Affectation: `, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formData.affectation || "Non renseigne", 80, y);
  y += lineHeight;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Date de traitement: `, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formData.dateTraitement ? new Date(formData.dateTraitement).toLocaleDateString("fr-FR") : "Non renseigne", 80, y);
  y += lineHeight;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Nature de relation: `, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formData.natureRelation || "Agent de paiement principal", 80, y);
  y += lineHeight;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Type de demande: `, 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formData.typeDemande || "Entree en relation", 80, y);
  y += 15;
  
  // Section Société
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 188, 212); // Turquoise Cash Plus
  doc.text("INFORMATIONS DE LA SOCIETE", 20, y);
  doc.setTextColor(0, 0, 0);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const societyInfo = [
    ["Raison Sociale", formData.raisonSociale],
    ["Forme Juridique", formData.formeJuridique],
    ["Adresse du siege social", formData.adresseSiegeSocial],
    ["Numero du RC", formData.numeroRC],
    ["Numero d'ICE", formData.numeroICE],
    ["Numero d'IF", formData.numeroIF],
    ["Date d'immatriculation", formData.dateImmatriculation ? new Date(formData.dateImmatriculation).toLocaleDateString("fr-FR") : ""],
    ["Montant du capital social", formData.montantCapitalSocial],
    ["Numero de la taxe professionnelle", formData.numeroTaxeProfessionnelle],
    ["Pays d'immatriculation", formData.pays],
    ["Ville d'immatriculation", formData.ville === "Autre" ? formData.villeAutre : formData.ville],
    ["Activite", formData.activite === "Autre" ? formData.activiteAutre : formData.activite],
    ["Statut de residence", formData.statutResidence],
    ["Detention gouvernementale", formData.detentionGouv],
    ["Cotation en bourse", formData.cotationBourse],
    ["Structure d'actionnariat", formData.structureActionnariat],
    ["Negatives News", formData.negativeNews],
    ["Sanctions internationales", formData.sanctionsSociete],
    ["Produits et Services", formData.produits],
    ["Canaux de distribution", formData.canaux],
  ];
  
  societyInfo.forEach(([label, value]) => {
    checkPageBreak();
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "Non renseigne", 80, y);
    y += lineHeight;
  });
  
  // Fonction pour afficher une personne physique
  const renderPersonne = (titre: string, personnes: PersonnePhysique[], showAdresse: boolean = false, showAge: boolean = false) => {
    if (!personnes || personnes.length === 0) return;
    
    personnes.forEach((personne, index) => {
      y += 5;
      checkPageBreak();
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 188, 212); // Turquoise Cash Plus
      doc.text(`${titre} ${personnes.length > 1 ? `#${index + 1}` : ""}`, 20, y);
      doc.setTextColor(0, 0, 0);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const personneInfo: [string, string][] = [
        ["Nom et Prenom", personne.nom],
      ];
      
      // Ajouter date de naissance et âge uniquement pour les dirigeants
      if (showAge) {
        personneInfo.push(
          ["Date de naissance", personne.dateNaissance || "Non renseigne"],
          ["Tranche d'age", personne.age || "Non renseigne"]
        );
      }
      
      // Ajouter l'adresse uniquement pour les dirigeants
      if (showAdresse && personne.adresse) {
        personneInfo.push(["Adresse", personne.adresse]);
      }
      
      personneInfo.push(
        ["Nationalite", personne.nationalite],
        ["Pays de residence", personne.paysResidence],
        ["Statut PPE", personne.ppe],
        ["Antecedents judiciaires", personne.antecedents],
        ["Blacklist", personne.blacklist],
        ["Sanctions internationales", personne.sanctions]
      );
      
      // Ajouter pourcentage de détention si présent
      if (personne.pourcentageDetention) {
        personneInfo.push(["Pourcentage de detention", personne.pourcentageDetention + "%"]);
      }
      
      // Ajouter nature de détention si présent
      if (personne.natureDetention) {
        personneInfo.push(["Nature de detention", personne.natureDetention]);
      }
      
      personneInfo.forEach(([label, value]) => {
        checkPageBreak();
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(value || "Non renseigne", 80, y);
        y += lineHeight;
      });
    });
  };
  
  // Dirigeants (avec adresse et âge)
  renderPersonne("DIRIGEANT", formData.dirigeants, true, true);
  
  // Associés (sans adresse ni âge)
  renderPersonne("ASSOCIE", formData.associes, false, false);
  
  // Bénéficiaires (sans adresse ni âge)
  renderPersonne("BENEFICIAIRE EFFECTIF", formData.beneficiaires, false, false);
  
  // Agences
  if (formData.agences && formData.agences.length > 0) {
    y += 5;
    checkPageBreak();
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 188, 212); // Turquoise Cash Plus
    doc.text("INFORMATIONS AGENCES", 20, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Nombre total d'agences:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.nombreTotalAgences || "0", 80, y);
    y += lineHeight;
    
    if (parseInt(formData.nombreTotalAgences) >= 5) {
      doc.setTextColor(255, 0, 0);
      doc.setFont("helvetica", "italic");
      doc.text("* Risque automatiquement eleve (>= 5 agences)", 20, y);
      doc.setTextColor(0, 0, 0);
      y += lineHeight;
    }
    
    y += 5;
    
    formData.agences.forEach((agence, index) => {
      checkPageBreak();
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 188, 212);
      doc.text(agence.type, 20, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const agenceInfo = [
        ["Numero de reference", agence.numeroReference],
        ["Code agence", agence.codeAgence],
        ["Nom d'agence", agence.nomAgence],
        ["Adresse", agence.adresseAgence],
      ];
      
      if (agence.typeChangement) {
        agenceInfo.push(["Type de changement", agence.typeChangement]);
        
        if (agence.typeChangement === "Cession" && agence.nomSocieteCessionnaire) {
          agenceInfo.push(["Societe cessionnaire", `${agence.nomSocieteCessionnaire} (${agence.codeSocieteCessionnaire})`]);
        }
        
        if (agence.typeChangement === "Transfert" && agence.nomSocieteBeneficiaire) {
          agenceInfo.push(["Societe beneficiaire", `${agence.nomSocieteBeneficiaire} (${agence.codeSocieteBeneficiaire})`]);
        }
      }
      
      agenceInfo.forEach(([label, value]) => {
        checkPageBreak();
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(value || "Non renseigne", 80, y);
        y += lineHeight;
      });
      
      y += 3;
    });
  }
  
  // Nouvelle page pour les résultats
  doc.addPage();
  y = 20;
  
  // Section Résultats
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 188, 212); // Turquoise Cash Plus
  doc.text("RESULTATS DE L'EVALUATION", 105, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 15;
  
  // Alerte sanctions
  if (result.alerteSanctions) {
    doc.setFillColor(255, 0, 0);
    doc.rect(20, y, 170, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INTERDICTION D'ENTREE OU DE MAINTENIR", 105, y + 6, { align: "center" });
    doc.text("LA RELATION D'AFFAIRES", 105, y + 12, { align: "center" });
    doc.setFontSize(9);
    doc.text("(Sanctions internationales)", 105, y + 17, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 25;
  }

  // Alerte pays interdits
  if (result.alertePaysInterdits) {
    doc.setFillColor(255, 0, 0);
    doc.rect(20, y, 170, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INTERDICTION D'ENTREE OU DE MAINTENIR", 105, y + 6, { align: "center" });
    doc.text("LA RELATION D'AFFAIRES", 105, y + 12, { align: "center" });
    doc.setFontSize(9);
    doc.text("(Pays interdit: Iran, Coree du Nord ou Myanmar)", 105, y + 17, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 25;
  }
  
  // Scores par axe (sauf si risque faible automatique)
  if (!result.critereFaibleAuto) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Scores par Axe:", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const scores = [
      ["Zone Geographique (35%)", result.scoreZoneGeo.toFixed(2)],
      ["Caracteristiques Client (35%)", result.scoreCaract.toFixed(2)],
      ["Produits et Services (20%)", result.scoreProduits.toFixed(2)],
      ["Canaux de Distribution (10%)", result.scoreCanaux.toFixed(2)],
    ];
    
    scores.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 30, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 120, y);
      y += lineHeight;
    });
    
    y += 10;
    
    // Score final
    doc.setFillColor(255, 255, 0);
    doc.rect(20, y, 170, 20, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SCORE FINAL:", 30, y + 8);
    doc.setFontSize(18);
    doc.text(result.scoreFinal.toFixed(2), 120, y + 8);
    y += 25;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("* Risque FAIBLE automatique (critere reglementaire)", 20, y);
    y += 15;
  }
  
  // Niveau de risque
  const riskColors: { [key: string]: [number, number, number] } = {
    "Faible": [0, 200, 0],
    "Moyen": [255, 200, 0],
    "Moyennement élevé": [255, 150, 0],
    "Élevé": [255, 0, 0],
  };
  
  const niveauAffiche = result.niveauRisqueForce || result.niveauRisque;
  const color = riskColors[niveauAffiche] || [128, 128, 128];
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(20, y, 170, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("NIVEAU DE RISQUE:", 30, y + 10);
  doc.setFontSize(20);
  doc.text(niveauAffiche.toUpperCase(), 30, y + 20);
  doc.setTextColor(0, 0, 0);
  y += 35;
  
  // Forçage du risque
  if (formData.forcageActive && result.niveauRisqueForce) {
    doc.setFillColor(255, 255, 200);
    doc.rect(20, y, 170, 30, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FORCAGE DU RISQUE", 30, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(`Responsable: ${formData.forcageResponsable}`, 30, y + 14);
    doc.text(`Date: ${new Date(formData.forcageDate).toLocaleDateString("fr-FR")}`, 30, y + 20);
    doc.text(`Motif: ${formData.forcageMotif}`, 30, y + 26);
    y += 35;
  }
  
  // Critères détectés
  if (result.critereRedhibitoire || result.critereElevéAuto) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    if (result.critereRedhibitoire) {
      doc.text("* Un ou plusieurs criteres redhibitoires ont ete detectes", 20, y);
      y += lineHeight;
    }
    if (result.critereElevéAuto) {
      doc.text("* Critere de risque eleve automatique detecte", 20, y);
      y += lineHeight;
    }
  }
  
  // Historique des modifications
  if (formData.historique && formData.historique.length > 0) {
    doc.addPage();
    y = 20;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 188, 212);
    doc.text("HISTORIQUE DES MODIFICATIONS", 105, y, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 15;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Nombre total de modifications: ${formData.historique.length}`, 20, y);
    y += 10;
    
    // Trier par date décroissante
    const sortedHistory = [...formData.historique].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    sortedHistory.forEach((entry, index) => {
      checkPageBreak();
      
      // Type de modification
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const typeLabels: Record<string, string> = {
        creation: "Creation",
        modification: "Modification",
        calcul: "Calcul de risque",
        forcage: "Forcage de risque"
      };
      doc.text(`${index + 1}. ${typeLabels[entry.typeModification] || "Modification"}`, 20, y);
      y += 7;
      
      // Date et utilisateur
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const dateStr = new Date(entry.date).toLocaleString("fr-FR");
      doc.text(`Date: ${dateStr}`, 30, y);
      y += 5;
      doc.text(`Utilisateur: ${entry.utilisateur}`, 30, y);
      y += 7;
      
      // Modifications
      if (entry.modifications && entry.modifications.length > 0) {
        entry.modifications.forEach((mod) => {
          checkPageBreak();
          doc.setFont("helvetica", "bold");
          doc.text(`- ${mod.labelChamp}:`, 35, y);
          y += 5;
          
          if (mod.ancienneValeur) {
            doc.setFont("helvetica", "normal");
            doc.text(`  Avant: ${mod.ancienneValeur}`, 40, y);
            y += 5;
          }
          
          doc.setFont("helvetica", "normal");
          doc.text(`  Apres: ${mod.nouvelleValeur}`, 40, y);
          y += 5;
        });
      }
      
      y += 3;
    });
  }
  
  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} sur ${totalPages}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Document confidentiel - Evaluation LAB/FT",
      105,
      pageHeight - 5,
      { align: "center" }
    );
  }
  
  // Télécharger le PDF
  const fileName = `Rapport_LAB_FT_${formData.raisonSociale || "Societe"}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
