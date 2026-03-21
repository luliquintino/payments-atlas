"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/**
 * Biblioteca de Problemas — Catálogo de Problemas de Pagamento
 *
 * Página pesquisável que lista problemas de pagamento conhecidos organizados por
 * categoria e severidade. Cada problema inclui descrição, métricas afetadas,
 * causas-raiz e contagem de soluções com link para o Conta Comigo.
 */

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface Problem {
  id: string;
  name: string;
  category: Category;
  severity: "Crítico" | "Alto" | "Médio";
  description: string;
  affectedMetrics: string[];
  rootCauses: string[];
  solutionCount: number;
}

type Category =
  | "Autorização"
  | "Fraude"
  | "Liquidação"
  | "Compliance"
  | "Performance"
  | "Integração";

/* -------------------------------------------------------------------------- */
/*                              Problems Data                                 */
/* -------------------------------------------------------------------------- */

const PROBLEMS: Problem[] = [
  /* ---- Autorização (7) ---- */
  {
    id: "auth-01",
    name: "Taxa de Recusa Alta",
    category: "Autorização",
    severity: "Crítico",
    description:
      "A taxa de aprovação de transações está significativamente abaixo do benchmark do setor. Emissores estão recusando um volume anormalmente alto de transações legítimas, impactando diretamente a receita e a experiência do cliente.",
    affectedMetrics: [
      "Taxa de Aprovação",
      "Receita Líquida",
      "Taxa de Conversão",
      "Satisfação do Cliente",
    ],
    rootCauses: [
      "Roteamento subótimo de transações",
      "Dados insuficientes enviados ao emissor",
      "Ausência de lógica de retentativa",
      "Falta de tokenização de rede",
    ],
    solutionCount: 5,
  },
  {
    id: "auth-02",
    name: "Falhas Cross-Border",
    category: "Autorização",
    severity: "Crítico",
    description:
      "Transações internacionais apresentam taxas de recusa desproporcionalmente altas comparadas a transações domésticas. O roteamento cross-border não está otimizado para os corredores de pagamento utilizados.",
    affectedMetrics: [
      "Taxa de Aprovação Cross-Border",
      "Receita Internacional",
      "Taxa de Conversão Global",
    ],
    rootCauses: [
      "Ausência de adquirente local no país de destino",
      "Conversão de moeda ineficiente",
      "Regras de compliance regional não atendidas",
      "Dados de transação incompatíveis com padrões locais",
    ],
    solutionCount: 4,
  },
  {
    id: "auth-03",
    name: 'Recusas "Não Autorizado"',
    category: "Autorização",
    severity: "Alto",
    description:
      'Alto volume de recusas com código genérico "Não Autorizado" sem detalhamento adicional do emissor. Dificulta diagnóstico e ação corretiva por não revelar a causa real da recusa.',
    affectedMetrics: [
      "Taxa de Aprovação",
      "Taxa de Retentativa",
      "Receita Recuperável",
    ],
    rootCauses: [
      "Emissor não retorna código detalhado",
      "Mapeamento incorreto de códigos de resposta",
      "Ausência de enriquecimento de dados pré-autorização",
    ],
    solutionCount: 3,
  },
  {
    id: "auth-04",
    name: "Falhas de Autenticação 3DS",
    category: "Autorização",
    severity: "Alto",
    description:
      "O fluxo de autenticação 3-D Secure está gerando alto abandono no checkout. Clientes não completam o desafio de autenticação, resultando em perda de vendas especialmente em dispositivos móveis.",
    affectedMetrics: [
      "Taxa de Conclusão 3DS",
      "Taxa de Conversão",
      "Abandono de Carrinho",
      "Taxa de Aprovação",
    ],
    rootCauses: [
      "Implementação de 3DS1 desatualizada",
      "Ausência de fluxo frictionless",
      "UX de desafio não otimizada para mobile",
      "Motor de isenções não configurado",
    ],
    solutionCount: 4,
  },
  {
    id: "auth-05",
    name: "Falha de Tokenização de Rede",
    category: "Autorização",
    severity: "Médio",
    description:
      "Tokens de rede não estão sendo utilizados ou estão falhando na atualização automática de credenciais. Cartões expirados ou substituídos não são atualizados, causando recusas em pagamentos recorrentes.",
    affectedMetrics: [
      "Taxa de Renovação",
      "Churn Involuntário",
      "Taxa de Aprovação Recorrente",
    ],
    rootCauses: [
      "Integração incompleta com bandeiras",
      "Account Updater não ativado",
      "Ciclo de atualização de token muito longo",
    ],
    solutionCount: 3,
  },
  {
    id: "auth-06",
    name: "Timeout de Autorização",
    category: "Autorização",
    severity: "Alto",
    description:
      "Transações estão excedendo o tempo limite de resposta do emissor, resultando em autorizações inconclusivas. O cliente não recebe confirmação e pode tentar novamente, gerando duplicatas.",
    affectedMetrics: [
      "Latência de Autorização",
      "Taxa de Timeout",
      "Transações Duplicadas",
      "Experiência do Cliente",
    ],
    rootCauses: [
      "Emissor com tempo de resposta lento",
      "Timeout configurado muito curto",
      "Problemas de conectividade de rede",
      "Processamento sequencial sem paralelismo",
    ],
    solutionCount: 3,
  },
  {
    id: "auth-07",
    name: "Regras do Emissor Incompatíveis",
    category: "Autorização",
    severity: "Médio",
    description:
      "Regras de validação do emissor estão em conflito com os dados enviados na transação. Campos obrigatórios ausentes ou formatos incompatíveis causam recusas antes mesmo da análise de crédito.",
    affectedMetrics: [
      "Taxa de Aprovação",
      "Taxa de Recusa Técnica",
      "Custo de Processamento",
    ],
    rootCauses: [
      "Campos obrigatórios não enviados",
      "Formato de dados incompatível com o emissor",
      "Regras regionais não implementadas",
    ],
    solutionCount: 2,
  },

  /* ---- Fraude (6) ---- */
  {
    id: "fraud-01",
    name: "Taxa de Falso Positivo Alta",
    category: "Fraude",
    severity: "Crítico",
    description:
      "O sistema de prevenção de fraude está bloqueando um percentual excessivo de transações legítimas. A triagem muito agressiva causa perda direta de receita e frustração do cliente legítimo.",
    affectedMetrics: [
      "Taxa de Falso Positivo",
      "Receita Bloqueada",
      "Satisfação do Cliente",
      "Taxa de Aprovação",
    ],
    rootCauses: [
      "Modelo de ML sobreajustado",
      "Limiares de risco muito conservadores",
      "Ausência de revisão manual para zona cinza",
      "Dados de treinamento desbalanceados",
    ],
    solutionCount: 5,
  },
  {
    id: "fraud-02",
    name: "Fraude de Teste de Cartão",
    category: "Fraude",
    severity: "Crítico",
    description:
      "Fraudadores estão realizando testes em massa de cartões roubados usando transações de baixo valor. O volume de testes sobrecarrega o sistema e precede ataques de fraude em larga escala.",
    affectedMetrics: [
      "Volume de Transações Suspeitas",
      "Custo de Processamento",
      "Taxa de Chargeback",
      "Reputação com Bandeiras",
    ],
    rootCauses: [
      "Ausência de controle de velocidade",
      "Sem limitação de tentativas por BIN",
      "CAPTCHA ou verificação humana ausente",
      "Monitoramento de padrões insuficiente",
    ],
    solutionCount: 4,
  },
  {
    id: "fraud-03",
    name: "Fraude Amigável",
    category: "Fraude",
    severity: "Alto",
    description:
      "Clientes legítimos estão contestando cobranças válidas junto ao emissor, alegando não reconhecer a transação. A fraude amigável é difícil de detectar antecipadamente e resulta em chargebacks.",
    affectedMetrics: [
      "Taxa de Chargeback",
      "Custo de Disputas",
      "Margem Líquida",
      "Índice de Chargeback na Bandeira",
    ],
    rootCauses: [
      "Descritor de cobrança confuso na fatura",
      "Política de reembolso pouco clara",
      "Ausência de evidência de entrega",
      "Processo de disputa lento",
    ],
    solutionCount: 4,
  },
  {
    id: "fraud-04",
    name: "Fraude de Tomada de Conta",
    category: "Fraude",
    severity: "Crítico",
    description:
      "Contas de clientes legítimos estão sendo comprometidas por fraudadores que alteram dados de pagamento e realizam compras não autorizadas. Impacto severo na confiança do cliente.",
    affectedMetrics: [
      "Taxa de Comprometimento de Conta",
      "Taxa de Chargeback",
      "Retenção de Clientes",
      "Custo de Suporte",
    ],
    rootCauses: [
      "Autenticação fraca ou ausente",
      "Credenciais vazadas em brechas de dados",
      "Ausência de detecção de device fingerprint",
      "Sem verificação de mudança de dados sensíveis",
    ],
    solutionCount: 5,
  },
  {
    id: "fraud-05",
    name: "Fraude Cross-Border",
    category: "Fraude",
    severity: "Alto",
    description:
      "Transações internacionais apresentam taxas de fraude significativamente maiores que transações domésticas. Padrões de fraude variam por região e os modelos não estão calibrados para cada mercado.",
    affectedMetrics: [
      "Taxa de Fraude Internacional",
      "Taxa de Chargeback Cross-Border",
      "Receita Internacional Líquida",
    ],
    rootCauses: [
      "Modelos de risco não calibrados por região",
      "Ausência de dados de geolocalização",
      "Regras de fraude genéricas sem personalização regional",
    ],
    solutionCount: 3,
  },
  {
    id: "fraud-06",
    name: "Abuso de Cupom/Promoção",
    category: "Fraude",
    severity: "Médio",
    description:
      "Usuários estão explorando vulnerabilidades em sistemas de cupons e promoções para obter descontos indevidos. Múltiplas contas são criadas para reutilizar promoções de primeiro uso.",
    affectedMetrics: [
      "Custo Promocional",
      "Margem por Transação",
      "Taxa de Abuso",
      "ROI de Marketing",
    ],
    rootCauses: [
      "Validação fraca de unicidade de usuário",
      "Ausência de device fingerprinting",
      "Regras de elegibilidade insuficientes",
      "Sem limites de uso por dispositivo/IP",
    ],
    solutionCount: 3,
  },

  /* ---- Liquidação (5) ---- */
  {
    id: "settle-01",
    name: "Atraso na Liquidação",
    category: "Liquidação",
    severity: "Crítico",
    description:
      "Os fundos não estão sendo liquidados dentro do prazo contratual. O atraso impacta o fluxo de caixa dos lojistas e gera reclamações e desconfiança na plataforma de pagamento.",
    affectedMetrics: [
      "Tempo Médio de Liquidação",
      "Satisfação do Lojista",
      "Fluxo de Caixa",
      "Volume de Reclamações",
    ],
    rootCauses: [
      "Falhas no motor de liquidação",
      "Reconciliação pendente bloqueando repasse",
      "Problemas bancários no destino",
      "Cálculo incorreto de taxas retendo fundos",
    ],
    solutionCount: 4,
  },
  {
    id: "settle-02",
    name: "Falhas de Conciliação",
    category: "Liquidação",
    severity: "Alto",
    description:
      "O processo de conciliação automática não está conseguindo parear transações com os repasses dos adquirentes. Discrepâncias não resolvidas acumulam e exigem intervenção manual custosa.",
    affectedMetrics: [
      "Taxa de Conciliação Automática",
      "Volume de Exceções",
      "Custo Operacional",
      "Precisão Financeira",
    ],
    rootCauses: [
      "Formato de arquivo do adquirente alterado",
      "Identificadores de transação inconsistentes",
      "Diferenças de arredondamento cambial",
      "Transações parciais não tratadas",
    ],
    solutionCount: 3,
  },
  {
    id: "settle-03",
    name: "Erros de Conversão Cambial",
    category: "Liquidação",
    severity: "Alto",
    description:
      "A conversão de moeda aplicada na liquidação diverge da taxa utilizada na autorização. Diferenças cambiais não previstas geram perdas financeiras ou cobranças incorretas ao lojista.",
    affectedMetrics: [
      "Precisão Cambial",
      "Margem de Câmbio",
      "Custo de Liquidação Cross-Border",
    ],
    rootCauses: [
      "Cotação desatualizada no momento da liquidação",
      "Spread cambial não contabilizado",
      "Ausência de hedge automático",
    ],
    solutionCount: 3,
  },
  {
    id: "settle-04",
    name: "Falhas de Repasse ao Lojista",
    category: "Liquidação",
    severity: "Crítico",
    description:
      "O repasse de fundos ao lojista está falhando sistematicamente. Dados bancários incorretos, contas encerradas ou limites de transferência estão impedindo o crédito na conta do destinatário.",
    affectedMetrics: [
      "Taxa de Sucesso de Repasse",
      "Satisfação do Lojista",
      "Volume de Suporte",
      "Saldo Retido",
    ],
    rootCauses: [
      "Dados bancários do lojista desatualizados",
      "Conta bancária do lojista encerrada ou bloqueada",
      "Limite de transferência do banco excedido",
      "Falha na API do banco de destino",
    ],
    solutionCount: 3,
  },
  {
    id: "settle-05",
    name: "Erros de Estorno",
    category: "Liquidação",
    severity: "Médio",
    description:
      "O processamento de estornos está apresentando erros de valor, duplicação ou falha na execução. Estornos parciais não são calculados corretamente e estornos totais duplicam o crédito.",
    affectedMetrics: [
      "Taxa de Erro de Estorno",
      "Satisfação do Cliente",
      "Custo de Operação",
    ],
    rootCauses: [
      "Cálculo incorreto de estorno parcial",
      "Ausência de idempotência no processamento",
      "Estorno tentado após prazo da bandeira",
    ],
    solutionCount: 2,
  },

  /* ---- Compliance (5) ---- */
  {
    id: "comp-01",
    name: "Falhas de Compliance PCI",
    category: "Compliance",
    severity: "Crítico",
    description:
      "O ambiente de processamento de dados de cartão não está em conformidade com os requisitos PCI DSS. Vulnerabilidades de segurança expõem dados sensíveis e podem resultar em multas severas.",
    affectedMetrics: [
      "Nível de Compliance PCI",
      "Risco de Multa",
      "Vulnerabilidades Abertas",
      "Cobertura de Criptografia",
    ],
    rootCauses: [
      "Criptografia insuficiente em trânsito ou em repouso",
      "Logs contendo dados sensíveis não mascarados",
      "Controles de acesso inadequados",
      "Escaneamento de vulnerabilidade desatualizado",
    ],
    solutionCount: 5,
  },
  {
    id: "comp-02",
    name: "Taxas de Desafio 3DS Altas",
    category: "Compliance",
    severity: "Alto",
    description:
      "Um percentual excessivo de transações está sendo direcionado ao fluxo de desafio 3DS em vez de ser aprovado via frictionless. Isso aumenta o abandono e reduz a taxa de conversão.",
    affectedMetrics: [
      "Taxa de Desafio 3DS",
      "Taxa de Conversão",
      "Abandono de Checkout",
      "Custo de Autenticação",
    ],
    rootCauses: [
      "Dados insuficientes enviados ao emissor para decisão frictionless",
      "Perfil de risco do lojista mal classificado",
      "Motor de isenções não configurado",
      "Histórico de transações não compartilhado",
    ],
    solutionCount: 4,
  },
  {
    id: "comp-03",
    name: "Violação de Regras da Bandeira",
    category: "Compliance",
    severity: "Crítico",
    description:
      "Operações de pagamento estão violando regras estabelecidas pelas bandeiras de cartão. Violações podem resultar em multas, aumento de taxas ou até suspensão do processamento.",
    affectedMetrics: [
      "Volume de Violações",
      "Multas Acumuladas",
      "Risco de Suspensão",
      "Custo de Compliance",
    ],
    rootCauses: [
      "Surcharge não permitido aplicado",
      "Prazos de contestação não respeitados",
      "Uso indevido de credenciais de teste em produção",
      "Não adesão a mandatos de migração de tecnologia",
    ],
    solutionCount: 3,
  },
  {
    id: "comp-04",
    name: "Falhas de Validação KYC",
    category: "Compliance",
    severity: "Alto",
    description:
      "O processo de verificação Know Your Customer está rejeitando lojistas legítimos ou falhando na detecção de entidades suspeitas. Processos inconsistentes geram risco regulatório.",
    affectedMetrics: [
      "Taxa de Aprovação KYC",
      "Tempo de Onboarding",
      "Risco Regulatório",
      "Volume de Revisão Manual",
    ],
    rootCauses: [
      "Base de dados de documentos desatualizada",
      "Validação OCR com alta taxa de erro",
      "Regras de verificação inconsistentes entre regiões",
      "Ausência de verificação de beneficiário final",
    ],
    solutionCount: 3,
  },
  {
    id: "comp-05",
    name: "Erros de Classificação de Dados",
    category: "Compliance",
    severity: "Médio",
    description:
      "Dados sensíveis de pagamento não estão sendo classificados e tratados corretamente conforme seu nível de sensibilidade. Dados PAN podem estar armazenados sem a proteção adequada.",
    affectedMetrics: [
      "Cobertura de Classificação",
      "Risco de Exposição",
      "Compliance de Retenção",
    ],
    rootCauses: [
      "Política de classificação de dados não implementada",
      "Ferramentas de DLP não configuradas",
      "Desenvolvedores sem treinamento de segurança",
    ],
    solutionCount: 2,
  },

  /* ---- Performance (5) ---- */
  {
    id: "perf-01",
    name: "Latência Alta de Gateway",
    category: "Performance",
    severity: "Crítico",
    description:
      "O tempo de resposta do gateway de pagamento está acima dos limites aceitáveis. Latência elevada degrada a experiência do checkout e pode causar timeouts e transações duplicadas.",
    affectedMetrics: [
      "Latência P95",
      "Latência P99",
      "Taxa de Timeout",
      "Taxa de Conversão",
    ],
    rootCauses: [
      "Gargalo no pool de conexões",
      "Serialização de requisições ao adquirente",
      "Ausência de cache para dados estáticos",
      "Infraestrutura subdimensionada",
    ],
    solutionCount: 4,
  },
  {
    id: "perf-02",
    name: "Falhas de Failover",
    category: "Performance",
    severity: "Crítico",
    description:
      "O mecanismo de failover automático entre adquirentes ou rotas não está funcionando corretamente. Quando o adquirente primário falha, as transações não são redirecionadas ao backup.",
    affectedMetrics: [
      "Disponibilidade do Serviço",
      "Taxa de Sucesso em Incidentes",
      "Tempo de Recuperação",
      "Receita Perdida em Outage",
    ],
    rootCauses: [
      "Health check do adquirente backup não configurado",
      "Lógica de failover não testada em produção",
      "Circuit breaker com limiares incorretos",
      "Credenciais do adquirente backup expiradas",
    ],
    solutionCount: 4,
  },
  {
    id: "perf-03",
    name: "Degradação em Picos",
    category: "Performance",
    severity: "Alto",
    description:
      "O sistema de pagamento degrada significativamente durante picos de tráfego como Black Friday, campanhas e flash sales. Auto-scaling não responde rápido o suficiente para absorver a carga.",
    affectedMetrics: [
      "Latência em Pico",
      "Taxa de Erro em Pico",
      "Throughput Máximo",
      "Receita em Eventos",
    ],
    rootCauses: [
      "Auto-scaling com tempo de warm-up muito longo",
      "Limites de conexão do banco de dados",
      "Ausência de pré-aquecimento antes de eventos",
      "Fila de processamento sem priorização",
    ],
    solutionCount: 4,
  },
  {
    id: "perf-04",
    name: "Limites de Rate da API",
    category: "Performance",
    severity: "Médio",
    description:
      "Chamadas à API de pagamento estão sendo rejeitadas por exceder os limites de taxa definidos. Lojistas com alto volume são impactados durante horários de pico, gerando transações perdidas.",
    affectedMetrics: [
      "Taxa de Rejeição por Rate Limit",
      "Throughput Efetivo",
      "Satisfação do Lojista",
    ],
    rootCauses: [
      "Limites de taxa não diferenciados por plano",
      "Ausência de fila de retry com backoff exponencial",
      "Endpoint de status consumindo quota desnecessariamente",
    ],
    solutionCount: 3,
  },
  {
    id: "perf-05",
    name: "Erros de Timeout",
    category: "Performance",
    severity: "Alto",
    description:
      "Transações estão expirando por timeout em diferentes pontos da cadeia de processamento. O cliente recebe erro, mas a transação pode ter sido processada pelo adquirente, gerando inconsistência.",
    affectedMetrics: [
      "Taxa de Timeout",
      "Transações Órfãs",
      "Consistência de Dados",
      "Custo de Reconciliação",
    ],
    rootCauses: [
      "Timeouts não configurados por etapa do fluxo",
      "Ausência de verificação de status pós-timeout",
      "Adquirente com tempo de resposta variável",
      "Sem mecanismo de idempotência",
    ],
    solutionCount: 3,
  },

  /* ---- Integração (5) ---- */
  {
    id: "integ-01",
    name: "Incompatibilidade de Versão da API",
    category: "Integração",
    severity: "Alto",
    description:
      "Lojistas integrados em versões antigas da API de pagamento estão enfrentando falhas por deprecação de endpoints ou mudanças de contrato. A migração não está sendo comunicada adequadamente.",
    affectedMetrics: [
      "Taxa de Erro de Integração",
      "Lojistas em Versão Obsoleta",
      "Volume de Suporte Técnico",
    ],
    rootCauses: [
      "Ausência de política de versionamento clara",
      "Deprecação sem período de transição adequado",
      "Documentação desatualizada",
      "Falta de ferramentas de migração automatizada",
    ],
    solutionCount: 3,
  },
  {
    id: "integ-02",
    name: "Erros de Parsing de Webhook",
    category: "Integração",
    severity: "Alto",
    description:
      "Notificações webhook de eventos de pagamento não estão sendo processadas corretamente pelo lojista. Falhas de parsing causam perda de eventos e inconsistência de estado entre sistemas.",
    affectedMetrics: [
      "Taxa de Entrega de Webhook",
      "Taxa de Processamento de Webhook",
      "Consistência de Estado",
      "Tempo de Reconciliação",
    ],
    rootCauses: [
      "Formato de payload alterado sem aviso",
      "Validação de assinatura falhando",
      "Timeout no endpoint do lojista",
      "Ausência de retry com backoff para falhas",
    ],
    solutionCount: 3,
  },
  {
    id: "integ-03",
    name: "Inconsistência Multi-Adquirente",
    category: "Integração",
    severity: "Médio",
    description:
      "O roteamento entre múltiplos adquirentes está gerando inconsistências de dados e comportamentos diferentes para operações equivalentes. Cada adquirente retorna formatos e códigos distintos.",
    affectedMetrics: [
      "Consistência de Resposta",
      "Complexidade de Integração",
      "Custo de Manutenção",
    ],
    rootCauses: [
      "Ausência de camada de normalização de resposta",
      "Mapeamento incompleto de códigos de erro",
      "Comportamento divergente de captura e estorno",
    ],
    solutionCount: 2,
  },
  {
    id: "integ-04",
    name: "Falhas de Migração de Token",
    category: "Integração",
    severity: "Crítico",
    description:
      "A migração de tokens entre provedores ou versões está falhando, resultando em perda de credenciais salvas de clientes. Clientes precisam re-cadastrar cartões, causando atrito e churn.",
    affectedMetrics: [
      "Taxa de Migração de Token",
      "Churn de Clientes",
      "Receita Recorrente",
      "Volume de Suporte",
    ],
    rootCauses: [
      "Formato de token incompatível entre provedores",
      "Ausência de mapeamento de tokens legados",
      "Processo de migração sem validação pós-importação",
      "Expiração de tokens durante janela de migração",
    ],
    solutionCount: 4,
  },
  {
    id: "integ-05",
    name: "Drift de Configuração",
    category: "Integração",
    severity: "Médio",
    description:
      "As configurações de integração entre ambientes de staging e produção estão divergindo. Mudanças aplicadas em um ambiente não são replicadas, causando comportamentos inesperados em produção.",
    affectedMetrics: [
      "Incidentes por Drift",
      "Tempo de Detecção",
      "Custo de Investigação",
    ],
    rootCauses: [
      "Ausência de infraestrutura como código",
      "Mudanças manuais em produção sem versionamento",
      "Falta de validação automática de configuração",
    ],
    solutionCount: 2,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Constants                                     */
/* -------------------------------------------------------------------------- */

const SEVERITY_META: Record<
  Problem["severity"],
  { color: string; bg: string; border: string; icon: string }
> = {
  Crítico: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
    icon: "🔴",
  },
  Alto: {
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.25)",
    icon: "🟠",
  },
  Médio: {
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.25)",
    icon: "🔵",
  },
};

