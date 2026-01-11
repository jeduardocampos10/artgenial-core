export type PlanType = 'free' | 'bronze' | 'silver' | 'gold' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanType;
}

export interface PlanConfig {
  name: string;
  nameDisplay: string;
  searchesPerDay: number | 'unlimited';
  automationUnlocked: boolean;
  color: string;
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'free',
    nameDisplay: 'Grátis',
    searchesPerDay: 10,
    automationUnlocked: false,
    color: 'plan-free',
  },
  bronze: {
    name: 'bronze',
    nameDisplay: 'Bronze',
    searchesPerDay: 30,
    automationUnlocked: false,
    color: 'plan-bronze',
  },
  silver: {
    name: 'silver',
    nameDisplay: 'Prata',
    searchesPerDay: 50,
    automationUnlocked: true,
    color: 'plan-silver',
  },
  gold: {
    name: 'gold',
    nameDisplay: 'Ouro',
    searchesPerDay: 100,
    automationUnlocked: true,
    color: 'plan-gold',
  },
  premium: {
    name: 'premium',
    nameDisplay: 'Premium',
    searchesPerDay: 'unlimited',
    automationUnlocked: true,
    color: 'plan-premium',
  },
};

export interface Lead {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipo: 'MEI' | 'ME' | 'EPP' | 'LTDA' | 'SA';
  cidade: string;
  uf: string;
  bairro: string;
  capitalSocial: number;
  hasWhatsApp: boolean;
  hasEmail: boolean;
  whatsapp?: string;
  email?: string;
  status?: 'downloaded' | 'whatsapp_sent' | 'email_sent' | 'responded' | 'no_response' | 'closed';
}

export interface FunnelStats {
  downloaded: number;
  whatsappSent: number;
  emailSent: number;
  responded: number;
  noResponse: number;
  closed: number;
}
