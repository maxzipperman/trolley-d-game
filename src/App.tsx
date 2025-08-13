import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AvatarSelect from "./pages/AvatarSelect";
import Play from "./pages/Play";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import History from "./pages/History";

import NotFound from "./pages/NotFound";
import SettingsDialog from "@/components/SettingsDialog";
import { Layout } from "@/components/Layout";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Treat the hook as returning a boolean (not a tuple)
  const reducedMotionFromHook = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState<boolean>(!!reducedMotionFromHook);

  // Sync local state when hook value changes
  useEffect(() => {
    setReducedMotion(!!reducedMotionFromHook);
  }, [reducedMotionFromHook]);

  // Provide a setter compatible with SettingsDialog that also keeps DOM/localStorage in sync
  const handleSetReducedMotion = (val: boolean) => {
    setReducedMotion(val);
    const rootEl = document.documentElement;
    if (val) {
      rootEl.classList.add("reduced-motion");
    } else {
      rootEl.classList.remove("reduced-motion");
    }
    localStorage.setItem("trolleyd-reduced-motion", String(val));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SettingsDialog
            reducedMotion={reducedMotion}
            setReducedMotion={handleSetReducedMotion}
          />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/avatars" element={<AvatarSelect />} />
              <Route path="/play" element={<Play />} />
              <Route path="/results" element={<Results />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
