import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { setupDatabase, createSampleData } from '@/lib/database-setup';
import { Database, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

export default function DatabaseSetupPage() {
  const [setupStatus, setSetupStatus] = useState<'checking' | 'needed' | 'ready'>('checking');
  const [sqlCommands, setSqlCommands] = useState<string>('');
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    const result = await setupDatabase();
    
    if (result.success) {
      setSetupStatus('ready');
      // Try to create sample data if tables exist
      await createSampleData();
    } else {
      setSetupStatus('needed');
      if (result.sqlCommands) {
        setSqlCommands(result.sqlCommands);
      }
    }
  };

  const copyToClipboard = async () => {
    if (sqlCommands) {
      setCopying(true);
      try {
        await navigator.clipboard.writeText(sqlCommands);
        toast({
          title: "Copied to clipboard",
          description: "SQL commands copied successfully",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Please copy the SQL commands manually",
          variant: "destructive",
        });
      } finally {
        setCopying(false);
      }
    }
  };

  const recheckDatabase = async () => {
    setSetupStatus('checking');
    await checkDatabaseStatus();
  };

  if (setupStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking database status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupStatus === 'ready') {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                Database Setup Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your database is properly configured with promotional banners and coupon systems.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-semibold">Features Available:</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Promotional Banner System
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Coupon Management System
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Discount Calculation at Checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Admin Management Panels
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/'} className="flex-1">
                  View Website
                </Button>
                <Button onClick={() => window.location.href = '/admin/dashboard'} variant="outline" className="flex-1">
                  Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Database Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The promotional banner and coupon features require database tables to be created in your Supabase dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Copy the SQL commands below</li>
                <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a></li>
                <li>Navigate to SQL Editor in your project</li>
                <li>Paste and run the SQL commands</li>
                <li>Return here and click "Check Database" to verify setup</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">SQL Commands:</h4>
                <Button
                  onClick={copyToClipboard}
                  disabled={copying}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copying ? 'Copying...' : 'Copy SQL'}
                </Button>
              </div>
              
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-sm whitespace-pre-wrap">{sqlCommands}</pre>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={recheckDatabase} className="flex-1">
                <Database className="w-4 h-4 mr-2" />
                Check Database
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline" className="flex-1">
                Skip for Now
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> The website will work without these features, but promotional banners and coupon functionality will not be available until the database is set up.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}