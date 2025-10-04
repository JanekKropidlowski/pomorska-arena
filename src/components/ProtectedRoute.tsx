import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

type Props = {
  children: ReactNode;
  allow?: Array<"admin" | "office" | "judge">; // optional role restriction
};

export default function ProtectedRoute({ children, allow }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/logowanie" replace />;
  if (allow && allow.length > 0) {
    const role = (user.role ?? "").toLowerCase();
    // Admin ma dostęp do wszystkich paneli
    if (role !== "admin" && !allow.includes(role as any)) {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
}


