// components/auth/ProtectedRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
