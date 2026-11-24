/** @file
 * OXBride Atelier — Page « Espace Compte » (Neo-Luxe Lumineux).
 * Route : /compte
 *
 * Parcours complet :
 *   - Non connecté : écran de connexion / création de compte.
 *   - Connecté : consultation + édition du profil, suppression du compte
 *     (avec confirmation), déconnexion.
 *
 * Intégration : `AccountProvider` (Shopify Storefront API avec repli local
 * portfolio si la boutique restreint les mutations client).
 *
 * Palette : fond champagne `#F9F8F6`, sections alternatives `#F2ECE4` / `#FAF7F3`,
 * cartes `bg-white/90`, accents `#9A7B5B` / `#C8B094`.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Heart,
  Calendar,
  Edit2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  Trash2,
  Lock,
  Loader2,
} from 'lucide-react';
import { useAccount, type AccountProfile } from '@/components/account/AccountProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

const LIEU_OPTIONS = [
  { value: '', label: 'Non défini' },
  { value: 'PAR', label: 'Paris · Place Vendôme (Salon Privé)' },
  { value: 'BEN', label: 'Abomey-Calavi · Atelier de Confection' },
] as const;

const PRESTATION_OPTIONS = [
  { value: '', label: 'Non défini' },
  { value: 'essayage-mariee', label: 'Essayage Collection Mariée' },
  { value: 'haute-couture', label: 'Création Haute Couture Sur-Mesure' },
  { value: 'tailoring-homme', label: 'Tailoring Homme' },
  { value: 'ensembles-couple', label: 'Ensembles Couple' },
  { value: 'ajustements', label: 'Ajustements & Retouches' },
] as const;

type AuthMode = 'login' | 'register';

export default function ComptePage() {
  const {
    profile,
    session,
    isHydrated,
    isLoggedIn,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
  } = useAccount();
  const { count: wishlistCount } = useWishlist();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AccountProfile>(profile);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Champs de connexion / création
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regPrenom, setRegPrenom] = useState('');
  const [regNom, setRegNom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTelephone, setRegTelephone] = useState('');

  // Synchroniser formData avec profile au chargement / connexion.
  useEffect(() => {
    if (isHydrated) {
      setFormData(profile);
    }
  }, [profile, isHydrated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      const result = await login({ email: loginEmail, password: loginPassword });
      if (!result.success) {
        setAuthError(result.message ?? 'Échec de la connexion.');
      } else {
        setAuthMessage(result.message ?? 'Connexion réussie.');
        setLoginPassword('');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      const result = await register({
        prenom: regPrenom,
        nom: regNom,
        email: regEmail,
        telephone: regTelephone,
        password: regPassword,
      });
      if (!result.success) {
        setAuthError(result.message ?? 'Échec de la création du compte.');
      } else {
        setAuthMessage(result.message ?? 'Compte créé.');
        setRegPassword('');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsEditing(false);
    setAuthMessage(null);
    setAuthError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (saveMessage) setSaveMessage(null);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const result = await updateProfile(formData);
      setSaveMessage(result.message ?? 'Profil mis à jour.');
      setIsEditing(false);
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const result = await deleteAccount();
      if (!result.success) {
        setDeleteError(result.message ?? 'Suppression impossible.');
      }
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatLieu = (value: string): string => {
    const opt = LIEU_OPTIONS.find((o) => o.value === value);
    return opt?.label ?? 'Non défini';
  };

  const formatPrestation = (value: string): string => {
    const opt = PRESTATION_OPTIONS.find((o) => o.value === value);
    return opt?.label ?? 'Non défini';
  };

  const modeLabel =
    session?.mode === 'shopify'
      ? 'Compte connecté à la boutique'
      : 'Mode portfolio (données locales)';

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-stone-500">
          <Sparkles className="w-8 h-8 animate-pulse text-[#9A7B5B]" aria-hidden="true" />
          <p className="text-sm font-sans uppercase tracking-wider">Chargement…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      {/* ================================================================
          Hero — Espace Compte
          ================================================================ */}
      <section className="border-b border-stone-200/80 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#9A7B5B] font-sans mb-6">
            Mon Espace
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1] tracking-tight text-stone-900 mb-6">
            {isLoggedIn ? 'Mon Compte' : 'Connexion'}
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {isLoggedIn
              ? 'Gérez votre profil, vos préférences d\'essayage et retrouvez votre sélection de coups de cœur.'
              : 'Connectez-vous pour retrouver votre sélection, préparer un essayage ou lancer un projet sur-mesure.'}
          </p>
        </div>
      </section>

      {/* ================================================================
          NON CONNECTÉ : Connexion / Création de compte
          ================================================================ */}
      {!isLoggedIn && (
        <section className="py-12 md:py-16 bg-[#F9F8F6]">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 sm:p-8">
              {/* Onglets */}
              <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[#F2ECE4]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                    setAuthMessage(null);
                  }}
                  className={[
                    'flex-1 rounded-lg py-2.5 text-sm font-sans uppercase tracking-[0.1em] transition-colors',
                    authMode === 'login'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900',
                  ].join(' ')}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError(null);
                    setAuthMessage(null);
                  }}
                  className={[
                    'flex-1 rounded-lg py-2.5 text-sm font-sans uppercase tracking-[0.1em] transition-colors',
                    authMode === 'register'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900',
                  ].join(' ')}
                >
                  Créer un compte
                </button>
              </div>

              {authError && (
                <div
                  className="mb-4 rounded-xl border border-amber-700/30 bg-amber-50/50 p-3 text-sm text-amber-700"
                  role="alert"
                >
                  {authError}
                </div>
              )}
              {authMessage && !authError && (
                <div
                  className="mb-4 rounded-xl border border-emerald-700/30 bg-emerald-50/50 p-3 text-sm text-emerald-700"
                  role="status"
                >
                  {authMessage}
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Courriel
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="vous@exemple.fr"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Mot de passe
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                        <span>Connexion…</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" aria-hidden="true" />
                        <span>Se connecter</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-stone-400 leading-relaxed">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-[#9A7B5B] underline underline-offset-4 hover:text-[#7a6345]"
                    >
                      Créer un compte
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-prenom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                        Prénom *
                      </label>
                      <input
                        id="reg-prenom"
                        type="text"
                        required
                        value={regPrenom}
                        onChange={(e) => setRegPrenom(e.target.value)}
                        placeholder="Votre prénom"
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-nom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                        Nom *
                      </label>
                      <input
                        id="reg-nom"
                        type="text"
                        required
                        value={regNom}
                        onChange={(e) => setRegNom(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Courriel *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="vous@exemple.fr"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-tel" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                        Téléphone
                      </label>
                      <input
                        id="reg-tel"
                        type="tel"
                        value={regTelephone}
                        onChange={(e) => setRegTelephone(e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-password" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                        Mot de passe *
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 caractères minimum"
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                        <span>Création…</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span>Créer mon compte</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-stone-400 leading-relaxed">
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-[#9A7B5B] underline underline-offset-4 hover:text-[#7a6345]"
                    >
                      Se connecter
                    </button>
                  </p>
                </form>
              )}

              {/* Note mode portfolio */}
              <div className="mt-6 rounded-xl border border-stone-200/80 bg-[#FAF7F3] p-3">
                <p className="text-[11px] text-stone-500 leading-relaxed text-center">
                  <ShieldCheck className="inline w-3.5 h-3.5 mr-1 align-[-2px] text-[#9A7B5B]" aria-hidden="true" />
                  Vos données sont conservées localement dans votre navigateur. Si la
                  boutique Shopify est en mode démo, le compte fonctionne en mode
                  portfolio sans connexion distante.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          CONNECTÉ : Profil
          ================================================================ */}
      {isLoggedIn && (
        <>
          <section className="py-12 md:py-16 bg-[#F9F8F6]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Carte principale du profil */}
              <div className="rounded-3xl border border-stone-200/80 bg-white/90 overflow-hidden">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-stone-200/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F2ECE4] text-[#9A7B5B]">
                      <User className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-stone-900">
                        {profile.prenom || profile.nom
                          ? `${profile.prenom} ${profile.nom}`
                          : 'Profil non complété'}
                      </h2>
                      <p className="text-sm text-stone-500">
                        {profile.email || session?.email || 'Aucun courriel renseigné'}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#9A7B5B] font-sans">
                        {modeLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(profile);
                            setIsEditing(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-stone-500 hover:border-stone-900 hover:text-stone-900 hover:bg-[#F2ECE4] transition-colors"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={saveLoading}
                          className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saveLoading}
                          className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saveLoading ? (
                            <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Check className="w-4 h-4" aria-hidden="true" />
                          )}
                          Enregistrer
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Contenu : grille d'informations ou formulaire */}
                <div className="p-6 space-y-6">
                  {saveMessage && (
                    <div
                      className="rounded-xl border border-emerald-700/30 bg-emerald-50/50 p-3 text-sm text-emerald-700 flex items-center gap-2"
                      role="status"
                    >
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{saveMessage}</span>
                    </div>
                  )}

                  {!isEditing ? (
                    // MODE CONSULTATION
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Prénom</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {profile.prenom || <span className="text-stone-400 italic">Non renseigné</span>}
                        </dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Nom</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {profile.nom || <span className="text-stone-400 italic">Non renseigné</span>}
                        </dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Courriel</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {profile.email || session?.email || <span className="text-stone-400 italic">Non renseigné</span>}
                        </dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Téléphone</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {profile.telephone || <span className="text-stone-400 italic">Non renseigné</span>}
                        </dd>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Ville / Pays</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {profile.ville || profile.pays
                            ? `${profile.ville}${profile.ville && profile.pays ? ', ' : ''}${profile.pays}`
                            : <span className="text-stone-400 italic">Non renseigné</span>}
                        </dd>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Salon souhaité</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {formatLieu(profile.lieuSouhaite)}
                        </dd>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Prestation souhaitée</dt>
                        <dd className="font-serif text-lg text-stone-900">
                          {formatPrestation(profile.prestationSouhaite)}
                        </dd>
                      </div>
                      {profile.notes && (
                        <div className="space-y-1 sm:col-span-2">
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Notes / Inspirations</dt>
                          <dd className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                            {profile.notes}
                          </dd>
                        </div>
                      )}
                      {profile.updatedAt && (
                        <div className="space-y-1 sm:col-span-2">
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Dernière mise à jour</dt>
                          <dd className="text-sm text-stone-500 font-sans">
                            {new Date(profile.updatedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    // MODE ÉDITION
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="prenom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Prénom *
                          </label>
                          <input
                            id="prenom"
                            name="prenom"
                            type="text"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            placeholder="Votre prénom"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                        <div>
                          <label htmlFor="nom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Nom *
                          </label>
                          <input
                            id="nom"
                            name="nom"
                            type="text"
                            value={formData.nom}
                            onChange={handleInputChange}
                            placeholder="Votre nom"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Courriel *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="vous@exemple.fr"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                        <div>
                          <label htmlFor="telephone" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Téléphone
                          </label>
                          <input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            placeholder="+33 6 00 00 00 00"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="ville" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Ville
                          </label>
                          <input
                            id="ville"
                            name="ville"
                            type="text"
                            value={formData.ville}
                            onChange={handleInputChange}
                            placeholder="Votre ville"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                        <div>
                          <label htmlFor="pays" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Pays
                          </label>
                          <input
                            id="pays"
                            name="pays"
                            type="text"
                            value={formData.pays}
                            onChange={handleInputChange}
                            placeholder="Votre pays"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="lieuSouhaite" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Salon souhaité pour l'essayage
                          </label>
                          <select
                            id="lieuSouhaite"
                            name="lieuSouhaite"
                            value={formData.lieuSouhaite}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          >
                            {LIEU_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="prestationSouhaite" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                            Type de prestation souhaitée
                          </label>
                          <select
                            id="prestationSouhaite"
                            name="prestationSouhaite"
                            value={formData.prestationSouhaite}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          >
                            {PRESTATION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                          Notes / Inspirations (matières, couleurs, délais, idées…)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Décrivez vos envies : type de pièce, matières envisagées, date de l'événement, inspiration..."
                          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={saveLoading}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:opacity-40"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={saveLoading}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {saveLoading ? (
                            <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Check className="w-4 h-4" aria-hidden="true" />
                          )}
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Zone de suppression du compte */}
                  <div className="pt-4 border-t border-stone-200/60">
                    {showDeleteConfirm ? (
                      <div className="rounded-xl border border-amber-700/30 bg-amber-50/50 p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
                          <div>
                            <p className="font-serif text-lg font-medium text-stone-900">
                              Confirmer la suppression du compte ?
                            </p>
                            <p className="text-sm text-stone-600 mt-1">
                              Cette action effacera votre profil et votre session.
                              Cette action est irréversible.
                            </p>
                            {deleteError && (
                              <p className="mt-2 text-sm text-amber-700">{deleteError}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={handleDeleteConfirm}
                            disabled={deleteLoading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:opacity-50"
                          >
                            {deleteLoading ? (
                              <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            )}
                            Oui, supprimer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteError(null);
                            }}
                            disabled={deleteLoading}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" aria-hidden="true" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-5 text-sm font-sans uppercase tracking-[0.1em] text-stone-500 hover:border-stone-900 hover:text-stone-900 hover:bg-[#F2ECE4] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Supprimer mon compte
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================
              Liens rapides — Wishlist & Rendez-vous
              ============================================================ */}
          <section className="py-12 md:py-16 border-t border-stone-200/80 bg-[#F2ECE4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/wishlist"
                  className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-white/90 p-8 hover:border-[#C8B094] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F2ECE4] text-[#9A7B5B]">
                      <Heart className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                        Ma liste de souhaits
                      </h3>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {wishlistCount > 0
                          ? `${wishlistCount} pièce${wishlistCount > 1 ? 's' : ''} enregistrée${wishlistCount > 1 ? 's' : ''}`
                          : 'Aucune pièce pour l\'instant'}
                      </p>
                    </div>
                    <Sparkles className="w-5 h-5 shrink-0 text-[#9A7B5B]" aria-hidden="true" />
                  </div>
                </Link>

                <Link
                  href="/rendez-vous"
                  className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-white/90 p-8 hover:border-[#C8B094] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F2ECE4] text-[#9A7B5B]">
                      <Calendar className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                        Mes rendez-vous
                      </h3>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        Réservez un essayage privé dans nos salons de Paris ou
                        d'Abomey-Calavi.
                      </p>
                    </div>
                    <Sparkles className="w-5 h-5 shrink-0 text-[#9A7B5B]" aria-hidden="true" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ================================================================
          CTA Final
          ================================================================ */}
      <section className="py-16 md:py-20 lg:py-24 border-t border-stone-200/80 bg-[#FAF7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Votre histoire continue
          </h3>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Découvrez nos collections, prenez rendez-vous en salon privé,
            ou lancez un projet sur-mesure. L'Atelier vous accompagne à
            chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Voir les collections
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              href="/sur-mesure"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Projet sur-mesure
            </Link>
            <Link
              href="/latelier"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Découvrir L'Atelier
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}