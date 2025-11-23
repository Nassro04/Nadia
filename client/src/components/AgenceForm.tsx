import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Agence } from "@/types";

interface AgenceFormProps {
  agence: Agence;
  onUpdate: (agence: Agence) => void;
  onDelete: () => void;
  showDelete: boolean;
}

export function AgenceForm({ agence, onUpdate, onDelete, showDelete }: AgenceFormProps) {
  const updateField = (field: keyof Agence, value: string) => {
    onUpdate({ ...agence, [field]: value });
  };

  return (
    <Card className="relative">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg text-primary">{agence.type}</h4>
          {showDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Numéro de référence</Label>
            <Input
              value={agence.numeroReference}
              onChange={(e) => updateField("numeroReference", e.target.value)}
              placeholder="REF-AGENCE-XXX"
            />
          </div>

          <div className="space-y-2">
            <Label>Code agence</Label>
            <Input
              value={agence.codeAgence}
              onChange={(e) => updateField("codeAgence", e.target.value)}
              placeholder="CODE-XXX"
            />
          </div>

          <div className="space-y-2">
            <Label>Nom d'agence</Label>
            <Input
              value={agence.nomAgence}
              onChange={(e) => updateField("nomAgence", e.target.value)}
              placeholder="Nom de l'agence"
            />
          </div>

          <div className="space-y-2">
            <Label>Adresse d'agence</Label>
            <Input
              value={agence.adresseAgence}
              onChange={(e) => updateField("adresseAgence", e.target.value)}
              placeholder="Adresse complète"
            />
          </div>


        </div>
      </CardContent>
    </Card>
  );
}
