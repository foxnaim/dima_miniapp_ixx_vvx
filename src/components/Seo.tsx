'use client';

import Script from 'next/script';
import { buildCanonicalUrl, siteConfig } from "@/lib/seo";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export const Seo = ({
  title,
  description,
  path,
  image,
  noIndex,
  jsonLd,
}: SeoProps) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description ?? siteConfig.description;
  const canonical = buildCanonicalUrl(path);
  const previewImage = image ?? siteConfig.ogImage;
  const keywords = siteConfig.keywords.join(", ");
  const robots = noIndex ? "noindex,nofollow" : "index,follow";

  return (
    <>
      <Script id="seo-meta" strategy="afterInteractive">
        {`
          (function() {
            // Обновляем title
            if (document.title !== "${fullTitle}") {
              document.title = "${fullTitle}";
            }
            
            // Обновляем или создаем canonical link
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (!canonicalLink) {
              canonicalLink = document.createElement('link');
              canonicalLink.setAttribute('rel', 'canonical');
              document.head.appendChild(canonicalLink);
            }
            canonicalLink.setAttribute('href', "${canonical}");
            
            // Обновляем meta теги
            const updateMeta = (name, content, property) => {
              const selector = property ? \`meta[property="\${name}"]\` : \`meta[name="\${name}"]\`;
              let meta = document.querySelector(selector);
              if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                  meta.setAttribute('property', name);
                } else {
                  meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
              }
              meta.setAttribute('content', content);
            };
            
            updateMeta('description', "${metaDescription.replace(/"/g, '\\"')}", false);
            updateMeta('keywords', "${keywords.replace(/"/g, '\\"')}", false);
            updateMeta('robots', "${robots}", false);
            updateMeta('og:title', "${fullTitle.replace(/"/g, '\\"')}", true);
            updateMeta('og:description', "${metaDescription.replace(/"/g, '\\"')}", true);
            updateMeta('og:type', 'website', true);
            updateMeta('og:url', "${canonical}", true);
            updateMeta('og:image', "${previewImage}", true);
            updateMeta('og:site_name', "${siteConfig.name.replace(/"/g, '\\"')}", true);
            updateMeta('og:locale', "${siteConfig.locale}", true);
            updateMeta('twitter:card', 'summary_large_image', false);
            updateMeta('twitter:title', "${fullTitle.replace(/"/g, '\\"')}", false);
            updateMeta('twitter:description', "${metaDescription.replace(/"/g, '\\"')}", false);
            updateMeta('twitter:image', "${previewImage}", false);
          })();
        `}
      </Script>
      {jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
    </>
  );
};

