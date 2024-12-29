// src/hooks/useNavigation.ts
import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToDashboard: () => navigate("/dashboard"),
    goToStories: () => navigate("/stories"),
    goToStoryCreator: () => navigate("/stories/new"),
    goToStory: (id: string) => navigate(`/stories/${id}`),
    goToGoals: () => navigate("/goals"),
    goToProfile: () => navigate("/profile"),
    goBack: () => navigate(-1),
  };
};
