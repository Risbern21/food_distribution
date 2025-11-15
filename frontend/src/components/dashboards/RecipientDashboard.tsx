import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Clock } from 'lucide-react';
import { Donation } from '@/lib/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import AvailableDonationCard from '@/components/cards/AvailableDonationCard';

const RecipientDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const fetchAvailableDonations = async () => {
    try {
      const response = await api.get('/donations/all/available');
      setDonations(response.data);
    } catch (error) {
      toast.error('Failed to load available donations');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation =>
    donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDonations = donations.filter(d => new Date(d.expiry_time) > new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Recipient Dashboard</h1>
        <p className="text-muted-foreground">Find and request available food</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Donations</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeDonations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {activeDonations.filter(d => {
                const hoursUntilExpiry = (new Date(d.expiry_time).getTime() - Date.now()) / (1000 * 60 * 60);
                return hoursUntilExpiry < 24;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available Donations */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Available Food</h2>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading available food...</div>
        ) : filteredDonations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No food available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonations.map((donation) => (
              <AvailableDonationCard 
                key={donation.donation_id} 
                donation={donation}
                onRequest={fetchAvailableDonations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientDashboard;
