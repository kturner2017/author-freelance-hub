
import { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  default_payment_type: z.enum(['full', 'milestone']),
  auto_release_payments: z.boolean(),
  notification_preferences: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
});

type PaymentSettingsType = z.infer<typeof formSchema>;

export default function PaymentSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<PaymentSettingsType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      default_payment_type: 'full',
      auto_release_payments: false,
      notification_preferences: {
        email: true,
        push: true,
      },
    },
  });

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('payment_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (settings) {
        // Parse the notification_preferences JSON if it exists
        const notificationPreferences = settings.notification_preferences as { email: boolean; push: boolean } || {
          email: true,
          push: true,
        };

        form.reset({
          default_payment_type: settings.default_payment_type || 'full',
          auto_release_payments: settings.auto_release_payments || false,
          notification_preferences: notificationPreferences,
        });
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PaymentSettingsType) => {
    try {
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...data,
        });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your payment settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout title="Payment Settings">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Payment Settings">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Payment Settings</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="default_payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Payment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                      Choose your preferred payment method for new transactions
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auto_release_payments"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Automatic Payment Release
                      </FormLabel>
                      <FormDescription>
                        Automatically release payments when milestones are marked as completed
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notification_preferences.email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive payment updates via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notification_preferences.push"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Push Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive push notifications for payment updates
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
