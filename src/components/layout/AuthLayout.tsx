import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">FinanceStory</h1>
          <p className="text-muted-foreground mt-2">
            Turn your finances into a story worth telling
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-lg p-6 border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
