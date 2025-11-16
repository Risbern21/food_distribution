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
  onUpdate: () => void;
}

const CancelOrderModal = ({
  isOpen,
  onClose,
  distributionId,
  donationTitle,
  onUpdate
}: FeedbackModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/distributions/${distributionId}`);
      toast.success("Order cancellation requested successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to request order cancellation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel the order for {donationTitle}?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Cancelling..." : "Request Cancelation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
