# 🍽️ FoodSolution

**Application Web B2B — Conseil Économique et Financier pour la Restauration**

FoodSolution est une solution de conseil digital destinée aux restaurateurs. Elle calcule le seuil de rentabilité de chaque plat en fonction du coût réel des matières premières.

## 💡 Concept Central

Calculer le seuil de rentabilité de chaque plat en fonction du coût réel des matières premières. L'utilisateur saisit ses produits, leurs prix d'achat, et FoodSolution calcule instantanément la marge, le food cost ratio et le prix de vente optimal.

## ✨ Fonctionnalités

- **🤖 Assistant Foodyx** — Bot intelligent qui accompagne les restaurateurs
- **📊 Calcul de rentabilité** — Food cost, marge brute, prix optimal
- **📦 Gestion des produits** — Matières premières avec prix unitaires
- **🍽️ Gestion des plats** — Recettes avec composition détaillée
- **📈 Dashboard** — Vue d'ensemble de la rentabilité
- **🔔 Alertes** — Notifications sur les variations de prix

## 🚀 Installation

### Prérequis

- Node.js 20+
- PostgreSQL (ou compte Supabase/Neon)

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd foodsolution

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos variables

# Générer le client Prisma
npm run db:generate

# Lancer en développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📐 Stack Technologique

### Frontend
- **Next.js 14** — App Router
- **React 18** — UI Library
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Zustand** — State Management
- **Lucide React** — Icons

### Backend
- **Next.js API Routes** — Backend API
- **Prisma** — ORM
- **PostgreSQL** — Database

## 📁 Structure du Projet

```
foodsolution/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Page d'accueil
│   │   └── globals.css      # Styles globaux
│   ├── components/          # Composants React
│   │   ├── ui/              # Composants UI réutilisables
│   │   ├── onboarding/      # Écrans d'onboarding
│   │   ├── chat/            # Interface de chat
│   │   ├── products/        # Gestion des produits
│   │   ├── dishes/          # Gestion des plats
│   │   └── dashboard/       # Dashboard
│   ├── lib/                 # Utilitaires
│   │   ├── utils.ts         # Fonctions utilitaires
│   │   └── calculations.ts  # Calculs de rentabilité
│   ├── store/               # State management
│   │   └── useStore.ts      # Store Zustand
│   └── types/               # Types TypeScript
│       └── index.ts
├── prisma/
│   └── schema.prisma        # Schéma de base de données
└── public/                  # Assets statiques
```

## 📊 Formules de Calcul

### Food Cost Ratio
```
Food Cost Ratio = (Coût MP / Prix de vente HT) × 100
```

### Marge Brute
```
Marge Brute = Prix de vente HT - Coût MP
```

### Prix de Vente Optimal
```
Prix vente HT optimal = Coût MP / Food Cost Ratio cible
```

### Objectifs par type d'établissement
- Fast-food : 25-30%
- Restaurant traditionnel : 28-35%
- Gastronomique : 30-40%
- Pizzeria : 20-28%

## 🎨 Design System

L'interface utilise un style "Light Premium Glassmorphism" avec :
- Glassmorphism sur les cartes
- Gradient de marque (Indigo → Violet → Cyan)
- Animations fluides
- Mobile-first responsive

## 📝 License

MIT License

---

Développé avec ❤️ par FoodSolution
