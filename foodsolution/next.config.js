/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pour Netlify - export statique
  output: 'export',
  
  // Désactiver l'optimisation d'images pour l'export statique
  images: {
    unoptimized: true,
  },
  
  // Trailing slash pour compatibilité Netlify
  trailingSlash: true,
}

module.exports = nextConfig
