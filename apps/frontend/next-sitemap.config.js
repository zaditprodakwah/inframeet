/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://inframeet.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin', '/api'],
      },
    ],
  },
}
