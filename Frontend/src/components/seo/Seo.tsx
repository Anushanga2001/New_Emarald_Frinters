const SITE_URL = 'https://www.newemarald.com'
const SITE_NAME = 'New Emarald Freighter'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = 'website',
}: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
