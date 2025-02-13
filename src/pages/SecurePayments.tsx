
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings, Plus } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

interface Payment {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'milestone' | 'full';
  description: string;
  created_at: string;
}

export default function SecurePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Secure Payments">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Secure Payments</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/professional-network/payment-settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => navigate('/professional-network/initiate-payment')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Initiate Payment
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500 mb-4">No payments found</p>
              <Button onClick={() => navigate('/professional-network/initiate-payment')}>
                Initiate Your First Payment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      ${payment.amount.toFixed(2)}
                    </CardTitle>
                    <Badge className={getStatusBadgeColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{payment.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{payment.type}</Badge>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/professional-network/payments/${payment.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
