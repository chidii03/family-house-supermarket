import { defineType, defineField } from 'sanity';
import { mainCategoryOptions } from '../../supermarket.config';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      options: { list: mainCategoryOptions },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      description: 'Optional parent category for nested supermarket menus.',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'categoryId',
      title: 'Category ID (Order)',
      description: 'Use numbers 1-8 to order these on the homepage.',
      type: 'number',
    }),
    defineField({
      name: 'isMain',
      title: 'Show on Homepage Category Slider?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
