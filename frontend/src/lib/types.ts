export type UserType = "donor" | "recipient" | "admin";

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  user_type: UserType;
}

export interface Donation {
  donation_id: string;
  donor_id: string;
  title: string;
  description: string;
  quantity: number;
  is_available: boolean;
  pickup_time: string;
  expiry_time: string;
}

export type DeliveryStatus = "pending" | "allocated" | "delivered";

export interface Distribution {
  distribution_id: string;
  donation_id: string;
  recipient_id: string;
  delivery_status: DeliveryStatus;
  delivered_at?: string;
  pickup_confirmed: boolean;
}

export interface Feedback {
  feedback_id: string;
  distribution_id: string;
  user_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StatDistribution {
  distribution_id: string;
  donation_id: string;
  donor_id: string;
  recipient_id: string;
  delivery_status: DeliveryStatus;
  delivered_at?: string;
  pickup_confirmed: boolean;
  title: string;
  description: string;
  quantity: number;
}
