import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calculator, Download, FileText, Plus, Shield } from "lucide-react";

import { generatePDF } from "@/lib/pdfGenerator";
import { generateExcel } from "@/lib/excelGenerator";
import { calculateRisk } from "@/lib/riskCalculator";
import { StorageService, SavedFiche } from "@/lib/storageService";
import { HistoryService } from "@/lib/historyService";
import type { HistoryEntry } from "@/types";
import { PersonnePhysiqueForm } from "@/components/PersonnePhysiqueForm";
import { AgenceForm } from "@/components/AgenceForm";
import FichesManager from "@/components/FichesManager";
import HistoryTimeline from "@/components/HistoryTimeline";
import dataJson from "@/data.json";
import { APP_TITLE } from "@/const";
import { toast } from "sonner";
import type { FormData, ReferenceData, Result, PersonnePhysique, Agence } from "@/types";

export default function Home() {
  const [data, setData] = useState<ReferenceData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    utilisateurCourant: "",
    historique: [],
    dateReception: "",
    affectation: "",
    dateTraitement: "",
    natureRelation: "Agent de paiement principal",
    typeDemande: "Entrée en relation",
    raisonSociale: "",
    formeJuridique: "",
    adresseSiegeSocial: "",
    numeroRC: "",
    numeroICE: "",
    numeroIF: "",
    dateImmatriculation: "",
    montantCapitalSocial: "",
    numeroTaxeProfessionnelle: "",
    pays: "",
    ville: "",
    villeAutre: "",
    activite: "",
    activiteAutre: "",
    statutResidence: "",
    detentionGouv: "",
    cotationBourse: "",
    structureActionnariat: "",
    negativeNews: "",
    sanctionsSociete: "",
    dirigeants: [{
      id: "1",
      nom: "",
      dateNaissance: "",
      age: "",
      nationalite: "",
      paysResidence: "",
      ppe: "",
      antecedents: "",
      blacklist: "",
      sanctions: "",
    }],
    associes: [{
      id: "1",
      nom: "",
      dateNaissance: "",
      age: "",
      nationalite: "",
      paysResidence: "",
      ppe: "",
      antecedents: "",
      blacklist: "",
      sanctions: "",
      pourcentageDetention: "",
    }],
    beneficiaires: [{
      id: "1",
      nom: "",
      dateNaissance: "",
      age: "",
      nationalite: "",
      paysResidence: "",
      ppe: "",
      antecedents: "",
      blacklist: "",
      sanctions: "",
      pourcentageDetention: "",
      natureDetention: "",
    }],
    nombreTotalAgences: "1",
    agences: [{
      id: "1",
      type: "Agence principale",
      numeroReference: "",
      codeAgence: "",
      nomAgence: "",
      adresseAgence: "",
    }],
    produits: "",
    canaux: "",
    forcageActive: false,
    forcageNiveauRisque: "",
    forcageMotif: "",
    forcageDate: "",
    forcageResponsable: "",
   });
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    // Charger les données directement depuis l'import
    setData(dataJson);
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPersonne = (type: "dirigeants" | "associes" | "beneficiaires") => {
    const newPersonne: PersonnePhysique = {
      id: Date.now().toString(),
      nom: "",
      dateNaissance: "",
      age: "",
      nationalite: "",
      paysResidence: "",
      ppe: "",
      antecedents: "",
      blacklist: "",
      sanctions: "",
    };
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], newPersonne],
    }));
  };

  const updatePersonne = (
    type: "dirigeants" | "associes" | "beneficiaires",
    index: number,
    personne: PersonnePhysique
  ) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [type]: prev[type].map((p, i) => (i === index ? personne : p)),
      };

      // Si c'est un associé avec >25% de détention, le dupliquer automatiquement dans les bénéficiaires
      if (type === "associes" && personne.pourcentageDetention) {
        const pourcentage = parseFloat(personne.pourcentageDetention);
        if (pourcentage > 25) {
          // Vérifier si cet associé existe déjà dans les bénéficiaires
          const existeDeja = updated.beneficiaires.some(
            (b) => b.nom === personne.nom && b.dateNaissance === personne.dateNaissance
          );

          if (!existeDeja) {
            // Ajouter l'associé comme bénéficiaire effectif
            const nouveauBeneficiaire: PersonnePhysique = {
              ...personne,
              id: `be-${Date.now()}-${Math.random()}`,
              natureDetention: "Détention par capital",
            };
            updated.beneficiaires = [...updated.beneficiaires, nouveauBeneficiaire];
          } else {
            // Mettre à jour le bénéficiaire existant
            updated.beneficiaires = updated.beneficiaires.map((b) =>
              b.nom === personne.nom && b.dateNaissance === personne.dateNaissance
                ? { ...personne, id: b.id, natureDetention: b.natureDetention || "Détention par capital" }
                : b
            );
          }
        } else {
          // Si le pourcentage est <= 25%, retirer des bénéficiaires s'il y était
          updated.beneficiaires = updated.beneficiaires.filter(
            (b) => !(b.nom === personne.nom && b.dateNaissance === personne.dateNaissance && b.natureDetention === "Détention par capital")
          );
        }
      }

      return updated;
    });
  };

  const deletePersonne = (
    type: "dirigeants" | "associes" | "beneficiaires",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addAgence = () => {
    const currentCount = formData.agences.length;
    const newAgence: Agence = {
      id: Date.now().toString(),
      type: currentCount === 0 ? "Agence principale" : `Succursale ${currentCount}`,
      numeroReference: "",
      codeAgence: "",
      nomAgence: "",
      adresseAgence: "",
    };
    setFormData((prev) => ({
      ...prev,
      agences: [...prev.agences, newAgence],
      nombreTotalAgences: (prev.agences.length + 1).toString(),
    }));
  };

  const updateAgence = (index: number, agence: Agence) => {
    setFormData((prev) => ({
      ...prev,
      agences: prev.agences.map((a, i) => (i === index ? agence : a)),
    }));
  };

  const deleteAgence = (index: number) => {
    setFormData((prev) => {
      const newAgences = prev.agences.filter((_, i) => i !== index);
      // Renommer les agences après suppression
      const renamedAgences = newAgences.map((agence, idx) => ({
        ...agence,
        type: idx === 0 ? "Agence principale" : `Succursale ${idx}`,
      }));
      return {
        ...prev,
        agences: renamedAgences,
        nombreTotalAgences: renamedAgences.length.toString(),
      };
    });
  };

  const handleCalculate = () => {
    if (!data) return;
    
    // Vérifier que l'utilisateur courant est renseigné
    if (!formData.utilisateurCourant || formData.utilisateurCourant.trim() === '') {
      toast.error("⚠️ Utilisateur obligatoire", {
        description: "Veuillez saisir votre nom dans le champ 'Utilisateur courant' avant de calculer le risque.",
      });
      return;
    }
    
    try {
      // Calculer le risque
      const calculatedResult = calculateRisk(formData, data);
      setResult(calculatedResult);
      
      // Enregistrer le calcul dans l'historique
      const formDataWithHistory = HistoryService.recordCalculation(
        formData,
        calculatedResult.niveauRisque,
        formData.utilisateurCourant
      );
      
      // Sauvegarder automatiquement la fiche
      const codeReference = StorageService.saveFiche(formDataWithHistory, calculatedResult);
      
      // Mettre à jour le formData avec le code de référence et l'historique
      setFormData((prev) => ({ ...formDataWithHistory, codeReference }));
      
      toast.success(`Fiche ${codeReference} sauvegardée automatiquement`);
    } catch (error) {
      console.error("Erreur lors du calcul:", error);
      toast.error("Erreur lors du calcul du risque");
    }
  };
  
  const handleLoadFiche = (savedFiche: SavedFiche) => {
    setFormData(savedFiche.formData);
    if (savedFiche.result) {
      setResult(savedFiche.result);
    }
  };
  
  const handleNewFiche = () => {
    // Réinitialiser le formulaire
    const newFormData: FormData = {
      utilisateurCourant: formData.utilisateurCourant || "", // Conserver l'utilisateur
      historique: [],
      dateReception: "",
      affectation: "",
      dateTraitement: "",
      natureRelation: "Agent de paiement principal",
      typeDemande: "Entrée en relation",
      raisonSociale: "",
      formeJuridique: "",
      adresseSiegeSocial: "",
      numeroRC: "",
      numeroICE: "",
      numeroIF: "",
      dateImmatriculation: "",
      montantCapitalSocial: "",
      numeroTaxeProfessionnelle: "",
      pays: "",
      ville: "",
      villeAutre: "",
      activite: "",
      activiteAutre: "",
      statutResidence: "",
      detentionGouv: "",
      cotationBourse: "",
      structureActionnariat: "",
      negativeNews: "",
      sanctionsSociete: "",
      dirigeants: [{
        id: "1",
        nom: "",
        dateNaissance: "",
        age: "",
        nationalite: "",
        paysResidence: "",
        ppe: "",
        antecedents: "",
        blacklist: "",
        sanctions: "",
      }],
      associes: [{
        id: "1",
        nom: "",
        dateNaissance: "",
        age: "",
        nationalite: "",
        paysResidence: "",
        ppe: "",
        antecedents: "",
        blacklist: "",
        sanctions: "",
        pourcentageDetention: "",
      }],
      beneficiaires: [{
        id: "1",
        nom: "",
        dateNaissance: "",
        age: "",
        nationalite: "",
        paysResidence: "",
        ppe: "",
        antecedents: "",
        blacklist: "",
        sanctions: "",
        pourcentageDetention: "",
        natureDetention: "",
      }],
      nombreTotalAgences: "1",
      agences: [{
        id: "1",
        type: "Agence principale",
        numeroReference: "",
        codeAgence: "",
        nomAgence: "",
        adresseAgence: "",
      }],
      produits: "",
      canaux: "",
      forcageActive: false,
      forcageNiveauRisque: "",
      forcageMotif: "",
      forcageDate: "",
      forcageResponsable: "",
    };
    
    setFormData(newFormData);
    setResult(null);
    toast.success("Nouvelle fiche créée");
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données de référence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center mb-4 space-y-3">
              <img src="/cashplus-logo.png" alt="Cash Plus" className="h-16" />
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Calculateur Risque LAB/FT - Personne Morale
                </h1>
                <p className="text-sm text-gray-600 max-w-xl mx-auto">
                  Évaluation structurée du risque de blanchiment et de financement du terrorisme pour les personnes morales.
                </p>
              </div>
            </div>

            {/* Barre d'outils */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <Button variant="default" onClick={handleNewFiche} className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Nouvelle fiche
              </Button>
              <div className="w-full md:w-auto flex justify-center">
                <FichesManager onLoadFiche={handleLoadFiche} />
              </div>
              {formData.codeReference && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 mt-2 md:mt-0">
                  <Shield className="h-4 w-4" />
                  <span className="font-mono text-xs md:text-sm font-medium">{formData.codeReference}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="metadata" className="w-full">
          <TabsList className={`grid w-full mb-6 ${formData.natureRelation === "Agent de paiement principal" ? "grid-cols-9" : "grid-cols-8"}`}>
            <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
            {formData.natureRelation === "Agent de paiement principal" && (
              <TabsTrigger value="agence">Agence</TabsTrigger>
            )}
            <TabsTrigger value="societe">Société</TabsTrigger>
            <TabsTrigger value="dirigeants">Dirigeants</TabsTrigger>
            <TabsTrigger value="associes">Associés</TabsTrigger>
            <TabsTrigger value="beneficiaires">Bénéficiaires</TabsTrigger>
            <TabsTrigger value="forcage">Forçage</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="resultat">Résultat</TabsTrigger>
          </TabsList>

          {/* Métadonnées */}
          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>Informations Générales</CardTitle>
                <CardDescription>
                  Renseignez les informations administratives de la demande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Champ utilisateur pour traçabilité */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-blue-900 font-semibold">
                      Utilisateur courant (pour traçabilité) <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      value={formData.utilisateurCourant}
                      onChange={(e) => updateFormData("utilisateurCourant", e.target.value)}
                      placeholder="Votre nom et prénom"
                      className="bg-white"
                      required
                    />
                    {!formData.utilisateurCourant && (
                      <p className="text-xs text-red-600 font-medium">
                        ⚠️ Ce champ est obligatoire. Veuillez saisir votre nom avant de continuer.
                      </p>
                    )}
                    <p className="text-xs text-blue-700">
                      Ce nom sera enregistré dans l'historique pour toutes les modifications que vous effectuez
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de réception de la demande</Label>
                    <Input
                      type="date"
                      value={formData.dateReception}
                      onChange={(e) => updateFormData("dateReception", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Affectation</Label>
                    <Input
                      value={formData.affectation}
                      onChange={(e) => updateFormData("affectation", e.target.value)}
                      placeholder="Nom du chargé de traitement"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de traitement de la demande</Label>
                    <Input
                      type="date"
                      value={formData.dateTraitement}
                      onChange={(e) => updateFormData("dateTraitement", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nature de relation</Label>
                    <Select
                      value={formData.natureRelation}
                      onValueChange={(v) => updateFormData("natureRelation", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agent de paiement principal">Agent de paiement principal</SelectItem>
                        <SelectItem value="Correspondant">Correspondant</SelectItem>
                        <SelectItem value="Partenaire B2B">Partenaire B2B</SelectItem>
                        <SelectItem value="Marchand TPE/E-Commerce">Marchand TPE/E-Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typeDemande">Type de demande</Label>
                    <Input
                      id="typeDemande"
                      value="Entrée en relation"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Société */}
          <TabsContent value="societe">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la Société</CardTitle>
                <CardDescription>
                  Renseignez les informations relatives à la personne morale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Raison Sociale</Label>
                    <Input
                      value={formData.raisonSociale}
                      onChange={(e) => updateFormData("raisonSociale", e.target.value)}
                      placeholder="Nom de la société"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Forme Juridique</Label>
                    <Select
                      value={formData.formeJuridique}
                      onValueChange={(v) => updateFormData("formeJuridique", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.formes_juridiques.map((f) => (
                          <SelectItem key={f.nom} value={f.nom}>
                            {f.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Adresse du siège social</Label>
                    <Input
                      value={formData.adresseSiegeSocial}
                      onChange={(e) => updateFormData("adresseSiegeSocial", e.target.value)}
                      placeholder="Adresse complète du siège social"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro du RC</Label>
                    <Input
                      value={formData.numeroRC}
                      onChange={(e) => updateFormData("numeroRC", e.target.value)}
                      placeholder="Numéro du Registre de Commerce"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro d'ICE</Label>
                    <Input
                      value={formData.numeroICE}
                      onChange={(e) => updateFormData("numeroICE", e.target.value)}
                      placeholder="Identifiant Commun de l'Entreprise"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro d'IF</Label>
                    <Input
                      value={formData.numeroIF}
                      onChange={(e) => updateFormData("numeroIF", e.target.value)}
                      placeholder="Identifiant Fiscal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date d'immatriculation</Label>
                    <Input
                      type="date"
                      value={formData.dateImmatriculation}
                      onChange={(e) => updateFormData("dateImmatriculation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Montant du capital social</Label>
                    <Input
                      value={formData.montantCapitalSocial}
                      onChange={(e) => updateFormData("montantCapitalSocial", e.target.value)}
                      placeholder="Montant en MAD"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro de la taxe professionnelle</Label>
                    <Input
                      value={formData.numeroTaxeProfessionnelle}
                      onChange={(e) => updateFormData("numeroTaxeProfessionnelle", e.target.value)}
                      placeholder="Numéro de taxe professionnelle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pays d'immatriculation</Label>
                    <Select value={formData.pays} onValueChange={(v) => updateFormData("pays", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.pays.map((p) => (
                          <SelectItem key={p.nom} value={p.nom}>
                            {p.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ville d'immatriculation</Label>
                    <Select value={formData.ville} onValueChange={(v) => updateFormData("ville", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.villes.map((v) => (
                          <SelectItem key={v.nom} value={v.nom}>
                            {v.nom}
                          </SelectItem>
                        ))}
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.ville === "Autre" && (
                      <Input
                        value={formData.villeAutre}
                        onChange={(e) => updateFormData("villeAutre", e.target.value)}
                        placeholder="Précisez la ville"
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Activité</Label>
                    <Input
                      list="activites-list"
                      value={formData.activite}
                      onChange={(e) => updateFormData("activite", e.target.value)}
                      placeholder="Saisir ou sélectionner une activité"
                      className="w-full"
                    />
                    <datalist id="activites-list">
                      {data.activites && data.activites.map((a) => (
                        <option key={a.nom} value={a.nom} />
                      ))}
                      <option value="Autre" />
                    </datalist>
                  </div>

                  {formData.activite === "Autre" && (
                    <div className="space-y-2 col-span-2">
                      <Label>Préciser l'activité</Label>
                      <Input
                        value={formData.activiteAutre}
                        onChange={(e) => updateFormData("activiteAutre", e.target.value)}
                        placeholder="Saisir l'activité non listée"
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Statut de résidence</Label>
                    <Select
                      value={formData.statutResidence}
                      onValueChange={(v) => updateFormData("statutResidence", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.residence.map((r) => (
                          <SelectItem key={r.nom} value={r.nom}>
                            {r.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Détention gouvernementale</Label>
                    <Select
                      value={formData.detentionGouv}
                      onValueChange={(v) => updateFormData("detentionGouv", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.oui_non.map((o) => (
                          <SelectItem key={o.nom} value={o.nom}>
                            {o.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cotation en bourse</Label>
                    <Select
                      value={formData.cotationBourse}
                      onValueChange={(v) => updateFormData("cotationBourse", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.oui_non.map((o) => (
                          <SelectItem key={o.nom} value={o.nom}>
                            {o.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Structure d'actionnariat</Label>
                    <Select
                      value={formData.structureActionnariat}
                      onValueChange={(v) => updateFormData("structureActionnariat", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.structure.map((s) => (
                          <SelectItem key={s.nom} value={s.nom}>
                            {s.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Négatives News</Label>
                    <Select
                      value={formData.negativeNews}
                      onValueChange={(v) => updateFormData("negativeNews", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.oui_non.map((o) => (
                          <SelectItem key={o.nom} value={o.nom}>
                            {o.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sanctions internationales</Label>
                    <Select
                      value={formData.sanctionsSociete}
                      onValueChange={(v) => updateFormData("sanctionsSociete", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.oui_non.map((o) => (
                          <SelectItem key={o.nom} value={o.nom}>
                            {o.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Produits et Services</Label>
                    <Select
                      value={formData.produits}
                      onValueChange={(v) => updateFormData("produits", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.produits.map((p) => (
                          <SelectItem key={p.nom} value={p.nom}>
                            {p.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Canaux de distribution</Label>
                    <Select
                      value={formData.canaux}
                      onValueChange={(v) => updateFormData("canaux", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.canaux.map((c) => (
                          <SelectItem key={c.nom} value={c.nom}>
                            {c.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dirigeants */}
          <TabsContent value="dirigeants">
            <Card>
              <CardHeader>
                <CardTitle>Dirigeants</CardTitle>
                <CardDescription>
                  Ajoutez les informations des dirigeants de la société
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.dirigeants.map((dirigeant, index) => (
                  <PersonnePhysiqueForm
                    key={dirigeant.id}
                    personne={dirigeant}
                    data={data}
                    onUpdate={(p) => updatePersonne("dirigeants", index, p)}
                    onDelete={() => deletePersonne("dirigeants", index)}
                    showDelete={formData.dirigeants.length > 1}
                    showAge={true}
                    showAdresse={true}
                  />
                ))}
                <Button onClick={() => addPersonne("dirigeants")} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un dirigeant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Associés */}
          <TabsContent value="associes">
            <Card>
              <CardHeader>
                <CardTitle>Associés</CardTitle>
                <CardDescription>
                  Ajoutez les informations des associés (obligatoire)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.associes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun associé ajouté</p>
                  </div>
                ) : (
                  formData.associes.map((associe, index) => (
                    <PersonnePhysiqueForm
                      key={associe.id}
                      personne={associe}
                      data={data}
                      onUpdate={(p) => updatePersonne("associes", index, p)}
                      onDelete={() => deletePersonne("associes", index)}
                      showAge={false}
                      showPourcentageDetention={true}
                    />
                  ))
                )}
                <Button onClick={() => addPersonne("associes")} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un associé
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bénéficiaires */}
          <TabsContent value="beneficiaires">
            <Card>
              <CardHeader>
                <CardTitle>Bénéficiaires Effectifs</CardTitle>
                <CardDescription>
                  Ajoutez les informations des bénéficiaires effectifs (obligatoire)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.beneficiaires.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun bénéficiaire effectif ajouté</p>
                  </div>
                ) : (
                  formData.beneficiaires.map((beneficiaire, index) => (
                    <PersonnePhysiqueForm
                      key={beneficiaire.id}
                      personne={beneficiaire}
                      data={data}
                      onUpdate={(p) => updatePersonne("beneficiaires", index, p)}
                      onDelete={() => deletePersonne("beneficiaires", index)}
                      showAge={false}
                      showPourcentageDetention={true}
                      showNatureDetention={true}
                    />
                  ))
                )}
                <Button onClick={() => addPersonne("beneficiaires")} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un bénéficiaire effectif
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agence */}
          {formData.natureRelation === "Agent de paiement principal" && (
          <TabsContent value="agence">
            <Card>
              <CardHeader>
                <CardTitle>Informations Agence</CardTitle>
                <CardDescription>
                  Gérez les informations des agences et succursales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Nombre total d'agences</Label>
                  <Input
                    type="number"
                    value={formData.nombreTotalAgences}
                    onChange={(e) => updateFormData("nombreTotalAgences", e.target.value)}
                    placeholder="1"
                    disabled
                  />
                  {parseInt(formData.nombreTotalAgences) >= 5 && (
                    <p className="text-sm text-red-600">
                      ⚠ Risque automatiquement élevé (≥ 5 agences)
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {formData.agences.map((agence, index) => (
                    <AgenceForm
                      key={agence.id}
                      agence={agence}
                      onUpdate={(a) => updateAgence(index, a)}
                      onDelete={() => deleteAgence(index)}
                      showDelete={formData.agences.length > 1}
                    />
                  ))}
                </div>

                <Button onClick={addAgence} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une succursale
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Forçage */}
          <TabsContent value="forcage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Forçage du Risque
                </CardTitle>
                <CardDescription>
                  Réservé au responsable - Permet de modifier manuellement le niveau de risque
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="forcageActive"
                    checked={formData.forcageActive}
                    onChange={(e) => updateFormData("forcageActive", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="forcageActive">Activer le forçage du risque</Label>
                </div>

                {formData.forcageActive && (
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-yellow-50">
                    <div className="space-y-2">
                      <Label>Niveau de risque forcé</Label>
                      <Select
                        value={formData.forcageNiveauRisque}
                        onValueChange={(v) => updateFormData("forcageNiveauRisque", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Faible">Faible</SelectItem>
                          <SelectItem value="Moyen">Moyen</SelectItem>
                          <SelectItem value="Moyennement élevé">Moyennement élevé</SelectItem>
                          <SelectItem value="Élevé">Élevé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Responsable</Label>
                      <Input
                        value={formData.forcageResponsable}
                        onChange={(e) => updateFormData("forcageResponsable", e.target.value)}
                        placeholder="Nom du responsable"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date du forçage</Label>
                      <Input
                        type="date"
                        value={formData.forcageDate}
                        onChange={(e) => updateFormData("forcageDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>Motif du forçage</Label>
                      <Input
                        value={formData.forcageMotif}
                        onChange={(e) => updateFormData("forcageMotif", e.target.value)}
                        placeholder="Raison du forçage du risque"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historique */}
          <TabsContent value="historique">
            <HistoryTimeline historique={formData.historique || []} />
          </TabsContent>

          {/* Résultat */}
          <TabsContent value="resultat">
            <Card>
              <CardHeader>
                <CardTitle>Résultat de l'Évaluation</CardTitle>
                <CardDescription>
                  Calculez et visualisez le niveau de risque LAB/FT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={handleCalculate} className="w-full" size="lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculer le Risque
                </Button>

                {result && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => generatePDF(formData, result)}
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Exporter PDF
                    </Button>
                    <Button
                      onClick={() => generateExcel(formData, result)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Excel
                    </Button>
                  </div>
                )}

                {result && (
                  <>
                    {result.alerteSanctions && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-bold">
                          ⚠ INTERDICTION D'ENTRÉE OU DE MAINTENIR LA RELATION D'AFFAIRES (Sanctions internationales)
                        </AlertDescription>
                      </Alert>
                    )}

                    {result.alertePaysInterdits && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-bold">
                          ⚠ INTERDICTION D'ENTRÉE OU DE MAINTENIR LA RELATION D'AFFAIRES (Pays interdit: Iran, Corée du Nord ou Myanmar)
                        </AlertDescription>
                      </Alert>
                    )}

                    {!result.critereFaibleAuto && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Scores par Axe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Zone Géographique (35%)</span>
                            <span className="font-bold">{result.scoreZoneGeo.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Caractéristiques Client (35%)</span>
                            <span className="font-bold">{result.scoreCaract.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Produits et Services (20%)</span>
                            <span className="font-bold">{result.scoreProduits.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Canaux de Distribution (10%)</span>
                            <span className="font-bold">{result.scoreCanaux.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold">Score Final</span>
                              <span className="text-2xl font-bold text-blue-600">
                                {result.scoreFinal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result.critereFaibleAuto && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Risque FAIBLE automatique détecté (critère réglementaire)
                        </AlertDescription>
                      </Alert>
                    )}

                    <Card
                      className={
                        result.niveauRisqueForce || result.niveauRisque === "Élevé"
                          ? "border-red-500"
                          : result.niveauRisqueForce || result.niveauRisque === "Moyennement élevé"
                          ? "border-orange-500"
                          : result.niveauRisqueForce || result.niveauRisque === "Moyen"
                          ? "border-yellow-500"
                          : "border-green-500"
                      }
                    >
                      <CardHeader>
                        <CardTitle className="text-2xl">Niveau de Risque</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div
                            className={`text-4xl font-bold p-6 rounded-lg ${
                              result.niveauRisqueForce || result.niveauRisque === "Élevé"
                                ? "bg-red-100 text-red-700"
                                : result.niveauRisqueForce || result.niveauRisque === "Moyennement élevé"
                                ? "bg-orange-100 text-orange-700"
                                : result.niveauRisqueForce || result.niveauRisque === "Moyen"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {(result.niveauRisqueForce || result.niveauRisque).toUpperCase()}
                          </div>

                          {result.niveauRisqueForce && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm font-semibold">Risque forcé par le responsable</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Responsable: {formData.forcageResponsable}
                              </p>
                              <p className="text-xs text-gray-600">
                                Date: {new Date(formData.forcageDate).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-xs text-gray-600">Motif: {formData.forcageMotif}</p>
                            </div>
                          )}

                          {(result.critereRedhibitoire || result.critereElevéAuto) && (
                            <div className="mt-4 text-sm text-gray-600 space-y-1">
                              {result.critereRedhibitoire && (
                                <p>* Un ou plusieurs critères rédhibitoires détectés</p>
                              )}
                              {result.critereElevéAuto && (
                                <p>* Critère de risque élevé automatique détecté</p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => generatePDF(formData, result)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exporter en PDF
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          const dataStr = JSON.stringify({ formData, result }, null, 2);
                          const dataBlob = new Blob([dataStr], { type: "application/json" });
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `Donnees_LAB_FT_${
                            formData.raisonSociale || "Societe"
                          }_${new Date().toISOString().split("T")[0]}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Exporter JSON
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer Cash Plus */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/cashplus-logo.png" alt="Cash Plus" className="h-10 mr-4" />
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Cash Plus. Tous droits réservés.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Service de Conformité LAB/FT</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
