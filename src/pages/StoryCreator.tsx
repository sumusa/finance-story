import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import EmotionPicker from "@/components/stories/EmotionPicker";
import MoneyAnimation from "@/components/animations/MoneyAnimation";
import { EmotionType } from "@/types/emotions";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoryForm {
  title: string;
  content: {
    description: string;
    amount: number;
    type: "income" | "expense" | "saving";
    date: string;
    emotion: EmotionType | undefined;
  };
  type: "goal_achieved" | "milestone" | "savings_streak" | "custom";
  visibility: "private" | "public";
}

const StoryCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<StoryForm>({
    title: "",
    content: {
      description: "",
      amount: 0,
      type: "saving",
      date: new Date().toISOString().split("T")[0],
      emotion: undefined,
    },
    type: "custom",
    visibility: "private",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("stories").insert([
        {
          user_id: user.id,
          title: form.title,
          content: form.content,
          type: form.type,
          visibility: form.visibility,
        },
      ]);

      if (error) throw error;
      setCelebrating(true);
      setTimeout(() => {
        navigate("/stories");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSelect = (emotion: EmotionType) => {
    setForm({
      ...form,
      content: { ...form.content, emotion },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        Create Your Financial Story
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Story Title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter your story title"
              className="text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={form.content.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, description: e.target.value },
                })
              }
              placeholder="Tell us about your financial journey..."
              className="min-h-[100px] text-foreground"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={form.content.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: {
                      ...form.content,
                      amount: Number(e.target.value),
                    },
                  })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={form.content.type}
                onValueChange={(value: "income" | "expense" | "saving") =>
                  setForm({
                    ...form,
                    content: { ...form.content, type: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="saving">Saving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="story-type">
                Story Type
              </label>
              <select
                id="story-type"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as StoryForm["type"],
                  })
                }
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="custom">Custom</option>
                <option value="goal_achieved">Goal Achieved</option>
                <option value="milestone">Milestone</option>
                <option value="savings_streak">Savings Streak</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="visibility">
                Visibility
              </label>
              <select
                id="visibility"
                value={form.visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visibility: e.target.value as "private" | "public",
                  })
                }
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium block">
              How do you feel about this?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <EmotionPicker
                selected={form.content.emotion}
                onSelect={handleEmotionSelect}
              />
            </div>
          </div>

          {/* Preview Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-lg font-semibold">Preview</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </CardHeader>
            <CardContent>
              {showPreview && form.content.emotion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <MoneyAnimation
                    amount={form.content.amount}
                    type={form.content.type}
                    emotion={form.content.emotion}
                  />
                  <div className="prose dark:prose-invert max-w-none">
                    <h2>{form.title}</h2>
                    <p>{form.content.description}</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/stories")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Story"}
            </Button>
          </div>
        </div>
      </form>

      {celebrating && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-background/80"
        >
          <div className="text-4xl">🎉 Story Created! 🎉</div>
        </motion.div>
      )}
    </div>
  );
};

export default StoryCreator;
