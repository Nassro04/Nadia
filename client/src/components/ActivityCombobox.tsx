import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ActivityComboboxProps {
  activities: Array<{ nom: string; score: number }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ActivityCombobox({
  activities,
  value,
  onChange,
  placeholder = "Sélectionner une activité...",
}: ActivityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-left"
          type="button"
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher une activité..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Aucune activité trouvée.</CommandEmpty>
            <CommandGroup>
              {activities
                .filter((activity) =>
                  activity.nom
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
                .slice(0, 100) // Limiter à 100 résultats pour les performances
                .map((activity) => (
                  <CommandItem
                    key={activity.nom}
                    value={activity.nom}
                    onSelect={() => {
                      onChange(activity.nom);
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === activity.nom ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {activity.nom}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
