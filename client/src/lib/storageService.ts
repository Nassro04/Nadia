import { FormData, Result } from "@/types";

export interface SavedFiche {
  codeReference: string;
  dateCreation: string;
  dateModification: string;
  formData: FormData;
  result?: Result;
}

const STORAGE_KEY = "labft_fiches";

/**
 * Service de gestion des fiches sauvegardées dans localStorage
 */
export class StorageService {
  /**
   * Génère un code de référence unique au format LABFT-YYYY-NNNN
   */
  static generateCodeReference(): string {
    const year = new Date().getFullYear();
    const fiches = this.getAllFiches();
    
    // Trouver le dernier numéro de l'année en cours
    const fichesAnneeEnCours = fiches.filter((f) =>
      f.codeReference.startsWith(`LABFT-${year}-`)
    );
    
    let maxNumber = 0;
    fichesAnneeEnCours.forEach((f) => {
      const match = f.codeReference.match(/LABFT-\d{4}-(\d{4})/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(4, "0");
    
    return `LABFT-${year}-${paddedNumber}`;
  }

  /**
   * Récupère toutes les fiches sauvegardées
   */
  static getAllFiches(): SavedFiche[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as SavedFiche[];
    } catch (error) {
      console.error("Erreur lors de la lecture des fiches:", error);
      return [];
    }
  }

  /**
   * Sauvegarde une nouvelle fiche
   */
  static saveFiche(formData: FormData, result?: Result): string {
    try {
      const fiches = this.getAllFiches();
      
      // Générer un code de référence si pas déjà présent
      let codeReference = formData.codeReference;
      if (!codeReference) {
        codeReference = this.generateCodeReference();
      }
      
      const now = new Date().toISOString();
      
      // Vérifier si la fiche existe déjà
      const existingIndex = fiches.findIndex(
        (f) => f.codeReference === codeReference
      );
      
      const savedFiche: SavedFiche = {
        codeReference,
        dateCreation: existingIndex >= 0 ? fiches[existingIndex].dateCreation : now,
        dateModification: now,
        formData: { ...formData, codeReference },
        result,
      };
      
      if (existingIndex >= 0) {
        // Mettre à jour la fiche existante
        fiches[existingIndex] = savedFiche;
      } else {
        // Ajouter une nouvelle fiche
        fiches.push(savedFiche);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fiches));
      return codeReference;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la fiche:", error);
      throw new Error("Impossible de sauvegarder la fiche");
    }
  }

  /**
   * Récupère une fiche par son code de référence
   */
  static getFicheByCode(codeReference: string): SavedFiche | null {
    const fiches = this.getAllFiches();
    return fiches.find((f) => f.codeReference === codeReference) || null;
  }

  /**
   * Recherche des fiches par raison sociale ou code de référence
   */
  static searchFiches(query: string): SavedFiche[] {
    const fiches = this.getAllFiches();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return fiches;
    
    return fiches.filter(
      (f) =>
        f.codeReference.toLowerCase().includes(lowerQuery) ||
        f.formData.raisonSociale.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Supprime une fiche par son code de référence
   */
  static deleteFiche(codeReference: string): boolean {
    try {
      const fiches = this.getAllFiches();
      const filteredFiches = fiches.filter(
        (f) => f.codeReference !== codeReference
      );
      
      if (filteredFiches.length === fiches.length) {
        return false; // Fiche non trouvée
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiches));
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la fiche:", error);
      return false;
    }
  }

  /**
   * Exporte toutes les fiches en JSON
   */
  static exportAllFiches(): string {
    const fiches = this.getAllFiches();
    return JSON.stringify(fiches, null, 2);
  }

  /**
   * Importe des fiches depuis JSON
   */
  static importFiches(jsonData: string): number {
    try {
      const importedFiches = JSON.parse(jsonData) as SavedFiche[];
      const existingFiches = this.getAllFiches();
      
      let importCount = 0;
      
      importedFiches.forEach((importedFiche) => {
        const existingIndex = existingFiches.findIndex(
          (f) => f.codeReference === importedFiche.codeReference
        );
        
        if (existingIndex >= 0) {
          // Remplacer la fiche existante
          existingFiches[existingIndex] = importedFiche;
        } else {
          // Ajouter une nouvelle fiche
          existingFiches.push(importedFiche);
        }
        
        importCount++;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingFiches));
      return importCount;
    } catch (error) {
      console.error("Erreur lors de l'importation des fiches:", error);
      throw new Error("Format JSON invalide");
    }
  }

  /**
   * Efface toutes les fiches (avec confirmation)
   */
  static clearAllFiches(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
