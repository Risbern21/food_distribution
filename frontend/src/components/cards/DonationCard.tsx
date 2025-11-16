import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/lib/types";
import { Clock, Package } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import DeleteDonationModal from "../modals/DeleteDonationModal";
import { Button } from "../ui/button";

dayjs.extend(relativeTime);

interface DonationCardProps {
  donation: Donation;
  onUpdate: () => void;
}

const DonationCard = ({ donation, onUpdate }: DonationCardProps) => {
  const isExpired = new Date(donation.expiry_time) < new Date();
  const expiresIn = dayjs(donation.expiry_time).fromNow();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <Card className={!donation.is_available ? "opacity-60" : "shadow-xl"}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{donation.title}</CardTitle>
          {donation.is_available ? (
            <Badge className="bg-primary text-primary-foreground">Active</Badge>
          ) : (
            <Badge variant="secondary">Alloted</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {donation.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{donation.quantity} items</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={isExpired ? "text-destructive" : "text-foreground"}>
            Expires {expiresIn}
          </span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center justify-between">
          <span>
            Pickup By: {dayjs(donation.pickup_time).format("MMM D, h:mm A")}
          </span>
          {donation.is_available && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Remove Donation
            </Button>
          )}
        </div>
      </CardContent>
      {showDeleteModal && donation.is_available && (
        <DeleteDonationModal
          donationId={donation.donation_id}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={onUpdate}
        />
      )}
    </Card>
  );
};

export default DonationCard;
