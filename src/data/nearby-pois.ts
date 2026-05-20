export interface NearbyPOI {
  name: string;
  nameEn?: string;
  nameId?: string;
  subtitleEn?: string;
  subtitleId?: string;
  category: 'food' | 'photo' | 'cafe' | 'activity';
  rating: number;
  distance: string;
  googleMapsUrl: string;
  coordinates: [number, number]; // [lng, lat]
}

export const NEARBY_POIS: Record<string, NearbyPOI[]> = {
  'Kelingking Beach': [
    {
      name: 'Paluang Cliff',
      subtitleEn: 'Stunning Cliffside Viewpoint of Kelingking from the Other Side',
      subtitleId: 'Spot Foto Tebing Indah Sisi Lain Kelingking',
      category: 'photo',
      rating: 4.8,
      distance: '850m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Paluang+Cliff+Nusa+Penida',
      coordinates: [115.476906, -8.753733]
    },
    {
      name: 'Kelingking Sunset Point Bar',
      subtitleEn: 'Chill Spot for Coconut Drinks and Sunset Views',
      subtitleId: 'Tempat Santai untuk Minum Kelapa & View Sunset',
      category: 'cafe',
      rating: 4.4,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kelingking+Sunset+Point+Bar+Nusa+Penida',
      coordinates: [115.476611, -8.750611]
    },
    {
      name: 'Secret Point Warung Kelingking',
      subtitleEn: 'Local Balinese Dishes Right Above the Trailhead',
      subtitleId: 'Kuliner Lokal Bali Tepat di Atas Jalur Turun',
      category: 'food',
      rating: 4.5,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Secret+Point+Warung+Kelingking',
      coordinates: [115.477211, -8.746622]
    }
  ],

  'Broken Beach': [
    {
      name: 'Angel\'s Billabong Cafe',
      subtitleEn: 'Cliffside Resto Overlooking the Turquoise Inlet',
      subtitleId: 'Resto Pinggir Tebing dengan View Air Laut Toska',
      category: 'cafe',
      rating: 4.2,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Angels+Billabong+Cafe+Nusa+Penida',
      coordinates: [115.449110, -8.733120]
    },
    {
      name: 'Warung Green Car Park',
      subtitleEn: 'Simple Local Warung for Cold Drinks and Snacks',
      subtitleId: 'Warung Lokal Sederhana untuk Minuman Dingin & Camilan',
      category: 'food',
      rating: 4.3,
      distance: '350m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Green+Car+Park+Nusa+Penida',
      coordinates: [115.448920, -8.731550]
    }
  ],

  'Angel Billabong': [
    {
      name: 'Angel\'s Billabong Cafe',
      subtitleEn: 'Cliffside Resto Overlooking the Turquoise Inlet',
      subtitleId: 'Resto Pinggir Tebing dengan View Air Laut Toska',
      category: 'cafe',
      rating: 4.2,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Angels+Billabong+Cafe+Nusa+Penida',
      coordinates: [115.449110, -8.733120]
    },
    {
      name: 'Warung Angel Nusa Penida',
      subtitleEn: 'Indonesian Comfort Food Near the Natural Pool',
      subtitleId: 'Masakan Rumah Indonesia Dekat Kolam Alami',
      category: 'food',
      rating: 4.3,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Angel+Nusa+Penida',
      coordinates: [115.450210, -8.732410]
    }
  ],

  'Crystal Bay': [
    {
      name: 'Crystal Bay Beach Club',
      subtitleEn: 'Tropical Beachfront Lounge & Sunset Cocktails',
      subtitleId: 'Lounge Pinggir Pantai & Koktail Sunset Populer',
      category: 'cafe',
      rating: 4.4,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Crystal+Bay+Beach+Club',
      coordinates: [115.459234, -8.715612]
    },
    {
      name: 'Snorkeling Point Crystal Bay',
      subtitleEn: 'Coral Reef Exploration & Boat Rental',
      subtitleId: 'Eksplorasi Terumbu Karang & Sewa Perahu Lokal',
      category: 'activity',
      rating: 4.7,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Snorkeling+Crystal+Bay+Nusa+Penida',
      coordinates: [115.459100, -8.715600]
    },
    {
      name: 'Amok Sunset',
      subtitleEn: 'Famous Treetop Nest Bar with Sunset Ocean View',
      subtitleId: 'Bar Sarang Burung Terkenal dengan View Sunset Laut',
      category: 'cafe',
      rating: 4.5,
      distance: '6.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Amok+Sunset+Nusa+Penida',
      coordinates: [115.443110, -8.705122]
    }
  ],

  'Tegenungan Waterfall': [
    {
      name: 'Omma Dayclub Bali',
      subtitleEn: 'Luxury Riverside Pool Club with Waterfall View',
      subtitleId: 'Klub Kolam Mewah Tepi Sungai & View Air Terjun',
      category: 'cafe',
      rating: 4.6,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Omma+Dayclub+Bali',
      coordinates: [115.289511, -8.575611]
    },
    {
      name: 'D\'Tukad River Club',
      subtitleEn: 'Treehouse Concept Dayclub and Swing Experience',
      subtitleId: 'Dayclub Konsep Rumah Pohon & Wahana Ayunan',
      category: 'cafe',
      rating: 4.3,
      distance: '250m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=D+Tukad+River+Club+Bali',
      coordinates: [115.289940, -8.574920]
    },
    {
      name: 'Tegenungan Swing & Photo Point',
      subtitleEn: 'Iconic Jungle Swing and Instagram Photo Spots',
      subtitleId: 'Ayunan Hutan Ikonik & Spot Foto Instagramable',
      category: 'photo',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tegenungan+Swing+and+Photo+Point',
      coordinates: [115.289000, -8.575400]
    }
  ],

  'Tirta Empul': [
    {
      name: 'Pura Mengening',
      subtitleEn: 'Peaceful and Less Crowded Water Purification Temple',
      subtitleId: 'Pura Melukat yang Tenang dan Bebas Antrean Padat',
      category: 'activity',
      rating: 4.8,
      distance: '1.1km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pura+Mengening+Tampaksiring',
      coordinates: [115.313450, -8.414320]
    },
    {
      name: 'Kopi Luwak Tampaksiring',
      subtitleEn: 'Traditional Coffee Plantation & Tasting Tour',
      subtitleId: 'Edukasi Kebun Kopi Tradisional & Sesi Cicip Kopi',
      category: 'cafe',
      rating: 4.6,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Coffee+Plantation+Tampaksiring',
      coordinates: [115.315000, -8.417700]
    },
    {
      name: 'Warung Kawi Tampaksiring',
      subtitleEn: 'Local Crispy Duck and Indonesian Specialty Food',
      subtitleId: 'Bebek Goreng Krispi Lokal & Masakan Khas Nusantara',
      category: 'food',
      rating: 4.5,
      distance: '950m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Kawi+Tampaksiring',
      coordinates: [115.310850, -8.423110]
    }
  ],

  'Coffee Plantation': [
    {
      name: 'Satria Coffee Plantation',
      subtitleEn: 'Organic Agro-Tourism & Balinese Tea Experience',
      subtitleId: 'Agrowisata Organik & Edukasi Teh Herbal Bali',
      category: 'activity',
      rating: 4.7,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Satria+Coffee+Plantation+Bali',
      coordinates: [115.260200, -8.548700]
    },
    {
      name: 'Uma Pakel Agro Tourism',
      subtitleEn: 'Jungle Swing & Herbal Coffee Tasting Overlooking the Valley',
      subtitleId: 'Ayunan Hutan & Cicip Kopi Herbal View Lembah',
      category: 'activity',
      rating: 4.6,
      distance: '450m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Uma+Pakel+Agro+Tourism+Ubud',
      coordinates: [115.259910, -8.546120]
    },
    {
      name: 'Cretya Lite by Alas Harum',
      subtitleEn: 'Trendy Jungle Café and Pool Lounge Access',
      subtitleId: 'Kafe Hutan Hits & Akses Pool Lounge Santai',
      category: 'cafe',
      rating: 4.5,
      distance: '800m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cretya+Lite+by+Alas+Harum',
      coordinates: [115.261150, -8.541120]
    }
  ],

  'Kintamani': [
    {
      name: 'Akasa Specialty Coffee',
      subtitleEn: 'Trendy Cafe Above the Clouds with Mount Batur View',
      subtitleId: 'Kafe Hits di Atas Awan dengan View Gunung Batur',
      category: 'cafe',
      rating: 4.6,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Akasa+Specialty+Coffee+Kintamani',
      coordinates: [115.357600, -8.279600]
    },
    {
      name: 'Ritatkala Cafe',
      subtitleEn: 'Aesthetic Modern Minimalist Cafe with Caldera Panorama',
      subtitleId: 'Kafe Estetik Minimalis Modern dengan Panorama Kaldera',
      category: 'cafe',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ritatkala+Cafe+Kintamani',
      coordinates: [115.356940, -8.278910]
    },
    {
      name: 'Paperhills',
      subtitleEn: 'Instagrammable Pastel-Themed Cafe Facing the Volcano',
      subtitleId: 'Kafe Instagenic Bertema Pastel Menghadap Gunung',
      category: 'cafe',
      rating: 4.6,
      distance: '600m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Paperhills+Kintamani',
      coordinates: [115.359120, -8.281150]
    },
    {
      name: 'El Lago Bali',
      subtitleEn: 'Modern Japanese Restaurant with Batur Lake Panorama',
      subtitleId: 'Restoran Jepang Modern dengan Panorama Danau Batur',
      category: 'food',
      rating: 4.5,
      distance: '450m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=El+Lago+Kintamani',
      coordinates: [115.342000, -8.267500]
    },
    {
      name: 'Batur Natural Hot Spring',
      subtitleEn: 'Relaxing Geothermal Pools at the Base of the Mountain',
      subtitleId: 'Pemandian Air Panas Alami Alami di Kaki Gunung',
      category: 'activity',
      rating: 4.4,
      distance: '9.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Batur+Natural+Hot+Spring+Kintamani',
      coordinates: [115.398120, -8.243550]
    }
  ],

  'Tegalalang Rice Terrace': [
    {
      name: 'Cretya Ubud by Alas Harum',
      subtitleEn: 'Luxury Restaurant & Multi-Tiered Pool Day Club',
      subtitleId: 'Resto Mewah & Klub Kolam Bertingkat View Sawah',
      category: 'cafe',
      rating: 4.7,
      distance: '400m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cretya+Ubud',
      coordinates: [115.281000, -8.440000]
    },
    {
      name: 'Alas Harum Giant Bali Swing',
      subtitleEn: 'Thrilling High Swings and Adventure Activities',
      subtitleId: 'Wahana Ekstrem Ayunan Tinggi & Aktivitas Petualangan',
      category: 'activity',
      rating: 4.8,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Alas+Harum+Ubud',
      coordinates: [115.280700, -8.439800]
    },
    {
      name: 'Tis Cafe Ubud',
      subtitleEn: 'Bamboo Architecture Restaurant with Infinity Pool and Swing',
      subtitleId: 'Resto Arsitektur Bambu dengan Kolam Infinity & Ayunan',
      category: 'cafe',
      rating: 4.5,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tis+Cafe+Tegalalang+Ubud',
      coordinates: [115.279880, -8.433450]
    }
  ],

  'Tukad Cepung Waterfall': [
    {
      name: 'Cepung Cave Sunlight Ray Spot',
      subtitleEn: 'Magical Sunbeams Inside a Hidden Canyon Cave',
      subtitleId: 'Cahaya Ilahi Mistis di Dalam Goa Air Terjun Tersembunyi',
      category: 'photo',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tukad+Cepung+Waterfall+Bali',
      coordinates: [115.386800, -8.441000]
    },
    {
      name: 'Warung Cepung',
      subtitleEn: 'Simple Local Warung with Authentic Balinese Food',
      subtitleId: 'Warung Lokal Sederhana dengan Masakan Otentik Bali',
      category: 'food',
      rating: 4.4,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Tukad+Cepung',
      coordinates: [115.386900, -8.441200]
    }
  ],

  'Pandawa Beach': [
    {
      name: 'Roosterfish Beach Club',
      subtitleEn: 'Vibrant Family Beach Club with Large Main Pool',
      subtitleId: 'Beach Club Keluarga yang Seru dengan Kolam Renang Luas',
      category: 'cafe',
      rating: 4.5,
      distance: '800m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Roosterfish+Beach+Club',
      coordinates: [115.188200, -8.843800]
    },
    {
      name: 'Pandawa Beach Canoeing',
      subtitleEn: 'Fun Ocean Canoe Rentals on Calm Shallow Waters',
      subtitleId: 'Sewa Kano Pantai untuk Mendayung di Air Tenang',
      category: 'activity',
      rating: 4.6,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandawa+Beach+Canoe',
      coordinates: [115.185800, -8.8445]
    },
    {
      name: 'Tebing Kapur Pandawa',
      nameEn: 'Pandawa Limestone Cliffs',
      nameId: 'Tebing Kapur Pandawa',
      subtitleEn: 'Majestic Carved Cliffs with Giant Statues Way',
      subtitleId: 'Jalanan Megah Diapit Tebing Kapur & Patung Pandawa',
      category: 'photo',
      rating: 4.8,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandawa+Beach+Cliff',
      coordinates: [115.174400, -8.845800]
    }
  ],

  'GWK Cultural Park': [
    {
      name: 'Jendela Bali Panoramic Restaurant',
      subtitleEn: 'Hilltop Dining with Sweeping City and Sea Views',
      subtitleId: 'Resto Atas Bukit dengan Pemandangan Kota & Laut Luas',
      category: 'food',
      rating: 4.4,
      distance: '300m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jendela+Bali+Panoramic+Restaurant',
      coordinates: [115.168000, -8.808700]
    },
    {
      name: 'Lotus Pond Amphitheater Plaza',
      subtitleEn: 'Massive Outdoor Venue for Cultural Festivals and Events',
      subtitleId: 'Area Terbuka Raksasa untuk Festival & Acara Budaya',
      category: 'activity',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lotus+Pond+GWK',
      coordinates: [115.167400, -8.810200]
    }
  ],

  'Uluwatu Temple': [
    {
      name: 'Uluwatu Kecak Dance Amphitheater',
      subtitleEn: 'Mesmerizing Cultural Fire Dance Against the Sunset',
      subtitleId: 'Pertunjukan Magis Tari Kecak Api Berlatar Sunset Laut',
      category: 'activity',
      rating: 4.8,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kecak+Dance+Uluwatu',
      coordinates: [115.085400, -8.830700]
    },
    {
      name: 'Single Fin Bali',
      subtitleEn: 'Famous Surf-Vibe Cliffside Club & Sunset Lounge',
      subtitleId: 'Klub Surfer Populer di Tebing Sunset Uluwatu',
      category: 'cafe',
      rating: 4.5,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Single+Fin+Bali',
      coordinates: [115.088900, -8.814900]
    },
    {
      name: 'Mana Uluwatu',
      subtitleEn: 'Trendy Cliffside Restaurant with Infinity Pool and Surf Break Views',
      subtitleId: 'Resto Tebing Hits dengan Kolam Infinity & View Laut Lepas',
      category: 'cafe',
      rating: 4.6,
      distance: '2.1km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mana+Uluwatu+Bali',
      coordinates: [115.090120, -8.813950]
    }
  ],

  'Jimbaran Beach': [
    {
      name: 'Menega Cafe',
      subtitleEn: 'Legendary Seafood Charcoal Grill Right on the Sand',
      subtitleId: 'Kuliner Seafood Bakar Arang Legendaris di Atas Pasir Pantai',
      category: 'food',
      rating: 4.5,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Menega+Cafe+Jimbaran',
      coordinates: [115.164500, -8.780700]
    },
    {
      name: 'Jimbaran Seafood Sunset Bay',
      subtitleEn: 'Stunning Golden Hour Photography by the Shoreline',
      subtitleId: 'Momen Foto Golden Hour Terbaik di Pinggiran Pesisir',
      category: 'photo',
      rating: 4.8,
      distance: '20m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jimbaran+Sunset+View',
      coordinates: [115.161000, -8.783000]
    }
  ],

  'Tanah Lot': [
    {
      name: 'Tanah Lot Cliff Sunset Terrace',
      subtitleEn: 'Panoramic High-Angle View of the Sea Temple',
      subtitleId: 'Sudut Pandang Tinggi Sunset Menghadap Pura Laut',
      category: 'photo',
      rating: 4.8,
      distance: '100m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tanah+Lot+Sunset+Terrace',
      coordinates: [115.086800, -8.618600]
    },
    {
      name: 'Deusa Coffee & Eatery Tanah Lot',
      subtitleEn: 'Cozy Modern Cafe for Pre-Sunset Specialty Coffee',
      subtitleId: 'Kafe Modern yang Nyaman untuk Kopi Premium Sebelum Sunset',
      category: 'cafe',
      rating: 4.5,
      distance: '600m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Deusa+Coffee+Tanah+Lot',
      coordinates: [115.091000, -8.618000]
    }
  ],

  'Jatiluwih Rice Terrace': [
    {
      name: 'Jatiluwih UNESCO Rice Fields Trekking',
      subtitleEn: 'Immersive Walking Trails Through Emerald Green Terrains',
      subtitleId: 'Jalur Jalan Kaki Edukatif Menembus Hamparan Sawah Hijau',
      category: 'activity',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jatiluwih+Rice+Terraces',
      coordinates: [115.131200, -8.370100]
    },
    {
      name: 'Billy\'s Terrace Cafe Jatiluwih',
      subtitleEn: 'Indonesian Buffet Dining Overlooking Wide Rice Fields',
      subtitleId: 'Resto Buffet Indonesia dengan View Hamparan Sawah Luas',
      category: 'food',
      rating: 4.4,
      distance: '350m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Billys+Terrace+Cafe+Jatiluwih',
      coordinates: [115.130900, -8.370200]
    }
  ],

  'Ulun Danu Beratan': [
    {
      name: 'Ulun Danu Beratan Iconic Pagoda Photo Spot',
      subtitleEn: 'Postcard-Perfect Views of the Floating Lakeside Temple',
      subtitleId: 'Spot Foto Ikonik Pura Terapung di Pinggir Danau Bedugul',
      category: 'photo',
      rating: 4.8,
      distance: '50m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pura+Ulun+Danu+Beratan',
      coordinates: [115.166800, -8.275200]
    },
    {
      name: 'Mentari Restaurant',
      subtitleEn: 'Spacious Traditional Buffet Catering to Mountain Travelers',
      subtitleId: 'Resto Prasmanan Luas yang Nyaman untuk Wisatawan Bedugul',
      category: 'food',
      rating: 4.3,
      distance: '400m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mentari+Restaurant+Bedugul',
      coordinates: [115.165300, -8.278600]
    },
    {
      name: 'Bedugul Botanical Garden',
      nameEn: 'Bali Botanic Garden',
      nameId: 'Kebun Raya Bali Bedugul',
      subtitleEn: 'Massive Highland Park Featuring Giant Trees and Ferns',
      subtitleId: 'Hutan Konservasi Dataran Tinggi yang Sejuk & Pohon Raksasa',
      category: 'activity',
      rating: 4.7,
      distance: '2.1km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bali+Botanic+Garden+Bedugul',
      coordinates: [115.152340, -8.283120]
    }
  ],

  'Handara Gate': [
    {
      name: 'Handara Golf Resort Cliff Resto',
      subtitleEn: 'Elegant Dining Setup Encircled by Cool Highlands',
      subtitleId: 'Resto Elegan dengan Suasana Dataran Tinggi yang Sejuk',
      category: 'food',
      rating: 4.4,
      distance: '200m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Handara+Gate+Restaurant',
      coordinates: [115.161200, -8.245200]
    },
    {
      name: 'Wanagiri Hidden Hills',
      subtitleEn: 'Famous Selfie Platforms and Overlooking Lake Swings',
      subtitleId: 'Spot Foto Ayunan Ekstrem & Replika Sarang Burung View Danau',
      category: 'photo',
      rating: 4.7,
      distance: '5.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wanagiri+Hidden+Hills+Bali',
      coordinates: [115.107500, -8.240300]
    }
  ],

  'Taman Ayun': [
    {
      name: 'Warung Rekreasi Bedugul',
      nameEn: 'Warung Rekreasi Taman Ayun Branch',
      nameId: 'Warung Rekreasi Cabang Taman Ayun',
      subtitleEn: 'Family-Friendly Eatery Specializing in Crispy Fried Duck',
      subtitleId: 'Rumah Makan Keluarga Spesialisasi Bebek Goreng Krispi',
      category: 'food',
      rating: 4.5,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Rekreasi+Taman+Ayun',
      coordinates: [115.165000, -8.535000]
    }
  ],

  'Lempuyang Temple': [
    {
      name: 'Lempuyang Resto & Bar',
      subtitleEn: 'Pitstop Eatery with Scenic East Bali Landscapes',
      subtitleId: 'Tempat Istirahat & Makan dengan Lanskap Indah Bali Timur',
      category: 'food',
      rating: 4.2,
      distance: '500m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lempuyang+Restaurant+Bali',
      coordinates: [115.636000, -8.391000]
    },
    {
      name: 'Lahangan Sweet',
      subtitleEn: 'Epic Mountain Viewpoint Accessible via Local 4x4 Shuttle',
      subtitleId: 'Spot Foto Rumah Pohon Epik Berlatar Gunung Agung (Akses Jip)',
      category: 'photo',
      rating: 4.8,
      distance: '12.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lahangan+Sweet+Karangasem',
      coordinates: [115.638600, -8.371900]
    }
  ],

  'Bhanuswari Resort & Spa': [
    {
      name: 'Taman Kupu-Kupu Kemenuh',
      nameEn: 'Kemenuh Butterfly Park',
      nameId: 'Taman Kupu-Kupu Kemenuh',
      subtitleEn: 'Enchanting Conservatory with Hundreds of Tropical Butterflies',
      subtitleId: 'Edukasi Penangkaran Ratusan Kupu-Kupu Cantik Tropis',
      category: 'activity',
      rating: 4.5,
      distance: '1.5km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kemenuh+Butterfly+Park',
      coordinates: [115.287100, -8.572800]
    },
    {
      name: 'Air Terjun Sumampan',
      nameEn: 'Sumampan Waterfall',
      nameId: 'Air Terjun Sumampan',
      subtitleEn: 'Off-The-Beaten-Path Jungle Falls with Stone Carvings',
      subtitleId: 'Air Terjun Hutan Tersembunyi dengan Ukiran Batu Alami',
      category: 'photo',
      rating: 4.6,
      distance: '2.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sumampan+Waterfall+Gianyar',
      coordinates: [115.290400, -8.551500]
    },
    {
      name: 'Tonyraka Art Gallery & Cafe',
      subtitleEn: 'Contemporary Art Exhibition Space Paired with Fine Brews',
      subtitleId: 'Galeri Seni Kontemporer Ubud & Tempat Ngopi Premium',
      category: 'cafe',
      rating: 4.6,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tonyraka+Art+Gallery+Ubud',
      coordinates: [115.272200, -8.547500]
    },
    {
      name: 'Bebek Tebasari Resto',
      subtitleEn: 'Premium Lakeside Bamboo Gazebos Serving Traditional Duck',
      subtitleId: 'Kuliner Bebek Tradisional Premium di Atas Saung Bambu Asri',
      category: 'food',
      rating: 4.8,
      distance: '3.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bebek+Tebasari+Resto',
      coordinates: [115.256600, -8.545700]
    }
  ],

  'Jimbaran Bay Beach Resort': [
    {
      name: 'Pantai Kedonganan Sunset',
      nameEn: 'Kedonganan Beach Sunset',
      nameId: 'Pantai Kedonganan',
      subtitleEn: 'Golden Shoreline Framed by Traditional Fishing Boats',
      subtitleId: 'Sunset Keemasan Berlatar Jajaran Perahu Nelayan Tradisional',
      category: 'photo',
      rating: 4.7,
      distance: '150m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kedonganan+Beach+Bali',
      coordinates: [115.169200, -8.759400]
    },
    {
      name: 'Cuca Restaurant Bali',
      subtitleEn: 'Critically Acclaimed Tapas and Creative Fine Dining Experience',
      subtitleId: 'Kuliner Tapas Inovatif & Destinasi Fine Dining Kelas Dunia',
      category: 'food',
      rating: 4.8,
      distance: '900m',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cuca+Restaurant+Jimbaran',
      coordinates: [115.169900, -8.773100]
    },
    {
      name: 'Samasta Lifestyle Village',
      subtitleEn: 'Trendy Open-Air Complex with Premium Cafes and Eateries',
      subtitleId: 'Pusat Kuliner Terbuka, Kafe Gaul, & Belanja Gaya Hidup',
      category: 'cafe',
      rating: 4.6,
      distance: '1.2km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Samasta+Lifestyle+Village',
      coordinates: [115.164500, -8.785400]
    },
    {
      name: 'Jenggala Keramik Bali',
      nameEn: 'Jenggala Ceramics Showroom',
      nameId: 'Galeri Jenggala Keramik',
      subtitleEn: 'Luxury Ceramic Gallery & Interactive Pottery Workshops',
      subtitleId: 'Showroom Keramik Mewah & Workshop Mewarnai Keramik',
      category: 'activity',
      rating: 4.6,
      distance: '1.8km',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jenggala+Keramik+Jimbaran',
      coordinates: [115.170500, -8.784900]
    }
  ]
};