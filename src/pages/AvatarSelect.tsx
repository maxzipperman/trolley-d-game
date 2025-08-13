import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePersonas } from "@/hooks/usePersonas";

const AVATARS_KEY = "trolleyd-selected-avatars";

const AvatarSelect = () => {
  useEffect(() => { document.title = "Trolley’d · Select Avatars"; }, []);
  const navigate = useNavigate();
  const { personas, loading } = usePersonas();
  const [selected, setSelected] = useLocalStorage<string[]>(AVATARS_KEY, []);

  function toggle(name: string) {
    setSelected(
      selected.includes(name)
        ? selected.filter((n) => n !== name)
        : [...selected, name]
    );
  }

  if (loading || !personas) {
    return <main className="min-h-screen container py-10" />;
  }

  if (personas.length === 0) {
    return (
      <main className="min-h-screen container max-w-2xl py-8">
        <p className="text-muted-foreground">No personas available. Please add data/personas.json.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Choose Avatars</h1>
        <p className="text-sm text-muted-foreground">
          Select personas to include in your results comparison.
        </p>
      </header>

      <ul className="space-y-4">
        {personas.map((p) => {
          const added = selected.includes(p.name);
          return (
            <li
              key={p.name}
              className="p-4 rounded-lg border border-border bg-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{p.name}</h2>
                <Toggle
                  pressed={added}
                  onPressedChange={() => toggle(p.name)}
                  size="sm"
                >
                  {added ? "Added" : "Add"}
                </Toggle>
              </div>
              {p.occupation_or_role && (
                <p className="text-sm text-muted-foreground">
                  {p.occupation_or_role}
                </p>
              )}
              {p.era_origin && (
                <p className="text-sm text-muted-foreground">{p.era_origin}</p>
              )}
              {p.worldview_values && (
                <p className="text-sm text-muted-foreground">
                  {p.worldview_values}
                </p>
              )}
              {p.tone_style && (
                <p className="text-sm text-muted-foreground">{p.tone_style}</p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => navigate("/play")}
          disabled={selected.length === 0}
        >
          Confirm & Play
        </Button>
      </div>
    </main>
  );
};

export default AvatarSelect;

