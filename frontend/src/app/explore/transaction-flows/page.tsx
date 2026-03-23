"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import FlowDiagram from "@/components/ui/FlowDiagram";
import type { FlowStep as FlowDiagramStep } from "@/components/ui/FlowDiagram";

/**
 * Fluxos de Transacao — Catalogo interativo de 8 fluxos de pagamento comuns.
 *
 * Cada fluxo e renderizado como um card clicavel. Quando expandido, revela
 * um diagrama passo a passo com etapas numeradas, atores envolvidos e
 * features exercitadas em cada estagio. Usa estado React para expandir/recolher.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlowStep {
  /** Numero da etapa (1-indexed) */
  step: number;
  /** O ator ou sistema executando esta etapa */
  actor: string;
  /** O que acontece nesta etapa */
  action: string;
  /** Features de pagamento envolvidas */
  features: string[];
}

interface TransactionFlow {
  /** Nome de exibicao do fluxo */
  name: string;
  /** Resumo curto */
  description: string;
  /** Tempo total aproximado */
  duration: string;
  /** Trilho utilizado */
  rail: string;
  /** Etapas ordenadas */
  steps: FlowStep[];
}

interface FlowConfig {
  colorFrom: string;
  colorTo: string;
  icon: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Flow Color/Icon Configuration
// ---------------------------------------------------------------------------

const FLOW_CONFIG: Record<string, FlowConfig> = {
  "Pagamento com Cartao": {
    colorFrom: "#6366f1",
    colorTo: "#818cf8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <line x1="2" y1="9" x2="18" y2="9" />
      </svg>
    ),
  },
  "Pagamento PIX": {
    colorFrom: "#10b981",
    colorTo: "#34d399",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  "Pagamento Cross-Border": {
    colorFrom: "#0ea5e9",
    colorTo: "#38bdf8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M2 10h16" />
        <path d="M10 2c2.5 2.5 4 5.2 4 8s-1.5 5.5-4 8" />
        <path d="M10 2c-2.5 2.5-4 5.2-4 8s1.5 5.5 4 8" />
      </svg>
    ),
  },
  "Pagamento ACH": {
    colorFrom: "#d97706",
    colorTo: "#fbbf24",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h14" />
        <path d="M3 10h14" />
        <path d="M5 7l5-4 5 4" />
        <path d="M5 10v7" />
        <path d="M10 10v7" />
        <path d="M15 10v7" />
      </svg>
    ),
  },
  "Pagamento com Carteira Digital": {
    colorFrom: "#8b5cf6",
    colorTo: "#a78bfa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="10" height="16" rx="2" />
        <line x1="10" y1="15" x2="10" y2="15" strokeWidth="2" />
      </svg>
    ),
  },
  "BNPL (Compre Agora, Pague Depois)": {
    colorFrom: "#f43f5e",
    colorTo: "#fb7185",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="14" rx="2" />
        <line x1="2" y1="9" x2="18" y2="9" />
        <line x1="7" y1="2" x2="7" y2="5" />
        <line x1="13" y1="2" x2="13" y2="5" />
      </svg>
    ),
  },
  "Pagamento em Marketplace": {
    colorFrom: "#f59e0b",
    colorTo: "#fcd34d",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 8v9a1 1 0 001 1h12a1 1 0 001-1V8l-3-6H6z" />
        <line x1="3" y1="8" x2="17" y2="8" />
        <path d="M8 2c-1.5 1.5-2 3.5-2 6" />
        <path d="M12 2c1.5 1.5 2 3.5 2 6" />
      </svg>
    ),
  },
  "Desembolsos (Payouts)": {
    colorFrom: "#14b8a6",
    colorTo: "#5eead4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="16" x2="10" y2="4" />
        <polyline points="5 9 10 4 15 9" />
        <line x1="3" y1="17" x2="17" y2="17" />
      </svg>
    ),
  },
};

