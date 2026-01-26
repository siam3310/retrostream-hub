import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.movie' | 'video.tv_show';
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO = ({
  title = 'black&white-tv | Streaming Movies, Series & Live Sports',
  description = 'Watch free movies, series and live sports streaming on black&white-tv. Enjoy Bangla, Hindi, and dubbed content with high-quality streaming.',
  keywords = 'streaming, movies, series, live sports, free movies, bangla movies, hindi movies, dubbed movies, watch online, black&white-tv',
  image = '/og-image.png',
  url = '',
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const siteName = 'black&white-tv';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="black&white-tv" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};
