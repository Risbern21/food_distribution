import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import DonorDashboard from '@/components/dashboards/DonorDashboard';
import RecipientDashboard from '@/components/dashboards/RecipientDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {user?.user_type === 'donor' && <DonorDashboard />}
        {user?.user_type === 'recipient' && <RecipientDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
