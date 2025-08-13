import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Settings = () => {
  useEffect(() => { document.title = "Trolley'd · Settings"; }, []);
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useLocalStorage<boolean>("trolleyd-high-contrast", false);
  const [reducedMotion, setReducedMotion] = useLocalStorage<boolean>(
    "trolleyd-reduced-motion",
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion]);

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="text-sm font-medium">
            High Contrast
          </label>
          <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="text-sm font-medium">
            Reduced Motion
          </label>
          <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
      >
        Back
      </button>
    </main>
  );
};

export default Settings;
