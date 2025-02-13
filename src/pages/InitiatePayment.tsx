
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  freelancer_id: z.string().uuid("Invalid freelancer ID"),
  description: z.string().min(1, "Description is required"),
  payment_type: z.enum(['full', 'milestone']),
});

type PaymentFormType = z.infer<typeof formSchema>;

export default function InitiatePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PaymentFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_type: 'full',
      description: '',
    },
  });

  const onSubmit = async (data: PaymentFormType) => {
    try {
      setIsLoading(true);
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        throw new Error('You must be logged in to initiate a payment');
      }

      // Create the payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          amount: parseFloat(data.amount),
          freelancer_id: data.freelancer_id,
          description: data.description,
          type: data.payment_type,
          client_id: user.data.user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create the payment transaction
      const platformFee = parseFloat(data.amount) * 0.10; // 10% platform fee
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          payment_id: payment.id,
          amount: parseFloat(data.amount),
          sender_id: user.data.user.id,
          receiver_id: data.freelancer_id,
          platform_fee: platformFee,
          status: 'pending'
        });

      if (transactionError) throw transactionError;

      toast({
        title: 'Payment initiated',
        description: 'Your payment has been initiated successfully.',
      });

      navigate('/professional-network/secure-payments');
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Initiate Payment">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Initiate Payment</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the payment amount in USD
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freelancer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelancer</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Freelancer ID" />
                    </FormControl>
                    <FormDescription>
                      Enter the ID of the freelancer you want to pay
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Full Payment</SelectItem>
                        <SelectItem value="milestone">Milestone-based</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how you want to structure the payment
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Payment description" />
                    </FormControl>
                    <FormDescription>
                      Provide a description for this payment
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating Payment...
                  </>
                ) : (
                  'Initiate Payment'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
