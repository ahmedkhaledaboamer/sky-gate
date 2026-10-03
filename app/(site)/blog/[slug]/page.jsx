import { notFound } from 'next/navigation';
import { BlogPostPage } from '@/components/pages/BlogPostPage';
import { blogPosts } from '@/data/blog';
import { getLocale } from '@/lib/getLocale';
import { ogImage } from '@/lib/site';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const locale = await getLocale();
  const title = post.title[locale];
  const description = post.excerpt[locale];
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: post.date,
      authors: [post.author.name[locale]],
      images: [ogImage(post.image)],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!blogPosts.some((p) => p.slug === slug)) notFound();
  return <BlogPostPage slug={slug} />;
}
