import { useEffect } from 'react'

interface SeoOptions {
  /** Título da aba/Google. Acrescenta "| Auto Racer" automaticamente se não tiver. */
  title?: string
  /** Meta description (ideal 120–160 caracteres). */
  description?: string
  /** URL canônica da página. */
  canonical?: string
  /** Imagem para compartilhamento (Open Graph / Twitter). */
  image?: string
}

const SITE = 'Auto Racer'
const BASE_URL = 'https://autoracer.shop'

function setMeta(key: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

/**
 * Define título + meta description (e Open Graph/Twitter) por página.
 * Use em cada página pública para que Google e redes sociais mostrem
 * informações específicas — não a descrição genérica do index.html.
 */
export function useSeo({ title, description, canonical, image }: SeoOptions) {
  useEffect(() => {
    if (title) {
      const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`
      document.title = fullTitle
      setMeta('og:title', fullTitle, 'property')
      setMeta('twitter:title', fullTitle)
    }
    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, 'property')
      setMeta('twitter:description', description)
    }
    const url = canonical || (typeof window !== 'undefined' ? `${BASE_URL}${window.location.pathname}` : BASE_URL)
    setCanonical(url)
    setMeta('og:url', url, 'property')
    if (image) {
      setMeta('og:image', image, 'property')
      setMeta('twitter:image', image)
    }
  }, [title, description, canonical, image])
}
