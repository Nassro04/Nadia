import type { FormData, HistoryEntry, FieldChange } from "@/types";

// Labels lisibles pour les champs
const FIELD_LABELS: Record<string, string> = {
  // Métadonnées
  dateReception: "Date de réception",
  affectation: "Affectation",
  dateTraitement: "Date de traitement",
  natureRelation: "Nature de relation",
  typeDemande: "Type de demande",
  
  // Société
  raisonSociale: "Raison sociale",
  formeJuridique: "Forme juridique",
  adresseSiegeSocial: "Adresse du siège social",
  numeroRC: "Numéro du RC",
  numeroICE: "Numéro d'ICE",
  numeroIF: "Numéro d'IF",
  dateImmatriculation: "Date d'immatriculation",
  montantCapitalSocial: "Montant du capital social",
  numeroTaxeProfessionnelle: "Numéro de la taxe professionnelle",
  pays: "Pays d'immatriculation",
  ville: "Ville d'immatriculation",
  villeAutre: "Ville (autre)",
  activite: "Activité",
  activiteAutre: "Activité (autre)",
  statutResidence: "Statut de résidence",
  detentionGouv: "Détention gouvernementale",
  cotationBourse: "Cotation en bourse",
  structureActionnariat: "Structure d'actionnariat",
  negativeNews: "Négatives News",
  sanctionsSociete: "Sanctions internationales (société)",
  produits: "Produits et services",
  canaux: "Canaux de distribution",
  
  // Agences
  nombreTotalAgences: "Nombre total d'agences",
  
  // Forçage
  forcageActive: "Forçage activé",
  forcageNiveauRisque: "Niveau de risque forcé",
  forcageMotif: "Motif du forçage",
  forcageDate: "Date du forçage",
  forcageResponsable: "Responsable du forçage",
};

export class HistoryService {
  /**
   * Compare deux versions de FormData et retourne les champs modifiés
   */
  static detectChanges(oldData: FormData, newData: FormData): FieldChange[] {
    const changes: FieldChange[] = [];
    
    // Comparer les champs simples
    const simpleFields = [
      "dateReception", "affectation", "dateTraitement", "natureRelation", "typeDemande",
      "raisonSociale", "formeJuridique", "adresseSiegeSocial", "numeroRC", "numeroICE", 
      "numeroIF", "dateImmatriculation", "montantCapitalSocial", "numeroTaxeProfessionnelle",
      "pays", "ville", "villeAutre", "activite", "activiteAutre", "statutResidence",
      "detentionGouv", "cotationBourse", "structureActionnariat", "negativeNews",
      "sanctionsSociete", "produits", "canaux", "nombreTotalAgences",
      "forcageActive", "forcageNiveauRisque", "forcageMotif", "forcageDate", "forcageResponsable"
    ];
    
    simpleFields.forEach(field => {
      const oldValue = String(oldData[field as keyof FormData] || "");
      const newValue = String(newData[field as keyof FormData] || "");
      
      if (oldValue !== newValue) {
        changes.push({
          champ: field,
          labelChamp: FIELD_LABELS[field] || field,
          ancienneValeur: oldValue,
          nouvelleValeur: newValue,
        });
      }
    });
    
    // Comparer les dirigeants
    if (JSON.stringify(oldData.dirigeants) !== JSON.stringify(newData.dirigeants)) {
      changes.push({
        champ: "dirigeants",
        labelChamp: "Dirigeants",
        ancienneValeur: `${oldData.dirigeants.length} dirigeant(s)`,
        nouvelleValeur: `${newData.dirigeants.length} dirigeant(s)`,
      });
    }
    
    // Comparer les associés
    if (JSON.stringify(oldData.associes) !== JSON.stringify(newData.associes)) {
      changes.push({
        champ: "associes",
        labelChamp: "Associés",
        ancienneValeur: `${oldData.associes.length} associé(s)`,
        nouvelleValeur: `${newData.associes.length} associé(s)`,
      });
    }
    
    // Comparer les bénéficiaires
    if (JSON.stringify(oldData.beneficiaires) !== JSON.stringify(newData.beneficiaires)) {
      changes.push({
        champ: "beneficiaires",
        labelChamp: "Bénéficiaires effectifs",
        ancienneValeur: `${oldData.beneficiaires.length} bénéficiaire(s)`,
        nouvelleValeur: `${newData.beneficiaires.length} bénéficiaire(s)`,
      });
    }
    
    // Comparer les agences
    if (JSON.stringify(oldData.agences) !== JSON.stringify(newData.agences)) {
      changes.push({
        champ: "agences",
        labelChamp: "Agences",
        ancienneValeur: `${oldData.agences.length} agence(s)`,
        nouvelleValeur: `${newData.agences.length} agence(s)`,
      });
    }
    
    return changes;
  }
  
