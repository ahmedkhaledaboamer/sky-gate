import { blogPosts } from '@/data/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const staticRoutes = ['', '/products', '/blog'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
  const posts = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...staticRoutes, ...posts];
}
