import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  distributionId: string;
  donationTitle: string;
  recipientId: string;
  donorId: string;
  // onSuccess?: () => void;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  distributionId,
  donationTitle,
  recipientId,
  donorId,
  // onSuccess,
}: FeedbackModalProps) => {
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comments.trim()) {
      toast.error("Please provide comments");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/feedbacks`, {
        distribution_id: distributionId,
        recipient_id: recipientId,
        donor_id: donorId,
        rating: rating,
        comments: comments,
        createdAt: new Date().toISOString(),
      });
      toast.success("Feedback submitted successfully");
      setRating(5);
      setComments("");
      onClose();
      // onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback for {donationTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              placeholder="Share your feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
