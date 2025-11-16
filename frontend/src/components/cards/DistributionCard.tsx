import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatDistribution, User } from "@/lib/types";
import { Check, Clock, Package } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";
import { useState } from "react";
import FeedbackModal from "../modals/FeedbackModal";
import api from "@/lib/api";
import { toast } from "sonner";
import DeleteModal from "../modals/DeleteDonationModal";
import CancelOrderModal from "../modals/CancelOrderModal";

dayjs.extend(relativeTime);

interface DistributionCardProps {
  distribution: StatDistribution;
  onUpdate: () => void;
}

const DistributionCard = ({
  distribution,
  onUpdate,
}: DistributionCardProps) => {
  const user: User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const confirmPickup = async () => {
    try {
      await api.put(`/distributions/${distribution.distribution_id}`, {
        user_id: user?.user_id,
        delivery_status: "picked_up",
        delivered_at: new Date().toISOString(),
      });
      toast.success("Request sent successfully!");
      onUpdate();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to request donation"
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{distribution.title}</CardTitle>
          <div className="text-sm">
            {user?.user_type === "donor" ? `To :reci` : `From :donor`}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-1">
          {distribution.description}
        </p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 ">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {distribution.quantity} items
            </span>
          </div>
          <div>
            {!distribution.pickup_confirmed ? (
              user?.user_type === "donor" ? (
                <Button onClick={() => confirmPickup()}>Confirm Pickup</Button>
              ) : (
                <div className="flex gap-1 items-center text-foreground">
                  <span>Waiting for pickup</span>
                  <Clock />
                </div>
              )
            ) : (
              <div className="flex gap-1 items-center text-foreground">
                <span>Delivered</span>
                <Check className="border rounded-full bg-green-500" />
              </div>
            )}
          </div>
        </div>
        {user?.user_type === "recipient" ? distribution.pickup_confirmed ? (
          <Button onClick={() => setFeedbackModalOpen(true)}>
            Give Feedback
          </Button>
        ) : (
          <Button onClick={() => setShowCancelModal(true)}>
            Request Cancellation
          </Button>
        ):null}
      </CardContent>
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        distributionId={distribution.distribution_id}
        recipientId={user?.user_id}
        donorId={distribution.donor_id}
        donationTitle={distribution.title}
      />
      <CancelOrderModal
        distributionId={distribution.distribution_id}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        donationTitle={distribution.title}
        onUpdate={onUpdate}
      />
    </Card>
  );
};

export default DistributionCard;
