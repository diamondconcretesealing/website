import { defineField, defineType } from "sanity";

// A single portfolio item shown in the Projects gallery on the homepage.
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (optional)",
      type: "string",
      description: "Short internal label. Not required.",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the photo for accessibility and SEO (e.g. 'Sealed exposed-aggregate driveway').",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Caption shown when a visitor hovers the photo.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Untitled project", subtitle, media };
    },
  },
});
