import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Heart, Users, TrendingDown, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-food-sharing.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-background opacity-60" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Share Food.<br />
                <span className="text-primary">Save the Planet.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Connect surplus food with people who need it. Reduce waste, fight hunger, 
                and build a sustainable community—one meal at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Sharing Food
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Find Food Near You
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={heroImage} 
                alt="People sharing food" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our community in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary-light flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Donate Food</h3>
                <p className="text-sm text-muted-foreground">
                  Restaurants and individuals can list surplus food with pickup details
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary-light flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Browse & Request</h3>
                <p className="text-sm text-muted-foreground">
                  Recipients can find available food near them and request items
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-accent-light flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Reduce Waste</h3>
                <p className="text-sm text-muted-foreground">
                  Track your impact and see how much food waste you've prevented
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary-light flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Give Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Rate your experience and help build trust in our community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of donors and recipients building a more sustainable future
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Join FoodShare Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 FoodShare. Fighting food waste, one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
