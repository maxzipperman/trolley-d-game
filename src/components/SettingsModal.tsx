import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon } from "lucide-react";
import type { Settings } from "@/types";
import React from "react";

interface SettingsModalProps {
  settings: Settings;
  onChange: (value: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onChange }) => {
  const toggle = (key: keyof Settings) => (checked: boolean) => {
    onChange({ ...settings, [key]: checked });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound</Label>
            <Switch id="sound" checked={settings.sound} onCheckedChange={toggle("sound")} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="haptics">Haptics</Label>
            <Switch id="haptics" checked={settings.haptics} onCheckedChange={toggle("haptics")} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="animations">Animations</Label>
            <Switch id="animations" checked={settings.animations} onCheckedChange={toggle("animations")} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
