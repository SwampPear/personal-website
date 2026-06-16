import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'private',
      title: 'Private',
      description:
        'Private posts are only visible to you while logged in to the Studio. They are hidden from everyone else, on the list and on their own page.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description:
        "The post body, broken into sections. Each section can carry an image; as the section scrolls into view, the right-hand image cross-fades to it. The first section's image acts as the cover, and sections without an image keep showing the previous one.",
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'content',
              title: 'Text',
              type: 'array',
              of: [defineArrayMember({ type: 'block' })],
            }),
            defineField({
              name: 'image',
              title: 'Image (optional)',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { blocks: 'content', media: 'image' },
            prepare({ blocks, media }) {
              const first = Array.isArray(blocks)
                ? blocks.find((b: { _type?: string }) => b._type === 'block')
                : undefined
              const text = first?.children
                ?.map((c: { text?: string }) => c.text)
                .join('')
              return { title: text || 'Section', media }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', isPrivate: 'private' },
    prepare({ title, subtitle, isPrivate }) {
      return {
        title: isPrivate ? `🔒 ${title ?? ''}` : title,
        subtitle,
      }
    },
  },
})
