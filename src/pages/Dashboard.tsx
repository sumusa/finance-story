import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/hooks/useNavigation";
import EmotionTimeline from "@/components/visualizations/EmotionTimeline";
import { PlusCircle } from "lucide-react";
import type { EmotionEntry, Transaction, Category } from "@/types/common";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TransactionWithCategory extends Transaction {
  categories: Category;
}

interface DashboardStats {
  totalSavings: number;
  totalStories: number;
  activeGoals: number;
  recentTransactions: TransactionWithCategory[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigation = useAppNavigation();
  const [stats, setStats] = useState<DashboardStats>({
    totalSavings: 0,
    totalStories: 0,
    activeGoals: 0,
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch total savings (sum of saving type transactions)
        const { data: savingsData } = await supabase
          .from("transactions")
          .select("amount")
          .eq("user_id", user.id)
          .eq("type", "expense");

        const totalSavings =
          savingsData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        // Fetch total stories count
        const { count: storiesCount } = await supabase
          .from("stories")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Fetch active goals count
        const { count: goalsCount } = await supabase
          .from("financial_goals")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "in_progress");

        // Fetch recent transactions
        const { data: recentTx } = await supabase
          .from("transactions")
          .select(
            `
            *,
            categories (name, emoji)
          `
          )
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(5);

        // Fetch emotion data for timeline
        const { data: emotionData } = await supabase
          .from("stories")
          .select("content, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setStats({
          totalSavings,
          totalStories: storiesCount || 0,
          activeGoals: goalsCount || 0,
          recentTransactions: recentTx || [],
        });

        if (emotionData) {
          setEmotionEntries(
            emotionData.map((story) => ({
              date: story.created_at,
              emotion: story.content.emotion,
              amount: story.content.amount,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Button onClick={() => navigation.goToStoryCreator()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Story
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-accent text-accent-foreground p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Total Savings
          </h3>
          <p className="text-3xl font-bold mt-2">
            ${stats.totalSavings.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-secondary text-secondary-foreground p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Stories Created
          </h3>
          <p className="text-3xl font-bold mt-2">{stats.totalStories}</p>
        </div>

        <div className="rounded-lg bg-primary text-primary-foreground p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Active Goals
          </h3>
          <p className="text-3xl font-bold mt-2">{stats.activeGoals}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Emotion Timeline */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Emotional Journey</h2>
          <EmotionTimeline entries={emotionEntries} />
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-primary/10 p-2 rounded-full">
                    {tx.categories?.emoji}
                  </span>
                  <div>
                    <p className="font-medium">{tx.categories?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "font-medium",
                    tx.type === "income" ? "text-green-500" : "text-destructive"
                  )}
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
