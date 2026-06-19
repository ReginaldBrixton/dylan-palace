import { Product } from './types';

export const PRODUCTS: Product[] = [
  // ------------------ SHIRTS ------------------
  // SHORT SLEEVES
  {
    id: 'p_ss1',
    name: 'Boxy Camp Collar Shirt',
    price: 120,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A relaxed camp collar shirt crafted from breathable cotton-blend. Features a sharp flat collar, horizontal hem line, and high-contrast horn-textured buttons.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss2',
    name: 'Washed Charcoal Tee',
    price: 85,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Heavily weighted 280GSM organic cotton jersey with dry hand-feel. Features a relaxed drop shoulder, thick double-needle collar, and vintage charcoal wash tone.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_ss3',
    name: 'Bound Silk Tee',
    price: 165,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Impeccable silk-blend tee with clean bonded edge cuffs and hem. Seamless neckline finish creates a highly fluid editorial transition under suit jackets.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_blue_polo',
    name: 'Horizontal Blue Striped Knit Polo',
    price: 135,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/blue_striped_polo_1781871467033.jpg'],
    description: 'A luxurious short sleeve knit polo shirt adorned with grey and blue horizontal stripes. Features a sharp dark navy contrast collar and premium lightweight yarn construction.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_beige_polo',
    name: 'Beige Striped Knit Polo',
    price: 135,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/beige_striped_polo_1781871478659.jpg'],
    description: 'An elegant fine-knit polo shirt styled with subtle beige and tan stripes. Complemented by a solid taupe ribbed collar, presenting a highly sophisticated casual asset.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_ss_olive_polo',
    name: 'Olive Striped Knit Polo',
    price: 135,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/olive_striped_polo_1781871493351.jpg'],
    description: 'Short sleeve fine-knit polo styled with elegant olive green and charcoal grey horizontal stripes. Complete with an olive ribbed collar and structured fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_grey_white_collar_polo',
    name: 'Two-Tone Grey Knit Polo',
    price: 145,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/grey_white_collar_polo_1781871506844.jpg'],
    description: 'A striking premium knit polo shirt designed with a textured heather-grey body contrasted beautifully by a pristine white collar and modern flat placket.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_crochet_floral',
    name: 'Crochet Floral Patchwork Shirt',
    price: 240,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/crochet_floral_shirt_1781871520491.jpg'],
    description: 'An editorial masterpiece constructed from handmade colorful crochet sunflower patches. Bold, breathable open-work design finished with a classic camp collar and real wood buttons.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_ss_crochet_diamond',
    name: 'Black Diamond Crochet Shirt',
    price: 220,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/black_crochet_diamond_shirt_1781871534787.jpg'],
    description: 'Artisanal short sleeve resort knit shirt featuring a rich black crochet body highlighted by a high-contrast white diamond-lattice open lace overlay.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_ss_grey_striped_hanging',
    name: 'Retro Grey Striped Polo',
    price: 155,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/grey_striped_polo_hanging_1781871548777.jpg'],
    description: 'A premium heavy-weighted grey knit polo shirt featuring wide horizontal black stripes and delicate white accent lines. Infuses retro sport aesthetics into modern luxury.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_ss_black_ribbed_panel',
    name: 'Ribbed-Panel Black Polo',
    price: 150,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/black_ribbed_panel_polo_hanging_1781871570414.jpg'],
    description: 'A sleek black luxury knit polo shirt defined by elegant vertical ribbed columns across the chest, creating high-fashion geometric texture depth.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_green_patterned',
    name: 'Patterned Forest Green Polo',
    price: 160,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/green_patterned_polo_hanging_1781871585512.jpg'],
    description: 'Rich forest green short sleeve knit polo boasting sophisticated cream horizontal geometric diamond patterns. Perfect blend of heritage golf feel and high street luxury.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_ss_burgundy_ribbed',
    name: 'Burgundy Ribbed Knit Polo',
    price: 140,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/burgundy_ribbed_polo_hanging_1781871599021.jpg'],
    description: 'Luxury short sleeve polo shirt cut from super soft combed burgundy yarn. Standard ribbed texture throughout delivers highly tactile luxury comfort.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_ss_ghana_home',
    name: 'Ghana Federation Home Jersey',
    price: 110,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/ghana_home_jersey_1781871612980.jpg'],
    description: 'The official white home jersey for the Ghana national football team. Displays abstract high-contrast line graphical layout in pan-African red, yellow, and green, complete with the iconic bold black star at center.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_ss_ghana_away',
    name: 'Ghana Federation Away Jersey',
    price: 110,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: ['/src/assets/images/ghana_away_jersey_1781871625604.jpg'],
    description: 'The spectacular away jersey of the Ghana national team in rich yellow-gold. Styled with traditional woven fabric pattern textures and contrast green collar detailing, centering the Black Star.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    deliversBy: 'JUNE 24'
  },

  // LONG SLEEVES
  {
    id: 'p1',
    name: 'Structured Linen Shirt',
    price: 145,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAure_aVMNHdt2BMg6TPu34XgqhNUxXU9z5Rgk8snyIEfN6n9iLICxX-eVUCcmiaWvD3sgu1Z4SaGhTUhgs4DQHTrx3URv4rwUL_n3se-KIarYy9alshSK7OigGryarzkLkUT0tGBvtYPbgKy9R1npCcoPN8rweQJNw-MuA-zktFt4RuP4YuU3CTCc6hJGJS074NJZmL7DWLejcWNEPqlkmiYdbKDXNtkBbnHV97cOH2cy6zCzIfWDW85KsgE8NkAupzfinU06-JfQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXu_Yu5G00SGHohF4EBW4Fr3FnPmtW6HA03iZQAmImLu_9aBifmkhbt0F2ARbHg195AyCFrQ2pXwu4xI9AW364myCi_YPh09758Nx-9fiA0enDtYeMyGnG4LBIMEvnN1nIcdSjFXxCvpkfFWB3TZ9eCtWtw803jt6-46qVcMA9OrJQVLe1ab6O1FbB2lZw0Si1Sp5AHGa5ST9z8QeDCDofC47ahVSXP4pj6c4HuAE4XWnnBvSPN3NanHRyekAIzETm9MZQgAHaoqocw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHGwuwySVWgZW20jL8-wylteJLQu4s9jCNMlNgOFMCHMq3vE1z9AAVx-qdwGOzby_sSv5BEclXtHFdROrhGQAVHgkdbxogwrgP0dNxnYt-6NdHfdPuSfnr-r69iNhJow8FWgL4CBOwJrpQgAJZkSSNbLKi6UqqOTTwJ_3lUh6liBqMgdDayaxr81pYO63t_o8Pw59M6_FtMtmXxQVBNM7KbJRx2DsU7gEQI952SidC4idgllJLgNZS9JApxIC9oJbIzgqqjJKVANM'
    ],
    description: 'An uncompromising approach to summer shirting. Crafted from heavyweight, structured linen that maintains its architectural silhouette throughout the day. Features a hidden placket and zero visible stitching for extreme precision.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p2',
    name: 'Oxford Poplin Shirt',
    price: 180,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdj42punBiYK1T6b-9Eyp9folakIRbNILE_81WEecrAK16N1liLKVOoSMU_XZ-pT8ER3lDNWS4qXw59QujNRK8KfDh9NSPHdvq__rvrlHNoMhsNu_SYhWGvb346ZtyzP6WavOEouO1w2benKzBh3PhWYO0AKMzy_t-5Blx4iwsOi7hWbhKQKurAGEhGSGOK65-R_GP9Agute2byhYTcplbG9LJAJUJLICL0s1YpFRKCt2CEYtFxCGpAIm6oGUzUL2Ot615j4U_uWQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDVonnL7znyj58_aytCNIqT8ck7Q1G9c-_Sre1Wr4Pg8ZsaGmhJx3KBJW8B6HRlXzVSSHRM0MxNJKZADOmnKvYlBjfDCMNbl2f-bXakvUxV_9UNzf-CzDWzPDL3NUiv638Re-s2-NMkIX5KyImJIGilRwcowsRw5DIcMtGii9TATB38l0mpOU2g-4EiS_5rMHmXyso1qxap1fTYkn_pufMDCMA6L_3cQiYQxm7EIpQOPeNLgKPNYwXMhEj4SnPga0NtutkYP1PzYo'
    ],
    description: 'Impeccably tailored white button-down shirt. Features crisp single-needle stitching, structured premium double-ply cotton poplin for a crisp fall, and clean geometric lines.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p3',
    name: 'Denim Overshirt',
    price: 220,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEk44j71YsvnMy-t8t2i7z0UW9X9xFCar0Edfu7d7U0A7x17jnF-czSs4hcyTLzHHCBeubi4yaPZxPjp6fREr75Pa5x_MVzOaJy-3qnJpUpAN3LZUTmadcjLotldbG0pT1B-IgQ83UBR2Gvz3Yv3bRrGPpKqfgji7d6Vf57-ZWaC4-Xy75Gu-Rtp3Z9Lr6tR2DEG22uo_JbA7bCSvc689u7ZDLGt5s9f29J5YddgjLTuDpJzCtuH_eOgcHCi5sAD8PAKGbd3-ph7o'
    ],
    description: 'Heavyweight raw denim overshirt styled with a stark, modern aesthetic. Silver polished button snaps and geometric double breast chest pockets provide high-contrast functionality.',
    sizes: ['M', 'L', 'XL'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p4',
    name: 'Silk Chiffon Shirt',
    price: 310,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClO1GLCqV9lXmEc7gVqBGkg1tmgn8aPzktoLygjsor9v5JcOjKmrOlk8c9AZP3qCF5YTwyG6ZKlVe7_IVFH7sJ42wJfIQjzYyzniRIw_uCJJbj8tOjwW37ZAYn4lYV3dqXqlQNLLPk36A5-dNo7qTM3smFaOgim6LWi0CXDWPFmthEkOGf9KdqXeUvkaBZBH2vRkeXXXAF1X_KpotgFdYI9cqCHVVwZD_OCve-v9NE4bd5eek6TCaCVEOCt3DQ93rMR8nzq46EyE4'
    ],
    description: 'Pure flowing off-white silk chiffon shirt. Extremely smooth drape with translucent features, giving a dramatic airy look that transitions beautifully between environments.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p5',
    name: 'Structured Shacket',
    price: 450,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxEIcUnipviGx4AmBjMLWIbAgrwVbsXIxxOsNXYQxB4cPlaaTLlPz1QkHree06tpkKvNLFviZBW7sI-1lgL4ciYtYAkNLcPMhzPYXiIhqZevTeAAhDM13UsknIRs7boKjaAZp9lZ6m6kzJHCEAAxKUm0HnH8RZHHZ5ppEIBjHAEVIj4tI6po_6Cc7uhHLA9fsL0fQvj44ayaD0rN45Gfr_-B3Ua17TUK4XlzjYEVgNbRlWURUd2Q8LGPgYLmuxu1c4IEK6aQn4W4U'
    ],
    description: 'A striking design hybrid between a structured jacket and a minimal shirt. Heavy architectural tailoring makes this charcoal beauty stand on its own feet.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p6',
    name: 'Striped Poplin',
    price: 195,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUbtlMk4M0ZKH30C3MU0xeBudAQq89zCZYdHeq433YjmrjyGgNoWbeMsL9tCrVDupS3F9yRZpl_EJf8GuF5A8KT2eiRm32WkMMSs0SKRQ1i4SYjdnIWMCTGCTFWgwBBlKfaKAyD1lYKXg7fIKMENYgqpUYhn2Ut0sk8iSbIkWVO0Dw33IhipIpGHr_C1VNhvM_L7CXvh0d_qkb6rEAMNYG6pmTQqzmGL6RTnaN5VxsKOm0J4tYzMS1tRpVarZwRsdwQK0SFsRz4k'
    ],
    description: 'Fine blue and white striped cotton poplin pattern with classic single-button cuffs. Crafted with high stitch density for maximum luxury and long-lasting editorial shape.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },

  // SINGLETS
  {
    id: 'p_si1',
    name: 'Ribbed Knit Singlet',
    price: 75,
    category: 'SHIRTS',
    subCategory: 'SINGLETS',
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Classic ribbed athletic singlet cut from heavy organic cotton-modal yarn. Deep scooped neckline, wide shoulder straps, and tailored side darts for a raw brutal shape.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_si2',
    name: 'Raw Asymmetric Vest',
    price: 95,
    category: 'SHIRTS',
    subCategory: 'SINGLETS',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Architectural asymmetric knit singlet. Curved side slits and unfinished flat hems create a perfect layering tool with high visual rhythm.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 26'
  },


  // ------------------ TROUSERS ------------------
  // SHORTS
  {
    id: 'p_tr_s1',
    name: 'Brutalist Cargo Shorts',
    price: 110,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Heavy architectural cotton shorts with flat cargo pockets flushed to the side seams. Hidden button flies, zero outward hardware, and clean raw edges.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_s2',
    name: 'Pleated Walk Shorts',
    price: 135,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crisp wide-leg pleated shorts crafted from visual structure drill twill. Sharp front creasing ensures an impeccably modern street presence.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s_chevron',
    name: 'Dual Chevron Athletic Shorts',
    price: 95,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    images: ['/src/assets/images/dual_chevron_shorts_1781871636731.jpg'],
    description: 'Premium casual training shorts package containing a deep black pair and an off-white cream pair. Finished with a clean contrasting double-chevron logo at left hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_s_circular',
    name: 'Circular Patch Sweat Shorts',
    price: 85,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    images: ['/src/assets/images/circular_patch_shorts_1781871648872.jpg'],
    description: 'Ultra cozy sweat shorts crafted in delicate pastel cream-yellow heavy fleece cotton. Featuring a high contrast custom circular branding emblem on left hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },

  // LONG TROUSERS
  {
    id: 'p_tr_l1',
    name: 'Wide-Leg Pleated Trousers',
    price: 245,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'An elegant long-cut trouser crafted from smooth luxury wool twill. Intricate double pleating creates an oversized fluid fall, structured down to the shoe line.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_l2',
    name: 'Minimal Straight Trousers',
    price: 190,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    images: [
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crisply pressed straight leg trousers. Features deep set side slip pockets, integrated belt tracks, and hidden clean pocket closures at the back.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },

  // JEANS
  {
    id: 'p_tr_j1',
    name: 'Raw Selvedge Denim',
    price: 210,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop'
    ],
    description: '14.5oz rigid selvedge denim cut with a clean mid-rise. Stiff raw structure that breaks beautifully with personal wear, showing red-line contrast selvedge when cuffed.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_j2',
    name: 'Oversized Charcoal Jeans',
    price: 185,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A relaxed boxy denim cut in faded slate wash. Clean minimal copper-free black metal rivets and pristine back leather-patch branding.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },

  // KHAKI
  {
    id: 'p_tr_k1',
    name: 'Tapered Utility Khakis',
    price: 165,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Slightly tapered utilitarian chinos cut from high-quality heavy sand-sand cotton gabardine. Resists wrinkles naturally with its rigid heavyweight structure.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 24'
  },


  // ------------------ SHOES ------------------
  // SNEAKERS
  {
    id: 'p_sh_sn1',
    name: 'Monolith Trail Runner',
    price: 195,
    category: 'SHOES',
    subCategory: 'SNEAKERS',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Tech trail performance runner utilizing highly structured panels, breathable mesh base, and thick vulcanized lug outer grips for maximalist contrast appeal.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_sh_sn2',
    name: 'Off-white Vulc Trainer',
    price: 140,
    category: 'SHOES',
    subCategory: 'SNEAKERS',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Clean low profile sneakers featuring premium calf leather linings, dual stitched canvas upper panels, and a completely flat vulcanized custom out-sole.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    deliversBy: 'JUNE 25'
  },

  // OXFORDS
  {
    id: 'p9',
    name: 'Avant-Garde Oxford',
    price: 290,
    category: 'SHOES',
    subCategory: 'OXFORDS',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCy8ACszouEpCdCm0bt-gsmUkauVM0Y8LXxU6U0WAyUrxzOkciewdZhi8lxcRpETwL9dbsotnE42_ESjrpOcfjMRQdSb2a8oW-gtnENPvHNxxreWRTdeTl2HG3X_qMU1cglAjYfZeM5fdah37PIHCvWa_gwIQFjpglL4o3X0I4_xjg21DB3f0kHovLUlubgOrcYwGkCk9lf5rvU2fSVrccRA-8Q0hxu0KGuzCXwdATgoq6qjZ5BKmR_2_UioLQva3rt-JjpYvDWU8'
    ],
    description: 'Avant-garde black leather lace-ups resting elegantly. Highly detailed seamless crafting, hard polished outer finish, and standard low profile block heel for uncompromised styling.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_sh_ox2',
    name: 'Polished Box-Calf Derbies',
    price: 330,
    category: 'SHOES',
    subCategory: 'OXFORDS',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Classic derby lace-ups using highly polished glass surface box-calf leather. Structured Goodyear Welt stitch construction guarantees eternal utility.',
    sizes: ['40', '41', '42', '43', '44'],
    deliversBy: 'JUNE 24'
  },

  // LOAFERS
  {
    id: 'p_sh_lo1',
    name: 'Brutalist Lug Loafer',
    price: 360,
    category: 'SHOES',
    subCategory: 'LOAFERS',
    images: [
      'https://images.unsplash.com/photo-1614252324478-f94d93026725?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A heavy, stark lug sole loafer cut from thick oily black saddle leather. Embellished with classic strap styling on a brutal high-profile geometric format.',
    sizes: ['40', '41', '42', '43', '44'],
    deliversBy: 'JUNE 24'
  },

  // BOOTS
  {
    id: 'p_sh_bo1',
    name: 'Chelsea Platform Boot',
    price: 410,
    category: 'SHOES',
    subCategory: 'BOOTS',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Sleek black calf leather ankle chelsea boot utilizing robust side stretch elastic inserts, heavy stack platform outsoles, and direct fit double pull-tabs.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_sh_gen1',
    name: 'Minimal Street Sneaker',
    price: 320,
    category: 'SHOES',
    subCategory: 'SNEAKERS',
    images: [
      '/src/assets/images/minimalist_street_sneaker_1781867805261.jpg'
    ],
    description: 'A minimalist, high-fashion street sneaker. Clean lines and a monochromatic cohesive design created for ultimate street presence.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    deliversBy: 'JULY 2'
  },
  {
    id: 'p_sh_gen2',
    name: 'Industrial Leather Boot',
    price: 480,
    category: 'SHOES',
    subCategory: 'BOOTS',
    images: [
      '/src/assets/images/brutalist_black_boot_1781867824040.jpg'
    ],
    description: 'A bold, heavy-duty black leather platform boot with a brutalist high-fashion aesthetic.',
    sizes: ['40', '41', '42', '43', '44'],
    deliversBy: 'JULY 4'
  },
  {
    id: 'p_sh_gen3',
    name: 'Classic Dark Loafer',
    price: 280,
    category: 'SHOES',
    subCategory: 'LOAFERS',
    images: [
      '/src/assets/images/elegant_leather_loafer_1781867845008.jpg'
    ],
    description: 'A highly polished, dark brown leather loafer shoe embodying a minimalist modern luxury aesthetic.',
    sizes: ['39', '40', '41', '42', '43'],
    deliversBy: 'JULY 1'
  },


  // ------------------ BAGS ------------------
  // TOTES
  {
    id: 'p7',
    name: 'Structured Canvas Tote',
    price: 220,
    category: 'BAGS',
    subCategory: 'TOTES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w5pIzh3OMxW9BbmS6hw1nzenzMD5VNWy9IxdPw9kuZnXHqFx8x0zwkYYXhwxYu6TFtOkrtjN0hAHQ84WvzTHiifYGolJB7yjxjr5JgcyXbMFcoBZQ4RrMNt2fqCWyILFblab08KrskVNiFlv82f0zuJgfJLNhudM8xsRVxZjXwovnG6R3iam0_qfjfQT6dtmqcUu6lb5ytvcb_LwJEcBVHaYkj5u4qxMJYzba_nhT3I8YXSQEDEqEh6CqCC_3MjVeu_r5J4_tvo'
    ],
    description: 'A durable structured black canvas tote bag. Perfect rectangular silhouette with rigid corners, flat hand straps, and clean minimalistic metal rivet reinforcements.',
    sizes: ['OS'],
    deliversBy: 'JUNE 24'
  },

  // CLUTCHES
  {
    id: 'p8',
    name: 'Sleek Leather Clasp Bag',
    price: 380,
    category: 'BAGS',
    subCategory: 'CLUTCHES',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhCPkTEANoVqrHfMlLFn6GppNX_8LVjD7D6PPP1y2uTbcZNvtUEH575OYuNHhq-c_lA8ca0CHdrCeSv2HBskBypGiMSfdsKbKPRomQdRmX_Wrolh6XSnfwm2ymokVy2UUzGQqU-J3Jux-16FU466bskUJ1z1gIjbgcAhbKMtiaV61B0r3EYUisLv0jusQgVV-R5lqrY84_Zgp_OrbKioQnfP4svqao4xBzJGwBSpvbUx9MxqPJqLKiGUK4mxKx0iIZacrlds6bBYo'
    ],
    description: 'Meticulously crafted black structured leather bag resting on stark architectural geometries. Heavy premium leather hardware with precise magnetic clasp alignment.',
    sizes: ['OS'],
    deliversBy: 'JUNE 24'
  },

  // BACKPACKS
  {
    id: 'p_bg_bp1',
    name: 'Monolith Tech Backpack',
    price: 260,
    category: 'BAGS',
    subCategory: 'BACKPACKS',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Matte custom weathercoat outer nylon pack with seamless taped zip dividers. Includes structured hidden internal tech sleeve slots.',
    sizes: ['OS'],
    deliversBy: 'JUNE 26'
  }
];

