import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { FinancialGoal } from "@/types/common";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from("financial_goals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setGoals(data || []);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <Button>
          <Plus className="mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No goals set</h3>
          <p className="text-muted-foreground mb-4">
            Set your first financial goal to start tracking your progress.
          </p>
          <Button>Create Your First Goal</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">{goal.title}</h3>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    ${goal.current_amount} / ${goal.target_amount}
                  </span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-secondary/30">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        (goal.current_amount / goal.target_amount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
