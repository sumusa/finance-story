// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import StoryList from "./pages/StoryList";
import StoryCreator from "./pages/StoryCreator";
import StoryView from "./pages/StoryView";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Types
type User = {
  id: string;
  email?: string;
} | null;

const App = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stories" element={<StoryList />} />
            <Route path="/stories/new" element={<StoryCreator />} />
            <Route path="/stories/:id" element={<StoryView />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

// Protected Route Component
const ProtectedRoute = ({ user }: { user: User }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default App;