const GENERATED_SHIRTS: Product[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `gen_shirt_${i}`,
  name: `Essential ${['Cotton', 'Linen', 'Silk', 'Blend'][i % 4]} ${['T-Shirt', 'Polo', 'Button-up', 'Camp Shirt'][i % 4]} ${i}`,
  price: 45 + (i * 2),
  category: 'SHIRTS',
  subCategory: ['SHORT SLEEVES', 'LONG SLEEVES', 'SINGLETS'][i % 3],
  gender: ['MALE', 'FEMALE', 'UNISEX'][i % 3] as any,
  images: [
    `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop&sig=${i}`,
  ],
  description: 'Premium quality basics carefully constructed for enduring minimalist wear.',
  sizes: ['S', 'M', 'L', 'XL'],
  deliversBy: 'JULY 2'
}));

const GENERATED_TROUSERS: Product[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `gen_trouser_${i}`,
  name: `${['Pleated', 'Wide-Leg', 'Slim', 'Relaxed'][i % 4]} ${['Chino', 'Jeans', 'Trouser', 'Cargo'][i % 4]} ${i}`,
  price: 90 + (i * 3),
  category: 'TROUSERS',
  subCategory: ['SHORTS', 'LONG TROUSERS', 'JEANS', 'KHAKI'][i % 4],
  brand: ['Acne', 'Levis', 'APC', 'Our Legacy'][i % 4],
  gender: ['MALE', 'FEMALE', 'UNISEX'][i % 3] as any,
  images: [
    `https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop&sig=${i}`,
  ],
  description: 'A sharp and structural piece suited perfectly for the sophisticated modern wardrobe.',
  sizes: ['28', '30', '32', '34'],
  deliversBy: 'JULY 2'
}));

const GENERATED_SHOES: Product[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `gen_shoe_${i}`,
  name: `${['Leather', 'Suede', 'Canvas', 'Mesh'][i % 4]} ${['Sneaker', 'Oxford', 'Boot', 'Loafer'][i % 4]} ${i}`,
  price: 150 + (i * 5),
  category: 'SHOES',
  brand: ['Nike', 'Allstars', 'Vans', 'Adidas', 'New Balance'][i % 5],
  subCategory: ['SNEAKERS', 'OXFORDS', 'LOAFERS', 'BOOTS', 'HIGHTOPS'][i % 5],
  gender: ['MALE', 'FEMALE', 'UNISEX'][i % 3] as any,
  images: [
    `https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop&sig=${i}`,
  ],
  description: 'Uncompromising craftsmanship meets avant-garde, everyday functional utility design.',
  sizes: ['8', '9', '10', '11', '12'],
  deliversBy: 'JULY 2'
}));

PRODUCTS.push(...GENERATED_SHIRTS, ...GENERATED_TROUSERS, ...GENERATED_SHOES);
