import { useEffect } from 'react'

const DEFAULTS = {
  title: 'Office Break Games – Quick Fun Games to Refresh Your Mind',
  description: 'Play quick, fun office break games. Refresh your mind and get back to work in 5 minutes.',
  image: '/og-cover.svg'
}

function setMeta(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaProperty(property, content) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SEO({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  image = DEFAULTS.image,
  canonical,
  noindex = false
}) {
  useEffect(() => {
    const origin = window.location.origin
    const url = canonical || window.location.href
    const absImage = image.startsWith('http') ? image : origin + image

    document.title = title
    setMeta('description', description)
    setLink('canonical', url)

    // Open Graph
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:image', absImage)
    setMetaProperty('og:url', url)

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', absImage)

    // Robots
    setMeta('robots', noindex ? 'noindex,nofollow' : 'index,follow')
  }, [title, description, image, canonical, noindex])

  return null
}
