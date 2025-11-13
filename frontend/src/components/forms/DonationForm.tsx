import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DonationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DonationForm = ({ onClose, onSuccess }: DonationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    donor_id: "",
    quantity: 1,
    pickup_time: "",
    expiry_time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    formData.donor_id = user?.user_id;
    formData.pickup_time = formData.pickup_time + ":00Z";
    formData.expiry_time = formData.expiry_time + ":00Z";

    try {
      console.log(formData);
      await api.post("/donations", formData);
      toast.success("Donation created successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create donation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create New Donation</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Fresh vegetables"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the food items..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                type="datetime-local"
                value={formData.pickup_time}
                onChange={(e) =>
                  setFormData({ ...formData, pickup_time: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_time">Expiry Time</Label>
              <Input
                id="expiry_time"
                type="datetime-local"
                value={formData.expiry_time}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_time: e.target.value })
                }
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Donation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationForm;
