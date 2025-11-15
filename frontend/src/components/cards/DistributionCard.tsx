import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatDistribution, User } from "@/lib/types";
import { Package } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import FeedbackModal from "../modals/FeedbackModal";
import api from "@/lib/api";

dayjs.extend(relativeTime);

interface DistributionCardProps {
  distribution: StatDistribution;
  onUpdate: () => void;
}

const DistributionCard = ({ distribution }: DistributionCardProps) => {
  const user:User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{distribution.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {distribution.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{distribution.quantity} items</span>
        </div>
        {user?.user_type === "recipient" && (
          <Button onClick={() => setFeedbackModalOpen(true)}>
            Give Feedback
          </Button>
        )}
      </CardContent>
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        distributionId={distribution.distribution_id}
        userId={user?.user_id}
        donationTitle={distribution.title}
      />
    </Card>
  );
};

export default DistributionCard;
