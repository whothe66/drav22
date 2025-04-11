
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const AuthCallback = () => {
  const { isLoading } = useAuth();

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-center text-lg">Completing authentication...</p>
              <p className="text-center text-sm text-muted-foreground">
                You'll be redirected shortly. Please do not close this window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthCallback;
