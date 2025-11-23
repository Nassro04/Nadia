import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, User, FileEdit, Calculator, AlertTriangle, Sparkles } from "lucide-react";
import type { HistoryEntry } from "@/types";
import { HistoryService } from "@/lib/historyService";

interface HistoryTimelineProps {
  historique: HistoryEntry[];
}

export default function HistoryTimeline({ historique }: HistoryTimelineProps) {
  if (!historique || historique.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des Modifications</CardTitle>
          <CardDescription>Aucune modification enregistrée pour cette fiche</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Trier par date décroissante (plus récent en premier)
  const sortedHistory = [...historique].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      case "modification":
        return <FileEdit className="h-5 w-5 text-orange-500" />;
      case "calcul":
        return <Calculator className="h-5 w-5 text-green-500" />;
      case "forcage":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <FileEdit className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "creation":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "modification":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "calcul":
        return "bg-green-100 text-green-800 border-green-300";
      case "forcage":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Modifications</CardTitle>
        <CardDescription>
          Traçabilité complète de toutes les modifications apportées à cette fiche
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedHistory.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Ligne verticale de connexion */}
              {index < sortedHistory.length - 1 && (
                <div className="absolute left-[22px] top-[40px] bottom-[-24px] w-0.5 bg-gray-200" />
              )}
              
              <div className="flex gap-4">
                {/* Icône */}
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                  {getIcon(entry.typeModification)}
                </div>
                
                {/* Contenu */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className={`${getTypeBadgeColor(entry.typeModification)} mb-2`}>
                        {HistoryService.getTypeLabel(entry.typeModification)}
                      </Badge>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{HistoryService.formatDate(entry.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{entry.utilisateur}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modifications */}
                  {entry.modifications.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {entry.modifications.map((mod, modIndex) => (
                        <div
                          key={modIndex}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div className="font-medium text-sm text-gray-900 mb-1">
                            {mod.labelChamp}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {mod.ancienneValeur && (
                              <div>
                                <span className="text-gray-500">Avant :</span>
                                <div className="mt-1 text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                                  {mod.ancienneValeur || <span className="italic text-gray-400">Vide</span>}
                                </div>
                              </div>
                            )}
                            <div className={mod.ancienneValeur ? "" : "col-span-2"}>
                              <span className="text-gray-500">Après :</span>
                              <div className="mt-1 text-gray-900 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                {mod.nouvelleValeur || <span className="italic text-gray-400">Vide</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Statistiques */}
        <Separator className="my-6" />
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {historique.length}
            </div>
            <div className="text-xs text-gray-500">Total modifications</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {historique.filter(h => h.typeModification === "modification").length}
            </div>
            <div className="text-xs text-gray-500">Modifications</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {historique.filter(h => h.typeModification === "calcul").length}
            </div>
            <div className="text-xs text-gray-500">Calculs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {historique.filter(h => h.typeModification === "forcage").length}
            </div>
            <div className="text-xs text-gray-500">Forçages</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
