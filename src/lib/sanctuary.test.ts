import { describe, it, expect } from 'bun:test';
import { getPostSanctuaryDetails } from './sanctuary.ts';

describe('Sanctuary & Location Resolver', () => {
  it('should resolve Aceh Puade venue accurately', () => {
    const post = {
      title: 'Resepsi Megah di Negeri Serambi Mekkah: Pelaminan Puade Tujuh Tingkat Berlatar Kemegahan Rumoh Aceh',
      tags: ['aceh', 'banda-aceh', 'pelaminan-puade', 'rumoh-aceh', 'luxury-venue']
    };
    const { tag, sanctuary } = getPostSanctuaryDetails(post);
    expect(tag).toBe('Banda Aceh, Sumatra');
    expect(sanctuary).toBe('Rumoh Aceh & Pelaminan Puade');
  });

  it('should resolve Sabang / Pulau Weh accurately', () => {
    const post = {
      title: 'Pesona Tebing Karang Titik Nol Sabang: Suaka Ikrar Suci Berlatar Kemurnian Laut Andaman Pulau Weh',
      tags: ['sabang', 'pulau-weh', 'laut-andaman', 'destination-wedding']
    };
    const { tag, sanctuary } = getPostSanctuaryDetails(post);
    expect(tag).toBe('Sabang, Pulau Weh');
    expect(sanctuary).toBe('Tebing Karang Laut Andaman');
  });

  it('should resolve Uluwatu Bali venue accurately', () => {
    const post = {
      title: 'Kemegahan Sakral di Tebing Samudra Uluwatu: Ikrar Abadi Berlatar Horison Senja Bali',
      tags: ['bali', 'uluwatu', 'luxury-venue', 'cliffside-wedding']
    };
    const { tag, sanctuary } = getPostSanctuaryDetails(post);
    expect(tag).toBe('Uluwatu, Bali Selatan');
    expect(sanctuary).toBe('Altar Samudra Tebing Uluwatu');
  });

  it('should resolve Yogyakarta Kraton accurately', () => {
    const post = {
      title: 'Mahakarya Ageng Kraton Ngayogyakarta: Filosofi Adiluhung Pernikahan Ningrat Jawa',
      tags: ['yogyakarta', 'paes-ageng', 'kraton']
    };
    const { tag, sanctuary } = getPostSanctuaryDetails(post);
    expect(tag).toBe('Yogyakarta, Jawa Tengah');
    expect(sanctuary).toBe('Kraton Hadiningrat Ngayogyakarta');
  });

  it('should handle unknown posts with graceful dynamic extraction', () => {
    const post = {
      title: 'Keindahan Danau Maninjau: Suaka Cinta Alami di Kelok 44',
      tags: ['maninjau', 'sumatra-barat']
    };
    const { tag, sanctuary } = getPostSanctuaryDetails(post);
    expect(tag).toBe('Maninjau');
    expect(sanctuary).toBe('Suaka Cinta Alami di Kelok 44');
  });
});
