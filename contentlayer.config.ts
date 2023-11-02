// contentlayer.config.ts
import {
  defineComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkReadingTime from 'remark-reading-time';

const computedFields = defineComputedFields<'Author' | 'Post'>({
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
  },
  readingTime: {
    type: 'number',
    resolve: async (doc) => {
      // see https://github.com/contentlayerdev/contentlayer/issues/216
      // there is currently no way to access vfile.data from the resolve function
      // therefore we have to compile here again to access it :|
      const { minutes } = await new Promise<{ minutes: number }>(
        (resolve, reject) => {
          remark()
            // @ts-ignore
            .use(remarkReadingTime)
            .process(doc.body.raw, (err, file) => {
              if (err) {
                reject(err);
              } else {
                resolve(file.data.readingTime);
              }
            });
        }
      );
      return Math.ceil(minutes);
    },
  },
});

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
  computedFields,
}));

export const Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: `authors/*.mdx`,
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Author, Post],
  mdx: {
    esbuildOptions: (options) => {
      options.tsconfig = `${process.env.PWD}/tsconfig.mdx.json`;
      return options;
    },
    remarkPlugins: [remarkGfm],
  },
});
