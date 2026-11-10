/**
 * OXBride Atelier — Typages Shopify Storefront API
 * Méta-objet : editorial_manifeste
 */

/** Donnée image issue d'une référence MediaImage (Storefront API). */
export interface ShopifyMetaobjectFieldImage {
  url: string;
  altText: string;
}

/** Référence de ressource (union MetafieldReference) réduite aux cas utilisés. */
export interface ShopifyMetaobjectFieldReference {
  __typename: string;
  image?: ShopifyMetaobjectFieldImage | null;
  url?: string | null;
}

export interface ShopifyMetaobjectField {
  key: string;
  value: string | null;
  reference: ShopifyMetaobjectFieldReference | null;
}

export interface ShopifyMetaobject {
  handle: string;
  type: string;
  fields: ShopifyMetaobjectField[];
}

export interface EditorialManifestoData {
  sousTitre: string;
  titre: string;
  citation: string;
  signature: string;
  visuelUrl?: string;
  visuelAlt?: string;
}

/**
 * Clés de champ acceptées pour le méta-objet (français / anglais) afin de
 * rester robuste quelle que soit la configuration du shop Shopify.
 *
 * `visuelUrl` est volontairement EXCLU : ce champ est une référence image,
 * il est traité séparément par `getFileUrl` (reference / JSON / valeur brute),
 * jamais par la boucle texte `getString`.
 */
const FIELD_ALIASES: Record<Exclude<keyof EditorialManifestoData, 'visuelAlt' | 'visuelUrl'>, string[]> = {
  sousTitre: ['sous_titre', 'subtitle', 'sousTitre'],
  titre: ['titre', 'title'],
  citation: ['citation', 'quote', 'poeme', 'poem'],
  signature: ['signature'],
};

const VISUEL_ALT_ALIASES = ['visuel_atelier_alt', 'atelier_image_alt', 'visuel_alt', 'image_alt'];

/** Alias dédiés au champ image (traités par getFileUrl, jamais par getString). */
const VISUEL_URL_ALIASES = ['visuel_atelier', 'atelier_image', 'visuel', 'image'];

export function parseEditorialManifesto(
  metaobject: ShopifyMetaobject | null
): EditorialManifestoData | null {
  if (!metaobject || !metaobject.fields?.length) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[EditorialManifesto] Méta-objet nul ou sans champs :', metaobject);
    }
    return null;
  }

  const fields = metaobject.fields;

  if (process.env.NODE_ENV === 'development') {
    console.log('[EditorialManifesto] Champs bruts reçus de Shopify :', JSON.stringify(fields, null, 2));
  }

  const getString = (key: string): string | null => {
    const field = fields.find((f) => f.key === key);
    return field?.value || null;
  };

  const getFileUrl = (key: string): { url: string | null; altText: string | null } => {
    const field = fields.find((f) => f.key === key);
    if (!field) return { url: null, altText: null };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[EditorialManifesto] getFileUrl("${key}") field =`, {
        key: field.key,
        value: field.value,
        reference: field.reference,
      });
    }

    // 1. Référence structurée (MetafieldReference → MediaImage ou GenericFile).
    //    On évite toute sous-sélection sur le scalaire `value` : l'image vient
    //    de `reference { ... on MediaImage { image { url altText } } ... on GenericFile { url } }`.
    const ref = field.reference;
    if (ref?.image?.url) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EditorialManifesto] getFileUrl("${key}") → référence MediaImage :`, ref.image.url);
      }
      return { url: ref.image.url, altText: ref.image.altText ?? null };
    }
    // 1b. GenericFile : URL directe sur le reference.
    if (ref?.url) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EditorialManifesto] getFileUrl("${key}") → référence GenericFile :`, ref.url);
      }
      return { url: ref.url, altText: null };
    }

    // 2. Valeur scalaire : URL brute ou référence fichier JSON-encodée (fallback robuste).
    if (field.value) {
      try {
        const parsed = JSON.parse(field.value);
        const url =
          parsed?.file?.image?.url ??
          parsed?.image?.url ??
          parsed?.url ??
          null;
        const altText =
          parsed?.file?.image?.altText ??
          parsed?.image?.altText ??
          parsed?.altText ??
          null;
        if (url) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[EditorialManifesto] getFileUrl("${key}") → valeur JSON parsée :`, url);
          }
          return { url, altText };
        }
      } catch {
        // Valeur brute (URL directe ou identifiant) — on la retourne telle quelle.
        if (process.env.NODE_ENV === 'development') {
          console.log(`[EditorialManifesto] getFileUrl("${key}") → valeur brute :`, field.value);
        }
        return { url: field.value, altText: null };
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[EditorialManifesto] getFileUrl("${key}") → aucune URL trouvée`);
    }
    return { url: null, altText: null };
  };

  const data: Partial<EditorialManifestoData> = {};

  for (const [target, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const alias of aliases) {
      const value = getString(alias);
      if (value) {
        data[target as keyof EditorialManifestoData] = value;
        break;
      }
    }
  }

  for (const alias of VISUEL_ALT_ALIASES) {
    const value = getString(alias);
    if (value) {
      data.visuelAlt = value;
      break;
    }
  }

  for (const alias of VISUEL_URL_ALIASES) {
    const { url, altText } = getFileUrl(alias);
    if (url) {
      data.visuelUrl = url;
      if (!data.visuelAlt) {
        data.visuelAlt = altText ?? `Visuel d'atelier — OXBride Atelier`;
      }
      break;
    }
  }

  // Obligatoire : titre et citation pour considérer la donnée comme valide
  if (!data.titre || !data.citation) {
    return null;
  }

  return data as EditorialManifestoData;
}

