import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/lib/types";
import { Clock, Package, MapPin } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

dayjs.extend(relativeTime);

interface AvailableDonationCardProps {
  donation: Donation;
  onRequest: () => void;
  onSuccess: () => void;
}

const AvailableDonationCard = ({
  donation,
  onRequest,
  onSuccess
}: AvailableDonationCardProps) => {
  const expiresIn = dayjs(donation.expiry_time).fromNow();
  const hoursUntilExpiry =
    (new Date(donation.expiry_time).getTime() - Date.now()) / (1000 * 60 * 60);
  const isExpiringSoon = hoursUntilExpiry < 24;
  const { user } = useAuth();
  const [Data] = useState({
    donation_id: donation.donation_id,
    recipient_id: user?.user_id || ""
  });

  const handleRequest = async () => {
    try {
      await api.post("/distributions", Data);
      toast.success("Request sent successfully!");
      onRequest();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to request donation"
      );
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{donation.title}</CardTitle>
          {isExpiringSoon && (
            <Badge className="bg-accent text-accent-foreground">
              Expiring Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{donation.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {donation.quantity} items available
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span
              className={
                isExpiringSoon ? "text-accent font-medium" : "text-foreground"
              }
            >
              Expires {expiresIn}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              Pickup: {dayjs(donation.pickup_time).format("MMM D, h:mm A")}
            </span>
          </div>
        </div>

        <Button onClick={handleRequest} className="w-full mt-auto">
          Request This Food
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvailableDonationCard;
