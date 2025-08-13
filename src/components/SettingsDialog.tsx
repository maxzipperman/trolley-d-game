import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface SettingsDialogProps {
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
}

const SettingsDialog = ({ reducedMotion, setReducedMotion }: SettingsDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="fixed bottom-4 right-4 rounded-md border border-border bg-card px-4 py-2 text-sm shadow-sm">
        Settings
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <div className="flex items-center justify-between py-4">
        <span className="text-sm">Reduce Motion</span>
        <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
      </div>
    </DialogContent>
  </Dialog>
);

export default SettingsDialog;
