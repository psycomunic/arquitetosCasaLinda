import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setAuthenticated(!!session);
        } catch (error) {
            console.error('Auth check error:', error);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
