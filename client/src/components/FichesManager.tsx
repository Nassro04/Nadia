import { useState, useEffect } from "react";
import { StorageService, SavedFiche } from "@/lib/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface FichesManagerProps {
  onLoadFiche: (fiche: SavedFiche) => void;
}

export default function FichesManager({ onLoadFiche }: FichesManagerProps) {
  const [fiches, setFiches] = useState<SavedFiche[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFiches();
    }
  }, [isOpen]);

  const loadFiches = () => {
    const allFiches = StorageService.getAllFiches();
    setFiches(allFiches);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = StorageService.searchFiches(query);
      setFiches(results);
    } else {
      loadFiches();
    }
  };

  const handleLoadFiche = (fiche: SavedFiche) => {
    onLoadFiche(fiche);
    setIsOpen(false);
    toast.success(`Fiche ${fiche.codeReference} chargée`);
  };

  const handleDeleteFiche = (codeReference: string) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la fiche ${codeReference} ?`
      )
    ) {
      const success = StorageService.deleteFiche(codeReference);
      if (success) {
        toast.success("Fiche supprimée");
        loadFiches();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleExportAll = () => {
    try {
      const jsonData = StorageService.exportAllFiches();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fiches_labft_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Fiches exportées");
    } catch (error) {
      toast.error("Erreur lors de l'exportation");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = event.target?.result as string;
            const count = StorageService.importFiches(jsonData);
            toast.success(`${count} fiche(s) importée(s)`);
            loadFiches();
          } catch (error) {
            toast.error("Erreur lors de l'importation");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Fiches sauvegardées ({StorageService.getAllFiches().length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des fiches sauvegardées</DialogTitle>
          <DialogDescription>
            Recherchez, chargez ou supprimez des fiches existantes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par code ou raison sociale..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleExportAll}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleImport}>
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          {/* Tableau des fiches */}
          {fiches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "Aucune fiche trouvée"
                : "Aucune fiche sauvegardée"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Raison sociale</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Date modification</TableHead>
                  <TableHead>Niveau risque</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiches.map((fiche) => (
                  <TableRow key={fiche.codeReference}>
                    <TableCell className="font-mono text-sm">
                      {fiche.codeReference}
                    </TableCell>
                    <TableCell className="font-medium">
                      {fiche.formData.raisonSociale}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(fiche.dateCreation)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(fiche.dateModification)}
                    </TableCell>
                    <TableCell>
                      {fiche.result ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            fiche.result.niveauRisque === "Faible"
                              ? "bg-green-100 text-green-800"
                              : fiche.result.niveauRisque === "Moyen"
                              ? "bg-yellow-100 text-yellow-800"
                              : fiche.result.niveauRisque ===
                                "Moyennement élevé"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fiche.result.niveauRisque}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Non calculé
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadFiche(fiche)}
                        >
                          Charger
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteFiche(fiche.codeReference)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
