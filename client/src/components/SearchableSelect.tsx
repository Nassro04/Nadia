import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchableSelectProps {
  items: Array<{ nom: string; score: number }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchableSelect({
  items,
  value,
  onChange,
  placeholder = "Sélectionner...",
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Rechercher une activité..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Select value={value} onValueChange={onChange} open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {filteredItems.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Aucune activité trouvée
            </div>
          ) : (
            filteredItems.slice(0, 100).map((item) => (
              <SelectItem key={item.nom} value={item.nom}>
                {item.nom}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {searchTerm && (
        <p className="text-xs text-muted-foreground">
          {filteredItems.length} résultat(s) trouvé(s)
        </p>
      )}
    </div>
  );
}
