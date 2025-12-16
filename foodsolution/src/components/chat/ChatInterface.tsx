'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Avatar, GlassCard, TypingIndicator, Button } from '@/components/ui';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { RichCard } from './RichCard';
import { ChevronLeft, MoreHorizontal, Menu } from 'lucide-react';

interface ChatInterfaceProps {
  onBack?: () => void;
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const { messages, isTyping, addMessage, setIsTyping, userName, onboardingData } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Show welcome message if no messages
    if (messages.length === 0 && showWelcome) {
      const timer = setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: getWelcomeMessage(),
        });
        setShowWelcome(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getWelcomeMessage = () => {
    const name = userName || 'Chef';
    const establishment = onboardingData.establishmentType || 'restaurant';
    
    return `Salut ${name} ! 👋

Je suis Foodyx, votre assistant rentabilité. Je suis là pour vous aider à :

📊 **Calculer le coût de vos plats** en fonction des matières premières
💰 **Optimiser vos prix de vente** pour améliorer vos marges
📈 **Piloter votre food cost** avec des alertes en temps réel

Pour commencer, vous pouvez :
• Ajouter vos premiers produits (ingrédients)
• Créer vos recettes avec leurs compositions
• Me demander d'analyser un plat existant

**Par quoi voulez-vous commencer ?**`;
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content });
    
    // Simulate Foodyx thinking
    setIsTyping(true);
    
    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate response
    const response = generateFoodyxResponse(content);
    
    setIsTyping(false);
    addMessage({ role: 'assistant', content: response });
  };

  const generateFoodyxResponse = (userMessage: string): string => {
    const lowercaseMsg = userMessage.toLowerCase();
    
    if (lowercaseMsg.includes('produit') || lowercaseMsg.includes('ingrédient')) {
      return `Parfait ! Pour ajouter un produit, j'ai besoin de quelques informations :

1. **Nom du produit** (ex: Tomates cerises)
2. **Prix d'achat** (ex: 4.50€)
3. **Quantité achetée** (ex: 1kg)
4. **Fournisseur** (optionnel)

Vous pouvez me les donner directement ou utiliser le bouton ➕ pour ajouter via le formulaire.

💡 **Astuce** : Vous pouvez aussi m'envoyer une photo de facture, je l'analyserai automatiquement !`;
    }
    
    if (lowercaseMsg.includes('plat') || lowercaseMsg.includes('recette')) {
      return `Excellent choix ! Pour créer un plat, voici ce dont j'ai besoin :

1. **Nom du plat** (ex: Burger Maison)
2. **Prix de vente TTC** (ex: 12€)
3. **Ingrédients et quantités**
4. **Nombre de portions**

Une fois le plat créé, je calculerai automatiquement :
• Le **coût matières premières**
• Le **food cost ratio** 
• La **marge brute**
• Le **prix optimal** recommandé

Quel plat souhaitez-vous ajouter ?`;
    }
    
    if (lowercaseMsg.includes('rentabilité') || lowercaseMsg.includes('food cost') || lowercaseMsg.includes('marge')) {
      return `📊 **Comprendre le Food Cost**

Le food cost ratio, c'est le pourcentage du prix de vente qui couvre le coût des matières premières.

**Formule :** Food Cost = (Coût MP / Prix HT) × 100

**Objectifs par type :**
• 🍔 Fast-food : 25-30%
• 🍽️ Traditionnel : 28-35%
• ⭐ Gastronomique : 30-40%

**Exemple concret :**
Un burger à 12€ TTC (10€ HT) avec 2.50€ de matières premières = **25% de food cost** ✅

Voulez-vous que j'analyse un de vos plats ?`;
    }
    
    if (lowercaseMsg.includes('aide') || lowercaseMsg.includes('comment')) {
      return `Bien sûr, je suis là pour vous aider ! 🙌

**Ce que je peux faire :**

📦 **Produits**
• Ajouter/modifier vos matières premières
• Suivre l'évolution des prix
• Alerter sur les variations

🍽️ **Plats**  
• Créer des recettes avec composition
• Calculer le coût de revient
• Optimiser les prix de vente

📊 **Analyses**
• Calculer le food cost ratio
• Identifier les plats non rentables
• Suggérer des optimisations

Qu'est-ce qui vous intéresse ?`;
    }
    
    // Default response
    return `Je comprends ! 

Pour vous aider au mieux, dites-moi ce que vous souhaitez faire :

1. 📦 **Ajouter un produit** - Enregistrer une matière première
2. 🍽️ **Créer un plat** - Composer une recette
3. 📊 **Analyser la rentabilité** - Calculer le food cost
4. 💡 **Obtenir des conseils** - Optimiser vos marges

Tapez le numéro ou décrivez votre besoin !`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <div className="flex items-center gap-3">
          <Avatar variant="foodyx" size="sm" />
          <div>
            <h1 className="font-semibold text-slate-900">Foodyx</h1>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              En ligne
            </p>
          </div>
        </div>
        
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <MoreHorizontal className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-start gap-3">
              <Avatar variant="foodyx" size="sm" />
              <GlassCard className="px-4 py-3" hover={false}>
                <TypingIndicator />
              </GlassCard>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
