/**
 * OXBride Atelier — Store Compte Client (Client Context).
 *
 * Parcours complet :
 *   - Création de compte (register) — tente Shopify `customerCreate`, sinon local.
 *   - Connexion (login) — tente Shopify `customerAccessTokenCreate`, sinon local.
 *     Création locale si le compte de démonstration n'existe pas encore.
 *   - Consultation / modification du profil (updateProfile) — tente Shopify
 *     `customerUpdate` si un `accessToken` Shopify est disponible, sinon local.
 *   - Déconnexion (logout) — tente Shopify `customerAccessTokenDelete`, sinon local.
 *   - Suppression du compte (deleteAccount) — tente Shopify `customerDelete`,
 *     sinon suppression locale. Confirmation requise côté UI.
 *
 * Persistance :
 *   - `oxb-account-v1`      : profil local (prénom, nom, courriel, téléphone, ville…).
 *   - `oxb-account-auth-v1` : session locale (accessToken Shopify si dispo,
 *     sinon token local de démonstration, email, mode).
 *
 * Stratégie de repli (portfolio) :
 *   Si la boutique Shopify est en mode démo / protégée / si le scope client
 *   n'est pas autorisé, l'API retourne `mode: 'local'` et le provider continue
 *   de fonctionner intégralement en local sans planter l'interface.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const PROFILE_KEY = 'oxb-account-v1';
const AUTH_KEY = 'oxb-account-auth-v1';

/** Mode de fonctionnement du compte : connecté à Shopify ou local (portfolio). */
export type AccountMode = 'shopify' | 'local';

/** Session persistante : token + email + mode. */
export interface AccountSession {
  /** Token d'accès Shopify si disponible, sinon token local factice. */
  accessToken: string;
  /** Email du compte connecté. */
  email: string;
  /** Mode de la session. */
  mode: AccountMode;
}

export interface AccountProfile {
  /** Prénom. */
  prenom: string;
  /** Nom de famille. */
  nom: string;
  /** Courriel. */
  email: string;
  /** Téléphone. */
  telephone: string;
  /** Ville. */
  ville: string;
  /** Pays. */
  pays: string;
  /** Lieu d'essayage souhaité : PAR (Paris) | BEN (Abomey-Calavi) | '' (non défini). */
  lieuSouhaite: '' | 'PAR' | 'BEN';
  /** Type de prestation souhaitée. */
  prestationSouhaite: string;
  /** Notes personnelles / inspirations. */
  notes: string;
  /** Date de dernière mise à jour (ISO). */
  updatedAt: string;
}

const DEFAULT_PROFILE: AccountProfile = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  ville: '',
  pays: '',
  lieuSouhaite: '',
  prestationSouhaite: '',
  notes: '',
  updatedAt: '',
};

/** Résultat normalisé d'une opération de compte. */
export interface AccountResult {
  success: boolean;
  /** Message destiné à l'utilisateur (succès ou erreur). */
  message?: string;
  /** Mode réellement utilisé (Shopify si la mutation a abouti). */
  mode?: AccountMode;
}

export interface RegisterInput {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface AccountContextValue {
  profile: AccountProfile;
  session: AccountSession | null;
  isHydrated: boolean;
  isLoggedIn: boolean;
  isComplete: boolean;
  /** Crée un compte (Shopify si possible, sinon local). */
  register: (input: RegisterInput) => Promise<AccountResult>;
  /** Connecte l'utilisateur (Shopify si possible, sinon local). */
  login: (input: LoginInput) => Promise<AccountResult>;
  /** Déconnecte l'utilisateur (Shopify si possible, sinon local). */
  logout: () => Promise<AccountResult>;
  /** Met à jour le profil (Shopify si connecté en mode Shopify, sinon local). */
  updateProfile: (updates: Partial<AccountProfile>) => Promise<AccountResult>;
  /** Supprime le compte (Shopify si possible, sinon local). */
  deleteAccount: () => Promise<AccountResult>;
  /** Réinitialise le profil local (sans toucher à la session). */
  resetProfile: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Persistance locale (tolérante)                                     */
/* ------------------------------------------------------------------ */

function readStoredProfile(): AccountProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const profile = parsed as Partial<AccountProfile>;
    return {
      prenom: profile.prenom ?? '',
      nom: profile.nom ?? '',
      email: profile.email ?? '',
      telephone: profile.telephone ?? '',
      ville: profile.ville ?? '',
      pays: profile.pays ?? '',
      lieuSouhaite:
        profile.lieuSouhaite === 'PAR' || profile.lieuSouhaite === 'BEN'
          ? profile.lieuSouhaite
          : '',
      prestationSouhaite: profile.prestationSouhaite ?? '',
      notes: profile.notes ?? '',
      updatedAt: profile.updatedAt ?? '',
    };
  } catch {
    return null;
  }
}

