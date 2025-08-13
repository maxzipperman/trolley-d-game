import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Slot { id: string; name: string }

const SLOTS_KEY = "trolleyd-slots";
const CURRENT_SLOT_KEY = "trolleyd-current-slot";
const ANSWERS_KEY = "trolleyd-answers";

const SaveSlots = () => {
  useEffect(() => { document.title = "Trolley'd · Save Slots"; }, []);
  const navigate = useNavigate();
  const [slots, setSlots] = useLocalStorage<Slot[]>(SLOTS_KEY, []);
  const [currentSlot, setCurrentSlot] = useLocalStorage<string | null>(CURRENT_SLOT_KEY, null);

  function selectSlot(id: string) {
    setCurrentSlot(id);
    navigate("/play");
  }

  function newGame() {
    const name = window.prompt("Name for new game", `Slot ${slots.length + 1}`);
    if (!name) return;
    const id = crypto.randomUUID();
    const newSlots = [...slots, { id, name }];
    setSlots(newSlots);
    setCurrentSlot(id);
    navigate("/play");
  }

  function deleteSlot(id: string) {
    const remaining = slots.filter(s => s.id !== id);
    setSlots(remaining);
    localStorage.removeItem(`${id}-${ANSWERS_KEY}`);
    if (currentSlot === id) {
      setCurrentSlot(null);
    }
  }

  return (
    <main className="min-h-screen container max-w-md py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Select Save Slot</h1>
      </header>
      <ul className="space-y-2">
        {slots.map(s => (
          <li key={s.id} className="flex items-center justify-between border border-border rounded-md p-3">
            <button onClick={() => selectSlot(s.id)} className="text-left flex-1">
              {s.name}
            </button>
            <button onClick={() => deleteSlot(s.id)} className="text-xs text-destructive ml-2">
              Delete
            </button>
          </li>
        ))}
        {slots.length === 0 && (
          <li className="text-muted-foreground">No save slots.</li>
        )}
      </ul>
      <button
        onClick={newGame}
        className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors font-medium"
      >
        New Game
      </button>
    </main>
  );
};

export default SaveSlots;