const CATEGORY_META: Record<
  Category,
  { color: string; bg: string; icon: string }
> = {
  Autorização: { color: "#1e3a5f", bg: "rgba(30,58,95,0.08)", icon: "🔐" },
  Fraude: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", icon: "🚨" },
  Liquidação: { color: "#6366f1", bg: "rgba(99,102,241,0.08)", icon: "💰" },
  Compliance: { color: "#d97706", bg: "rgba(217,119,6,0.08)", icon: "📋" },
  Performance: { color: "#0ea5e9", bg: "rgba(14,165,233,0.08)", icon: "⚡" },
  Integração: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", icon: "🔗" },
};

const ALL_CATEGORIES: Category[] = [
  "Autorização",
  "Fraude",
  "Liquidação",
  "Compliance",
  "Performance",
  "Integração",
];

const ALL_SEVERITIES: Problem["severity"][] = ["Crítico", "Alto", "Médio"];

/* -------------------------------------------------------------------------- */
/*                            Highlight helper                                */
/* -------------------------------------------------------------------------- */

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        style={{
          background: "rgba(37,99,235,0.2)",
          color: "inherit",
          borderRadius: 2,
          padding: "0 2px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function ProblemLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(),
  );
  const [activeSeverities, setActiveSeverities] = useState<
    Set<Problem["severity"]>
  >(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  /* ---- Toggle helpers ---- */
  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleSeverity = (sev: Problem["severity"]) => {
    setActiveSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) next.delete(sev);
      else next.add(sev);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ---- Filtering ---- */
  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      const matchesCat =
        activeCategories.size === 0 || activeCategories.has(p.category);
      const matchesSev =
        activeSeverities.size === 0 || activeSeverities.has(p.severity);
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.affectedMetrics.some((m) => m.toLowerCase().includes(q));
      return matchesCat && matchesSev && matchesSearch;
    });
  }, [search, activeCategories, activeSeverities]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const bySeverity = { Crítico: 0, Alto: 0, Médio: 0 };
    const byCat: Record<Category, number> = {
      Autorização: 0,
      Fraude: 0,
      Liquidação: 0,
      Compliance: 0,
      Performance: 0,
      Integração: 0,
    };
    let totalSolutions = 0;
    for (const p of PROBLEMS) {
      bySeverity[p.severity]++;
      byCat[p.category]++;
      totalSolutions += p.solutionCount;
    }
    return { bySeverity, byCat, totalSolutions };
  }, []);

  /* ---- Group filtered by category ---- */
  const grouped = useMemo(() => {
    const map = new Map<Category, Problem[]>();
    for (const p of filtered) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return map;
  }, [filtered]);

  const totalSolutionsFiltered = filtered.reduce(
    (acc, p) => acc + p.solutionCount,
    0,
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* ================================================================== */}
      {/*  PAGE HEADER                                                       */}
      {/* ================================================================== */}
      <div className="page-header animate-fade-in" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #dc2626 0%, #d97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <span role="img" aria-label="library">
              📚
            </span>
          </div>
          <div>
            <h1 className="page-title">Biblioteca de Problemas</h1>
          </div>
        </div>
        <p className="page-description" style={{ marginTop: 4 }}>
          Catálogo pesquisável de {PROBLEMS.length} problemas de pagamento
          conhecidos com causas-raiz, métricas afetadas e{" "}
          {stats.totalSolutions} soluções recomendadas.
        </p>
      </div>

      {/* ================================================================== */}
      {/*  STATS OVERVIEW                                                    */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Total problems */}
        <div className="stat-card" style={{ padding: "18px 12px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}
          >
            Total
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>
            {PROBLEMS.length}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            problemas catalogados
          </div>
        </div>

        {/* Severity stats */}
        {ALL_SEVERITIES.map((sev) => {
          const meta = SEVERITY_META[sev];
          return (
            <div
              key={sev}
              className="stat-card"
              style={{
                padding: "18px 12px",
                borderTop: `3px solid ${meta.color}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: meta.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                {meta.icon} {sev}
              </div>
              <div className="metric-value" style={{ fontSize: 28 }}>
                {stats.bySeverity[sev]}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                {Math.round(
                  (stats.bySeverity[sev] / PROBLEMS.length) * 100,
                )}
                % do total
              </div>
            </div>
          );
        })}

        {/* Solutions */}
        <div className="stat-card" style={{ padding: "18px 12px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--success)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}
          >
            Soluções
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>
            {stats.totalSolutions}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            recomendações
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: -4, marginBottom: 12, fontStyle: "italic" }}>
        * Números e estimativas podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================== */}
      {/*  SEARCH BAR                                                        */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-2"
        style={{ position: "relative", marginBottom: 16 }}
      >
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Pesquisar por nome, descrição, categoria ou métrica..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 44px 12px 42px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontSize: 14,
            outline: "none",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ================================================================== */}
      {/*  FILTERS: Category + Severity                                      */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-2"
        style={{ marginBottom: 24 }}
      >
        {/* Category filter row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
              marginRight: 4,
            }}
          >
            Categoria
          </span>
          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = activeCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  border: `1px solid ${isActive ? meta.color : "var(--border)"}`,
                  background: isActive ? meta.bg : "transparent",
                  color: isActive ? meta.color : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{meta.icon}</span>
                {cat}
                <span
                  style={{
                    fontSize: 11,
                    opacity: 0.7,
                    fontWeight: 600,
                  }}
                >
                  {stats.byCat[cat]}
                </span>
              </button>
            );
          })}
          {activeCategories.size > 0 && (
            <button
              onClick={() => setActiveCategories(new Set())}
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Severity filter row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
              marginRight: 4,
            }}
          >
            Severidade
          </span>
          {ALL_SEVERITIES.map((sev) => {
            const meta = SEVERITY_META[sev];
            const isActive = activeSeverities.has(sev);
            return (
              <button
                key={sev}
                onClick={() => toggleSeverity(sev)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${isActive ? meta.color : "var(--border)"}`,
                  background: isActive ? meta.bg : "transparent",
                  color: isActive ? meta.color : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {meta.icon} {sev}
              </button>
            );
          })}
          {activeSeverities.size > 0 && (
            <button
              onClick={() => setActiveSeverities(new Set())}
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* ---- Result count ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span
          style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}
        >
          {filtered.length} problema{filtered.length !== 1 ? "s" : ""} encontrado
          {filtered.length !== 1 ? "s" : ""}
          {search && (
            <span style={{ fontStyle: "italic" }}>
              {" "}
              para &ldquo;{search}&rdquo;
            </span>
          )}
        </span>
        <span
          style={{ fontSize: 12, color: "var(--text-muted)" }}
        >
          {totalSolutionsFiltered} soluções
        </span>
      </div>

      {/* ================================================================== */}
      {/*  PROBLEM CARDS — grouped by category                               */}
      {/* ================================================================== */}
      {filtered.length === 0 ? (
        <div
          className="card animate-fade-in"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>
            🔍
          </div>
          <h3
            style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}
          >
            Nenhum problema encontrado
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Tente ajustar sua pesquisa ou alterar os filtros.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {ALL_CATEGORIES.filter((cat) => grouped.has(cat)).map((cat) => {
            const catMeta = CATEGORY_META[cat];
            const problems = grouped.get(cat)!;

            return (
              <div key={cat} className="animate-fade-in">
                {/* Category group header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottom: `2px solid ${catMeta.color}22`,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: catMeta.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {catMeta.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: catMeta.color,
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      background: "var(--surface-hover)",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {problems.length}
                  </span>
                </div>

                {/* Problem cards */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {problems.map((problem) => {
                    const isExpanded = expandedIds.has(problem.id);
                    const sevMeta = SEVERITY_META[problem.severity];

                    return (
                      <div
                        key={problem.id}
                        className="card-flat"
                        style={{
                          borderLeft: `4px solid ${sevMeta.color}`,
                          padding: "16px 18px",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                        }}
                        onClick={() => toggleExpanded(problem.id)}
                      >
                        {/* Top row: name + badges */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            flexWrap: "wrap",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <h3
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                margin: 0,
                              }}
                            >
                              {highlightText(problem.name, search)}
                            </h3>
                            {/* Severity badge */}
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 10px",
                                borderRadius: 9999,
                                fontSize: 11,
                                fontWeight: 700,
                                background: sevMeta.bg,
                                color: sevMeta.color,
                                border: `1px solid ${sevMeta.border}`,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {sevMeta.icon} {problem.severity}
                            </span>
                          </div>
                          {/* Expand indicator */}
                          <span
                            style={{
                              fontSize: 16,
                              color: "var(--text-muted)",
                              transition: "transform 0.2s ease",
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0)",
                              flexShrink: 0,
                            }}
                          >
                            ▾
                          </span>
                        </div>

                        {/* Description (truncated when collapsed) */}
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                            marginBottom: 8,
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? 999 : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {highlightText(problem.description, search)}
                        </p>

                        {/* Compact info row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            fontSize: 12,
                            color: "var(--text-muted)",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                            {problem.affectedMetrics.length} métricas
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {problem.rootCauses.length} causas
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "var(--success)",
                              fontWeight: 600,
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {problem.solutionCount} soluções
                          </span>
                        </div>

                        {/* ---- Expandable details ---- */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateRows: isExpanded ? "1fr" : "0fr",
                            transition: "grid-template-rows 0.3s ease",
                          }}
                        >
                          <div style={{ overflow: "hidden" }}>
                            <div style={{ paddingTop: 16 }}>
                              {/* Affected Metrics */}
                              <div style={{ marginBottom: 14 }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    color: "var(--text-muted)",
                                    marginBottom: 8,
                                  }}
                                >
                                  Métricas Afetadas
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                  }}
                                >
                                  {problem.affectedMetrics.map((metric) => (
                                    <span
                                      key={metric}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: catMeta.bg,
                                        color: catMeta.color,
                                        border: `1px solid ${catMeta.color}22`,
                                      }}
                                    >
                                      <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                      >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                      </svg>
                                      {highlightText(metric, search)}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Root Causes */}
                              <div style={{ marginBottom: 14 }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    color: "var(--text-muted)",
                                    marginBottom: 8,
                                  }}
                                >
                                  Causas-Raiz
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                  }}
                                >
                                  {problem.rootCauses.map((cause, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 8,
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 6,
                                          background: sevMeta.bg,
                                          color: sevMeta.color,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: 11,
                                          fontWeight: 700,
                                          flexShrink: 0,
                                          marginTop: 1,
                                        }}
                                      >
                                        {i + 1}
                                      </span>
                                      <span>{cause}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Solutions CTA */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "12px 14px",
                                  borderRadius: 10,
                                  background: "var(--surface-hover)",
                                  border: "1px solid var(--border)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  style={{
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: "var(--success)",
                                    }}
                                  >
                                    {problem.solutionCount}
                                  </span>
                                  {problem.solutionCount === 1
                                    ? "solução disponível"
                                    : "soluções disponíveis"}
                                </span>
                                <Link
                                  href="/diagnostics/conta-comigo"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background:
                                      "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                                    color: "white",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  Diagnosticar
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================== */}
      {/*  FOOTER — Related Pages                                            */}
      {/* ================================================================== */}
      <div style={{ marginTop: 40 }}>
        <div className="divider-text" style={{ marginBottom: 20 }}>
          Páginas Relacionadas
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              title: "Conta Comigo",
              desc: "Diagnostique problemas e receba soluções personalizadas",
              href: "/diagnostics/conta-comigo",
              icon: "🩺",
              gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            },
            {
              title: "Árvore de Métricas",
              desc: "Visualize a hierarquia de métricas e seus relacionamentos",
              href: "/diagnostics/metrics-tree",
              icon: "🌳",
              gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
            },
            {
              title: "Sinais de Fraude",
              desc: "Explore sinais e indicadores de fraude em pagamentos",
              href: "/fraud/fraud-signals",
              icon: "🔍",
              gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
            },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card-flat interactive-hover"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "16px 14px",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: page.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {page.icon}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {page.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {page.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
