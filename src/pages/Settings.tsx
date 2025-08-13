import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SpicyModeToggle } from "@/components/SpicyModeToggle";
import { Card } from "@/components/ui/card";

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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Trolley'd experience
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Content Preferences</h3>
            <SpicyModeToggle />
            <p className="text-sm text-muted-foreground mt-2">
              Enable spicy mode for more controversial and edgy scenarios. 
              Generated content will be more provocative and thought-provoking.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Accessibility</h3>
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
        </div>
      </Card>

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
