"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Choice {
  label: string;
  description: string;
  impact: Record<string, number>;
  explanation: string;
  optimal: boolean;
  score: number;
}

interface Stage {
  type: "context" | "decision" | "result";
  title: string;
  narrative: string;
  situation?: string;
  choices?: Choice[];
}

interface MetricDef {
  label: string;
  value: number;
  suffix: string;
  color: string;
  better: "up" | "down";
}

interface CaseStudy {
  id: string;
  title: string;
  icon: string;
  difficulty: "Facil" | "Medio" | "Dificil";
  difficultyColor: string;
  company: string;
  sector: string;
  metrics: Record<string, MetricDef>;
  stages: Stage[];
  idealPath: string[];
  idealExplanation: string;
}

// ---------------------------------------------------------------------------
// Case Study Data — 6 Scenarios
// ---------------------------------------------------------------------------
const CASES: CaseStudy[] = [
  {
    id: "ecommerce-auth",
    title: "E-commerce com auth rate de 68%",
    icon: "\uD83D\uDED2",
    difficulty: "Medio",
    difficultyColor: "#F59E0B",
    company: "ShopBR",
    sector: "E-commerce",
    metrics: {
      authRate: { label: "Auth Rate", value: 68, suffix: "%", color: "#EF4444", better: "up" },
      revenue: { label: "Receita/mes", value: 12.5, suffix: "M", color: "#3B82F6", better: "up" },
      crossBorder: { label: "Falha Cross-border", value: 60, suffix: "%", color: "#F59E0B", better: "down" },
      chargeback: { label: "Chargeback", value: 1.2, suffix: "%", color: "#8B5CF6", better: "down" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce acaba de assumir como Head de Pagamentos da ShopBR, um e-commerce com 500K transacoes/mes e faturamento de R$12.5M. Na sua primeira reuniao com o CEO, ele vai direto ao ponto: \"Nossa auth rate esta em 68%. Estamos deixando R$4M na mesa todo mes.\" Ao mergulhar nos dados, voce descobre que 60% do trafego e cross-border e a maioria das recusas vem de emissores internacionais. O board quer resultados em 90 dias.",
      },
      {
        type: "decision",
        title: "Decisao 1: Como investigar o problema?",
        narrative:
          "Seu time de dados preparou um relatorio preliminar. As recusas estao concentradas em BINs internacionais, especialmente Visa e Mastercard da America Latina. Voce precisa definir a primeira acao de investigacao.",
        situation: "Auth Rate: 68% | 32% das transacoes recusadas | 60% do trafego e cross-border",
        choices: [
          {
            label: "Analise de BIN + decline codes",
            description: "Mapear quais BINs e codigos de recusa concentram as falhas para identificar padroes",
            impact: { authRate: 3, revenue: 0.8, crossBorder: -5, chargeback: 0 },
            explanation:
              "Analise de BIN e decline codes e o ponto de partida classico, mas nao resolve o problema diretamente. Voce ganha visibilidade, porem leva 2-3 semanas para ter dados acionaveis.",
            optimal: false,
            score: 3,
          },
          {
            label: "A/B test de rotas por adquirente",
            description: "Dividir trafego entre adquirentes para medir qual tem melhor aprovacao por regiao",
            impact: { authRate: 6, revenue: 1.6, crossBorder: -12, chargeback: -0.1 },
            explanation:
              "Brilhante. O A/B test de rotas revela imediatamente que adquirentes locais em cada pais aprovam 15-20% mais que o roteamento atual. Voce tem dados acionaveis em 1 semana e ja comeca a ver melhoria.",
            optimal: true,
            score: 5,
          },
          {
            label: "Implementar retry automatico",
            description: "Reprocessar transacoes recusadas em um segundo adquirente automaticamente",
            impact: { authRate: 4, revenue: 1.0, crossBorder: -3, chargeback: 0 },
            explanation:
              "Retry recupera soft-declines, o que e util. Mas sem entender ONDE esta o problema, voce esta tratando sintoma e nao causa. O A/B test teria dado mais clareza primeiro.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Qual feature priorizar?",
        narrative:
          "Os dados do teste confirmaram: transacoes roteadas para adquirentes locais tem 18% mais aprovacao. Agora voce precisa escolher o investimento tecnologico principal para o trimestre.",
        situation: "Auth Rate subiu para ~74% | Revenue impactado positivamente | Board animado",
        choices: [
          {
            label: "Network Tokens",
            description: "Substituir PANs por tokens das bandeiras, melhorando aprovacao e seguranca",
            impact: { authRate: 5, revenue: 1.5, crossBorder: -3, chargeback: -0.15 },
            explanation:
              "Network Tokens sao o investimento certo neste momento. Com o roteamento ja otimizado, tokens da bandeira adicionam 5-10% de aprovacao por adquirente. Visa e Mastercard reportam ganhos consistentes de 2-4% em auth rate globalmente.",
            optimal: true,
            score: 5,
          },
          {
            label: "Smart Routing engine",
            description: "Construir um motor de roteamento inteligente baseado em ML",
            impact: { authRate: 4, revenue: 1.2, crossBorder: -8, chargeback: -0.05 },
            explanation:
              "Smart Routing e poderoso, mas voce ja validou o conceito com o A/B test. Construir o engine completo leva 3+ meses. Network Tokens daria resultado mais rapido agora, e o routing engine pode vir depois.",
            optimal: false,
            score: 4,
          },
          {
            label: "Otimizacao de 3DS",
            description: "Reduzir friccao no 3D Secure com exemptions e frictionless flow",
            impact: { authRate: 3, revenue: 0.9, crossBorder: -2, chargeback: -0.3 },
            explanation:
              "3DS optimization reduz chargebacks significativamente, o que e otimo. Mas o impacto em auth rate e menor que Network Tokens. Para o objetivo de 90 dias do board, tokens entregam mais.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Como medir e sustentar o sucesso?",
        narrative:
          "Duas semanas apos implementar a feature escolhida, a auth rate esta subindo. O CFO quer saber como voce vai medir ROI e garantir que os ganhos sejam permanentes. Voce precisa escolher o framework de medicao.",
        situation: "Auth Rate ~79% | Meta do board: 82% em 90 dias | Faltam 4 semanas",
        choices: [
          {
            label: "Dashboard real-time + alertas",
            description: "Painel com metricas ao vivo, alertas de degradacao e drill-down por adquirente",
            impact: { authRate: 2, revenue: 0.6, crossBorder: -2, chargeback: -0.05 },
            explanation:
              "Dashboard real-time e essencial para operacoes, mas e uma ferramenta passiva. Voce ve o problema, mas nao o resolve automaticamente. Para os ultimos pontos percentuais, voce precisa de algo mais proativo.",
            optimal: false,
            score: 3,
          },
          {
            label: "Relatorio semanal executivo",
            description: "Report semanal com analise de tendencias e recomendacoes para o board",
            impact: { authRate: 1, revenue: 0.3, crossBorder: -1, chargeback: 0 },
            explanation:
              "Relatorios executivos sao importantes para governanca, mas nao melhoram a auth rate diretamente. E comunicacao, nao otimizacao.",
            optimal: false,
            score: 2,
          },
          {
            label: "A/B continuo + auto-otimizacao",
            description: "Sistema que testa continuamente novas rotas e ajusta automaticamente para maximizar aprovacao",
            impact: { authRate: 4, revenue: 1.1, crossBorder: -5, chargeback: -0.1 },
            explanation:
              "Perfeito. A/B continuo fecha o ciclo: voce nao apenas mede, mas otimiza automaticamente. O sistema testa novas rotas, BINs e horarios, ajustando em tempo real. Isso garante que os ganhos sejam permanentes e continuem melhorando.",
            optimal: true,
            score: 5,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "Tres meses depois, voce apresenta os resultados ao board da ShopBR. O caminho ideal era: A/B test de rotas (investigacao rapida e acionavel) -> Network Tokens (maximizar aprovacao por adquirente) -> A/B continuo (sustentar e escalar ganhos). Empresas como VTEX e dLocal reportam ganhos similares ao combinar roteamento inteligente com tokenizacao.",
      },
    ],
    idealPath: ["A/B test de rotas por adquirente", "Network Tokens", "A/B continuo + auto-otimizacao"],
    idealExplanation:
      "A sequencia otima investiga rapido (A/B test), implementa a tecnologia de maior impacto (Network Tokens) e cria um sistema auto-sustentavel (A/B continuo). Auth rate final: ~85%, +R$5.8M/mes em receita recuperada.",
  },
  {
    id: "marketplace-fraud",
    title: "Marketplace com fraude organizada",
    icon: "\uD83D\uDEA8",
    difficulty: "Dificil",
    difficultyColor: "#EF4444",
    company: "TechMart",
    sector: "Marketplace",
    metrics: {
      fraudRate: { label: "Fraud Rate", value: 3.2, suffix: "%", color: "#EF4444", better: "down" },
      chargebacks: { label: "Chargebacks/mes", value: 847, suffix: "", color: "#F59E0B", better: "down" },
      gmv: { label: "GMV Mensal", value: 8.2, suffix: "M", color: "#3B82F6", better: "up" },
      falsePositive: { label: "Falsos Positivos", value: 12, suffix: "%", color: "#8B5CF6", better: "down" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce e o Head de Risk do TechMart, um marketplace de eletronicos com GMV de R$8.2M/mes. Na segunda-feira de manha, voce recebe um e-mail da Visa: \"Seu merchant ID foi incluido no Visa Fraud Monitoring Program. Voce tem 90 dias para reduzir a fraud rate para abaixo de 0.9% ou enfrentara multas progressivas.\" A taxa de fraude saltou de 0.5% para 3.2% nas ultimas 3 semanas. O time de risco, com 4 analistas, esta revisando 200+ transacoes suspeitas por dia manualmente.",
      },
      {
        type: "decision",
        title: "Decisao 1: Acao imediata de contencao",
        narrative:
          "Voce tem 48 horas para conter o sangramento antes da proxima reuniao com o CEO. Os chargebacks estao custando R$270K/mes e crescendo. Qual a primeira medida?",
        situation: "Fraud Rate: 3.2% | 847 chargebacks/mes | Alerta Visa ativo | Time sobrecarregado",
        choices: [
          {
            label: "Velocity checks + limites por seller",
            description: "Implementar limites de transacoes por cartao/device/IP e teto por seller novo",
            impact: { fraudRate: -1.4, chargebacks: -380, gmv: -0.3, falsePositive: 2 },
            explanation:
              "Velocity checks sao a medida de contencao mais equilibrada. Limitam a fraude sem matar o negocio. O aumento de falsos positivos e aceitavel no curto prazo. Sellers novos com limites baixos reduzem exposicao imediatamente.",
            optimal: true,
            score: 5,
          },
          {
            label: "Bloquear todas transacoes >R$500",
            description: "Cortar todas as transacoes de alto valor ate investigar a causa raiz",
            impact: { fraudRate: -1.8, chargebacks: -450, gmv: -2.8, falsePositive: 18 },
            explanation:
              "Bloquear por valor e uma guilhotina. Reduz fraude rapidamente, mas mata 34% do GMV porque eletronicos caros sao o core do marketplace. O impacto comercial e desproporcional e sellers legitimos vao reclamar.",
            optimal: false,
            score: 2,
          },
          {
            label: "Triplicar o time de review manual",
            description: "Contratar 8 analistas temporarios para review manual de todas transacoes suspeitas",
            impact: { fraudRate: -0.4, chargebacks: -100, gmv: 0, falsePositive: -1 },
            explanation:
              "Mais analistas ajudam, mas levam 2-3 semanas para treinar e a fraude organizada se adapta mais rapido que review manual. Voce esta jogando dinheiro num problema que precisa de solucao sistematica.",
            optimal: false,
            score: 2,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Investigacao da causa raiz",
        narrative:
          "A contencao inicial deu resultado. Agora voce precisa entender de onde vem o ataque. Seu analista sênior descobriu que 70% dos chargebacks vem de sellers criados nas ultimas 6 semanas.",
        situation: "Fraud Rate: ~1.8% | Contencao funcionando | Padrao de sellers novos identificado",
        choices: [
          {
            label: "Analise de rede (sellers + devices + IPs)",
            description: "Mapear conexoes entre sellers, dispositivos e enderecos IP para identificar o ring de fraude",
            impact: { fraudRate: -0.8, chargebacks: -200, gmv: 0.3, falsePositive: -3 },
            explanation:
              "Analise de rede e a investigacao mais poderosa. Voce descobre que 12 sellers \"independentes\" compartilham 3 dispositivos e 2 faixas de IP. Ao suspender o ring inteiro, a fraude cai drasticamente e voce pode relaxar regras para sellers legitimos, reduzindo falsos positivos.",
            optimal: true,
            score: 5,
          },
          {
            label: "Analise de BIN e padroes de cartao",
            description: "Investigar quais BINs e tipos de cartao estao sendo usados nas fraudes",
            impact: { fraudRate: -0.4, chargebacks: -100, gmv: 0, falsePositive: -1 },
            explanation:
              "Analise de BIN identifica cartoes de teste e BINs comprometidos, mas nao revela QUEM esta por tras. Em fraude organizada de marketplace, o vetor de ataque e o seller, nao o cartao.",
            optimal: false,
            score: 3,
          },
          {
            label: "Reforcar KYC de sellers",
            description: "Exigir documentacao adicional e verificacao de identidade para todos os sellers",
            impact: { fraudRate: -0.3, chargebacks: -80, gmv: -0.4, falsePositive: 0 },
            explanation:
              "KYC mais rigoroso e importante a longo prazo, mas leva semanas para implementar e cria friccao no onboarding. Nao resolve o problema dos sellers fraudulentos JA ativos na plataforma.",
            optimal: false,
            score: 2,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Prevencao permanente",
        narrative:
          "O ring de fraude foi identificado e suspenso. Agora voce precisa garantir que isso nao aconteca novamente. O CEO quer um plano de prevencao para apresentar ao board e a Visa.",
        situation: "Fraud Rate: ~1.0% | Ring suspenso | Meta Visa: <0.9% | Precisamos de sistema permanente",
        choices: [
          {
            label: "ML hibrido + seller scoring",
            description: "Modelo de ML para transacoes + score de risco para sellers com monitoramento continuo",
            impact: { fraudRate: -0.5, chargebacks: -120, gmv: 0.5, falsePositive: -6 },
            explanation:
              "O modelo hibrido e a solucao gold-standard para marketplaces. ML detecta padroes novos em transacoes, enquanto seller scoring monitora comportamento ao longo do tempo. A combinacao reduz fraude E falsos positivos, liberando GMV de sellers legitimos.",
            optimal: true,
            score: 5,
          },
          {
            label: "Regras estaticas avancadas",
            description: "Criar conjunto robusto de regras baseadas nos padroes descobertos",
            impact: { fraudRate: -0.3, chargebacks: -70, gmv: -0.1, falsePositive: -2 },
            explanation:
              "Regras estaticas sao previsíveis e rapidas, mas fraudadores se adaptam. Em 3-6 meses, novos vetores de ataque vao contornar as regras. ML se adapta automaticamente.",
            optimal: false,
            score: 3,
          },
          {
            label: "Terceirizar para provider antifraude",
            description: "Contratar Signifyd, Riskified ou ClearSale para gerenciar fraude",
            impact: { fraudRate: -0.4, chargebacks: -90, gmv: -0.2, falsePositive: -4 },
            explanation:
              "Terceirizar e rapido e eficaz, mas caro (1-2% do GMV) e remove controle estrategico. Para um marketplace, entender os proprios dados de seller e vantagem competitiva. Melhor construir internamente.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "Seis meses depois, o TechMart saiu do programa de monitoramento da Visa. O caminho ideal era: Velocity checks (contencao rapida sem matar GMV) -> Analise de rede (identificar o ring inteiro) -> ML hibrido + seller scoring (prevencao adaptativa). Marketplaces como Mercado Livre e Shopee usam abordagens similares de seller scoring combinado com ML transacional.",
      },
    ],
    idealPath: ["Velocity checks + limites por seller", "Analise de rede (sellers + devices + IPs)", "ML hibrido + seller scoring"],
    idealExplanation:
      "Contencao imediata (velocity), investigacao cirurgica (analise de rede), e prevencao adaptativa (ML + seller scoring). Fraud rate final: 0.5%, saida do programa Visa, GMV recuperado para R$8.7M.",
  },
  {
    id: "saas-churn",
    title: "SaaS com churn involuntario alto",
    icon: "\uD83D\uDD04",
    difficulty: "Medio",
    difficultyColor: "#F59E0B",
    company: "CloudPay SaaS",
    sector: "SaaS B2B",
    metrics: {
      churnInvol: { label: "Churn Involuntario", value: 8.5, suffix: "%", color: "#EF4444", better: "down" },
      mrr: { label: "MRR", value: 2.8, suffix: "M", color: "#3B82F6", better: "up" },
      retrySuccess: { label: "Retry Success", value: 22, suffix: "%", color: "#10B981", better: "up" },
      dunning: { label: "Dunning Recovery", value: 15, suffix: "%", color: "#8B5CF6", better: "up" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce e VP de Payments da CloudPay, uma SaaS B2B com MRR de R$2.8M e 3.200 clientes. O board esta preocupado: o churn involuntario (falhas de pagamento) e 8.5% — quase o triplo do benchmark de 3% para SaaS. Isso significa que R$238K/mes de receita e perdida simplesmente porque cartoes falham na cobranca recorrente. Seu sistema atual tenta 1 retry 24h apos a falha e envia 1 e-mail de dunning. O CEO diz: \"Estamos perdendo clientes que QUEREM pagar. Resolva isso.\"",
      },
      {
        type: "decision",
        title: "Decisao 1: Primeira melhoria no retry",
        narrative:
          "Voce analisou os dados: 45% das falhas sao soft-declines (fundos insuficientes temporariamente, limite diario) e 30% sao dados desatualizados (cartao expirado, numero trocado). Seu retry unico 24h apos falha recupera apenas 22%.",
        situation: "1 retry 24h apos falha | 22% de recuperacao | 45% soft-declines | 30% dados desatualizados",
        choices: [
          {
            label: "Smart retry com schedule otimizado",
            description: "Retries em horarios otimizados (dia de pagamento, horario comercial) com backoff inteligente",
            impact: { churnInvol: -2.5, mrr: 0.3, retrySuccess: 25, dunning: 3 },
            explanation:
              "Smart retry e o quick-win mais poderoso. Estudos da Stripe e Recurly mostram que retries em horarios otimizados (5o dia util, 10h da manha) recuperam 40-60% dos soft-declines. De 22% para 47% de recovery e um salto massivo.",
            optimal: true,
            score: 5,
          },
          {
            label: "Account Updater",
            description: "Implementar servico de atualizacao automatica de dados de cartao via bandeiras",
            impact: { churnInvol: -1.5, mrr: 0.2, retrySuccess: 10, dunning: 2 },
            explanation:
              "Account Updater resolve os 30% de dados desatualizados, mas nao ajuda com soft-declines (45% do problema). Smart retry teria impacto maior no volume total de recuperacao.",
            optimal: false,
            score: 4,
          },
          {
            label: "Dunning email sequence avancada",
            description: "Serie de 5 e-mails personalizados pedindo atualizacao do metodo de pagamento",
            impact: { churnInvol: -1.0, mrr: 0.1, retrySuccess: 3, dunning: 12 },
            explanation:
              "Dunning melhor e importante, mas depende do cliente agir. Taxa de abertura de e-mail transacional e 40-50%, e conversao de atualizacao e ~15%. Smart retry automatiza a recuperacao sem depender do cliente.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Reduzir falhas na origem",
        narrative:
          "Os smart retries estao funcionando bem. Agora voce quer atacar a causa raiz: por que tantos cartoes falham na primeira tentativa?",
        situation: "Retry recovery subiu para ~47% | Ainda temos 30% de dados desatualizados | MRR estabilizando",
        choices: [
          {
            label: "Account Updater + Network Tokens",
            description: "Atualizacao automatica de cartoes via bandeira + tokenizacao para maior aprovacao",
            impact: { churnInvol: -2.0, mrr: 0.4, retrySuccess: 5, dunning: 2 },
            explanation:
              "A combinacao Account Updater + Network Tokens e devastadoramente eficaz. Updater mantem dados corretos automaticamente, e tokens da bandeira tem 2-4% mais aprovacao que PANs. Juntos, eliminam a maioria das falhas evitaveis.",
            optimal: true,
            score: 5,
          },
          {
            label: "Pre-dunning proativo",
            description: "Notificar clientes 7 dias antes do vencimento se o cartao esta proximo de expirar",
            impact: { churnInvol: -1.0, mrr: 0.2, retrySuccess: 2, dunning: 8 },
            explanation:
              "Pre-dunning e uma boa pratica, mas ainda depende do cliente agir. Account Updater faz isso automaticamente, sem friccao. A combinacao com tokens e mais completa.",
            optimal: false,
            score: 3,
          },
          {
            label: "Backup payment method",
            description: "Pedir segundo metodo de pagamento no onboarding como fallback",
            impact: { churnInvol: -1.2, mrr: 0.2, retrySuccess: 8, dunning: 3 },
            explanation:
              "Backup payment e util, mas adiciona friccao no onboarding e so funciona para novos clientes. Para a base existente de 3.200 clientes, Account Updater tem impacto imediato.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Otimizacao e escala",
        narrative:
          "O churn involuntario caiu pela metade. O CFO quer saber: como voce garante que continuamos melhorando e qual o proximo patamar?",
        situation: "Churn involuntario ~4% | Meta: <3% | MRR estavel e crescendo | Board satisfeito",
        choices: [
          {
            label: "Oferecer PIX como fallback automatico",
            description: "Quando cartao falha, cobrar automaticamente via PIX (debitando de conta ja cadastrada)",
            impact: { churnInvol: -0.8, mrr: 0.2, retrySuccess: 3, dunning: 2 },
            explanation:
              "PIX como fallback e inovador no contexto brasileiro. Com taxa de sucesso de 95%+ e liquidacao instantanea, recupera transacoes que nenhum retry de cartao conseguiria. Porem, requer consentimento previo e integracao com Open Finance.",
            optimal: false,
            score: 4,
          },
          {
            label: "ML para prever e prevenir falhas",
            description: "Modelo preditivo que antecipa falhas e ajusta data/hora/metodo de cobranca proativamente",
            impact: { churnInvol: -1.2, mrr: 0.3, retrySuccess: 8, dunning: 5 },
            explanation:
              "ML preditivo e o nivel mais avancado de otimizacao. O modelo aprende padroes de cada cliente (dia que recebe salario, horario que tem limite, metodo preferido) e ajusta a cobranca automaticamente. Empresas como Recurly e Chargebee reportam reducoes de 20-40% adicionais em churn involuntario.",
            optimal: true,
            score: 5,
          },
          {
            label: "Programa de fidelidade com desconto anual",
            description: "Incentivar planos anuais pre-pagos para eliminar cobrancas mensais",
            impact: { churnInvol: -0.5, mrr: 0.1, retrySuccess: 0, dunning: 0 },
            explanation:
              "Planos anuais reduzem a exposicao a falhas (12 cobracas viram 1), mas a conversao anual tipica e 15-20% da base. ML preditivo tem impacto em 100% dos clientes mensais.",
            optimal: false,
            score: 2,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "Em 6 meses, a CloudPay reduziu o churn involuntario de 8.5% para 2.8%, abaixo do benchmark de 3%. O caminho ideal era: Smart retry (quick-win massivo) -> Account Updater + Tokens (eliminar causa raiz) -> ML preditivo (otimizacao continua). Empresas como Slack, Zoom e HubSpot implementaram stacks similares para manter churn involuntario abaixo de 2%.",
      },
    ],
    idealPath: ["Smart retry com schedule otimizado", "Account Updater + Network Tokens", "ML para prever e prevenir falhas"],
    idealExplanation:
      "Quick-win com smart retry, eliminacao da causa raiz com Account Updater + Tokens, e otimizacao continua com ML. Churn involuntario final: 2.8%, +R$1.6M/ano em receita recuperada.",
  },
  {
    id: "cross-border-latam",
    title: "Otimizacao cross-border LATAM",
    icon: "\uD83C\uDF0E",
    difficulty: "Dificil",
    difficultyColor: "#EF4444",
    company: "LatamPay",
    sector: "Pagamentos Cross-border",
    metrics: {
      authRate: { label: "Auth Rate LATAM", value: 61, suffix: "%", color: "#EF4444", better: "up" },
      fxCost: { label: "Custo FX", value: 3.8, suffix: "%", color: "#F59E0B", better: "down" },
      tpv: { label: "TPV Mensal", value: 15, suffix: "M", color: "#3B82F6", better: "up" },
      countries: { label: "Paises Ativos", value: 4, suffix: "", color: "#10B981", better: "up" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce e Head de Expansion da LatamPay, uma fintech que processa pagamentos cross-border na America Latina. Hoje operam em 4 paises (Brasil, Mexico, Colombia, Argentina) com TPV de US$15M/mes. O problema: a auth rate media e 61% — muito abaixo dos 80%+ que conseguem domesticamente em cada pais. O custo de FX de 3.8% esta comendo a margem. O CEO quer expandir para Chile e Peru ate o fim do ano, mas precisa resolver a eficiencia atual primeiro.",
      },
      {
        type: "decision",
        title: "Decisao 1: Estrategia de roteamento",
        narrative:
          "Ao analisar os dados, voce percebe que todas as transacoes estao sendo processadas via um unico adquirente nos EUA que faz settlement em USD. Transacoes do Brasil para Mexico, por exemplo, fazem: BRL -> USD -> MXN com dupla conversao.",
        situation: "Roteamento centralizado nos EUA | Dupla conversao cambial | 61% auth rate media",
        choices: [
          {
            label: "Adquirentes locais em cada pais",
            description: "Conectar adquirentes locais (Cielo/BR, Conekta/MX, Mercado Pago/CO) para processar domesticamente",
            impact: { authRate: 12, fxCost: -1.5, tpv: 2, countries: 0 },
            explanation:
              "Adquirentes locais sao o game-changer. Processar domesticamente elimina a dupla conversao e emissores locais aprovam mais quando a transacao vem de um adquirente do mesmo pais. dLocal e EBANX construiram seus negocios exatamente nesta tese.",
            optimal: true,
            score: 5,
          },
          {
            label: "Otimizar roteamento no adquirente atual",
            description: "Negociar melhores taxas e configuracoes com o adquirente americano existente",
            impact: { authRate: 3, fxCost: -0.5, tpv: 0.5, countries: 0 },
            explanation:
              "Otimizar o adquirente atual ajuda marginalmente, mas o problema estrutural de processamento offshore permanece. Emissores locais simplesmente aprovam menos transacoes vindas de adquirentes estrangeiros.",
            optimal: false,
            score: 2,
          },
          {
            label: "Implementar metodos locais (PIX, OXXO, PSE)",
            description: "Adicionar metodos de pagamento alternativos locais em cada pais",
            impact: { authRate: 5, fxCost: -0.8, tpv: 3, countries: 0 },
            explanation:
              "Metodos locais sao importantes para cobertura (PIX no Brasil, OXXO no Mexico), mas nao resolvem a auth rate de cartoes que e o core do TPV. Adquirentes locais atacam o problema principal primeiro.",
            optimal: false,
            score: 4,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Otimizacao de FX",
        narrative:
          "Com adquirentes locais, a auth rate subiu e voce esta processando domesticamente. Mas ainda tem custo de FX quando o merchant quer receber em USD. Como otimizar?",
        situation: "Auth Rate ~73% | FX ainda custa 2.3% | Merchants querem settlement em USD ou moeda local",
        choices: [
          {
            label: "Settlement em moeda local + netting",
            description: "Oferecer settlement na moeda local e usar netting entre paises para reduzir conversoes",
            impact: { authRate: 2, fxCost: -1.0, tpv: 1.5, countries: 0 },
            explanation:
              "Netting e settlement local sao sofisticados e eficazes. Se voce tem R$1M entrando no Brasil e US$200K saindo para Mexico, pode compensar internamente sem converter tudo. Reduz custo de FX em 40-60%. Wise (TransferWise) popularizou este modelo.",
            optimal: true,
            score: 5,
          },
          {
            label: "Negociar spreads menores com bancos",
            description: "Usar volume para conseguir taxas de câmbio melhores com parceiros bancarios",
            impact: { authRate: 0, fxCost: -0.4, tpv: 0, countries: 0 },
            explanation:
              "Negociar spreads ajuda, mas o ganho e limitado (0.3-0.5%). Netting elimina conversoes inteiras, o que e muito mais impactante que reduzir o custo de cada conversao.",
            optimal: false,
            score: 2,
          },
          {
            label: "Multi-currency accounts",
            description: "Manter contas em cada moeda para timing otimo de conversao",
            impact: { authRate: 0, fxCost: -0.6, tpv: 0.5, countries: 0 },
            explanation:
              "Contas multi-currency permitem converter em momentos favoraveis, mas requerem capital parado em cada moeda e expertise de tesouraria. Netting e mais eficiente para o mesmo resultado.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Expansao para novos paises",
        narrative:
          "O modelo esta funcionando. Agora o CEO quer Chile e Peru online ate o fim do ano. Como voce aborda a expansao mantendo qualidade?",
        situation: "Auth Rate 75% | FX Cost 1.3% | Modelo validado em 4 paises | Meta: +2 paises ate dezembro",
        choices: [
          {
            label: "Expansao via orquestracao multi-PSP",
            description: "Usar plataforma de orquestracao para conectar PSPs locais rapidamente em cada novo pais",
            impact: { authRate: 3, fxCost: -0.2, tpv: 4, countries: 2 },
            explanation:
              "Orquestracao multi-PSP e a forma mais rapida e escalavel de expandir. Plataformas como Spreedly ou Primer conectam PSPs locais em semanas em vez de meses. Voce mantem a flexibilidade de trocar ou adicionar PSPs conforme necessidade sem reescrever integracao.",
            optimal: true,
            score: 5,
          },
          {
            label: "Integracao direta com adquirentes locais",
            description: "Fazer integracao ponto-a-ponto com adquirentes em Chile (Transbank) e Peru (Niubiz)",
            impact: { authRate: 4, fxCost: -0.2, tpv: 3, countries: 2 },
            explanation:
              "Integracao direta da mais controle e potencialmente melhor auth rate, mas cada integracao leva 2-4 meses. Com meta de dezembro, voce corre risco de nao entregar. Orquestracao acelera sem sacrificar muito controle.",
            optimal: false,
            score: 4,
          },
          {
            label: "Parceria com PSP pan-regional",
            description: "Usar um unico PSP que ja opera em Chile e Peru como MercadoPago ou dLocal",
            impact: { authRate: 2, fxCost: 0.3, tpv: 2.5, countries: 2 },
            explanation:
              "PSP pan-regional e rapido para lancar, mas voce fica dependente de um unico parceiro e tipicamente paga mais. O custo de FX pode ate subir porque voce perde poder de negociacao. Orquestracao preserva flexibilidade.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "Em 9 meses, a LatamPay transformou sua operacao cross-border. O caminho ideal: adquirentes locais (resolver auth rate), netting + settlement local (otimizar FX), orquestracao multi-PSP (escalar rapidamente). Fintechs como dLocal, EBANX e Kushki validaram que processamento local com inteligencia global e a formula para LATAM.",
      },
    ],
    idealPath: ["Adquirentes locais em cada pais", "Settlement em moeda local + netting", "Expansao via orquestracao multi-PSP"],
    idealExplanation:
      "Processamento local (auth rate +17%), netting para FX (custo cai 60%), orquestracao para escala (2 paises em 3 meses). Auth rate final: 78%, FX cost: 1.1%, 6 paises ativos.",
  },
  {
    id: "boleto-pix",
    title: "Migracao de boleto para PIX",
    icon: "\u26A1",
    difficulty: "Facil",
    difficultyColor: "#10B981",
    company: "EducaBR",
    sector: "Educacao Online",
    metrics: {
      convBoleto: { label: "Conversao Boleto", value: 55, suffix: "%", color: "#EF4444", better: "up" },
      convPix: { label: "Conversao PIX", value: 0, suffix: "%", color: "#10B981", better: "up" },
      ticketMedio: { label: "Ticket Medio", value: 297, suffix: "R$", color: "#3B82F6", better: "up" },
      settlement: { label: "Settlement", value: 3, suffix: " dias", color: "#8B5CF6", better: "down" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce gerencia pagamentos da EducaBR, uma plataforma de cursos online com 180K alunos. Hoje, 40% da receita vem de boleto bancario — um legado do perfil do publico (classes B/C, muitos sem cartao de credito). O problema: a conversao de boleto e 55% (quase metade dos boletos gerados nunca sao pagos). O settlement e D+2/D+3, e o custo operacional de R$3.50 por boleto esta acumulando. O PIX ja tem 150M de usuarios no Brasil. O CEO pergunta: \"Por que ainda nao migramos?\"",
      },
      {
        type: "decision",
        title: "Decisao 1: Estrategia de migracao",
        narrative:
          "Voce precisa definir como introduzir o PIX sem alienar os clientes que ja estao acostumados com boleto. 35% do publico tem mais de 45 anos e usa boleto ha anos.",
        situation: "40% da receita via boleto | Conversao 55% | Publico parte senior | PIX nao implementado",
        choices: [
          {
            label: "PIX como opcao padrao, boleto como fallback",
            description: "Reordenar checkout: PIX primeiro, boleto visivel mas secundario",
            impact: { convBoleto: -10, convPix: 72, ticketMedio: 5, settlement: -2 },
            explanation:
              "A estrategia ideal. PIX como padrao captura a maioria que ja usa PIX (75% dos brasileiros), enquanto manter boleto visível nao aliena quem precisa. A conversao de PIX e tipicamente 85-92% (vs 55% boleto), e o settlement e instantaneo.",
            optimal: true,
            score: 5,
          },
          {
            label: "Remover boleto completamente",
            description: "Substituir boleto por PIX e cartao, eliminando a opcao de boleto",
            impact: { convBoleto: -55, convPix: 68, ticketMedio: -15, settlement: -3 },
            explanation:
              "Remover boleto completamente e arriscado. 15-20% do publico da EducaBR pode nao ter PIX ou preferir boleto por habito. Voce perde receita no curto prazo ate esses clientes se adaptarem (se adaptarem).",
            optimal: false,
            score: 2,
          },
          {
            label: "Oferecer desconto para PIX",
            description: "Dar 5% de desconto para pagamentos via PIX como incentivo de migracao",
            impact: { convBoleto: -5, convPix: 65, ticketMedio: -12, settlement: -1 },
            explanation:
              "Desconto para PIX funciona como incentivo, mas come a margem (5% de R$297 = R$14.85 por transacao). Simplesmente reordenar o checkout ja direciona a maioria para PIX sem custo. O desconto pode ser usado pontualmente, nao como estrategia principal.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Otimizacao da experiencia PIX",
        narrative:
          "PIX esta funcionando como opcao padrao. A conversao de PIX e boa, mas voce quer maximizar. Alguns clientes copiam o codigo e esquecem de pagar. Outros reclamam que o QR code expirou.",
        situation: "PIX como padrao | Conversao PIX ~72% | 15% copiam e nao pagam | QR expira em 30min",
        choices: [
          {
            label: "PIX com QR dinamico + notificacoes",
            description: "QR com validade estendida (24h) + WhatsApp/push lembrando do pagamento pendente",
            impact: { convBoleto: 0, convPix: 12, ticketMedio: 3, settlement: 0 },
            explanation:
              "QR dinamico com validade estendida + notificacoes e a combinacao perfeita. WhatsApp tem 98% de taxa de abertura no Brasil. Um lembrete 1h depois com link direto para o PIX recupera 60-70% dos abandonos. iFood e Nubank usam este modelo.",
            optimal: true,
            score: 5,
          },
          {
            label: "PIX Copia-e-Cola otimizado",
            description: "Melhorar UX do copia-e-cola com botao de copiar grande e instrucoes claras",
            impact: { convBoleto: 0, convPix: 5, ticketMedio: 0, settlement: 0 },
            explanation:
              "Melhorar o copia-e-cola ajuda, mas o problema real e que o cliente SAI do checkout. Notificacoes o trazem de volta. UX melhor e necessario mas nao suficiente.",
            optimal: false,
            score: 3,
          },
          {
            label: "PIX parcelado via Open Finance",
            description: "Implementar PIX com parcelamento automatico debitando da conta do cliente",
            impact: { convBoleto: -3, convPix: 8, ticketMedio: 45, settlement: 0 },
            explanation:
              "PIX parcelado e inovador e aumenta ticket medio, mas a adocao de Open Finance ainda e baixa (menos de 10% dos usuarios). Notificacoes + QR dinamico tem impacto imediato em 100% dos usuarios PIX.",
            optimal: false,
            score: 3,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Maximizar revenue e recorrencia",
        narrative:
          "A migracao esta madura. PIX domina o checkout. Agora voce quer resolver o ultimo problema: recorrencia. Cursos tem mensalidades, e PIX nao tem debito automatico nativo (ainda).",
        situation: "PIX conversao ~84% | Boleto caiu para 15% do mix | Recorrencia e o proximo desafio",
        choices: [
          {
            label: "PIX recorrente via link de pagamento mensal",
            description: "Enviar link de PIX todo mes via WhatsApp/email com 1 toque para pagar",
            impact: { convBoleto: -2, convPix: 3, ticketMedio: 8, settlement: 0 },
            explanation:
              "Link de pagamento mensal via WhatsApp e a solucao pragmatica. 1 toque para pagar e quase tao facil quanto debito automatico. Acompanhado de lembretes, a conversao de recorrencia chega a 88-92%. Enquanto PIX debito automatico nao amadurece, esta e a melhor opcao.",
            optimal: true,
            score: 5,
          },
          {
            label: "Migrar recorrencia para cartao de credito",
            description: "Incentivar cadastro de cartao para cobranca automatica de mensalidades",
            impact: { convBoleto: -5, convPix: -3, ticketMedio: 0, settlement: -1 },
            explanation:
              "Cartao de credito tem debito automatico nativo, mas boa parte do publico da EducaBR nao tem cartao (por isso usavam boleto). Forcar cartao exclui justamente o publico que voce conquistou com PIX.",
            optimal: false,
            score: 2,
          },
          {
            label: "Implementar PIX debito automatico (Pix Automatico)",
            description: "Ser early adopter do Pix Automatico do Banco Central para debito recorrente",
            impact: { convBoleto: -3, convPix: 5, ticketMedio: 2, settlement: 0 },
            explanation:
              "Pix Automatico e o futuro, mas a implementacao esta em fase inicial com poucos bancos suportando. Link de pagamento mensal resolve AGORA, e voce migra para Pix Automatico quando estiver maduro.",
            optimal: false,
            score: 4,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "Em 4 meses, a EducaBR transformou seus pagamentos. O caminho ideal: PIX como padrao com boleto fallback (migracao suave), QR dinamico + notificacoes WhatsApp (maximizar conversao), link de pagamento recorrente (resolver recorrencia sem cartao). Empresas como Hotmart e Eduzz reportam que PIX superou boleto em todos os indicadores em plataformas de educacao online.",
      },
    ],
    idealPath: ["PIX como opcao padrao, boleto como fallback", "PIX com QR dinamico + notificacoes", "PIX recorrente via link de pagamento mensal"],
    idealExplanation:
      "Migracao suave (PIX padrao), maximizacao de conversao (QR + WhatsApp), e recorrencia pragmatica (link mensal). Conversao PIX: 87%, settlement instantaneo, custo operacional reduzido em 70%.",
  },
  {
    id: "multi-acquirer",
    title: "Setup multi-adquirente para escala",
    icon: "\uD83C\uDFD7\uFE0F",
    difficulty: "Dificil",
    difficultyColor: "#EF4444",
    company: "ScalePay",
    sector: "Plataforma de Pagamentos",
    metrics: {
      uptime: { label: "Uptime", value: 97.2, suffix: "%", color: "#EF4444", better: "up" },
      authRate: { label: "Auth Rate", value: 74, suffix: "%", color: "#F59E0B", better: "up" },
      costPerTx: { label: "Custo/TX", value: 2.8, suffix: "%", color: "#3B82F6", better: "down" },
      tps: { label: "TPS Pico", value: 180, suffix: "", color: "#10B981", better: "up" },
    },
    stages: [
      {
        type: "context",
        title: "O Cenario",
        narrative:
          "Voce e o CTO da ScalePay, uma plataforma de pagamentos que processa para 800 merchants. Hoje voce usa um unico adquirente (Cielo) e esta enfrentando problemas: uptime de 97.2% (meta: 99.9%), auth rate de 74% (mercado: 82%), e custos crescentes porque nao tem poder de negociacao. Na Black Friday passada, o adquirente caiu por 23 minutos e voce perdeu R$2.1M em vendas dos merchants. O board exige: \"Nunca mais.\"",
      },
      {
        type: "decision",
        title: "Decisao 1: Arquitetura de roteamento",
        narrative:
          "Voce precisa sair da dependencia de um unico adquirente. A primeira decisao e como construir a camada de roteamento que vai orquestrar multiplos adquirentes.",
        situation: "1 adquirente (Cielo) | 97.2% uptime | Sem failover | Black Friday = R$2.1M perdidos",
        choices: [
          {
            label: "Orquestrador proprio com failover automatico",
            description: "Construir camada de roteamento interna com health-check e failover em tempo real entre adquirentes",
            impact: { uptime: 2.3, authRate: 4, costPerTx: -0.1, tps: 50 },
            explanation:
              "Orquestrador proprio e o investimento certo para uma plataforma de pagamentos. Health-check a cada 5 segundos, failover em menos de 100ms, e a base para smart routing futuro. Voce controla a logica, os dados e a evolucao. Para plataformas de escala, este e o caminho de dLocal, Adyen e Stripe.",
            optimal: true,
            score: 5,
          },
          {
            label: "Usar plataforma de orquestracao (Spreedly/Primer)",
            description: "Implementar orquestrador terceirizado para conectar multiplos adquirentes rapidamente",
            impact: { uptime: 2.0, authRate: 3, costPerTx: 0.2, tps: 30 },
            explanation:
              "Orquestracao terceirizada e rapida para lancar, mas adiciona custo por transacao e dependencia de terceiro. Para uma plataforma que vende pagamentos como core, o orquestrador deve ser proprio. Faz sentido para merchants, nao para PSPs.",
            optimal: false,
            score: 3,
          },
          {
            label: "Failover manual com segundo adquirente",
            description: "Conectar Rede como backup e trocar manualmente quando Cielo cair",
            impact: { uptime: 1.0, authRate: 1, costPerTx: 0, tps: 0 },
            explanation:
              "Failover manual e melhor que nada, mas \"manualmente\" em pagamentos significa minutos de downtime. Cada minuto parado na Black Friday custa R$91K. Failover automatico e essencial.",
            optimal: false,
            score: 1,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 2: Estrategia de roteamento inteligente",
        narrative:
          "O orquestrador esta no ar com 3 adquirentes (Cielo, Rede, Stone). Failover funciona perfeitamente. Agora voce quer maximizar auth rate roteando cada transacao para o adquirente com maior probabilidade de aprovar.",
        situation: "3 adquirentes conectados | Failover funcionando | Uptime 99.5% | Roteamento round-robin",
        choices: [
          {
            label: "Roteamento baseado em performance historica",
            description: "Analisar auth rate por BIN/bandeira/valor em cada adquirente e rotear para o melhor",
            impact: { uptime: 0.2, authRate: 5, costPerTx: -0.3, tps: 20 },
            explanation:
              "Roteamento por performance historica e o passo natural apos ter multiplos adquirentes. Voce descobre que Cielo aprova mais Visa debito, Rede tem melhor performance em Mastercard credito, e Stone lidera em valores altos. Ao rotear baseado nesses dados, voce maximiza auth rate E pode negociar melhor com cada adquirente.",
            optimal: true,
            score: 5,
          },
          {
            label: "Roteamento por custo",
            description: "Enviar cada transacao para o adquirente com menor MDR para aquela bandeira/produto",
            impact: { uptime: 0, authRate: -1, costPerTx: -0.5, tps: 0 },
            explanation:
              "Rotear por custo reduz MDR, mas pode diminuir auth rate. O adquirente mais barato nem sempre e o que mais aprova. Performance-based routing otimiza receita total (auth rate x ticket), que e mais valioso que economia em MDR.",
            optimal: false,
            score: 3,
          },
          {
            label: "Load balancing igualitario",
            description: "Distribuir trafego 33/33/33 entre os tres adquirentes para balancear carga",
            impact: { uptime: 0.1, authRate: 1, costPerTx: -0.1, tps: 40 },
            explanation:
              "Load balancing distribui carga mas nao otimiza performance. Voce trata todos os adquirentes como iguais quando eles tem perfis de aprovacao muito diferentes. E desperdicar dados valiosos.",
            optimal: false,
            score: 2,
          },
        ],
      },
      {
        type: "decision",
        title: "Decisao 3: Escala e resiliencia",
        narrative:
          "O smart routing esta entregando resultados. A proxima Black Friday esta chegando e o CEO quer garantia de que o sistema aguenta 3x o trafego normal sem degradacao.",
        situation: "Auth Rate 83% | Uptime 99.7% | TPS pico: 250 | Black Friday espera 500 TPS",
        choices: [
          {
            label: "Circuit breaker + auto-scaling + cascading retry",
            description: "Implementar circuit breaker por adquirente, auto-scaling da infra, e cascade retry para declines",
            impact: { uptime: 0.2, authRate: 3, costPerTx: -0.2, tps: 300 },
            explanation:
              "A combinacao circuit breaker + auto-scaling + cascade e o padrao de resiliencia de plataformas enterprise. Circuit breaker isola adquirentes degradados em millisegundos, auto-scaling garante capacidade, e cascade retry recupera soft-declines no proximo adquirente. Adyen processa 500+ TPS com esta arquitetura.",
            optimal: true,
            score: 5,
          },
          {
            label: "Over-provisioning de infraestrutura",
            description: "Provisionar 5x a capacidade necessaria para garantir que nao vai cair",
            impact: { uptime: 0.1, authRate: 0, costPerTx: 0.3, tps: 200 },
            explanation:
              "Over-provisioning e forca bruta. Funciona para nao cair, mas nao melhora auth rate nem resiliencia contra falhas de adquirente. E caro e ineficiente. Circuit breaker e auto-scaling fazem o mesmo com 1/5 do custo.",
            optimal: false,
            score: 2,
          },
          {
            label: "Modo degradado planejado",
            description: "Preparar modo de operacao reduzida (apenas credito Visa/Master) se trafego exceder capacidade",
            impact: { uptime: 0.1, authRate: -2, costPerTx: 0, tps: 100 },
            explanation:
              "Modo degradado e um plano B valido, mas nao deveria ser o plano A. Recusar debito e bandeiras menores durante a Black Friday significa perder vendas. Auto-scaling com circuit breaker mantem tudo funcionando.",
            optimal: false,
            score: 2,
          },
        ],
      },
      {
        type: "result",
        title: "Resultado Final",
        narrative:
          "A Black Friday foi um sucesso absoluto. O sistema processou 520 TPS no pico sem degradacao. O caminho ideal: orquestrador proprio (controle e failover), roteamento por performance (maximizar aprovacao), circuit breaker + auto-scaling (resiliencia em escala). A ScalePay agora tem a arquitetura de pagamentos mais robusta do mercado brasileiro.",
      },
    ],
    idealPath: ["Orquestrador proprio com failover automatico", "Roteamento baseado em performance historica", "Circuit breaker + auto-scaling + cascading retry"],
    idealExplanation:
      "Controle proprio (orquestrador), inteligencia (performance routing), e resiliencia (circuit breaker + scaling). Uptime: 99.9%, Auth Rate: 86%, TPS: 550, custo reduzido em 35%.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void,
  onDone?: () => void
) {
  const start = performance.now();
  function frame(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    onUpdate(from + (to - from) * eased);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      onUpdate(to);
      onDone?.();
    }
  }
  requestAnimationFrame(frame);
}

function formatMetric(value: number, suffix: string): string {
  if (suffix === "M" || suffix === "%") return value.toFixed(1) + suffix;
  if (suffix === "R$") return suffix + Math.round(value);
  if (suffix === " dias") return Math.round(value) + suffix;
  return Math.round(value).toString() + suffix;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CaseStudyLab() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, MetricDef>>({});
  const [displayMetrics, setDisplayMetrics] = useState<Record<string, MetricDef>>({});
  const [decisions, setDecisions] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const [revealedChoice, setRevealedChoice] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recordQuiz, visitPage } = useGameProgress();

  useEffect(() => {
    visitPage("/labs/case-study");
  }, [visitPage]);

  const caseData = selectedCase !== null ? CASES[selectedCase] : null;
  const stage = caseData ? caseData.stages[currentStage] : null;

  const decisionStages = caseData ? caseData.stages.filter((s) => s.type === "decision") : [];
  const currentDecisionIndex = caseData
    ? caseData.stages.slice(0, currentStage + 1).filter((s) => s.type === "decision").length - 1
    : -1;

  const startCase = useCallback((idx: number) => {
    const c = CASES[idx];
    const m = JSON.parse(JSON.stringify(c.metrics)) as Record<string, MetricDef>;
    setSelectedCase(idx);
    setCurrentStage(0);
    setMetrics(m);
    setDisplayMetrics(m);
    setDecisions([]);
    setTotalScore(0);
    setShowResult(false);
    setRevealedChoice(null);
  }, []);

  const handleChoice = useCallback(
    (choiceIdx: number) => {
      if (!stage || stage.type !== "decision" || !stage.choices || animating || revealedChoice !== null) return;
      const choice = stage.choices[choiceIdx];
      setRevealedChoice(choiceIdx);
      setDecisions((prev) => [...prev, choiceIdx]);
      setTotalScore((prev) => prev + choice.score);
      setAnimating(true);

      const newMetrics = JSON.parse(JSON.stringify(metrics)) as Record<string, MetricDef>;
      const keys = Object.keys(choice.impact);
      let completed = 0;

      keys.forEach((key) => {
        if (!metrics[key]) return;
        const from = metrics[key].value;
        const to = from + choice.impact[key];
        newMetrics[key] = { ...newMetrics[key], value: to };

        animateValue(from, to, 900, (v) => {
          setDisplayMetrics((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: v },
          }));
        }, () => {
          completed++;
          if (completed === keys.length) {
            setAnimating(false);
          }
        });
      });

      setMetrics(newMetrics);
    },
    [stage, metrics, animating, revealedChoice]
  );

  const nextStage = useCallback(() => {
    if (!caseData) return;
    setRevealedChoice(null);
    const next = currentStage + 1;
    if (next >= caseData.stages.length) {
      setShowResult(true);
      const maxScore = decisionStages.length * 5;
      const pct = Math.round((totalScore / maxScore) * 100);
      const xp = decisions.length * 5 + (pct >= 80 ? 10 : 0);
      recordQuiz("/labs/case-study-" + caseData.id, totalScore, maxScore, xp);
      setShowXpToast(`+${xp} XP — Caso concluido!${pct >= 80 ? " Bonus Expert!" : ""}`);
      setTimeout(() => setShowXpToast(null), 4000);
    } else {
      setCurrentStage(next);
    }
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [caseData, currentStage, decisionStages.length, totalScore, decisions, recordQuiz]);

  const resetAll = useCallback(() => {
    setSelectedCase(null);
    setCurrentStage(0);
    setMetrics({});
    setDisplayMetrics({});
    setDecisions([]);
    setTotalScore(0);
    setShowResult(false);
    setRevealedChoice(null);
  }, []);

  // -------------------------------------------------------------------------
  // XP Toast
  // -------------------------------------------------------------------------
  const xpToastEl = showXpToast ? (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        background: "#10B981",
        color: "white",
        padding: "0.75rem 1.25rem",
        borderRadius: "0.75rem",
        fontWeight: 700,
        fontSize: "0.85rem",
        zIndex: 999,
        boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
      }}
    >
      {showXpToast}
    </div>
  ) : null;

  // -------------------------------------------------------------------------
  // Render: Case Selector
  // -------------------------------------------------------------------------
  if (selectedCase === null) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/labs"
            style={{
              color: "var(--primary)",
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              marginBottom: "0.75rem",
            }}
          >
            &larr; Labs
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.375rem",
            }}
          >
            Estudo de Caso Interativo
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Assuma o papel de um lider de pagamentos e tome decisoes estrategicas em cenarios reais.
            Cada escolha impacta metricas — compare seu resultado com a solucao ideal do mercado.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => startCase(i)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.3rem" }}>{c.icon}</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "1rem",
                      background: c.difficultyColor + "18",
                      color: c.difficultyColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {c.difficulty}
                  </span>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>{c.sector}</span>
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {c.title}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {Object.values(c.metrics).map((m) => (
                  <span
                    key={m.label}
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "0.25rem",
                      background: m.color + "12",
                      color: m.color,
                      fontWeight: 600,
                    }}
                  >
                    {m.label}: {m.value}{m.suffix}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Result Screen
  // -------------------------------------------------------------------------
  if (showResult && caseData) {
    const maxScore = decisionStages.length * 5;
    const pct = Math.round((totalScore / maxScore) * 100);
    const scoreColor = pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
    const scoreLabel = pct >= 80 ? "Expert!" : pct >= 50 ? "Bom trabalho" : "Pode melhorar";
    const scoreEmoji = pct >= 80 ? "\uD83C\uDFC6" : pct >= 50 ? "\uD83D\uDC4D" : "\uD83D\uDCDA";

    const resultStage = caseData.stages[caseData.stages.length - 1];

    return (
      <div ref={containerRef} style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
        {xpToastEl}

        {/* Score Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{scoreEmoji}</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
            {scoreLabel}
          </h2>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: scoreColor, marginBottom: "0.5rem" }}>
            {totalScore}/{maxScore} pontos
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {pct}% do caminho ideal — {decisions.filter((d, i) => {
              const dStage = caseData.stages.filter((s) => s.type === "decision")[i];
              return dStage?.choices?.[d]?.optimal;
            }).length} de {decisionStages.length} decisoes otimas
          </p>
        </div>

        {/* Before/After Metrics */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Comparacao Antes / Depois
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {Object.entries(metrics).map(([key, m]) => {
              const initial = caseData.metrics[key];
              const diff = m.value - initial.value;
              const isGood = (m.better === "up" && diff > 0) || (m.better === "down" && diff < 0);
              return (
                <div
                  key={key}
                  style={{
                    background: "var(--background)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    border: "1px solid var(--border)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.15rem", textDecoration: "line-through" }}>
                    {formatMetric(initial.value, m.suffix)}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: m.color }}>
                    {formatMetric(m.value, m.suffix)}
                  </div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: isGood ? "#10B981" : "#EF4444" }}>
                    {diff >= 0 ? "+" : ""}{formatMetric(diff, m.suffix === "R$" ? "" : m.suffix)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrative + Ideal Path */}
        <div
          style={{
            background: "var(--primary-bg)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem" }}>
            Solucao Real — O que as melhores empresas fazem
          </div>
          <p style={{ fontSize: "0.825rem", color: "var(--foreground)", lineHeight: 1.7, marginBottom: "1rem" }}>
            {resultStage.narrative}
          </p>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Caminho ideal:
          </div>
          {caseData.idealPath.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "50%",
                  minWidth: "1.2rem",
                  height: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "0.1rem",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "0.75rem", fontStyle: "italic" }}>
            {caseData.idealExplanation}
          </p>
        </div>

        {/* Reflection */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Reflexao: O que voce faria diferente?
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Reveja suas decisoes e pense: com as informacoes que voce tem agora, qual seria sua estrategia?
            Em pagamentos, a ordem das prioridades frequentemente importa tanto quanto as proprias escolhas.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={resetAll}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Escolher Outro Caso
          </button>
          <button
            onClick={() => startCase(selectedCase)}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Stage (Context / Decision)
  // -------------------------------------------------------------------------
  if (!caseData || !stage) return null;

  const stageProgress = ((currentStage + 1) / caseData.stages.length) * 100;

  return (
    <div ref={containerRef} style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
      {xpToastEl}

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          href="/labs"
          style={{
            color: "var(--primary)",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            marginBottom: "0.75rem",
          }}
        >
          &larr; Labs
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)" }}>
            {caseData.icon} {caseData.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.15rem 0.5rem",
                borderRadius: "1rem",
                background: caseData.difficultyColor + "18",
                color: caseData.difficultyColor,
              }}
            >
              {caseData.difficulty}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--primary)",
                background: "var(--primary-bg)",
                padding: "0.2rem 0.6rem",
                borderRadius: "1rem",
              }}
            >
              Etapa {currentStage + 1}/{caseData.stages.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px" }}>
          <div
            style={{
              height: "100%",
              width: stageProgress + "%",
              background: "var(--primary)",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {Object.entries(displayMetrics).map(([, m]) => (
          <div
            key={m.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.6rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {m.label}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: m.color }}>
              {formatMetric(m.value, m.suffix)}
            </div>
          </div>
        ))}
      </div>

      {/* Stage Content */}
      {stage.type === "context" && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "var(--primary-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              {caseData.icon}
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {caseData.company} — {caseData.sector}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>{stage.title}</div>
            </div>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--foreground)", lineHeight: 1.75 }}>
            {stage.narrative}
          </p>
          <button
            onClick={nextStage}
            style={{
              marginTop: "1.25rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "0.5rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Comecar Analise &rarr;
          </button>
        </div>
      )}

      {stage.type === "decision" && (
        <div style={{ marginBottom: "1.25rem" }}>
          {/* Decision narrative */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
              {stage.title}
            </h2>
            <p style={{ fontSize: "0.825rem", color: "var(--foreground)", lineHeight: 1.65, marginBottom: "0.75rem" }}>
              {stage.narrative}
            </p>
            {stage.situation && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  background: "var(--primary-bg)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                {stage.situation}
              </div>
            )}
          </div>

          {/* Choices */}
          {revealedChoice === null && stage.choices && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stage.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  disabled={animating}
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "0.625rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    cursor: animating ? "not-allowed" : "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, background 0.2s",
                    opacity: animating ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!animating) {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.background = "var(--primary-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--surface)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        background: "var(--primary)",
                        color: "white",
                        borderRadius: "50%",
                        minWidth: "1.2rem",
                        height: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
                      {c.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", lineHeight: 1.5, paddingLeft: "1.7rem" }}>
                    {c.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Revealed choice explanation */}
          {revealedChoice !== null && stage.choices && (
            <div>
              {stage.choices.map((c, i) => {
                const isSelected = i === revealedChoice;
                const borderColor = isSelected
                  ? c.optimal ? "#10B981" : "#F59E0B"
                  : c.optimal ? "#10B98140" : "var(--border)";
                const bgColor = isSelected
                  ? c.optimal ? "#10B98110" : "#F59E0B10"
                  : c.optimal ? "#10B98108" : "var(--background)";

                return (
                  <div
                    key={i}
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "0.625rem",
                      border: `1.5px solid ${borderColor}`,
                      background: bgColor,
                      marginBottom: "0.75rem",
                      opacity: !isSelected && !c.optimal ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      {isSelected && (
                        <span style={{ fontSize: "0.9rem" }}>
                          {c.optimal ? "\u2705" : "\uD83D\uDCA1"}
                        </span>
                      )}
                      {!isSelected && c.optimal && (
                        <span style={{ fontSize: "0.9rem" }}>{"\u2B50"}</span>
                      )}
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>
                        {c.label}
                      </span>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            padding: "0.1rem 0.4rem",
                            borderRadius: "0.25rem",
                            background: c.optimal ? "#10B98120" : "#F59E0B20",
                            color: c.optimal ? "#10B981" : "#F59E0B",
                          }}
                        >
                          SUA ESCOLHA — {c.score}/5 pts
                        </span>
                      )}
                      {!isSelected && c.optimal && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            padding: "0.1rem 0.4rem",
                            borderRadius: "0.25rem",
                            background: "#10B98120",
                            color: "#10B981",
                          }}
                        >
                          MELHOR OPCAO — 5/5 pts
                        </span>
                      )}
                    </div>
                    {(isSelected || c.optimal) && (
                      <p style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: 1.6, paddingLeft: "1.6rem", marginTop: "0.25rem" }}>
                        {c.explanation}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                onClick={nextStage}
                disabled={animating}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  background: animating ? "var(--border)" : "var(--primary)",
                  color: "white",
                  border: "none",
                  cursor: animating ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {currentStage + 1 >= caseData.stages.length - 1
                  ? "Ver Resultado Final"
                  : `Proxima Etapa (${currentDecisionIndex + 2}/${decisionStages.length}) \u2192`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
