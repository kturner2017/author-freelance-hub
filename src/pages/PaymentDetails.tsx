
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

interface PaymentMilestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  due_date: string;
  completed_at: string | null;
}

interface Payment {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'milestone' | 'full';
  description: string;
  created_at: string;
  milestones?: PaymentMilestone[];
}

export default function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPaymentDetails();
    }
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (paymentError) throw paymentError;

      if (paymentData.type === 'milestone') {
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('payment_milestones')
          .select('*')
          .eq('payment_id', id)
          .order('due_date', { ascending: true });

        if (milestonesError) throw milestonesError;

        setPayment({ ...paymentData, milestones: milestonesData });
      } else {
        setPayment(paymentData);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
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

  if (isLoading) {
    return (
      <Layout title="Payment Details">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!payment) {
    return (
      <Layout title="Payment Not Found">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500 mb-4">Payment not found</p>
              <Button onClick={() => navigate('/professional-network/payments')}>
                Back to Payments
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Payment Details">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/professional-network/payments')}
          className="mb-6"
        >
          Back to Payments
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  ${payment.amount.toFixed(2)}
                </CardTitle>
                <CardDescription>
                  Created on {new Date(payment.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={getStatusBadgeColor(payment.status)}>
                {payment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{payment.description}</p>
            <Badge variant="outline">{payment.type}</Badge>
          </CardContent>
        </Card>

        {payment.type === 'milestone' && payment.milestones && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            {payment.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{milestone.title}</CardTitle>
                      <CardDescription>
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{milestone.description}</p>
                  <p className="font-semibold">
                    Amount: ${milestone.amount.toFixed(2)}
                  </p>
                  {milestone.completed_at && (
                    <p className="text-sm text-gray-500 mt-2">
                      Completed: {new Date(milestone.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