function writeStoredProfile(profile: AccountProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Stockage indisponible : ignoré silencieusement.
  }
}

function readStoredSession(): AccountSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const session = parsed as Partial<AccountSession>;
    if (!session.accessToken || !session.email) return null;
    return {
      accessToken: session.accessToken,
      email: session.email,
      mode: session.mode === 'shopify' ? 'shopify' : 'local',
    };
  } catch {
    return null;
  }
}

function writeStoredSession(session: AccountSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // Stockage indisponible : ignoré silencieusement.
  }
}

/** Identifiants locaux de démonstration (jamais utilisés en production). */
const DEMO_STORE_KEY = 'oxb-account-demo-v1';

interface DemoAccount {
  email: string;
  password: string;
  prenom: string;
  nom: string;
  telephone: string;
}

function readDemoAccounts(): DemoAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DEMO_STORE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoAccount[]) : [];
  } catch {
    return [];
  }
}

function writeDemoAccounts(accounts: DemoAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(accounts));
  } catch {
    // Stockage indisponible : ignoré silencieusement.
  }
}

/** Réponse normalisée renvoyée par /api/account/*. */
interface AccountApiResponse {
  success: boolean;
  mode?: AccountMode;
  accessToken?: string;
  expiresAt?: string;
  customer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    defaultAddress?: { city?: string | null; country?: string | null } | null;
  } | null;
  errors?: string[];
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AccountProfile>(DEFAULT_PROFILE);
  const [session, setSession] = useState<AccountSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydratation initiale (profil + session) après montage.
  useEffect(() => {
    const storedProfile = readStoredProfile();
    const storedSession = readStoredSession();
    if (storedProfile) setProfile(storedProfile);
    if (storedSession) setSession(storedSession);
    setIsHydrated(true);
  }, []);

  // Persistance du profil après hydratation.
  useEffect(() => {
    if (!isHydrated) return;
    if (session) {
      writeStoredProfile(profile);
    }
  }, [profile, isHydrated, session]);

  // Persistance de la session.
  useEffect(() => {
    if (!isHydrated) return;
    writeStoredSession(session);
  }, [session, isHydrated]);

  const register = useCallback(async (input: RegisterInput): Promise<AccountResult> => {
    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: input.prenom.trim(),
          lastName: input.nom.trim(),
          email: input.email.trim(),
          phone: input.telephone?.trim() || undefined,
          password: input.password,
        }),
      });

      const data: AccountApiResponse = await response.json().catch(() => ({ success: false }));

      if (!data.success) {
        return {
          success: false,
          message: data.errors?.[0] ?? 'Impossible de créer le compte.',
          mode: data.mode ?? 'local',
        };
      }

      const mode: AccountMode = data.mode ?? 'local';
      const accessToken = data.accessToken ?? `local-${Date.now()}`;

      // Profil local
      const nextProfile: AccountProfile = {
        prenom: input.prenom.trim(),
        nom: input.nom.trim(),
        email: input.email.trim(),
        telephone: input.telephone?.trim() ?? '',
        ville: data.customer?.defaultAddress?.city ?? '',
        pays: data.customer?.defaultAddress?.country ?? '',
        lieuSouhaite: '',
        prestationSouhaite: '',
        notes: '',
        updatedAt: new Date().toISOString(),
      };

      setProfile(nextProfile);
      setSession({ accessToken, email: nextProfile.email, mode });

      // En mode local, on mémorise les identifiants de démonstration.
      if (mode === 'local') {
        const accounts = readDemoAccounts();
        if (!accounts.some((a) => a.email === nextProfile.email)) {
          accounts.push({
            email: nextProfile.email,
            password: input.password,
            prenom: nextProfile.prenom,
            nom: nextProfile.nom,
            telephone: nextProfile.telephone,
          });
          writeDemoAccounts(accounts);
        }
      }

      return {
        success: true,
        mode,
        message:
          mode === 'shopify'
            ? 'Votre compte a été créé.'
            : 'Votre compte local a été créé (mode portfolio).',
      };
    } catch {
      // Repli local intégral en cas d'échec réseau.
      const nextProfile: AccountProfile = {
        prenom: input.prenom.trim(),
        nom: input.nom.trim(),
        email: input.email.trim(),
        telephone: input.telephone?.trim() ?? '',
        ville: '',
        pays: '',
        lieuSouhaite: '',
        prestationSouhaite: '',
        notes: '',
        updatedAt: new Date().toISOString(),
      };

      setProfile(nextProfile);
      setSession({ accessToken: `local-${Date.now()}`, email: nextProfile.email, mode: 'local' });

      const accounts = readDemoAccounts();
      if (!accounts.some((a) => a.email === nextProfile.email)) {
        accounts.push({
          email: nextProfile.email,
          password: input.password,
          prenom: nextProfile.prenom,
          nom: nextProfile.nom,
          telephone: nextProfile.telephone,
        });
        writeDemoAccounts(accounts);
      }

      return {
        success: true,
        mode: 'local',
        message: 'Votre compte local a été créé (mode portfolio, hors ligne).',
      };
    }
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<AccountResult> => {
    const email = input.email.trim();

    try {
      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: input.password }),
      });

      const data: AccountApiResponse = await response.json().catch(() => ({ success: false }));

      if (data.success && data.accessToken) {
        const mode: AccountMode = data.mode ?? 'local';
        const nextProfile: AccountProfile = {
          prenom: data.customer?.firstName ?? profile.prenom,
          nom: data.customer?.lastName ?? profile.nom,
          email,
          telephone: data.customer?.phone ?? profile.telephone,
          ville: data.customer?.defaultAddress?.city ?? profile.ville,
          pays: data.customer?.defaultAddress?.country ?? profile.pays,
          lieuSouhaite: profile.lieuSouhaite,
          prestationSouhaite: profile.prestationSouhaite,
          notes: profile.notes,
          updatedAt: new Date().toISOString(),
        };

        setProfile(nextProfile);
        setSession({ accessToken: data.accessToken, email, mode });

        return {
          success: true,
          mode,
          message: mode === 'shopify' ? 'Connexion réussie.' : 'Connexion locale réussie (mode portfolio).',
        };
      }

      // Échec Shopify : tenter la connexion locale de démonstration.
      const accounts = readDemoAccounts();
      const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (match && match.password === input.password) {
        const nextProfile: AccountProfile = {
          prenom: match.prenom,
          nom: match.nom,
          email: match.email,
          telephone: match.telephone,
          ville: profile.ville,
          pays: profile.pays,
          lieuSouhaite: profile.lieuSouhaite,
          prestationSouhaite: profile.prestationSouhaite,
          notes: profile.notes,
          updatedAt: new Date().toISOString(),
        };

        setProfile(nextProfile);
        setSession({ accessToken: `local-${Date.now()}`, email: match.email, mode: 'local' });

        return {
          success: true,
          mode: 'local',
          message: 'Connexion locale réussie (mode portfolio).',
        };
      }

      // Si aucun compte local mais mode démo demandé : créer automatiquement.
      if (data.mode === 'local') {
        const nextProfile: AccountProfile = {
          prenom: profile.prenom,
          nom: profile.nom,
          email,
          telephone: profile.telephone,
          ville: profile.ville,
          pays: profile.pays,
          lieuSouhaite: profile.lieuSouhaite,
          prestationSouhaite: profile.prestationSouhaite,
          notes: profile.notes,
          updatedAt: new Date().toISOString(),
        };

        setProfile(nextProfile);
        setSession({ accessToken: `local-${Date.now()}`, email, mode: 'local' });

        const newAccount: DemoAccount = {
          email,
          password: input.password,
          prenom: nextProfile.prenom,
          nom: nextProfile.nom,
          telephone: nextProfile.telephone,
        };
        writeDemoAccounts([...accounts, newAccount]);

        return {
          success: true,
          mode: 'local',
          message: 'Connexion locale réussie (compte créé automatiquement en mode portfolio).',
        };
      }

      return {
        success: false,
        message: data.errors?.[0] ?? 'Identifiants incorrects.',
        mode: data.mode ?? 'shopify',
      };
    } catch {
      // Repli local hors ligne.
      const accounts = readDemoAccounts();
      const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (match && match.password === input.password) {
        setSession({ accessToken: `local-${Date.now()}`, email: match.email, mode: 'local' });
        return { success: true, mode: 'local', message: 'Connexion locale réussie (hors ligne).' };
      }

      // Création automatique en mode portfolio hors ligne.
      setSession({ accessToken: `local-${Date.now()}`, email, mode: 'local' });
      const newAccount: DemoAccount = {
        email,
        password: input.password,
        prenom: profile.prenom,
        nom: profile.nom,
        telephone: profile.telephone,
      };
      writeDemoAccounts([...accounts, newAccount]);
      setProfile((prev) => ({ ...prev, email }));

      return {
        success: true,
        mode: 'local',
        message: 'Connexion locale réussie (mode portfolio, hors ligne).',
      };
    }
  }, [profile]);

  const logout = useCallback(async (): Promise<AccountResult> => {
    if (session?.mode === 'shopify' && session.accessToken) {
      try {
        const response = await fetch('/api/account/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: session.accessToken }),
        });
        const data: AccountApiResponse = await response.json().catch(() => ({ success: false }));
        if (!data.success) {
          // On déconnecte quand même localement.
          setSession(null);
          return { success: true, mode: 'local', message: 'Déconnecté (session Shopify expirée).' };
        }
      } catch {
        // Hors ligne : déconnexion locale.
      }
    }

    setSession(null);
    return { success: true, mode: session?.mode ?? 'local', message: 'Déconnecté.' };
  }, [session]);

  const updateProfile = useCallback(
    async (updates: Partial<AccountProfile>): Promise<AccountResult> => {
      // Toujours mettre à jour le profil local.
      const nextProfile: AccountProfile = {
        ...profile,
        ...updates,
        email: updates.email ?? profile.email,
        updatedAt: new Date().toISOString(),
      };
      setProfile(nextProfile);

      // Si connecté en mode Shopify, synchroniser vers Shopify.
      if (session?.mode === 'shopify' && session.accessToken) {
        try {
          const response = await fetch('/api/account/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessToken: session.accessToken,
              customer: {
                firstName: nextProfile.prenom,
                lastName: nextProfile.nom,
                email: nextProfile.email,
                phone: nextProfile.telephone || undefined,
              },
            }),
          });
          const data: AccountApiResponse = await response.json().catch(() => ({ success: false }));

          if (data.success) {
            return { success: true, mode: 'shopify', message: 'Profil mis à jour.' };
          }

          return {
            success: true,
            mode: 'shopify',
            message: `Profil mis à jour localement (Shopify : ${data.errors?.[0] ?? 'indisponible'}).`,
          };
        } catch {
          return {
            success: true,
            mode: 'shopify',
            message: 'Profil mis à jour localement (Shopify hors ligne).',
          };
        }
      }

      return { success: true, mode: session?.mode ?? 'local', message: 'Profil mis à jour.' };
    },
    [profile, session]
  );

  const deleteAccount = useCallback(async (): Promise<AccountResult> => {
    if (session?.mode === 'shopify' && session.accessToken) {
      try {
        const response = await fetch('/api/account/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: session.accessToken }),
        });
        const data: AccountApiResponse = await response.json().catch(() => ({ success: false }));

        if (data.success) {
          setProfile(DEFAULT_PROFILE);
          setSession(null);
          return { success: true, mode: 'shopify', message: 'Compte supprimé.' };
        }

        return {
          success: false,
          mode: 'shopify',
          message: data.errors?.[0] ?? 'Suppression impossible côté Shopify.',
        };
      } catch {
        // Hors ligne : on supprime localement.
      }
    }

    // Suppression locale.
    const email = session?.email ?? profile.email;
    const accounts = readDemoAccounts().filter(
      (a) => a.email.toLowerCase() !== email.toLowerCase()
    );
    writeDemoAccounts(accounts);
    setProfile(DEFAULT_PROFILE);
    setSession(null);

    return { success: true, mode: session?.mode ?? 'local', message: 'Compte supprimé (local).' };
  }, [profile.email, session]);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  const isComplete = useMemo(
    () =>
      Boolean(profile.prenom.trim()) &&
      Boolean(profile.nom.trim()) &&
      Boolean(profile.email.trim()),
    [profile]
  );

  const isLoggedIn = session !== null;

  const value = useMemo<AccountContextValue>(
    () => ({
      profile,
      session,
      isHydrated,
      isLoggedIn,
      isComplete,
      register,
      login,
      logout,
      updateProfile,
      deleteAccount,
      resetProfile,
    }),
    [
      profile,
      session,
      isHydrated,
      isLoggedIn,
      isComplete,
      register,
      login,
      logout,
      updateProfile,
      deleteAccount,
      resetProfile,
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount doit être utilisé à l\'intérieur d\'un <AccountProvider>.');
  }
  return context;
}