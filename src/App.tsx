import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PublicView from "./pages/PublicView";
import TeamPanel from "./pages/TeamPanel";
import TeamRegistration from "./pages/TeamRegistration";
import JudgePanel from "./pages/JudgePanel";
import OfficePanel from "./pages/OfficePanel";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/logowanie" element={<Login />} />
            <Route path="/wydarzenie/:eventId" element={<EventDetails />} />
            <Route path="/rejestracja" element={<TeamRegistration />} />
            <Route path="/rejestracja/:eventId" element={<TeamRegistration />} />
            <Route path="/druzyna/:teamId" element={<TeamPanel />} />
            <Route path="/druzyna" element={<TeamPanel />} />
            <Route path="/publiczne-wyniki" element={<PublicView />} />
            <Route path="/sedzia" element={<ProtectedRoute allow={["judge"]}><JudgePanel /></ProtectedRoute>} />
            <Route path="/biuro" element={<ProtectedRoute allow={["office"]}><OfficePanel /></ProtectedRoute>} />
            <Route path="/administrator" element={<ProtectedRoute allow={["admin"]}><AdminPanel /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
