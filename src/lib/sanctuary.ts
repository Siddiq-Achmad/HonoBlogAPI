// ============================================================
// Sanctuary & Location Metadata Resolver — LUXIMA Wedding Journal
// Derives authentic Indonesian destination tags & sanctuary names
// directly from post tags, title, category, and database records.
// ============================================================

export interface SanctuaryDetails {
  tag: string;
  sanctuary: string;
}

interface PostLike {
  title?: string | null;
  slug?: string | null;
  tags?: string[] | null;
  category?: {
    name?: string | null;
    slug?: string | null;
  } | null;
}

/**
 * Resolves authentic Indonesian location tag and bespoke sanctuary name
 * strictly based on post database records (tags, title, category).
 * Eliminates arbitrary/random hardcoding.
 */
export function getPostSanctuaryDetails(post?: PostLike | null): SanctuaryDetails {
  if (!post) {
    return { tag: 'Bespoke Sanctuary', sanctuary: 'Suaka Nusantara' };
  }

  const tags = Array.isArray(post.tags) ? post.tags.map(t => String(t).toLowerCase()) : [];
  const title = String(post.title || '').trim();
  const titleLower = title.toLowerCase();

  // 1. Banda Aceh / Serambi Mekkah / Rumoh Aceh & Puade
  if (
    tags.includes('rumoh-aceh') ||
    tags.includes('pelaminan-puade') ||
    (tags.includes('aceh') && (titleLower.includes('puade') || titleLower.includes('rumoh')))
  ) {
    return {
      tag: 'Banda Aceh, Sumatra',
      sanctuary: 'Rumoh Aceh & Pelaminan Puade'
    };
  }

  // 2. Sabang / Pulau Weh / Titik Nol
  if (
    tags.includes('sabang') ||
    tags.includes('pulau-weh') ||
    tags.includes('laut-andaman') ||
    titleLower.includes('sabang') ||
    titleLower.includes('pulau weh')
  ) {
    return {
      tag: 'Sabang, Pulau Weh',
      sanctuary: 'Tebing Karang Laut Andaman'
    };
  }

  // 3. Aceh Adat / Boh Gaca & Peusijuek
  if (
    tags.includes('boh-gaca') ||
    tags.includes('peusijuek') ||
    titleLower.includes('boh gaca') ||
    titleLower.includes('peusijuek')
  ) {
    return {
      tag: 'Banda Aceh, Serambi Mekkah',
      sanctuary: 'Bale Adat Peusijuek'
    };
  }

  // 4. Aceh Darussalam / Patam Dhoe & Kasab Emas
  if (
    tags.includes('patam-dhoe') ||
    tags.includes('kasab-emas') ||
    titleLower.includes('patam dhoe')
  ) {
    return {
      tag: 'Aceh Darussalam',
      sanctuary: 'Atelier Mahkota Diraja'
    };
  }

  // 5. Uluwatu / Bali Selatan
  if (
    tags.includes('uluwatu') ||
    titleLower.includes('uluwatu')
  ) {
    return {
      tag: 'Uluwatu, Bali Selatan',
      sanctuary: 'Altar Samudra Tebing Uluwatu'
    };
  }

  // 6. Ubud / Sungai Ayung
  if (
    tags.includes('ubud') ||
    tags.includes('ayung-river') ||
    titleLower.includes('ubud') ||
    titleLower.includes('ayung')
  ) {
    return {
      tag: 'Ubud, Bali',
      sanctuary: 'Suaka Lembah Sungai Ayung'
    };
  }

  // 7. Yogyakarta / Kraton Hadiningrat
  if (
    tags.includes('yogyakarta') ||
    tags.includes('kraton') ||
    tags.includes('paes-ageng') ||
    titleLower.includes('kraton') ||
    titleLower.includes('yogyakarta')
  ) {
    return {
      tag: 'Yogyakarta, Jawa Tengah',
      sanctuary: 'Kraton Hadiningrat Ngayogyakarta'
    };
  }

  // 8. Borobudur / Lembah Menoreh
  if (
    tags.includes('borobudur') ||
    tags.includes('menoreh') ||
    tags.includes('amanjiwo') ||
    titleLower.includes('borobudur') ||
    titleLower.includes('menoreh')
  ) {
    return {
      tag: 'Lembah Menoreh, Borobudur',
      sanctuary: 'Pelataran Candi Borobudur'
    };
  }

  // 9. Parahyangan / Lembang / Gedong Putih
  if (
    tags.includes('parahyangan') ||
    tags.includes('sunda') ||
    tags.includes('gedong-putih') ||
    titleLower.includes('parahyangan') ||
    titleLower.includes('lembang')
  ) {
    return {
      tag: 'Dataran Tinggi Parahyangan',
      sanctuary: 'Villa Kolonial Lembang'
    };
  }

  // 10. Minangkabau / Ranah Minang
  if (
    tags.includes('minangkabau') ||
    tags.includes('anak-daro') ||
    tags.includes('sunting-emas') ||
    titleLower.includes('minangkabau')
  ) {
    return {
      tag: 'Ranah Minang, Sumatra Barat',
      sanctuary: 'Istano Basa Pagaruyung'
    };
  }

  // 11. Labuan Bajo / Flores / Phinisi
  if (
    tags.includes('labuan-bajo') ||
    tags.includes('phinisi-luxury') ||
    tags.includes('flores') ||
    tags.includes('komodo') ||
    titleLower.includes('labuan bajo') ||
    titleLower.includes('phinisi')
  ) {
    return {
      tag: 'Labuan Bajo, Flores',
      sanctuary: 'Phinisi Luxury Royal Deck'
    };
  }

  // 12. Batavia / Jakarta
  if (
    tags.includes('jakarta') ||
    tags.includes('dharmawangsa') ||
    tags.includes('colonial-heritage') ||
    titleLower.includes('batavia') ||
    titleLower.includes('dharmawangsa')
  ) {
    return {
      tag: 'Batavia Heritage, Jakarta',
      sanctuary: 'The Dharmawangsa Courtyard'
    };
  }

  // 13. Danau Toba / Kaldera / Batak
  if (
    tags.includes('danau-toba') ||
    tags.includes('toba') ||
    tags.includes('samosir') ||
    tags.includes('batak') ||
    titleLower.includes('toba')
  ) {
    return {
      tag: 'Danau Toba, Sumatra Utara',
      sanctuary: 'Kaldera Megah Toba & Samosir'
    };
  }

  // 14. Martapura / Kalimantan Selatan
  if (
    tags.includes('intan-martapura') ||
    tags.includes('martapura') ||
    titleLower.includes('martapura')
  ) {
    return {
      tag: 'Martapura, Kalimantan Selatan',
      sanctuary: 'Paviliun Kriya Intan Martapura'
    };
  }

  // 15. Janur & Melati Flora
  if (
    tags.includes('janur-modern') ||
    tags.includes('melati-ronce') ||
    titleLower.includes('janur') ||
    titleLower.includes('ronce melati')
  ) {
    return {
      tag: 'Nusantara Botanical Atelier',
      sanctuary: 'Instalasi Janur & Ronce Melati'
    };
  }

  // 16. Kebaya Couture
  if (
    tags.includes('kebaya-couture') ||
    titleLower.includes('kebaya')
  ) {
    return {
      tag: 'Haute Couture Atelier',
      sanctuary: 'Atelier Kebaya Modern'
    };
  }

  // Dynamic Fallback: Parse location and sanctuary cleanly from title & tags
  let sanctuaryName = 'Suaka Nusantara';
  if (title.includes(':')) {
    const parts = title.split(':');
    const subtitle = parts[1].trim();
    sanctuaryName = subtitle.length > 32 ? subtitle.substring(0, 32).trim() + '...' : subtitle;
  } else {
    sanctuaryName = title.length > 32 ? title.substring(0, 32).trim() + '...' : title;
  }

  const primaryTag = tags.find(t => !['luxury-venue', 'destination-wedding', 'wedding', 'indonesia'].includes(t));
  const locationTag = primaryTag
    ? primaryTag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : (post.category?.name || 'Bespoke Sanctuary');

  return { tag: locationTag, sanctuary: sanctuaryName };
}
