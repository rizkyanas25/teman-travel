export interface NearbyPOI {
  name: string;
  nameEn?: string;
  nameId?: string;
  category: 'food' | 'photo' | 'cafe' | 'activity';
  rating: number;
  distance: string;
  googleMapsUrl: string;
  coordinates: [number, number]; // [lng, lat]
}

export const NEARBY_POIS: Record<string, NearbyPOI[]> = {
  'Kelingking Beach': [
    {
      name: 'Paluang Cliff (Spot Foto Tebing Nusa Penida)',
      category: 'photo',
      rating: 4.8,
      distance: '800m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Paluang+Cliff+Nusa+Penida',
      coordinates: [115.4769, -8.7537]
    },
    {
      name: 'Secret Point Warung Kelingking (Kuliner Lokal & View)',
      category: 'food',
      rating: 4.5,
      distance: '120m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Secret+Point+Warung+Kelingking',
      coordinates: [115.4772, -8.7466]
    },
    {
      name: 'Kelingking Sunset Point Bar',
      category: 'cafe',
      rating: 4.4,
      distance: '250m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kelingking+Sunset+Point+Bar',
      coordinates: [115.4766, -8.7506]
    }
  ],
  'Broken Beach': [
    {
      name: 'Angel\'s Billabong (Kolam Alami Sangat Dekat)',
      category: 'photo',
      rating: 4.8,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Angels+Billabong+Nusa+Penida',
      coordinates: [115.4490, -8.7335]
    },
    {
      name: 'Angel\'s Billabong Cafe',
      category: 'cafe',
      rating: 4.2,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Angels+Billabong+Cafe+Nusa+Penida',
      coordinates: [115.4490, -8.7335]
    }
  ],
  'Angel Billabong': [
    {
      name: 'Broken Beach (Tegeh Cliff View)',
      category: 'photo',
      rating: 4.8,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Broken+Beach+Nusa+Penida',
      coordinates: [115.4508, -8.7328]
    },
    {
      name: 'Warung Angel Nusa Penida',
      category: 'food',
      rating: 4.3,
      distance: '120m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Angel+Nusa+Penida',
      coordinates: [115.4505, -8.7280]
    }
  ],
  'Crystal Bay': [
    {
      name: 'Crystal Bay Beach Club (Sunset Drinks)',
      category: 'cafe',
      rating: 4.4,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Crystal+Bay+Beach+Club',
      coordinates: [115.4592, -8.7156]
    },
    {
      name: 'Snorkeling Point Crystal Bay (Sewa Perahu Lokal)',
      category: 'activity',
      rating: 4.7,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Snorkeling+Crystal+Bay+Nusa+Penida',
      coordinates: [115.4591, -8.7156]
    }
  ],
  'Tegenungan Waterfall': [
    {
      name: 'Omma Dayclub Bali (Luxury Pool Club & View)',
      category: 'cafe',
      rating: 4.6,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Omma+Dayclub+Bali',
      coordinates: [115.2895, -8.5756]
    },
    {
      name: 'Tegenungan Swing & Photo Point',
      category: 'photo',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tegenungan+Swing+and+Photo+Point',
      coordinates: [115.2890, -8.5754]
    },
    {
      name: 'Bebek Tebasari Resto (Ubud Traditional Food)',
      category: 'food',
      rating: 4.8,
      distance: '3.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bebek+Tebasari+Resto',
      coordinates: [115.2566, -8.5457]
    }
  ],
  'Tirta Empul': [
    {
      name: 'Warung Babi Guling Ibu Oka (Ubud Kuliner Legendaris)',
      category: 'food',
      rating: 4.4,
      distance: '850m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Babi+Guling+Ibu+Oka+Tampaksiring',
      coordinates: [115.3130, -8.4180]
    },
    {
      name: 'Kopi Luwak Tampaksiring (Edukasi Kopi Bali)',
      category: 'cafe',
      rating: 4.6,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Coffee+Plantation+Tampaksiring',
      coordinates: [115.3150, -8.4177]
    }
  ],
  'Coffee Plantation': [
    {
      name: 'Satria Coffee Plantation (Agrowisata Organik)',
      category: 'activity',
      rating: 4.7,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Satria+Coffee+Plantation+Bali',
      coordinates: [115.2602, -8.5487]
    },
    {
      name: 'Cantik Agriculture (Sunset Coffee Testing)',
      category: 'cafe',
      rating: 4.5,
      distance: '350m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cantik+Agriculture+Bali',
      coordinates: [115.3352, -8.3835]
    }
  ],
  'Kintamani': [
    {
      name: 'Akasa Specialty Coffee (Ngopi Atas Awan & View Batur)',
      category: 'cafe',
      rating: 4.6,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Akasa+Specialty+Coffee+Kintamani',
      coordinates: [115.3576, -8.2796]
    },
    {
      name: 'El Lago Bali (Japanese Culinary & Lake View)',
      category: 'food',
      rating: 4.5,
      distance: '450m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=El+Lago+Kintamani',
      coordinates: [115.3420, -8.2675]
    },
    {
      name: 'Tegalalang - Kintamani Crater Ridge Path',
      category: 'photo',
      rating: 4.9,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mount+Batur+View+Point+Kintamani',
      coordinates: [115.3550, -8.2520]
    }
  ],
  'Tegalalang Rice Terrace': [
    {
      name: 'Cretya Ubud by Alas Harum (Resto & Pool Day Club)',
      category: 'cafe',
      rating: 4.7,
      distance: '400m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cretya+Ubud',
      coordinates: [115.2810, -8.4400]
    },
    {
      name: 'Alas Harum Giant Bali Swing',
      category: 'activity',
      rating: 4.8,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Alas+Harum+Ubud',
      coordinates: [115.2807, -8.4398]
    },
    {
      name: 'Tegalalang Terrace Photo Spot',
      category: 'photo',
      rating: 4.7,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tegalalang+Rice+Terrace+Ubud',
      coordinates: [115.2793, -8.4317]
    }
  ],
  'Tukad Cepung Waterfall': [
    {
      name: 'Cepung Cave Sunlight Ray Spot',
      category: 'photo',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tukad+Cepung+Waterfall+Bali',
      coordinates: [115.3868, -8.4410]
    },
    {
      name: 'Warung Cepung (Kuliner Lokal)',
      category: 'food',
      rating: 4.4,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Tukad+Cepung',
      coordinates: [115.3869, -8.4412]
    }
  ],
  'Pandawa Beach': [
    {
      name: 'Roosterfish Beach Club (Family Beach Club & Pool)',
      category: 'cafe',
      rating: 4.5,
      distance: '800m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Roosterfish+Beach+Club',
      coordinates: [115.1882, -8.8438]
    },
    {
      name: 'Pandawa Beach Canoeing (Sewa Kano Pantai)',
      category: 'activity',
      rating: 4.6,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandawa+Beach+Canoe',
      coordinates: [115.1858, -8.8445]
    },
    {
      name: 'Tebing Kapur Pandawa (Instagramable Highway Cliffs)',
      category: 'photo',
      rating: 4.8,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandawa+Beach+Cliff',
      coordinates: [115.1744, -8.8458]
    }
  ],
  'GWK Cultural Park': [
    {
      name: 'Jendela Bali Panoramic Restaurant (Resto Pemandangan Atas)',
      category: 'food',
      rating: 4.4,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jendela+Bali+Panoramic+Restaurant',
      coordinates: [115.1680, -8.8087]
    },
    {
      name: 'Lotus Pond Amphitheater Plaza',
      category: 'activity',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Pond+GWK',
      coordinates: [115.1674, -8.8102]
    }
  ],
  'Uluwatu Temple': [
    {
      name: 'Uluwatu Kecak Dance Amphitheater (Sunset Performance)',
      category: 'activity',
      rating: 4.8,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kecak+Dance+Uluwatu',
      coordinates: [115.0854, -8.8307]
    },
    {
      name: 'Single Fin Bali (Sunset Cliff Beach Club)',
      category: 'cafe',
      rating: 4.5,
      distance: '1.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Single+Fin+Bali',
      coordinates: [115.0889, -8.8149]
    },
    {
      name: 'Suluban Beach Secret Cliff View',
      category: 'photo',
      rating: 4.7,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Suluban+Beach',
      coordinates: [115.0938, -8.8145]
    }
  ],
  'Jimbaran Beach': [
    {
      name: 'Menega Cafe (Seafood Bakar Legendaris Jimbaran)',
      category: 'food',
      rating: 4.5,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Menega+Cafe+Jimbaran',
      coordinates: [115.1645, -8.7807]
    },
    {
      name: 'Jimbaran Seafood Sunset Bay',
      category: 'photo',
      rating: 4.8,
      distance: '20m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jimbaran+Sunset+View',
      coordinates: [115.1610, -8.7830]
    }
  ],
  'Tanah Lot': [
    {
      name: 'Tanah Lot Cliff Sunset Terrace',
      category: 'photo',
      rating: 4.8,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tanah+Lot+Sunset+Terrace',
      coordinates: [115.0868, -8.6186]
    },
    {
      name: 'Deusa Coffee & Eatery Tanah Lot',
      category: 'cafe',
      rating: 4.5,
      distance: '600m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Deusa+Coffee+Tanah+Lot',
      coordinates: [115.0910, -8.6180]
    }
  ],
  'Jatiluwih Rice Terrace': [
    {
      name: 'Jatiluwih UNESCO Rice Fields Trekking',
      category: 'activity',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jatiluwih+Rice+Terraces',
      coordinates: [115.1312, -8.3701]
    },
    {
      name: 'Billy\'s Terrace Cafe Jatiluwih',
      category: 'food',
      rating: 4.4,
      distance: '350m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Billys+Terrace+Cafe+Jatiluwih',
      coordinates: [115.1309, -8.3702]
    }
  ],
  'Ulun Danu Beratan': [
    {
      name: 'Ulun Danu Beratan Iconic Pagoda Photo Spot',
      category: 'photo',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pura+Ulun+Danu+Beratan',
      coordinates: [115.1668, -8.2752]
    },
    {
      name: 'Mentari Restaurant (Traditional Buffet Resto)',
      category: 'food',
      rating: 4.3,
      distance: '400m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mentari+Restaurant+Bedugul',
      coordinates: [115.1653, -8.2786]
    }
  ],
  'Handara Gate': [
    {
      name: 'Handara Golf Resort Cliff Resto',
      category: 'food',
      rating: 4.4,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Handara+Gate+Restaurant',
      coordinates: [115.1612, -8.2452]
    },
    {
      name: 'Wanagiri Hidden Hills (Ayunan Danau & Spot Foto)',
      category: 'photo',
      rating: 4.7,
      distance: '4.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wanagiri+Hidden+Hills',
      coordinates: [115.1075, -8.2403]
    }
  ],
  'Taman Ayun': [
    {
      name: 'Warung Rekreasi Bedugul (Taman Ayun Branch)',
      category: 'food',
      rating: 4.5,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Rekreasi+Taman+Ayun',
      coordinates: [115.1650, -8.5350]
    }
  ],
  'Lempuyang Temple': [
    {
      name: 'Lahangan Sweet (Pemandangan Gunung Agung Spektakuler)',
      category: 'photo',
      rating: 4.8,
      distance: '3.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lahangan+Sweet',
      coordinates: [115.6386, -8.3719]
    },
    {
      name: 'Lempuyang Resto & Bar',
      category: 'food',
      rating: 4.2,
      distance: '500m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lempuyang+Restaurant',
      coordinates: [115.6360, -8.3910]
    }
  ],
  'Bhanuswari Resort & Spa': [
    {
      name: 'Taman Kupu-Kupu Kemenuh (Konservasi & Wisata)',
      nameEn: 'Kemenuh Butterfly Park (Butterfly Conservation & Garden)',
      nameId: 'Taman Kupu-Kupu Kemenuh (Konservasi & Edukasi Wisata)',
      category: 'activity',
      rating: 4.5,
      distance: '1.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kemenuh+Butterfly+Park',
      coordinates: [115.2871, -8.5728]
    },
    {
      name: 'Air Terjun Sumampan (Alami & Tersembunyi)',
      nameEn: 'Sumampan Waterfall (Scenic Hidden Gem Jungle Falls)',
      nameId: 'Air Terjun Sumampan (Eksotis & Alami Tersembunyi)',
      category: 'photo',
      rating: 4.6,
      distance: '2.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sumampan+Waterfall',
      coordinates: [115.2904, -8.5515]
    },
    {
      name: 'Tonyraka Art Gallery & Cafe',
      nameEn: 'Tonyraka Art Gallery & Cafe (Contemporary Art & Specialty Coffee)',
      nameId: 'Tonyraka Art Gallery & Cafe (Seni Kontemporer & Kopi Premium)',
      category: 'cafe',
      rating: 4.6,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tonyraka+Art+Gallery',
      coordinates: [115.2722, -8.5475]
    },
    {
      name: 'Bebek Tebasari Resto',
      nameEn: 'Bebek Tebasari Resto (Premium Balinese Heritage Dining)',
      nameId: 'Bebek Tebasari Resto (Kuliner Bebek Tradisional Premium)',
      category: 'food',
      rating: 4.8,
      distance: '3.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bebek+Tebasari+Resto',
      coordinates: [115.2566, -8.5457]
    }
  ],
  'Jimbaran Bay Beach Resort': [
    {
      name: 'Pantai Kedonganan Sunset',
      nameEn: 'Kedonganan Beach Sunset (Golden Sands & Fishing Boats)',
      nameId: 'Pantai Kedonganan (Sunset Keemasan & Nelayan Tradisional)',
      category: 'photo',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kedonganan+Beach',
      coordinates: [115.1692, -8.7594]
    },
    {
      name: 'Cuca Restaurant Bali',
      nameEn: 'Cuca Restaurant Bali (Award-Winning Creative Tapas & Fine Dining)',
      nameId: 'Cuca Restaurant Bali (Kuliner Kreatif Modern & Fine Dining Legendaris)',
      category: 'food',
      rating: 4.8,
      distance: '900m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cuca+Restaurant+Jimbaran',
      coordinates: [115.1699, -8.7731]
    },
    {
      name: 'Samasta Lifestyle Village',
      nameEn: 'Samasta Lifestyle Village (Premium Cafes, Eateries & Craft Shops)',
      nameId: 'Samasta Lifestyle Village (Pusat Kuliner, Kafe & Belanja Premium)',
      category: 'cafe',
      rating: 4.6,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Samasta+Lifestyle+Village',
      coordinates: [115.1645, -8.7854]
    },
    {
      name: 'Jenggala Keramik Bali',
      nameEn: 'Jenggala Ceramics (Paint-a-Pot Ceramic Workshop & Showroom)',
      nameId: 'Jenggala Keramik (Edukasi Mewarnai & Galeri Keramik Mewah)',
      category: 'activity',
      rating: 4.6,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jenggala+Keramik+Jimbaran',
      coordinates: [115.1705, -8.7849]
    }
  ]
};
