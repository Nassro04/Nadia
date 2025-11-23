// Test du calculateur
const fs = require('fs');

// Charger les données
const data = JSON.parse(fs.readFileSync('./client/public/data.json', 'utf-8'));

console.log("=== DONNÉES CHARGÉES ===");
console.log(`Pays: ${data.pays ? data.pays.length : 'UNDEFINED'}`);
console.log(`Activités: ${data.activites ? data.activites.length : 'UNDEFINED'}`);
console.log(`Villes: ${data.villes ? data.villes.length : 'UNDEFINED'}`);
console.log(`Produits: ${data.produits ? data.produits.length : 'UNDEFINED'}`);
console.log(`Canaux: ${data.canaux ? data.canaux.length : 'UNDEFINED'}`);
console.log(`Pays risque élevé: ${data.pays_risque_eleve ? data.pays_risque_eleve.length : 'UNDEFINED'}`);

// Simuler un formData minimal
const formData = {
  chargeTraitement: "Test",
  numeroReference: "REF-001",
  nombreAgences: "2",
  raisonSociale: "Test SA",
  formeJuridique: "Société Anonyme (SA)",
  pays: "Maroc",
  ville: "Casablanca",
  villeAutre: "",
  activite: "Culture du riz",
  statutResidence: "Société résidente",
  detentionGouv: "Non",
  cotationBourse: "Non",
  structureActionnariat: "Structure Simple",
  negativeNews: "Non",
  sanctionsSociete: "Non",
  dirigeants: [{
    id: "1",
    nom: "Test Dirigeant",
    dateNaissance: "1980-01-01",
    age: "44 ans",
    nationalite: "Maroc",
    paysResidence: "Maroc",
    ppe: "Non",
    antecedents: "Non",
    blacklist: "Non",
    sanctions: "Non",
  }],
  associes: [],
  beneficiaires: [],
  produits: "Comptes courants",
  canaux: "Agence",
  forcageActive: false,
  forcageNiveauRisque: "",
  forcageMotif: "",
  forcageDate: "",
  forcageResponsable: "",
};

console.log("\n=== FORM DATA ===");
console.log(JSON.stringify(formData, null, 2));

