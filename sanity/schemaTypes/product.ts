import { defineType, defineField } from "sanity";
import { itemGroupOptions, mainCategoryOptions, subCategoryOptions } from "../../supermarket.config";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    // PRODUCT IMAGES
    defineField({
      name: "image",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
    // PRODUCT NAME
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // SLUG
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 90,
      },
      validation: (Rule) => Rule.required(),
    }),

    // PRICE
    defineField({
      name: "price",
      title: "Price (₦)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),

    // LESS PRICE
    defineField({
      name: "lessprice",
      title: "lessPrice (₦)",
      type: "number",
    }),

    defineField({
      name: "ctg",
      title: "Shelf Label",
      type: "string",
    }),

    defineField({
      name: "sale",
      title: "Promo Badge",
      type: "string",
    }),

    {
      name: "review",
      title: "Review Count",
      type: "number",
      description: "Number of reviews ",
    },

    {
      name: "soldCurrent",
      title: "Sold (Current)",
      type: "number",
      description: "Items sold so far",
    },

    {
      name: "soldTotal",
      title: "Sold (Total)",
      type: "number",
      description: "Total stock or target ",
    },
    // PRODUCT DESCRIPTION
    defineField({
      name: "details",
      title: "Product Details",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Main Category",
      type: "string",
      options: { list: mainCategoryOptions },
    }),

    defineField({
      name: "isCategoryProduct",
      title: "Show in Category Collections?",
      description:
        "Toggle this for products that should appear in supermarket category collections.",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "subCategory",
      title: "Sub Category",
      type: "string",
      options: { list: subCategoryOptions },
    }),

    defineField({
      name: "subName",
      title: "Product Group",
      description: "Examples: Rice, Baby Formula, Soft Drinks, Chicken Wings.",
      type: "string",
      options: { list: itemGroupOptions },
    }),

    // STOCK STATUS
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "isbanner",
      title: "Banner",
      type: "boolean",
      initialValue: false,
    }),
    // FEATURE FLAGS (FOR SECTIONS)
    defineField({
      name: "isBestDeal",
      title: "Best Deal",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "title",
      title: "title",
      type: "string",
      description: "Controls title of products in Best Deals section",
    }),

    defineField({
      name: "isBestOffer",
      title: "Best Offer",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "isHero",
      title: "Homepage Hero",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "Hero_order",
      title: "Hero_order",
      type: "number",
      description: "Controls order of products in Hero section",
    }),

    defineField({
      name: "small_text",
      title: "small_text",
      type: "string",
      description: "Controls title of products in Hero section",
    }),

    defineField({
      name: "ispromo_banner",
      title: "Banner ",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "banner_text",
      title: "banner_text",
      type: "string",
      description: "Controls small text of products in Promo banner section",
    }),

    defineField({
      name: "description",
      title: "description",
      type: "string",
      description: "Controls description of products in Promo banner section",
    }),

    defineField({
      name: "promobanner_order",
      title: "promobanner_order",
      type: "number",
      description: "Controls order of products in Promo banner section",
    }),

    defineField({
      name: "bestDealOrder",
      title: "Best Deal Order",
      type: "number",
      description: "Controls order of products in Best Deals section",
    }),

    defineField({
      name: "isBestSales",
      title: "Best Sales",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "BestSales",
      title: "Best Sales",
      type: "number",
      description: "best sales product",
    }),

    defineField({
      name: "isArrivals",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isHotDeal",
      title: "Hot Deals Product",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "HotDealOrder",
      title: "Hot Deal Order",
      type: "number",
      description: "Controls order of products in Hot Deals section",
    }),
    defineField({
      name: "isShortProducts",
      title: "Short Products",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isTopSelling",
      title: "Top Selling",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image.0",
      price: "price",
    },
    prepare(selection) {
      const { title, media, price } = selection;
      return {
        title,
        media,
        subtitle: `₦${price}`,
      };
    },
  },
});
export {
  mainCategoryOptions as categories,
  subCategoryOptions as subCategories,
  itemGroupOptions as subNames,
};
