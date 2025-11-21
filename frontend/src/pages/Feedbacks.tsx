import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Feedback } from "@/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star, MessageCircle } from "lucide-react";

interface customFeedback extends Feedback {
  donation_title: string;
  recipient_email: string;
}

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<customFeedback[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/feedbacks/all/${user.user_id}`);
      setFeedbacks(response.data);
    } catch (error) {
      toast.error("Failed to load feedbacks");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Feedbacks</h1>
            <p className="text-muted-foreground">
              Reviews received from recipients
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading feedbacks...
            </div>
          ) : !feedbacks || feedbacks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No feedbacks yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbacks?.map((feedback) => (
                <Card key={feedback.feedback_id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {feedback.donation_title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          By: {feedback.recipient_email}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(feedback.rating || 0)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-foreground">{feedback.comments}</p>
                    {/* {feedback.created_at && (
                      <p className="text-xs text-muted-foreground">
                        {feedback.created_at}
                      </p>
                    )} */}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Feedbacks;
