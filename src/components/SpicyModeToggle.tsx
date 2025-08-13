import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SpicyModeToggle() {
  const [spicyMode, setSpicyMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('spicyMode') === 'true';
    setSpicyMode(saved);
  }, []);

  const handleToggle = (checked: boolean) => {
    setSpicyMode(checked);
    localStorage.setItem('spicyMode', checked.toString());
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="spicy-mode"
        checked={spicyMode}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="spicy-mode" className="text-sm">
        Spicy Mode {spicyMode && "🌶️"}
      </Label>
      {spicyMode && (
        <span className="text-xs text-muted-foreground">
          More controversial content
        </span>
      )}
    </div>
  );
}