/**
 * @file
 * OXBride Atelier — Alias historique « L'Atelier ».
 * Route : /atelier
 *
 * Redirige proprement l'ancienne URL de navigation (/atelier) vers la route
 * canonique /latelier afin qu'aucun lien du menu ou du pied de page ne mène
 * à une erreur 404. La redirection est côté serveur (HTTP 308 permanent).
 */

import { redirect } from 'next/navigation';

export default function AtelierAliasPage() {
  redirect('/latelier');
}