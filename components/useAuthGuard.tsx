'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/providers/datastore';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  exp: number;
  [key: string]: unknown;
};

export default function useAuthGuard({ requireAuth = true }: { requireAuth?: boolean } = {}) {
  const { user, logout } = useStore();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isHydrated = useStore((state) => state.isHydrated);
  const router = useRouter();

  // Ref pour stocker le timer d'inactivité
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    // Vérifier si le token est expiré
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          logout();
          router.push('/auth/login');
          return;
        }

        // Déconnexion automatique à l'expiration du token
        const timeout = setTimeout(() => {
          logout();
          router.push('/auth/login');
        }, (decoded.exp - now) * 1000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Token invalide', error);
        logout();
        router.push('/auth/login');
        return;
      }
    }

    // Vérifier si l'utilisateur est requis ou non
    if (requireAuth && !user) {
      router.push('/auth/login');
    } else if (!requireAuth && user) {
      router.push('/dashboard');
    }
  }, [user, token, requireAuth, router, isHydrated, logout]);

  // 🔥 Gestion de l'inactivité
  useEffect(() => {
    if (!user) return; // pas besoin si pas connecté

    const resetInactivityTimer = () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);

      inactivityTimeout.current = setTimeout(() => {
        logout();
        router.push('/auth/login');
      }, 1 * 60 * 1000); // 10 minutes
    };

    // Réinitialiser à chaque interaction
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    // Démarrer le timer au montage
    resetInactivityTimer();

    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [user, logout, router]);
}