  /**
   * Ajoute une entrée dans l'historique
   */
  static addHistoryEntry(
    formData: FormData,
    typeModification: "creation" | "modification" | "calcul" | "forcage",
    modifications: FieldChange[],
    utilisateur?: string
  ): FormData {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      utilisateur: utilisateur || formData.utilisateurCourant || "Utilisateur non identifié",
      typeModification,
      modifications,
    };
    
    const historique = formData.historique || [];
    
    return {
      ...formData,
      historique: [...historique, entry],
    };
  }
  
  /**
   * Enregistre une création de fiche
   */
  static recordCreation(formData: FormData, utilisateur?: string): FormData {
    return this.addHistoryEntry(
      formData,
      "creation",
      [{ champ: "creation", labelChamp: "Création de la fiche", ancienneValeur: "", nouvelleValeur: "Fiche créée" }],
      utilisateur
    );
  }
  
  /**
   * Enregistre un calcul de risque
   */
  static recordCalculation(formData: FormData, niveauRisque: string, utilisateur?: string): FormData {
    return this.addHistoryEntry(
      formData,
      "calcul",
      [{ champ: "calcul", labelChamp: "Calcul du risque", ancienneValeur: "", nouvelleValeur: `Niveau de risque: ${niveauRisque}` }],
      utilisateur
    );
  }
  
  /**
   * Enregistre un forçage de risque
   */
  static recordForcage(
    formData: FormData,
    ancienNiveau: string,
    nouveauNiveau: string,
    motif: string,
    utilisateur?: string
  ): FormData {
    return this.addHistoryEntry(
      formData,
      "forcage",
      [{
        champ: "forcage",
        labelChamp: "Forçage du niveau de risque",
        ancienneValeur: ancienNiveau,
        nouvelleValeur: `${nouveauNiveau} (Motif: ${motif})`,
      }],
      utilisateur
    );
  }
  
  /**
   * Enregistre une modification de fiche
   */
  static recordModification(oldData: FormData, newData: FormData, utilisateur?: string): FormData {
    const changes = this.detectChanges(oldData, newData);
    
    if (changes.length === 0) {
      return newData; // Aucune modification détectée
    }
    
    return this.addHistoryEntry(newData, "modification", changes, utilisateur);
  }
  
  /**
   * Formate une date pour l'affichage
   */
  static formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  /**
   * Obtient l'icône pour un type de modification
   */
  static getTypeIcon(type: string): string {
    switch (type) {
      case "creation":
        return "✨";
      case "modification":
        return "✏️";
      case "calcul":
        return "🧮";
      case "forcage":
        return "⚠️";
      default:
        return "📝";
    }
  }
  
  /**
   * Obtient le label pour un type de modification
   */
  static getTypeLabel(type: string): string {
    switch (type) {
      case "creation":
        return "Création";
      case "modification":
        return "Modification";
      case "calcul":
        return "Calcul de risque";
      case "forcage":
        return "Forçage de risque";
      default:
        return "Modification";
    }
  }
}