/* ============================================================================
   Méta-objet : private_salon_experience (Salon Privé)
   ============================================================================ */

/** Donnée plate du méta-objet Salon Privé (après parsing). */
export interface PrivateSalonExperienceData {
  titre: string;
  sousTitre: string;
  description: string;
  parisAdresse: string;
  parisDetail: string;
  beninAdresse: string;
  beninDetail: string;
  contactEmail: string;
  contactPhone: string;
  reservationUrl: string;
  contactLabel: string;
  reservationLabel: string;
}

/** Clés de champ acceptées pour le méta-objet private_salon_experience. */
/**
 * Couvre les variantes renvoyées par Shopify (casse, underscores, espaces,
 * tirets) : location_1_title, location_1_address, cta_button_text, etc.
 * Le matching est de toute façon normalisé par `normalizeShopifyKey`.
 */
export const SALON_FIELD_ALIASES: Record<keyof PrivateSalonExperienceData, string[]> = {
  titre: ['titre', 'title', 'salon_titre', 'salon_title', 'titre_salon', 'location_1_title', 'location_2_title', 'heading', 'name'],
  sousTitre: ['sous_titre', 'subtitle', 'salon_sousTitre', 'sous-titre', 'salon_subtitle', 'sous_titre_salon', 'description_courte', 'lead'],
  description: ['description', 'salon_description', 'intro', 'body', 'contenu', 'salon_intro', 'texte', 'text', 'resume', 'summary'],
  parisAdresse: ['paris_adresse', 'adresse_paris', 'paris', 'adresse', 'address', 'location_1_address', 'adresse_salon_paris', 'lieu_paris'],
  parisDetail: ['paris_detail', 'detail_paris', 'paris_description', 'detail', 'location_1_detail', 'details_paris', 'paris_complement', 'complement_paris'],
  beninAdresse: ['benin_adresse', 'adresse_benin', 'benin', 'location_2_address', 'adresse_salon_benin', 'adresse_cotonou', 'lieu_benin'],
  beninDetail: ['benin_detail', 'detail_benin', 'benin_description', 'location_2_detail', 'details_benin', 'benin_complement', 'complement_benin'],
  contactEmail: ['contact_email', 'email', 'email_contact', 'contact', 'e_mail', 'contact_adresse', 'adresse_email'],
  contactPhone: ['contact_phone', 'telephone', 'phone', 'tel', 'phone_number', 'numero_telephone', 'telephone_contact', 'tel_contact'],
  reservationUrl: ['reservation_url', 'url_reservation', 'lien_reservation', 'book_url', 'cta_url', 'lien', 'url', 'reservation_lien'],
  contactLabel: ['contact_label', 'label_contact', 'bouton_contact', 'btn_contact', 'contacter', 'bouton_contacter'],
  reservationLabel: ['reservation_label', 'label_reservation', 'bouton_reservation', 'btn_reservation', 'cta_button_text', 'cta_text', 'bouton_cta', 'reserver', 'reservation_bouton'],
};
/**
 * Normalise une clé de champ Shopify pour faire correspondre de manière
 * identique toutes ses variantes : casse ignorée, camelCase converti,
 * espaces / tirets / points transformés en underscores.
 *
 * Ex: "Location 1 Title", "location_1_title", "LOCATION-1-TITLE",
 *     "location1Title" → "location_1_title"
 */
export function normalizeShopifyKey(key: string): string {
  return key
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[.\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}


/** Fallback textuel élégant si le méta-objet n'est pas encore publié. */
export const PRIVATE_SALON_FALLBACK: PrivateSalonExperienceData = {
  titre: 'Réservez votre Salon Privé',
  sousTitre: 'L’Expérience Sur-Mesure',
  description:
    'Prenez rendez-vous dans nos salons privés pour une consultation sur-mesure, à Paris ou à Abomey-Calavi. Soieries, dentelles et coupes créées rien que pour vous.',
  parisAdresse: 'Paris · Place Vendôme',
  parisDetail: 'Atelier privé sur rendez-vous — essayage et conseil sur-mesure.',
  beninAdresse: 'Abomey-Calavi · Bénin',
  beninDetail: 'Consultation sur-mesure et créations exclusives pour l’Afrique de l’Ouest.',
  contactEmail: 'contact@oxbride-atelier.com',
  contactPhone: '+229 XX XX XX XX',
  reservationUrl: '/rendez-vous',
  contactLabel: 'Contacter l’Atelier',
  reservationLabel: 'Réserver un Essayage',
};

/* ============================================================================
   Lookbook — Produits de la collection dédiée (Storefront API)
   ============================================================================ */

/** Donnée plate d’un produit lookbook exposée au composant galerie. */
export interface LookbookProductData {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  images: Array<{ url: string; altText: string }>;
  link: string;
}


/* ============================================================================
   Collections — Univers de la Maison (Storefront API)
   ============================================================================ */

/** Nœud collection retourné par la Storefront API. */
export interface ShopifyCollectionNode {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string | null;
  image: { url: string; altText: string | null } | null;
}

/** Donnée d’un pilier de collection exposée aux composants. */
export interface CollectionPillar {
  key: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
}

/** Donnée plate d’une collection Shopify (après mapping). */
export interface CollectionData {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
}
