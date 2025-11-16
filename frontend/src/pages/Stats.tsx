import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Donations from "@/components/stats/Donations";
import Orders from "@/components/stats/Orders";

const Stats = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {user?.user_type === "donor" && <Donations />}
        {user?.user_type === "recipient" && <Orders />}
      </div>
    </div>
  );
};

export default Stats;
