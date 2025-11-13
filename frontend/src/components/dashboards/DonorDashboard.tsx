import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Clock } from 'lucide-react';
import { Donation } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import DonationForm from '@/components/forms/DonationForm';
import DonationCard from '@/components/cards/DonationCard';
import { useAuth } from '@/contexts/AuthContext';

const DonorDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const {user}=useAuth();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get(`/donations/my_donations/${user?.user_id}`);
      setDonations(response.data);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationCreated = () => {
    setShowForm(false);
    fetchDonations();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="text-muted-foreground">Manage your food donations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Donation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{donations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {donations.filter(d => new Date(d.expiry_time) > new Date()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {donations.reduce((sum, d) => sum + d.quantity, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation Form Modal */}
      {showForm && (
        <DonationForm 
          onClose={() => setShowForm(false)} 
          onSuccess={handleDonationCreated}
        />
      )}

      {/* Donations List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Your Donations</h2>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading donations...</div>
        ) : donations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No donations yet</p>
              <Button onClick={() => setShowForm(true)}>Create Your First Donation</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((donation) => (
              <DonationCard 
                key={donation.donation_id} 
                donation={donation}
                onUpdate={fetchDonations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
