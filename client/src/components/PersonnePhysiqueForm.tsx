import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PersonnePhysique, ReferenceData } from "@/types";

interface Props {
  personne: PersonnePhysique;
  data: ReferenceData;
  onUpdate: (personne: PersonnePhysique) => void;
  onDelete: () => void;
  showDelete?: boolean;
  showAge?: boolean; // Afficher le champ âge (uniquement pour dirigeants)
  showAdresse?: boolean; // Afficher le champ adresse (uniquement pour dirigeants)
  showPourcentageDetention?: boolean; // Afficher le pourcentage de détention (associés et bénéficiaires)
  showNatureDetention?: boolean; // Afficher la nature de détention (bénéficiaires uniquement)
}

export function PersonnePhysiqueForm({ personne, data, onUpdate, onDelete, showDelete = true, showAge = false, showAdresse = false, showPourcentageDetention = false, showNatureDetention = false }: Props) {
  const updateField = (field: keyof PersonnePhysique, value: string) => {
    const updated = { ...personne, [field]: value };
    
    // Calcul automatique de l'âge si date de naissance
    if (field === "dateNaissance" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Déterminer la tranche d'âge
      if (age >= 18 && age <= 21) {
        updated.age = "18-21 ans";
      } else if (age >= 22 && age <= 24) {
        updated.age = "22-24 ans";
      } else if (age >= 25 && age <= 65) {
        updated.age = "25-65 ans";
      } else if (age >= 66 && age <= 75) {
        updated.age = "66-75 ans";
      } else if (age > 75) {
        updated.age = "Plus de 75 ans";
      }
    }
    
    onUpdate(updated);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 relative">
      {showDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nom et Prénom</Label>
          <Input
            value={personne.nom}
            onChange={(e) => updateField("nom", e.target.value)}
            placeholder="Nom complet"
          />
        </div>

        {showAge && (
          <>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                value={personne.dateNaissance}
                onChange={(e) => updateField("dateNaissance", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tranche d'âge (calculé automatiquement)</Label>
              <Input
                value={personne.age || ""}
                disabled
                placeholder="Calculé à partir de la date de naissance"
                className="bg-gray-100"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Nationalité</Label>
          <Select value={personne.nationalite} onValueChange={(v) => updateField("nationalite", v)}>
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

        {showAdresse && (
          <div className="space-y-2">
            <Label>Adresse</Label>
            <Input
              value={personne.adresse || ""}
              onChange={(e) => updateField("adresse", e.target.value)}
              placeholder="Adresse complète"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Pays de résidence</Label>
          <Select value={personne.paysResidence} onValueChange={(v) => updateField("paysResidence", v)}>
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
          <Label>Statut PPE</Label>
          <Select value={personne.ppe} onValueChange={(v) => updateField("ppe", v)}>
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
          <Label>Antécédents judiciaires</Label>
          <Select value={personne.antecedents} onValueChange={(v) => updateField("antecedents", v)}>
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
          <Label>Blacklist</Label>
          <Select value={personne.blacklist} onValueChange={(v) => updateField("blacklist", v)}>
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
          <Select value={personne.sanctions} onValueChange={(v) => updateField("sanctions", v)}>
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

        {showPourcentageDetention && (
          <div className="space-y-2">
            <Label>Pourcentage de détention (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={personne.pourcentageDetention || ""}
              onChange={(e) => updateField("pourcentageDetention", e.target.value)}
              placeholder="Ex: 30"
            />
          </div>
        )}

        {showNatureDetention && (
          <div className="space-y-2">
            <Label>Nature de détention</Label>
            <Select value={personne.natureDetention || ""} onValueChange={(v) => updateField("natureDetention", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Détention par capital">Détention par capital</SelectItem>
                <SelectItem value="Détention par notion de contrôle">Détention par notion de contrôle</SelectItem>
                <SelectItem value="Représentant(s) légaux">Représentant(s) légaux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
