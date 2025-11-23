export interface PersonnePhysique {
  id: string;
  nom: string;
  dateNaissance: string;
  age?: string;
  adresse?: string;
  nationalite: string;
  paysResidence: string;
  ppe: string;
  antecedents: string;
  blacklist: string;
  sanctions: string;
  pourcentageDetention?: string;
  natureDetention?: string;
}

export interface Agence {
  id: string;
  type: string; // "Agence principale", "Succursale 1", etc.
  numeroReference: string;
  codeAgence: string;
  nomAgence: string;
  adresseAgence: string;
  typeChangement?: string; // "Changement d'adresse", "Cession", "Transfert"
  nomSocieteCessionnaire?: string;
  codeSocieteCessionnaire?: string;
  nomSocieteBeneficiaire?: string;
  codeSocieteBeneficiaire?: string;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO timestamp
  utilisateur: string; // Nom de l'utilisateur qui a fait la modification
  typeModification: "creation" | "modification" | "calcul" | "forcage";
  modifications: FieldChange[];
}

export interface FieldChange {
  champ: string; // Nom du champ modifié
  labelChamp: string; // Label lisible du champ
  ancienneValeur: string;
  nouvelleValeur: string;
}

export interface FormData {
  // Code de référence unique
  codeReference?: string; // Format: LABFT-YYYY-NNNN
  
  // Utilisateur courant (pour traçabilité)
  utilisateurCourant?: string;
  
  // Historique des modifications
  historique?: HistoryEntry[];
  
  // Métadonnées
  dateReception: string;
  affectation: string; // Ancien "chargeTraitement"
  dateTraitement: string;
  natureRelation: string; // "Agent de paiement principale", "Correspondant", etc.
  typeDemande: string; // "Entrée en relation" par défaut
  
  // Société
  raisonSociale: string;
  formeJuridique: string;
  adresseSiegeSocial: string;
  numeroRC: string;
  numeroICE: string;
  numeroIF: string;
  dateImmatriculation: string;
  montantCapitalSocial: string;
  numeroTaxeProfessionnelle: string;
  pays: string;
  ville: string;
  villeAutre: string;
  activite: string;
  activiteAutre: string;
  statutResidence: string;
  detentionGouv: string;
  cotationBourse: string;
  structureActionnariat: string;
  negativeNews: string;
  sanctionsSociete: string;
  
  // Dirigeants (tableau)
  dirigeants: PersonnePhysique[];
  
  // Associés (tableau)
  associes: PersonnePhysique[];
  
  // Bénéficiaires (tableau)
  beneficiaires: PersonnePhysique[];
  
  // Agences (tableau)
  nombreTotalAgences: string;
  agences: Agence[];
  
  // Produits et Canaux
  produits: string;
  canaux: string;
  
  // Forçage du risque
  forcageActive: boolean;
  forcageNiveauRisque: string;
  forcageMotif: string;
  forcageDate: string;
  forcageResponsable: string;
}

export interface Result {
  scoreZoneGeo: number;
  scoreCaract: number;
  scoreProduits: number;
  scoreCanaux: number;
  scoreFinal: number;
  niveauRisque: string;
  niveauRisqueForce?: string;
  alerteSanctions: boolean;
  alertePaysInterdits: boolean;
  critereRedhibitoire: boolean;
  critereFaibleAuto: boolean;
  critereElevéAuto: boolean;
  dateValidation: string;
}

export interface ReferenceData {
  pays: Array<{ nom: string; score: number }>;
  pays_risque_eleve: string[];
  villes: Array<{ nom: string; score: number }>;
  formes_juridiques: Array<{ nom: string; score: number }>;
  activites: Array<{ nom: string; score: number }>;
  produits: Array<{ nom: string; score: number }>;
  canaux: Array<{ nom: string; score: number }>;
  oui_non: Array<{ nom: string; score: number }>;
  residence: Array<{ nom: string; score: number }>;
  structure: Array<{ nom: string; score: number }>;
  age: Array<{ nom: string; score: number }>;
}
