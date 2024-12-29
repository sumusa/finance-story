import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const DEMO_EMAIL = "demo@financestory.app";
const DEMO_PASSWORD = "demo123456";

const DemoLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleDemoLogin}
      disabled={loading}
    >
      {loading ? "Loading demo..." : "Try Demo Account"}
    </Button>
  );
};

export default DemoLogin;
