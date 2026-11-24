/** @file
 * OXBride Atelier — API Compte : Déconnexion.
 * Route : POST /api/account/logout
 *
 * Tente la suppression du token via Shopify (`customerAccessTokenDelete`).
 * Retourne toujours un succès pour permettre la déconnexion locale.
 *
 * Input : { accessToken }
 * Output : { success, mode }
 */

import { deleteCustomerAccessToken } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json({ success: true, mode: 'local' }, { status: 200 });
    }

    const { accessToken } = body as { accessToken?: unknown };

    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      return Response.json({ success: true, mode: 'local' }, { status: 200 });
    }

    const result = await deleteCustomerAccessToken(accessToken);

    if (result && result.success) {
      return Response.json({ success: true, mode: 'shopify' }, { status: 200 });
    }

    return Response.json({ success: true, mode: 'local' }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /account/logout] Erreur :', error);
    }
    return Response.json({ success: true, mode: 'local' }, { status: 200 });
  }
}