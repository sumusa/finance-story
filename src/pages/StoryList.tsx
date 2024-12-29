import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useAppNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EMOTIONS } from "@/types/emotions";
import type { EmotionType } from "@/types/emotions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarIcon } from "@radix-ui/react-icons";

interface Story {
  id: string;
  title: string;
  content: {
    description: string;
    amount: number;
    type: string;
    emotion: string;
    date: string;
  };
  type: string;
  visibility: string;
  created_at: string;
}

const StoryCard = ({
  story,
  onClick,
}: {
  story: Story;
  onClick: () => void;
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="font-semibold text-lg text-foreground">
            {story.title}
          </h3>
          <span className="text-2xl">
            {EMOTIONS[story.content.emotion as EmotionType]?.icon}
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {story.content.description}
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            {new Date(story.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StoryList = () => {
  const { user } = useAuth();
  const navigation = useAppNavigation();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Current user:", user);

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        console.log("Stories data:", data);
        console.log("Error if any:", error);

        if (error) throw error;
        setStories(data || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user]);

  console.log("Component state:", { loading, stories, user });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Financial Stories</h1>
        <Button onClick={() => navigation.goToStoryCreator()}>
          <Plus className="mr-2" />
          New Story
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Your Money Story Awaits! 📚
          </h3>
          <p className="text-muted-foreground mb-4">
            Like an empty diary ready for adventures, your financial journey is
            about to begin! Time to write your first chapter - no plot twists
            about overdraft fees though, please!
          </p>
          <Button onClick={() => navigation.goToStoryCreator()}>
            Create Your First Story
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => navigation.goToStory(story.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryList;
