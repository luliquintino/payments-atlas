/**
 * Business Rules Data
 *
 * Regras de negócio de pagamento organizadas por tipo: validação, roteamento,
 * risco, compliance e operacional. Extraídas do componente de página para
 * reutilização e manutenção centralizada.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RuleType = "validation" | "routing" | "risk" | "compliance" | "operational";
export type Severity = "info" | "warning" | "critical" | "blocker";

export interface BusinessRule {
  id: string;
  rule_name: string;
  rule_type: RuleType;
  condition: string;
  expected_behavior: string;
  severity: Severity;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const RULE_TYPE_META: Record<
  RuleType,
  { label: string; icon: string; color: string }
> = {
  validation: {
    label: "Validação",
    icon: "V",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  routing: {
    label: "Roteamento",
    icon: "R",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  risk: {
    label: "Risco",
    icon: "!",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  compliance: {
    label: "Compliance",
    icon: "C",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  operational: {
    label: "Operacional",
    icon: "O",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  info: "info",
  warning: "aviso",
  critical: "crítico",
  blocker: "bloqueante",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  critical: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  blocker: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export const ALL_RULE_TYPES: RuleType[] = [
  "validation",
  "routing",
  "risk",
  "compliance",
  "operational",
];

// ---------------------------------------------------------------------------
// Data — Regras de negócio
// ---------------------------------------------------------------------------

export const RULES: BusinessRule[] = [
  // --- Regras de validação ---
  {
    id: "v1",
    rule_name: "Verificação Luhn do Número do Cartão",
    rule_type: "validation",
    condition: "Número do cartão falha na validação do algoritmo Luhn",
    expected_behavior: "Rejeitar a transação antes de enviar ao adquirente. Retornar código de erro INVALID_CARD_NUMBER ao merchant.",
    severity: "blocker",
  },
  {
    id: "v2",
    rule_name: "Validação de Data de Expiração",
    rule_type: "validation",
    condition: "Data de expiração do cartão está no passado ou mais de 20 anos no futuro",
    expected_behavior: "Rejeitar a transação e retornar INVALID_EXPIRY. Não encaminhar para a bandeira.",
    severity: "blocker",
  },
  {
    id: "v3",
    rule_name: "Verificação de Faixa de Valor",
    rule_type: "validation",
    condition: "Valor da transação é zero, negativo ou excede o máximo configurado pelo merchant",
    expected_behavior: "Rejeitar com INVALID_AMOUNT. Registrar a tentativa para monitoramento.",
    severity: "critical",
  },
  {
    id: "v4",
    rule_name: "Validação de Código de Moeda",
    rule_type: "validation",
    condition: "Código de moeda não é um código ISO 4217 válido ou não está habilitado para o merchant",
    expected_behavior: "Rejeitar com UNSUPPORTED_CURRENCY. Retornar lista de moedas suportadas nos detalhes do erro.",
    severity: "warning",
  },
  {
    id: "v5",
    rule_name: "Validação de CVV/CVC",
    rule_type: "validation",
    condition: "Código de segurança (CVV/CVC) não tem 3 ou 4 dígitos, ou contém caracteres não numéricos",
    expected_behavior: "Rejeitar com INVALID_SECURITY_CODE antes de encaminhar ao adquirente.",
    severity: "blocker",
  },

  // --- Regras de roteamento ---
  {
    id: "r1",
    rule_name: "Roteamento Doméstico vs. Cross-Border",
    rule_type: "routing",
    condition: "País do emissor coincide com o país do adquirente",
    expected_behavior: "Rotear pela conexão doméstica do adquirente. Aplicar taxas de interchange doméstico. Marcar como doméstico nos arquivos de liquidação.",
    severity: "info",
  },
  {
    id: "r2",
    rule_name: "Roteamento por Bandeira Preferida",
    rule_type: "routing",
    condition: "Cartão é multi-bandeira (ex.: Visa + Elo) e merchant tem preferência de roteamento configurada",
    expected_behavior: "Rotear pela bandeira preferida do merchant. Usar bandeira padrão como fallback se a rota preferida não estiver disponível.",
    severity: "warning",
  },
  {
    id: "r3",
    rule_name: "Failover para Adquirente de Backup",
    rule_type: "routing",
    condition: "Adquirente primário retorna timeout ou erro de sistema (código de resposta 96, 91)",
    expected_behavior: "Retentar pelo adquirente de backup em até 3 segundos. Se backup também falhar, retornar ACQUIRER_UNAVAILABLE.",
    severity: "critical",
  },
  {
    id: "r4",
    rule_name: "Seleção de MCC Correto",
    rule_type: "routing",
    condition: "Merchant Category Code (MCC) determina regras de interchange e elegibilidade para certos programas",
    expected_behavior: "Usar MCC correto do merchant no registro. MCC incorreto pode resultar em multas da bandeira e interchange incorreto.",
    severity: "warning",
  },

  // --- Regras de risco ---
  {
    id: "ri1",
    rule_name: "Revisão de Transação de Alto Valor",
    rule_type: "risk",
    condition: "Valor da transação excede 5x o valor médio de transação do portador do cartão",
    expected_behavior: "Sinalizar para revisão manual. Reter autorização por até 30 minutos. Notificar equipe de risco via alerta.",
    severity: "warning",
  },
  {
    id: "ri2",
    rule_name: "Limite de Velocidade Excedido",
    rule_type: "risk",
    condition: "Mais de 5 transações do mesmo cartão em uma janela de 10 minutos",
    expected_behavior: "Soft-decline da transação com VELOCITY_EXCEEDED. Exigir autenticação step-up (desafio 3DS).",
    severity: "critical",
  },
  {
    id: "ri3",
    rule_name: "Bloqueio por Divergência de País",
    rule_type: "risk",
    condition: "País de geolocalização do IP não coincide com o país do emissor do cartão e merchant tem regras geográficas restritas habilitadas",
    expected_behavior: "Bloquear a transação. Retornar GEOGRAPHIC_RESTRICTION. Permitir override com autenticação 3DS.",
    severity: "critical",
  },
  {
    id: "ri4",
    rule_name: "Anomalia de Fingerprint de Dispositivo",
    rule_type: "risk",
    condition: "Fingerprint do dispositivo não corresponde a nenhum dispositivo previamente visto para este portador de cartão",
    expected_behavior: "Aumentar pontuação de risco em 25 pontos. Se pontuação total exceder o limite, acionar desafio 3DS.",
    severity: "warning",
  },

  // --- Regras de compliance ---
  {
    id: "c1",
    rule_name: "Mascaramento de Dados PCI",
    rule_type: "compliance",
    condition: "Número do cartão aparece em qualquer saída de log, resposta de API ou armazenamento fora do vault",
    expected_behavior: "Mascarar todos exceto os últimos 4 dígitos (ex.: ****1234). Alertar equipe de segurança se PAN completo for detectado em logs.",
    severity: "blocker",
  },
  {
    id: "c2",
    rule_name: "Aplicação de SCA (PSD2)",
    rule_type: "compliance",
    condition: "Transação origina do EEA e nenhuma isenção de SCA se aplica (low-value <€30, TRA, MIT, trusted beneficiary)",
    expected_behavior: "Aplicar Strong Customer Authentication via 3DS 2.x. Recusar se autenticação não for completada.",
    severity: "blocker",
  },
  {
    id: "c3",
    rule_name: "Triagem de Sanções",
    rule_type: "compliance",
    condition: "Merchant ou país do portador do cartão está na lista de sanções OFAC/UE",
    expected_behavior: "Bloquear transação imediatamente. Registrar Relatório de Atividade Suspeita. Notificar equipe de compliance.",
    severity: "blocker",
  },
  {
    id: "c4",
    rule_name: "Retenção de Dados PCI DSS",
    rule_type: "compliance",
    condition: "Dados sensíveis de autenticação (CVV, PIN, banda magnética) armazenados após autorização",
    expected_behavior: "Deletar imediatamente dados sensíveis após autorização bem-sucedida. Nunca armazenar CVV, PIN ou dados da banda magnética. Requisito PCI DSS 3.2.",
    severity: "blocker",
  },
  {
    id: "c5",
    rule_name: "Monitoramento AML (Anti-Money Laundering)",
    rule_type: "compliance",
    condition: "Transação excede limites de reporting ou padrão é consistente com tipologias de lavagem",
    expected_behavior: "Registrar para revisão AML. Transações acima de R$10.000 (ou equivalente) devem ser reportadas ao COAF/FinCEN.",
    severity: "critical",
  },

  // --- Regras operacionais ---
  {
    id: "o1",
    rule_name: "Aplicação de Idempotência",
    rule_type: "operational",
    condition: "Requisição de API contém uma chave de idempotência que já foi usada nas últimas 24 horas",
    expected_behavior: "Retornar a resposta original sem reprocessar. Registrar a tentativa duplicada.",
    severity: "warning",
  },
  {
    id: "o2",
    rule_name: "Corte de Liquidação",
    rule_type: "operational",
    condition: "Transação é autorizada após o horário de corte diário de liquidação (23:00 UTC)",
    expected_behavior: "Incluir a transação no lote de liquidação do próximo dia útil. Ajustar a data de liquidação conforme necessário.",
    severity: "info",
  },
  {
    id: "o3",
    rule_name: "Tratamento de Timeout",
    rule_type: "operational",
    condition: "Nenhuma resposta recebida do adquirente em 30 segundos",
    expected_behavior: "Enviar reversão/void para prevenir cobranças duplicadas. Retornar TIMEOUT ao merchant. Registrar para conciliação.",
    severity: "critical",
  },
  {
    id: "o4",
    rule_name: "Verificação de Integridade de Lote",
    rule_type: "operational",
    condition: "Contagem de registros ou valor total do lote de liquidação não corresponde ao header/trailer",
    expected_behavior: "Rejeitar o lote inteiro. Alertar equipe de operações. Solicitar retransmissão ao adquirente.",
    severity: "blocker",
  },
  {
    id: "o5",
    rule_name: "Reconciliação de Transações Pendentes",
    rule_type: "operational",
    condition: "Transação autorizada há mais de 7 dias sem captura correspondente",
    expected_behavior: "Alertar merchant sobre autorização pendente. Após 30 dias sem captura, a autorização expira automaticamente na bandeira.",
    severity: "warning",
  },
];
