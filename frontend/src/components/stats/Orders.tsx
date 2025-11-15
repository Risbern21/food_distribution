import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatDistribution } from "@/lib/types";
import api from "@/lib/api";
import toast from "react-hot-toast";
import DistributionCard from "@/components/cards/DistributionCard";
import { useAuth } from "@/contexts/AuthContext";

const Orders = () => {
  const [distributions, setDistributions] = useState<StatDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await api.get(
        `/distributions/all_received/${user?.user_id}`
      );
      setDistributions(response.data);
    } catch (error) {
      toast.error("Failed to load donations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Orders</h1>
          <p className="text-muted-foreground">View your food orders</p>
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Your Donations
        </h2>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading donations...
          </div>
        ) : distributions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No distributions received yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distributions.map((distribution) => (
              <DistributionCard
                key={distribution.donation_id}
                distribution={distribution}
                onUpdate={fetchMyOrders}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
