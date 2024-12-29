import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Story {
  id: string;
  title: string;
  content: {
    description: string;
    amount: number;
    type: string;
    date: string;
  };
  type: string;
  visibility: string;
  created_at: string;
}

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setStory(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!story) return <div>Story not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/stories")}
      >
        <ArrowLeft className="mr-2" />
        Back to Stories
      </Button>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{story.title}</h1>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(story.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {story.content.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>

        <div className="prose dark:prose-invert">
          <p>{story.content.description}</p>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
            {story.type.replace("_", " ")}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary/10 text-secondary-foreground">
            {story.content.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
