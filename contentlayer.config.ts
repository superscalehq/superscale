// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  contentType: 'mdx',
  filePathPattern: `posts/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    author: { type: 'string', required: true },
    createdAt: { type: 'date', required: true },
    updatedAt: { type: 'date', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
  },
}));

export default makeSource({ contentDirPath: 'content', documentTypes: [Post] });
