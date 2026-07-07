export const brand = {
  name: "Family House Supermarket",
  shortName: "Family House SuperMarket",
  tagline: "Everyday Essentials",
  domain: "www.familyhousesupermarket.com",
  url: "https://www.familyhousesupermarket.com",
  email: "Familyhousesupermarket@gmail.com",
  phone: "07044012151",
  phoneInternational: "+2347044012151",
  whatsapp: "2347044012151",
  address: "198C Governor's Road, Ikotun, Lagos, Nigeria",
  instagram: "https://www.instagram.com/familyhousesupermarket?utm_source=qr",
  tiktok: "https://www.tiktok.com/@familyhousesupermarket",
  logo: "/brand/family-house-logo.jpeg",
  description:
    "Family House Supermarket is a modern neighborhood supermarket in Ikotun, Lagos, bringing quality groceries, beverages, toiletries, household essentials, bakery treats, frozen foods, gadgets, wines and spirits together in one convenient shopping experience.",
};

export type SupermarketSubCategory = {
  name: string;
  items: string[];
};

export type SupermarketCategory = {
  title: string;
  products: string;
  icon: string;
  description: string;
  subCategories: SupermarketSubCategory[];
};

export const supermarketCategories: SupermarketCategory[] = [
  {
    title: "Food Condiments",
    products: "Pantry essentials",
    icon: "bi-basket2",
    description: "Oils, spices, food stuff and everyday cooking ingredients.",
    subCategories: [
      { name: "Vegetable Oil", items: ["Kings Oil", "Power Oil", "Devon Kings", "Mamador", "Groundnut Oil"] },
      { name: "Spices", items: ["Curry", "Thyme", "Seasoning Cubes", "Mixed Spices", "Pepper Mix"] },
      { name: "Food Stuff", items: ["Rice", "Beans", "Garri", "Pasta", "Noodles"] },
      { name: "Ingredients", items: ["Tomato Paste", "Salt", "Sugar", "Flour", "Baking Ingredients"] },
    ],
  },
  {
    title: "Household Essentials",
    products: "Home care",
    icon: "bi-house-heart",
    description: "Useful home, kitchen, kids, stationery and gifting items.",
    subCategories: [
      { name: "Duvet & Bedding", items: ["Duvets", "Bedsheets", "Pillow Cases", "Blankets"] },
      { name: "Kitchen Utensils", items: ["Cookware", "Cutlery", "Storage Bowls", "Plates", "Kitchen Tools"] },
      { name: "Stationaries", items: ["Notebooks", "Pens", "School Supplies", "Office Basics"] },
      { name: "Kids Toys", items: ["Educational Toys", "Board Games", "Soft Toys", "Outdoor Toys"] },
      { name: "Gifts", items: ["Gift Sets", "Greeting Cards", "Gift Bags", "Celebration Packs"] },
    ],
  },
  {
    title: "Cosmetics / Toiletries",
    products: "Beauty & hygiene",
    icon: "bi-stars",
    description: "Personal care, baby care, cleaning, fragrance and beauty products.",
    subCategories: [
      { name: "Cleaning Materials", items: ["Detergents", "Disinfectants", "Mops", "Brushes", "Tissue Paper"] },
      { name: "Diffusers / Air Fresheners", items: ["Diffusers", "Aerosol Fresheners", "Gel Fresheners", "Car Fresheners"] },
      { name: "Insecticides", items: ["Insecticide Spray", "Mosquito Coils", "Repellents"] },
      { name: "Baby Care", items: ["Baby Wipes", "Diapers", "Baby Lotion", "Baby Wash"] },
      { name: "Dental Care", items: ["Toothpaste", "Toothbrushes", "Mouthwash", "Dental Floss"] },
      { name: "Personal Hygiene", items: ["Bath Soap", "Body Cream", "Deodorants", "Cotton Buds"] },
      { name: "Sanitary Care", items: ["Sanitary Pads", "Panty Liners", "Tampons"] },
      { name: "Perfumes / Roll On", items: ["Perfumes", "Roll Ons", "Body Spray", "Colognes"] },
      { name: "Body Wash", items: ["Shower Gel", "Body Scrub", "Liquid Soap"] },
      { name: "Hair Care", items: ["Shampoo", "Conditioner", "Hair Cream", "Hair Accessories"] },
      { name: "Health & Beauty", items: ["Skincare", "Supplements", "Makeup", "Beauty Tools"] },
    ],
  },
  {
    title: "Provision / Beverages",
    products: "Breakfast & drinks",
    icon: "bi-cup-straw",
    description: "Baby food, cereals, tea, coffee, cocoa and family beverages.",
    subCategories: [
      { name: "Baby Section", items: ["Baby Formula", "Baby Cereal", "Baby Snacks", "Feeding Bottles"] },
      { name: "Beverages", items: ["Chocolate Drinks", "Coffee", "Malt Drinks", "Powdered Milk"] },
      { name: "Cereals", items: ["Cornflakes", "Oats", "Granola", "Custard", "Golden morn"] },
      { name: "Tea", items: ["Black Tea", "Green Tea", "Herbal Tea", "Tea Bags"] },
    ],
  },
  {
    title: "Liquor / Drinks",
    products: "Cold room favorites",
    icon: "bi-cup",
    description: "Wines, spirits, beer, soft drinks, juice, milk, yogurt and ice cream.",
    subCategories: [
      { name: "Vodka & Gin", items: ["Vodka", "Gin", "Whisky", "Brandy", "Rum"] },
      { name: "Fruit Wines", items: ["Red Wine", "White Wine", "Sparkling Wine", "Fruit Wine"] },
      { name: "Herbal Wines", items: ["Bitters", "Herbal Drinks", "Tonics"] },
      { name: "Soft Drinks", items: ["Cola", "Lemon Lime", "Bottled Water", "Soda"] },
      { name: "Beer", items: ["Lager", "Stout", "Cider", "Non-Alcoholic Beer"] },
      { name: "Juice", items: ["Fruit Juice", "Nectar", "Kids Juice", "Smoothies"] },
      { name: "Evaporated Milk / Yogurt", items: ["Evaporated Milk", "Yogurt", "Drinking Yogurt", "Milk Drinks"] },
      { name: "Energy Drinks", items: ["Energy Drinks", "Sports Drinks", "Tonics"] },
      { name: "Ice Cream", items: ["Tubs", "Cones", "Popsicles", "Frozen Desserts"] },
    ],
  },
  {
    title: "Gadgets / Electronics",
    products: "Smart picks",
    icon: "bi-phone",
    description: "Useful electronics, accessories, small gadgets and power items.",
    subCategories: [
      { name: "Mobile Accessories", items: ["Chargers", "Cables", "Earphones", "Power Banks"] },
      { name: "Small Appliances", items: ["Kettles", "Blenders", "Irons", "Extension Boxes"] },
      { name: "Smart Gadgets", items: ["Smart Watches", "Speakers", "LED Bulbs", "Adapters"] },
    ],
  },
  {
    title: "Bakery",
    products: "Fresh daily",
    icon: "bi-cake2",
    description: "Bread, pastries, desserts, treats and light eats.",
    subCategories: [
      { name: "Bread", items: ["Sliced Bread", "Family Loaf", "Wheat Bread", "Burger Buns"] },
      { name: "Pastries", items: ["Meat Pie", "Sausage Roll", "Doughnuts", "Croissants"] },
      { name: "Desserts", items: ["Cakes", "Cupcakes", "Parfaits", "Puddings"] },
      { name: "Light Eats", items: ["Sandwiches", "Small Chops", "Snacks"] },
      { name: "Treats", items: ["Cookies", "Chin Chin", "Candy", "Chocolate"] },
    ],
  },
  {
    title: "Frozen Foods",
    products: "Frozen & chilled",
    icon: "bi-snow",
    description: "Chicken, fish, seafood, gizzard, hot dogs and frozen favorites.",
    subCategories: [
      { name: "Chicken", items: ["Chicken Wings", "Chicken Laps", "Whole Chicken", "Chicken Breast"] },
      { name: "Seafoods", items: ["Prawns", "Shrimps", "Crab", "Calamari"] },
      { name: "Gizzard & Hot Dogs", items: ["Gizzard", "Hot Dogs", "Sausages", "Meat Balls"] },
      { name: "Fish", items: ["Croaker", "Tilapia", "Mackerel", "Catfish", "Stock Fish"] },
    ],
  },
];

export const mainCategoryOptions = supermarketCategories.map((category) => ({
  title: category.title,
  value: category.title,
}));

export const subCategoryOptions = supermarketCategories.flatMap((category) =>
  category.subCategories.map((subCategory) => ({
    title: subCategory.name,
    value: subCategory.name,
  })),
);

export const itemGroupOptions = supermarketCategories.flatMap((category) =>
  category.subCategories.flatMap((subCategory) =>
    subCategory.items.map((item) => ({
      title: item,
      value: item,
    })),
  ),
);

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