const STAT_COLORS = [
  { from: "#6366f1", to: "#818cf8" },
  { from: "#10b981", to: "#34d399" },
  { from: "#0ea5e9", to: "#38bdf8" },
  { from: "#d97706", to: "#fbbf24" },
];

// ---------------------------------------------------------------------------
// Dados — 8 tipos de fluxo de transacao
// ---------------------------------------------------------------------------

const transactionFlows: TransactionFlow[] = [
  {
    name: "Pagamento com Cartao",
    description:
      "Pagamento online padrao com cartao — cliente insere dados do cartao, autorizacao via rede de cartao, captura e liquidacao.",
    duration: "2-5 segundos (auth) / T+1-T+3 (liquidacao)",
    rail: "Redes de Cartao",
    steps: [
      {
        step: 1,
        actor: "Cliente",
        action: "Insere os dados do cartao na pagina de checkout do lojista via formulario seguro de pagamento ou SDK.",
        features: ["Interface de Checkout", "Tokenizacao de Cartao", "Conformidade PCI"],
      },
      {
        step: 2,
        actor: "Gateway de Pagamento",
        action: "Valida a entrada, tokeniza o cartao, aplica regras de fraude e encaminha a solicitacao de autorizacao.",
        features: ["Tokenizacao", "Scoring de Fraude", "Roteamento Inteligente"],
      },
      {
        step: 3,
        actor: "Rede de Cartao (Visa / MC)",
        action: "Roteia a mensagem de autorizacao (ISO 8583) do adquirente para o banco emissor.",
        features: ["Roteamento de Rede", "Qualificacao de Interchange"],
      },
      {
        step: 4,
        actor: "Banco Emissor",
        action: "Valida os fundos do portador do cartao, aplica verificacoes de risco e retorna aprovacao ou recusa.",
        features: ["Autorizacao do Emissor", "Verificacao de Saldo", "3-D Secure"],
      },
      {
        step: 5,
        actor: "Gateway de Pagamento",
        action: "Recebe a resposta de autorizacao e repassa o resultado ao sistema do lojista.",
        features: ["Tratamento de Resposta Auth", "Notificacao via Webhook"],
      },
      {
        step: 6,
        actor: "Lojista",
        action: "Inicia a captura (imediata ou diferida). O adquirente agrupa capturas para clearing.",
        features: ["Captura", "Processamento em Lote"],
      },
      {
        step: 7,
        actor: "Sistema de Liquidacao",
        action: "Fundos sao compensados pela rede de cartao e liquidados na conta bancaria do lojista (T+1 a T+3).",
        features: ["Clearing", "Liquidacao Liquida", "Reconciliacao"],
      },
    ],
  },
  {
    name: "Pagamento PIX",
    description:
      "Sistema de pagamento instantaneo do Brasil — cliente escaneia um QR code ou usa uma chave PIX; fundos liquidam em segundos, 24/7.",
    duration: "< 10 segundos de ponta a ponta",
    rail: "PIX (BACEN)",
    steps: [
      {
        step: 1,
        actor: "Lojista",
        action: "Gera um QR code PIX ou link PIX Copia e Cola com o valor da transacao e metadados.",
        features: ["Geracao de QR Code", "API de Cobranca PIX"],
      },
      {
        step: 2,
        actor: "Cliente",
        action: "Escaneia o QR code pelo app do banco ou insere a chave PIX para iniciar a transferencia.",
        features: ["Consulta de Chave PIX", "Leitura de QR"],
      },
      {
        step: 3,
        actor: "Banco do Pagador (PSP)",
        action: "Valida a identidade e o saldo do pagador, depois submete a instrucao de pagamento ao BACEN SPI.",
        features: ["Validacao de Saldo", "Regras Antifraude"],
      },
      {
        step: 4,
        actor: "BACEN (SPI)",
        action: "O sistema de pagamentos instantaneos do banco central valida, compensa e liquida a transacao em tempo real.",
        features: ["Clearing Instantaneo", "Liquidacao em Tempo Real"],
      },
      {
        step: 5,
        actor: "Banco do Recebedor (PSP)",
        action: "Credita a conta do lojista instantaneamente e envia notificacao de confirmacao.",
        features: ["Credito Instantaneo", "Webhook / Notificacao Push"],
      },
      {
        step: 6,
        actor: "Lojista",
        action: "Recebe webhook de confirmacao de liquidacao e cumpre o pedido.",
        features: ["Confirmacao de Pagamento", "Gatilho de Cumprimento do Pedido"],
      },
    ],
  },
  {
    name: "Pagamento Cross-Border",
    description:
      "Pagamento internacional com cartao ou banco exigindo conversao cambial, roteamento cross-border e processamento multi-adquirente.",
    duration: "2-8 segundos (auth) / T+2-T+5 (liquidacao)",
    rail: "Redes de Cartao / SWIFT",
    steps: [
      {
        step: 1,
        actor: "Cliente",
        action: "Paga em um site de lojista internacional. O metodo de pagamento e moeda podem diferir da base do lojista.",
        features: ["Checkout Multi-Moeda", "Deteccao de Geolocalizacao"],
      },
      {
        step: 2,
        actor: "Orquestrador de Pagamento",
        action: "Determina o adquirente e rota otimos com base no BIN do cartao do cliente e moeda alvo.",
        features: ["Roteamento Inteligente", "Consulta de BIN", "Multi-Adquirente"],
      },
      {
        step: 3,
        actor: "Adquirente Local",
        action: "Submete a autorizacao na moeda local, aplicando conversao dinamica de moeda se aplicavel.",
        features: ["DCC (Conversao Dinamica de Moeda)", "Adquirencia Local"],
      },
      {
        step: 4,
        actor: "Rede de Cartao",
        action: "Roteia a autorizacao cross-border do adquirente local ao banco emissor do cliente no exterior.",
        features: ["Roteamento Cross-Border", "Taxas da Bandeira"],
      },
      {
        step: 5,
        actor: "Banco Emissor (Estrangeiro)",
        action: "Autoriza a transacao e aplica a taxa de cambio para o extrato do portador do cartao.",
        features: ["Conversao FX", "Autorizacao do Emissor"],
      },
      {
        step: 6,
        actor: "Sistema de Liquidacao",
        action: "Clearing multi-moeda via bancos correspondentes. Fundos convertidos e liquidados no banco do lojista.",
        features: ["Liquidacao Cross-Border", "Banco Correspondente", "Compensacao FX"],
      },
    ],
  },
  {
    name: "Pagamento ACH",
    description:
      "Transferencia em lote via Automated Clearing House para pagamentos banco-a-banco nos EUA — comumente usado para folha de pagamento, cobranca recorrente e B2B.",
    duration: "1-3 dias uteis (padrao) / ACH no mesmo dia disponivel",
    rail: "ACH (Nacha)",
    steps: [
      {
        step: 1,
        actor: "Originador (Lojista / Empregador)",
        action: "Coleta o numero da conta e routing number do cliente e cria um lancamento ACH.",
        features: ["Verificacao de Conta Bancaria", "Mandato / Autorizacao"],
      },
      {
        step: 2,
        actor: "ODFI (Banco Originador)",
        action: "Recebe o lancamento ACH do originador e agrupa para submissao ao operador ACH.",
        features: ["Criacao de Arquivo em Lote", "Formatacao NACHA"],
      },
      {
        step: 3,
        actor: "Operador ACH (Fed / EPN)",
        action: "Classifica e distribui lancamentos ACH aos bancos recebedores em janelas de liquidacao.",
        features: ["Janelas de Clearing", "Classificacao de Lancamentos"],
      },
      {
        step: 4,
        actor: "RDFI (Banco Recebedor)",
        action: "Recebe o lancamento ACH, valida a conta e efetua o debito ou credito.",
        features: ["Validacao de Conta", "Verificacao NSF"],
      },
      {
        step: 5,
        actor: "Liquidacao (Federal Reserve)",
        action: "Liquidacao liquida ocorre entre ODFI e RDFI pelo Federal Reserve em janelas designadas.",
        features: ["Liquidacao Liquida", "Janela ACH no Mesmo Dia"],
      },
      {
        step: 6,
        actor: "Originador",
        action: "Recebe arquivos de retorno/notificacao se o lancamento foi rejeitado (ex.: NSF, conta invalida).",
        features: ["Tratamento de Retorno", "Processamento NOC"],
      },
    ],
  },
  {
    name: "Pagamento com Carteira Digital",
    description:
      "Pagamento usando carteira digital (PayPal, Apple Pay, Google Pay) — cliente se autentica com o provedor da carteira em vez de inserir dados do cartao.",
    duration: "1-3 segundos (auth) / T+1 (liquidacao ao lojista)",
    rail: "Carteira + Trilho subjacente de Cartao/Banco",
    steps: [
      {
        step: 1,
        actor: "Cliente",
        action: "Seleciona o metodo de pagamento por carteira no checkout (ex.: botao Apple Pay, redirecionamento PayPal).",
        features: ["Integracao SDK de Carteira", "Selecao de Metodo de Pagamento"],
      },
      {
        step: 2,
        actor: "Provedor da Carteira",
        action: "Autentica o usuario (biometria / senha) e apresenta as fontes de financiamento vinculadas.",
        features: ["Autenticacao Biometrica", "Autenticacao do Usuario"],
      },
      {
        step: 3,
        actor: "Provedor da Carteira",
        action: "Gera um token de rede ou payload criptografado representando a fonte de financiamento selecionada.",
        features: ["Tokenizacao de Rede", "Geracao de DPAN"],
      },
      {
        step: 4,
        actor: "Gateway de Pagamento",
        action: "Recebe o token da carteira e submete uma solicitacao de autorizacao pelo trilho subjacente.",
        features: ["Decriptacao de Token", "Processamento pelo Gateway"],
      },
      {
        step: 5,
        actor: "Rede de Cartao / Trilho Bancario",
        action: "Processa a autorizacao como uma transferencia padrao de cartao ou banco usando as credenciais tokenizadas.",
        features: ["Autorizacao de Rede", "Mapeamento Token-para-PAN"],
      },
      {
        step: 6,
        actor: "Lojista",
        action: "Recebe confirmacao de autorizacao. Captura e liquidacao seguem o ciclo do trilho subjacente.",
        features: ["Captura", "Liquidacao", "Reconciliacao"],
      },
    ],
  },
  {
    name: "BNPL (Compre Agora, Pague Depois)",
    description:
      "Fluxo de pagamento parcelado onde um provedor BNPL (Klarna, Affirm, Afterpay) subscreve o cliente e paga o lojista antecipadamente.",
    duration: "3-10 segundos (aprovacao) / repasse instantaneo ao lojista",
    rail: "Provedor BNPL + Cartao/Banco",
    steps: [
      {
        step: 1,
        actor: "Cliente",
        action: "Seleciona BNPL como metodo de pagamento no checkout e e redirecionado ao provedor BNPL.",
        features: ["Widget BNPL", "Redirecionamento / Iframe"],
      },
      {
        step: 2,
        actor: "Provedor BNPL",
        action: "Realiza avaliacao de credito em tempo real usando consulta de credito soft e modelos proprietarios de scoring.",
        features: ["Scoring de Credito", "Consulta de Credito Soft", "KYC Simplificado"],
      },
      {
        step: 3,
        actor: "Provedor BNPL",
        action: "Aprova o plano (ex.: 4 parcelas) e apresenta os termos ao cliente para aceitacao.",
        features: ["Geracao de Plano de Parcelas", "Apresentacao de Termos"],
      },
      {
        step: 4,
        actor: "Cliente",
        action: "Aceita o plano de parcelamento e confirma o primeiro pagamento (geralmente no checkout).",
        features: ["Aceitacao do Plano", "Cobranca da Primeira Parcela"],
      },
      {
        step: 5,
        actor: "Provedor BNPL",
        action: "Paga ao lojista o valor total do pedido (menos taxas BNPL), assumindo o risco de credito.",
        features: ["Repasse ao Lojista", "Assuncao de Risco"],
      },
      {
        step: 6,
        actor: "Provedor BNPL",
        action: "Cobra as parcelas restantes do cliente durante o periodo programado (2-12 semanas).",
        features: ["Cobranca de Parcelas", "Gestao de Multas por Atraso", "Dunning"],
      },
    ],
  },
  {
    name: "Pagamento em Marketplace",
    description:
      "Fluxo de pagamento multipartite para marketplaces — fundos sao coletados do comprador, divididos entre a plataforma e vendedores, com logica de escrow e repasse.",
    duration: "2-5 segundos (auth) / T+1-T+7 (repasse ao vendedor)",
    rail: "Cartao / Banco + Liquidacao Dividida",
    steps: [
      {
        step: 1,
        actor: "Comprador",
        action: "Finaliza a compra no marketplace. O carrinho pode conter itens de multiplos vendedores.",
        features: ["Carrinho Multi-Vendedor", "Agregacao de Checkout"],
      },
      {
        step: 2,
        actor: "Plataforma do Marketplace",
        action: "Cria um payment intent com instrucoes de split — taxa da plataforma, parcelas dos vendedores, retencao de imposto.",
        features: ["Payment Intent com Split", "Calculo de Taxas"],
      },
      {
        step: 3,
        actor: "Processador de Pagamento",
        action: "Autoriza e captura o valor total do metodo de pagamento do comprador.",
        features: ["Autorizacao", "Captura", "Retencao em Escrow"],
      },
      {
        step: 4,
        actor: "Plataforma do Marketplace",
        action: "Retem fundos em escrow ate que condicoes de cumprimento sejam atendidas (confirmacao de envio, entrega).",
        features: ["Gestao de Escrow", "Verificacao de Cumprimento"],
      },
      {
        step: 5,
        actor: "Processador de Pagamento",
        action: "Executa o split — encaminha a comissao da plataforma ao marketplace e o restante a cada vendedor.",
        features: ["Liquidacao Dividida", "Repasse Multipartite"],
      },
      {
        step: 6,
        actor: "Vendedores",
        action: "Recebem repasses em suas contas bancarias conectadas conforme o cronograma de repasse configurado.",
        features: ["Repasse ao Vendedor", "Agendamento de Repasse", "Relatorio Fiscal"],
      },
    ],
  },
  {
    name: "Desembolsos (Payouts)",
    description:
      "Fluxo de desembolso — plataforma ou empresa envia fundos a destinatarios (vendedores, motoristas, freelancers) via transferencia bancaria ou card push.",
    duration: "Instantaneo a T+3 dependendo do metodo",
    rail: "ACH / SEPA / PIX / Card Push",
    steps: [
      {
        step: 1,
        actor: "Plataforma / Empresa",
        action: "Calcula o valor de repasse por destinatario com base em ganhos, deducoes e taxas.",
        features: ["Calculo de Ganhos", "Deducao de Taxas"],
      },
      {
        step: 2,
        actor: "Plataforma / Empresa",
        action: "Cria instrucoes de repasse via API do PSP, especificando destinatario, valor e metodo.",
        features: ["API de Repasse", "Gestao de Destinatarios"],
      },
      {
        step: 3,
        actor: "PSP / Provedor de Repasse",
        action: "Valida dados do destinatario (conta bancaria, identidade) e verificacoes de compliance.",
        features: ["Validacao KYC", "Triagem de Sancoes", "Verificacao de Conta"],
      },
      {
        step: 4,
        actor: "PSP / Provedor de Repasse",
        action: "Submete o repasse pelo trilho local apropriado (ACH, SEPA, PIX, Faster Payments).",
        features: ["Selecao de Trilho", "Submissao ao Trilho Local"],
      },
      {
        step: 5,
        actor: "Banco Recebedor",
        action: "Credita a conta bancaria do destinatario. O prazo depende do trilho (instantaneo para PIX, T+1 para ACH).",
        features: ["Credito em Conta", "Confirmacao de Liquidacao"],
      },
      {
        step: 6,
        actor: "Plataforma / Empresa",
        action: "Recebe confirmacao via webhook e atualiza o status do repasse do destinatario no dashboard.",
        features: ["Confirmacao de Repasse", "Reconciliacao", "Relatorio Fiscal"],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Card Authorization Sequence Diagram Data
// ---------------------------------------------------------------------------

const cardAuthActors = ["Cliente", "Merchant", "PSP/Gateway", "Adquirente", "Bandeira", "Emissor"];

const cardAuthFlow: FlowDiagramStep[] = [
  { from: "Cliente", to: "Merchant", label: "Inicia pagamento", detail: "Cliente insere dados do cartao ou usa wallet digital no checkout do merchant", type: "request" },
  { from: "Merchant", to: "PSP/Gateway", label: "Envia transacao", detail: "Merchant envia dados da transacao ao PSP via API (amount, card token, merchant_id, idempotency_key)", type: "request" },
  { from: "PSP/Gateway", to: "Adquirente", label: "Roteia ao adquirente", detail: "Smart routing seleciona o melhor adquirente baseado em custo, taxa de sucesso e latencia. Mensagem ISO 8583 (0100)", type: "request" },
  { from: "Adquirente", to: "Bandeira", label: "Encaminha a bandeira", detail: "Adquirente formata mensagem ISO 8583 e envia via rede da bandeira (VisaNet, Banknet)", type: "request" },
  { from: "Bandeira", to: "Emissor", label: "Solicita autorizacao", detail: "Bandeira roteia ao emissor do cartao. Emissor verifica: saldo, limite, fraude, geolocalizacao, status do cartao", type: "request" },
  { from: "Emissor", to: "Bandeira", label: "Resposta (aprovado/negado)", detail: "Emissor retorna codigo de resposta (00=aprovado, 05=nao autorizado, 51=saldo insuficiente, etc.)", type: "response" },
  { from: "Bandeira", to: "Adquirente", label: "Repassa resposta", detail: "Bandeira repassa resposta do emissor ao adquirente com authorization code", type: "response" },
  { from: "Adquirente", to: "PSP/Gateway", label: "Retorna resultado", detail: "Adquirente envia resposta ao PSP com status, auth code, e response code", type: "response" },
  { from: "PSP/Gateway", to: "Merchant", label: "Webhook de resultado", detail: "PSP notifica merchant via webhook com status final. Merchant atualiza pedido", type: "response" },
  { from: "Merchant", to: "Cliente", label: "Exibe confirmacao", detail: "Checkout exibe confirmacao de pagamento aprovado ou mensagem de erro", type: "response" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransactionFlowsPage() {
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());
  const quiz = getQuizForPage("/explore/transaction-flows");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const toggleFlow = (name: string) => {
    setExpandedFlows((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // Compute aggregate stats
  const stats = useMemo(() => {
    const totalSteps = transactionFlows.reduce((t, f) => t + f.steps.length, 0);
    const uniqueRails = new Set(transactionFlows.map((f) => f.rail)).size;
    const uniqueActors = new Set(
      transactionFlows.flatMap((f) => f.steps.map((s) => s.actor))
    ).size;
    return { totalSteps, uniqueRails, uniqueActors };
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Fluxos de Transacao
        </h1>
        <p className="page-description">
          Detalhamentos passo a passo de {transactionFlows.length} fluxos de
          pagamento comuns. Clique em qualquer card para expandir o diagrama
          completo com atores, acoes e features em cada etapa.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Como funciona o fluxo de um pagamento com cartão</li>
          <li>Etapas de autorização, clearing e liquidação</li>
          <li>Diferenças entre fluxos domésticos e cross-border</li>
        </ul>
      </div>

      {/* ================================================================= */}
      {/* SEQUENCE DIAGRAM — Card Authorization Flow                        */}
      {/* ================================================================= */}
      <FlowDiagram
        title="Fluxo de Autorizacao de Cartao — Diagrama de Sequencia"
        actors={cardAuthActors}
        steps={cardAuthFlow}
      />

      {/* ================================================================= */}
      {/* STATS — Phase 2                                                   */}
      {/* ================================================================= */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 animate-fade-in stagger-1"
        style={{ gap: "1rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Fluxos", value: transactionFlows.length, emoji: "🔄" },
          { label: "Etapas Totais", value: stats.totalSteps, emoji: "📋" },
          { label: "Trilhos", value: stats.uniqueRails, emoji: "🛤️" },
          { label: "Atores Unicos", value: stats.uniqueActors, emoji: "👥" },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ padding: "1.25rem" }}
          >
            <div className="flex items-center" style={{ gap: "0.875rem" }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${STAT_COLORS[idx].from}, ${STAT_COLORS[idx].to})`,
                  fontSize: "1.125rem",
                }}
              >
                {stat.emoji}
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>
        * Tempos de duração e liquidação podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================= */}
      {/* FLOW CARDS — Phases 1, 3, 4, 5, 6                                */}
      {/* ================================================================= */}
      <div className="flex flex-col" style={{ gap: "1.25rem" }}>
        {transactionFlows.map((flow, idx) => {
          const isExpanded = expandedFlows.has(flow.name);
          const config = FLOW_CONFIG[flow.name] || {
            colorFrom: "#6366f1",
            colorTo: "#818cf8",
            icon: null,
          };

          return (
            <div
              key={flow.name}
              className={`card-glow overflow-hidden animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
              style={{
                borderLeft: `4px solid ${config.colorFrom}`,
                animationDelay: idx > 5 ? `${0.3 + (idx - 5) * 0.05}s` : undefined,
              }}
            >
              {/* ── Clickable header ── */}
              <button
                onClick={() => toggleFlow(flow.name)}
                className="w-full text-left flex items-center bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all"
                style={{ gap: "1rem", padding: "1.25rem 1.5rem" }}
              >
                {/* Icon circle */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.75rem",
                    background: `linear-gradient(135deg, ${config.colorFrom}, ${config.colorTo})`,
                    boxShadow: `0 4px 12px ${config.colorFrom}30`,
                  }}
                >
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold">{flow.name}</h2>
                  <p className="text-sm text-[var(--text-muted)] truncate">
                    {flow.description}
                  </p>
                </div>

                {/* Metadata pills */}
                <div className="hidden sm:flex items-center shrink-0" style={{ gap: "0.5rem" }}>
                  {/* Rail badge — colored */}
                  <span
                    className="text-xs font-medium rounded-full"
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: `${config.colorFrom}15`,
                      color: config.colorFrom,
                      border: `1px solid ${config.colorFrom}30`,
                    }}
                  >
                    {flow.rail}
                  </span>
                  {/* Step count badge */}
                  <span
                    className="badge-primary text-xs font-medium"
                    style={{ padding: "0.25rem 0.625rem" }}
                  >
                    {flow.steps.length} etapas
                  </span>
                </div>

                {/* Chevron */}
                <span
                  className={`text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {/* ── Expanded flow detail ── */}
              <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div style={{ padding: "1.5rem" }}>
                    {/* Gradient accent bar */}
                    <div
                      style={{
                        height: "3px",
                        borderRadius: "3px",
                        background: `linear-gradient(90deg, ${config.colorFrom}, ${config.colorTo})`,
                        marginBottom: "1.25rem",
                      }}
                    />

                    {/* Meta boxes */}
                    <div className="flex flex-wrap" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
                      {[
                        { label: "Duracao", value: flow.duration },
                        { label: "Trilho", value: flow.rail },
                        { label: "Etapas", value: String(flow.steps.length) },
                      ].map((meta) => (
                        <div
                          key={meta.label}
                          className="rounded-lg"
                          style={{
                            padding: "0.625rem 1rem",
                            background: "var(--surface-hover)",
                            borderLeft: `3px solid ${config.colorFrom}`,
                          }}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            {meta.label}
                          </div>
                          <div className="text-sm font-semibold">{meta.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Step-by-step timeline */}
                    <div className="relative">
                      {flow.steps.map((step, stepIdx) => (
                        <div
                          key={step.step}
                          className="flex"
                          style={{
                            gap: "1rem",
                            marginBottom: stepIdx < flow.steps.length - 1 ? "1.5rem" : "0",
                          }}
                        >
                          {/* Step indicator + connector */}
                          <div className="flex flex-col items-center">
                            <div
                              className="flex items-center justify-center text-white text-sm font-bold shrink-0"
                              style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${config.colorFrom}, ${config.colorTo})`,
                                boxShadow: `0 2px 8px ${config.colorFrom}40`,
                              }}
                            >
                              {step.step}
                            </div>
                            {stepIdx < flow.steps.length - 1 && (
                              <div
                                style={{
                                  width: "3px",
                                  flex: 1,
                                  background: `linear-gradient(to bottom, ${config.colorFrom}50, ${config.colorFrom}15)`,
                                  marginTop: "0.25rem",
                                  borderRadius: "9999px",
                                }}
                              />
                            )}
                          </div>

                          {/* Step content */}
                          <div className="flex-1" style={{ paddingBottom: "0.5rem" }}>
                            {/* Actor label as colored chip */}
                            <div
                              className="text-xs font-bold uppercase tracking-wider inline-flex items-center"
                              style={{
                                marginBottom: "0.375rem",
                                padding: "0.2rem 0.625rem",
                                borderRadius: "6px",
                                background: `${config.colorFrom}12`,
                                color: config.colorFrom,
                                border: `1px solid ${config.colorFrom}25`,
                              }}
                            >
                              {step.actor}
                            </div>
                            <p className="text-sm" style={{ marginBottom: "0.5rem" }}>
                              {step.action}
                            </p>
                            <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                              {step.features.map((f) => (
                                <span
                                  key={f}
                                  className="chip chip-primary text-[13px]"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* FOOTER CALLOUT — Phase 7                                          */}
      {/* ================================================================= */}
      <div
        className="animate-fade-in"
        style={{
          marginTop: "2.5rem",
          padding: "1.25rem 1.5rem",
          borderLeft: "4px solid var(--accent-sky)",
          background: "var(--surface-hover)",
          borderRadius: "0 12px 12px 0",
        }}
      >
        <h3
          className="font-bold flex items-center"
          style={{ gap: "0.5rem", marginBottom: "0.625rem", fontSize: "1rem" }}
        >
          <span>💡</span>
          Entendendo os fluxos de transacao
        </h3>
        <p
          className="text-sm text-[var(--text-muted)] leading-relaxed"
          style={{ maxWidth: "44rem" }}
        >
          Cada fluxo mostra os atores envolvidos e as features exercitadas em
          cada etapa. Use estes diagramas para entender como sua stack de
          pagamentos processa transacoes, identificar onde falhas podem ocorrer e
          mapear dependencias de features dentro de cada fluxo.
        </p>
      </div>

      {/* ================================================================= */}
      {/* NAVIGATION LINKS — Phase 8                                        */}
      {/* ================================================================= */}
      <div
        className="card-glow animate-fade-in"
        style={{ marginTop: "2rem", padding: "1.5rem" }}
      >
        <h3 className="font-bold" style={{ marginBottom: "0.875rem" }}>
          Explore mais no Atlas
        </h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "0.75rem" }}
        >
          {[
            { name: "Mapa de Pagamentos", href: "/explore/payments-map", icon: "🗺️" },
            { name: "Trilhos de Pagamento", href: "/explore/payment-rails", icon: "🛤️" },
            { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", icon: "🌐" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] transition-colors group"
              style={{ gap: "0.625rem", padding: "0.875rem" }}
            >
              <span style={{ fontSize: "1.125rem" }}>{link.icon}</span>
              <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                {link.name}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform"
                style={{ marginLeft: "auto" }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
