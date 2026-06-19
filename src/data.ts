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
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop'
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
    images: ['/images/blue_striped_polo_1781871467033.jpg'],
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
    images: ['/images/beige_striped_polo_1781871478659.jpg'],
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
    images: ['/images/olive_striped_polo_1781871493351.jpg'],
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
    images: ['/images/grey_white_collar_polo_1781871506844.jpg'],
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
    images: ['/images/crochet_floral_shirt_1781871520491.jpg'],
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
    images: ['/images/black_crochet_diamond_shirt_1781871534787.jpg'],
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
    images: ['/images/grey_striped_polo_hanging_1781871548777.jpg'],
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
    images: ['/images/black_ribbed_panel_polo_hanging_1781871570414.jpg'],
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
    images: ['/images/green_patterned_polo_hanging_1781871585512.jpg'],
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
    images: ['/images/burgundy_ribbed_polo_hanging_1781871599021.jpg'],
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
    images: ['/images/ghana_home_jersey_1781871612980.jpg'],
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
    images: ['/images/ghana_away_jersey_1781871625604.jpg'],
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
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Architectural asymmetric knit singlet. Curved side slits and unfinished flat hems create a perfect layering tool with high visual rhythm.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 26'
  },

  // NEW SHIRTS EXPLICITLY REQUESTED BY USER
  {
    id: 'p_add_resort_abstract',
    name: 'Abstract Earth Resort Shirt',
    price: 155,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A stunning resort-style shirt featuring an abstract earthy botanical pattern printed on ultra-fluid, sustainable tencel fiber. Styled with a classic cuban camp collar and clean casual fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_add_linen_buttonup',
    name: 'Portuguese Linen Button-Up',
    price: 165,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Naturally breathable long-sleeve shirt crafted from premium Portuguese linen yarn. Featuring structural chest pockets, a sharp collar stand, and mother-of-pearl buttons.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_add_utility_overshirt',
    name: 'Minimal Canvas Overshirt',
    price: 185,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'The ultimate layering piece. Crafted from heavyweight wash-treated utility canvas, featuring an elegant flat placket, large architectural flap pockets, and a clean square hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_add_pinstripe_dress',
    name: 'Signature Pinstripe Dress Shirt',
    price: 195,
    category: 'SHIRTS',
    subCategory: 'LONG SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'An exquisite stripe shirt detailed with fine charcoal stripes. Expertly tailored in Italy with standard spread collar, curved hemline, and custom button cuffs.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_add_piquet_polo',
    name: 'Fine Pique Classic Polo',
    price: 125,
    category: 'SHIRTS',
    subCategory: 'SHORT SLEEVES',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crafted from soft comb-cotton pique weave. High tactile elegance, solid rib cuffs, and a dynamic two-button placket for complete stylistic versatility.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },


  // ------------------ TROUSERS ------------------
  // SHORTS
  {
    id: 'p_tr_s1',
    name: 'Brutalist Cargo Shorts',
    price: 110,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
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
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop'
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
    gender: 'MALE',
    images: ['/images/dual_chevron_shorts_1781871636731.jpg'],
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
    gender: 'MALE',
    images: ['/images/circular_patch_shorts_1781871648872.jpg'],
    description: 'Ultra cozy sweat shorts crafted in delicate pastel cream-yellow heavy fleece cotton. Featuring a high contrast custom circular branding emblem on left hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s5',
    name: 'High-Waisted Denim Shorts',
    price: 115,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Relaxed premium high-waisted denim shorts. Authentic wash with raw cuffed hems and traditional five-pocket hardware.',
    sizes: ['26', '28', '30', '32'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_tr_s6',
    name: 'Tailored Linen Walk Shorts',
    price: 140,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Beautifully structured shorts in organic Belgian flax linen. Perfect relaxed tailored silhouette with front micro-pleating and standard button closures.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_s7',
    name: 'Striped Resort Walk Shorts',
    price: 125,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1618220048045-10a6dbdfad36?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Lightweight linen-blend shorts detailing continuous pinstripes. A fluid construction complete with an elastic waist band and deep side slip pockets.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_s8',
    name: 'Desert Sand Chino Shorts',
    price: 105,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Sleek casual flat-front chino shorts designed with heavy-washed sand twill cotton. Perfect standard fit with detailed jet pockets on back.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_s9',
    name: 'Linen Drape Shorts',
    price: 120,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1582142407894-3d85ee70b135?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Comfortable draping shorts structured in loose off-white linen weave. Elevated with secure drawstring belt loops and elegant double-stitch finishes.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s10',
    name: 'Minimalist Terry Shorts',
    price: 90,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1519748771151-a94aa509fc6d?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Ultra-soft unbrushed French terry shorts designed for absolute leisure. Features flat-locked seams and robust premium cotton pull-ropes.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_s11',
    name: 'Seersucker Striped Shorts',
    price: 130,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1584273112727-41277a7261ac?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Summer-ready seersucker shorts styled in beautiful textured ocean pinstripes. Extremely lightweight, breezy, and easily paired.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_s12',
    name: 'Athletic Premium Fleece Shorts',
    price: 95,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'High-density luxury heavyweight fleece shorts. Complete with double-lined deep side pockets, custom metal grommets, and flat-lay cuffs.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_s13',
    name: 'Silt Linen Shorts',
    price: 115,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1625910513397-a40236a99256?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Clean mid-rise casual shorts in Earth silt colorway. Features breathable, slightly textured weave structure perfect for warm afternoon layers.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s14',
    name: 'Safari Belted Briefs',
    price: 135,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Rugged yet elegant cargo safari shorts featuring a thick matching fabric belt, deep-slitted pockets, and crisp high turn-ups.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_tr_s15',
    name: 'Corduroy Leisure Shorts',
    price: 120,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Supremely soft wide-wale cotton corduroy shorts with comfortable elastic waistband and durable deep side pockets.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_s16',
    name: 'Eco Cotton Sweatshorts',
    price: 85,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1519748771151-a94aa509fc6d?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Relaxed loungewear shorts crafted from recycled organic cotton French terry. High waistband detail makes this a perfect everyday staple.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s17',
    name: 'Raw Cut Denim Shorts',
    price: 110,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Faded indigo wash denim shorts featuring structural hand distressed hems and robust heavy copper denim button fly.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_s18',
    name: 'Stitch Trim Khaki Shorts',
    price: 100,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Fine cotton chino shorts elevated with continuous tonal heavy-stitch details along outer seams and pockets.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_s19',
    name: 'Pleated High-Waisted Shorts',
    price: 130,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1618220048045-10a6dbdfad36?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A structural masterpiece featuring elegant waist tucking which creates a gorgeous fluid flare profile. Tailored in heavy cotton drill.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_s20',
    name: 'Active Nylon Track Shorts',
    price: 90,
    category: 'TROUSERS',
    subCategory: 'SHORTS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Breathable, rapid-dry ripstop nylon shorts styled with mesh lining inserts and contrast performance side zippers.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 27'
  },

  // LONG TROUSERS
  {
    id: 'p_tr_l1',
    name: 'Wide-Leg Pleated Trousers',
    price: 245,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'MALE',
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
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Crisply pressed straight leg trousers. Features deep set side slip pockets, integrated belt tracks, and hidden clean pocket closures at the back.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_l3',
    name: 'Tailored Wool Crease Trousers',
    price: 260,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Magnificent high-waisted dress trousers tailored from lightweight Italian worsted wool. Features a sharp pressed center crease and seamless zip closure.',
    sizes: ['26', '28', '30', '32'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_l4',
    name: 'Fluid Wide-Leg Linen Pants',
    price: 215,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Gorgeously relaxed wide-leg trousers composed of pure textured linen. Designed with a clean elastic-back waistband and deep structural side pockets.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_l5',
    name: 'Tapered Cotton Chinos',
    price: 180,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Pragmatic tapered dress chinos in highly durable cotton diagonal weave. Features seamless waistband tracks and beautifully concealed fly buttoning.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_l6',
    name: 'Pleated Sand Trousers',
    price: 195,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Medium-weight cotton trousers finished in warm sand tone. Highlighted with dual architectural pleating and clean button welt back pockets.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_tr_l7',
    name: 'Heavyweight Utility Canvas Pants',
    price: 210,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Premium thick wash utility trousers crafted in high mechanical strength cotton canvas. Complete with clean reinforced back panels and double tool loops.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_l8',
    name: 'Relaxed Terry Sweatpants',
    price: 155,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1506629082923-f3d64157f35d?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Delightfully comfortable heavy fleece knit sweatpants with clean flat drawcords, hidden pocket zippers, and soft tapered cuff loops.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_l9',
    name: 'Retro Pinstripe Trousers',
    price: 235,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Tailored dress trousers sporting heritage chalk stripes woven in dense luxury cotton. Perfect coordinates for elegant evening styling.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_l10',
    name: 'Drape Silk Drawstring Trousers',
    price: 285,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'An unstructured luxurious drape trouser crafted from lightweight premium mulberry silk blend. Features a flowing wrap-inspired front closure.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_l11',
    name: 'Cropped Belgian Linen Pants',
    price: 185,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Naturally textured casual cropped trousers tailored in authentic loose Belgian linen. Complete with front slide pockets and a clean horn-button fly.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_l12',
    name: 'Fine Knit Lounge Pants',
    price: 175,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1506629082923-f3d64157f35d?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Delicate fine-knit ribbed leisure trousers. Styled with a subtle flared cuff hem, high-contrast elastic waistband, and zero bulk seams.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_l13',
    name: 'Sleek Charcoal Wool Slacks',
    price: 250,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Classic professional slacks tailored from heavy worsted charcoal wool. Engineered for structural crease retention and long-lasting durability.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_l14',
    name: 'British Herringbone Trousers',
    price: 240,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'British-inspired tailoring displaying soft herringbone pattern wool-blend. Features double front coin slits and secure zip fly.',
    sizes: ['32', '34', '36', '38'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_tr_l15',
    name: 'Architectural Cargo Pants',
    price: 195,
    category: 'TROUSERS',
    subCategory: 'LONG TROUSERS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1619523735732-c38ddef01e18?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Modern, high-fashion streetwear cargo pants featuring detailed geometric outer paneling, discrete zip closures, and adjustable cuff widths.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },

  // JEANS
  {
    id: 'p_tr_j1',
    name: 'Raw Selvedge Denim',
    price: 210,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop'
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
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A relaxed boxy denim cut in faded slate wash. Clean minimal copper-free black metal rivets and pristine back leather-patch branding.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_j3',
    name: 'High-Waisted Pale Indigo Jeans',
    price: 195,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Stately high-waisted denim finished in beautiful pale indigo vintage wash. Made from rigid Japanese selvedge weave with neat straight-leg fall.',
    sizes: ['26', '28', '30', '32'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_j4',
    name: 'Straight-Leg Distressed Jeans',
    price: 190,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1511130558040-60a0050cd12b?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Comfortable mid-wash denim. Masterfully detailed with light knee and pocket grinding for an expertly weathered casual accent.',
    sizes: ['26', '28', '30', '32'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_j5',
    name: 'Washed White Crop Denim',
    price: 180,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Impeccable cream-white cropped jeans. Features a clean raw edge hem line, bright silver hardware accents, and comfortable soft denim drape.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_j6',
    name: 'Classic Straight Blue Jeans',
    price: 175,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Our signature classic straight fit blue jeans. Pure heavyweight cotton denim featuring double stitching and a standard button fly.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_j7',
    name: 'Tapered Black Wash Jeans',
    price: 180,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Expertly tailored jeans sporting an elegant tapered lower leg in deep charcoal black mineral wash.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_j8',
    name: 'Relaxed Carpenter Denim',
    price: 195,
    category: 'TROUSERS',
    subCategory: 'JEANS',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Highly utilitarian worker carpenter jeans including typical side utility slips, reinforced flat back pockets, and heavy-duty triple seams.',
    sizes: ['28', '30', '32', '34', '36'],
    deliversBy: 'JUNE 27'
  },

  // KHAKI
  {
    id: 'p_tr_k1',
    name: 'Tapered Utility Khakis',
    price: 165,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Slightly tapered utilitarian chinos cut from high-quality heavy sand-sand cotton gabardine. Resists wrinkles naturally with its rigid heavyweight structure.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_k2',
    name: 'Relaxed Sand Chinos',
    price: 170,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Supreme quality comfort chinos composed of washed soft cotton twill fabric. Features deep slip pockets and high-quality double belt loops.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 26'
  },
  {
    id: 'p_tr_k3',
    name: 'Tailored Khaki Dress Pants',
    price: 190,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'A sharp, modern cut designed with a structured fabric blend. Perfect for professional styling coordinates.',
    sizes: ['30', '32', '34', '36'],
    deliversBy: 'JUNE 25'
  },
  {
    id: 'p_tr_k4',
    name: 'Drawstring Linen-Chino Pants',
    price: 175,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'UNISEX',
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Hybrid breathable trousers sporting a comfortable elastic pull-string waist and structured, elegant chino pockets.',
    sizes: ['S', 'M', 'L', 'XL'],
    deliversBy: 'JUNE 28'
  },
  {
    id: 'p_tr_k5',
    name: 'Pleated High-Rise Khakis',
    price: 180,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Flattering high-rise khakis styled with clean dual pleats, standard front tortoiseshell buttoning, and straight flared leg profile.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 27'
  },
  {
    id: 'p_tr_k6',
    name: 'Cuffed Straight-Leg Chinos',
    price: 160,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'FEMALE',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Minimalist classic straight chinos. Elevated with elegant permanent turn-up hems and discrete flat side pockets.',
    sizes: ['S', 'M', 'L'],
    deliversBy: 'JUNE 24'
  },
  {
    id: 'p_tr_k7',
    name: 'Rigid Officer Khakis',
    price: 185,
    category: 'TROUSERS',
    subCategory: 'KHAKI',
    gender: 'MALE',
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Extra stiff heavy cotton officer-weight khakis. Highlighted with classic button fly, belt loops, and vertical stitch seams.',
    sizes: ['30', '32', '34', '36', '38'],
    deliversBy: 'JUNE 25'
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
      '/images/minimalist_street_sneaker_1781867805261.jpg'
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
      '/images/brutalist_black_boot_1781867824040.jpg'
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
      '/images/elegant_leather_loafer_1781867845008.jpg'
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

