import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Utensils, User } from "lucide-react";
import { useState } from "react";
import AccountSettingsModal from "./modals/AccountSettingsModal";

export const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <AccountSettingsModal
        isOpen={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
      />
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="text-foreground">FoodShare</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/stats">
                <Button variant="ghost">
                  {user?.user_type === "donor" ? "My Donations" : "My Orders"}
                </Button>
              </Link>
              {user?.user_type === "donor" && (
                <Link to="/feedbacks">
                  <Button variant="ghost">Your Feedbacks</Button>
                </Link>
              )}
              <span
                className="text-sm text-muted-foreground flex flex-row items-center gap-1 cursor-pointer"
                onClick={() => setAccountSettingsOpen(true)}
              >
                <span className="border-2 border-green-400 rounded-full p-2">
                  <User />
                </span>
                <span>{user?.username}</span>
              </span>
            </>
          ) : (
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
