/**
 * Dados de Fraude & Risco — Payments Knowledge System
 *
 * Exporta dados para o pipeline de detecção de fraude, sinais de fraude
 * e ciclo de vida de chargeback.
 */

// ---------------------------------------------------------------------------
// Types — Pipeline de Detecção de Fraude
// ---------------------------------------------------------------------------

export interface PipelineStep {
  /** Nome da etapa */
  name: string;
  /** Descrição curta */
  description: string;
  /** Nível de risco visual (determina cor) */
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface PipelineStage {
  /** Nome do estágio */
  name: string;
  /** Descrição do estágio */
  description: string;
  /** Atores envolvidos neste estágio */
  actors: string[];
  /** Tempo típico de execução */
  timing: string;
  /** Features de pagamento exercitadas */
  features: string[];
  /** Etapas dentro do estágio */
  steps: PipelineStep[];
  /** Cor do estágio (mapeia para nível de risco geral) */
  color: "blue" | "yellow" | "orange" | "red";
}

// ---------------------------------------------------------------------------
// Types — Sinais de Fraude
// ---------------------------------------------------------------------------

export type SignalCategory =
  | "Device"
  | "Comportamental"
  | "Identidade"
  | "Transacional";

export type SignalStrength = "forte" | "moderado" | "fraco";

export interface FraudSignal {
  /** Identificador único */
  id: string;
  /** Nome do sinal */
  name: string;
  /** Descrição do que o sinal indica */
  description: string;
  /** Categoria do sinal */
  category: SignalCategory;
  /** Força do sinal como indicador de fraude */
  strength: SignalStrength;
  /** Risco de falso positivo (alto/médio/baixo) */
  falsePositiveRisk: "alto" | "médio" | "baixo";
}

// ---------------------------------------------------------------------------
// Types — Ciclo de Chargeback
// ---------------------------------------------------------------------------

export interface ChargebackStage {
  /** Número da etapa (1-indexed) */
  step: number;
  /** Nome da etapa */
  name: string;
  /** Descrição do que acontece */
  description: string;
  /** Atores envolvidos */
  actors: string[];
  /** Prazos aplicáveis */
  deadlines: string[];
  /** Documentos necessários */
  requiredDocuments: string[];
  /** Dicas para o lojista */
  merchantTips: string[];
}

// ---------------------------------------------------------------------------
// Dados — Pipeline de Detecção de Fraude (4 estágios)
// ---------------------------------------------------------------------------

export const fraudPipelineStages: PipelineStage[] = [
  {
    name: "Pré-Autenticação",
    description:
      "Triagem inicial antes da autenticação do portador. Análise de device, velocidade e dados contextuais para decidir o nível de autenticação necessário.",
    actors: ["Motor de Risco", "Gateway de Pagamento", "Provedor de Device Fingerprint"],
    timing: "< 100ms",
    features: ["Fraud Scoring", "Velocity Checks", "BIN Lookup"],
    steps: [
      {
        name: "Coleta de Device Fingerprint",
        description:
          "SDK client-side coleta atributos do dispositivo: navegador, OS, resolução, timezone, idioma e plugins instalados.",
        riskLevel: "low",
      },
      {
        name: "Verificação de Velocidade",
        description:
          "Analisa frequência de transações por cartão, IP, device e conta nas últimas horas para detectar padrões de teste de cartão.",
        riskLevel: "low",
      },
      {
        name: "Enriquecimento de Dados",
        description:
          "Consulta dados de BIN, geolocalização de IP, listas negras de email e bases de fraude compartilhadas para enriquecer o contexto.",
        riskLevel: "low",
      },
      {
        name: "Scoring Pré-Auth",
        description:
          "Modelo de ML gera score de risco inicial (0-100) combinando todos os sinais coletados. Define se vai para fluxo frictionless ou desafio.",
        riskLevel: "medium",
      },
    ],
    color: "blue",
  },
  {
    name: "Autenticação",
    description:
      "Verificação da identidade do portador do cartão via protocolos de autenticação como 3D Secure, biometria ou OTP.",
    actors: ["ACS (Access Control Server)", "Directory Server", "3DS Server", "Emissor"],
    timing: "2-30 segundos",
    features: ["3D Secure", "EMV 3D Secure 2.x"],
    steps: [
      {
        name: "Decisão de Autenticação",
        description:
          "Com base no score pré-auth, decide: frictionless (baixo risco), desafio (risco moderado) ou bloqueio (alto risco).",
        riskLevel: "medium",
      },
      {
        name: "Fluxo 3DS (Frictionless ou Challenge)",
        description:
          "Dados são enviados ao emissor via Directory Server. Emissor decide se aprova sem fricção ou exige autenticação adicional do portador.",
        riskLevel: "medium",
      },
      {
        name: "Verificação do Portador",
        description:
          "Se challenge: portador verifica identidade via OTP, biometria ou app do banco. Resultado é retornado ao lojista.",
        riskLevel: "high",
      },
    ],
    color: "yellow",
  },
  {
    name: "Pós-Autenticação",
    description:
      "Análise final após autenticação e autorização. Monitoramento contínuo para detectar fraudes que passaram pelas camadas anteriores.",
    actors: ["Motor de Risco", "Analista de Fraude", "Sistema de Monitoramento"],
    timing: "Tempo real + batch (24h)",
    features: ["Fraud Scoring", "Velocity Checks", "Chargeback Management"],
    steps: [
      {
        name: "Revisão Manual (Zona Cinza)",
        description:
          "Transações com score entre 70-90 são direcionadas para revisão manual por analistas de fraude antes da captura.",
        riskLevel: "high",
      },
      {
        name: "Monitoramento Pós-Autorização",
        description:
          "Análise batch identifica padrões de fraude em transações já autorizadas: velocidade tardia, endereços suspeitos, comportamento anômalo.",
        riskLevel: "high",
      },
      {
        name: "Atualização de Modelos",
        description:
          "Feedback de chargebacks confirmados e falsos positivos retroalimenta os modelos de ML para calibração contínua.",
        riskLevel: "medium",
      },
      {
        name: "Ação Preventiva",
        description:
          "Bloqueio preventivo de cartões comprometidos, atualização de listas negras e ajuste de regras de velocidade.",
        riskLevel: "high",
      },
    ],
    color: "orange",
  },
  {
    name: "Disputa",
    description:
      "Gestão de chargebacks e disputas quando fraude é confirmada ou alegada pelo portador do cartão. Inclui representment e arbitragem.",
    actors: ["Lojista", "Adquirente", "Emissor", "Bandeira"],
    timing: "30-120 dias",
    features: ["Chargeback Management"],
    steps: [
      {
        name: "Recebimento do Chargeback",
        description:
          "Emissor inicia chargeback em nome do portador. Lojista é notificado e o valor é debitado provisoriamente.",
        riskLevel: "critical",
      },
      {
        name: "Coleta de Evidências",
        description:
          "Lojista reúne evidências: comprovante de entrega, logs de autenticação 3DS, IP do comprador, comunicações com cliente.",
        riskLevel: "critical",
      },
      {
        name: "Representment",
        description:
          "Lojista submete evidências ao adquirente para contestar o chargeback. Emissor avalia e decide se reverte ou mantém.",
        riskLevel: "critical",
      },
      {
        name: "Arbitragem (se necessário)",
        description:
          "Se não resolvido, a bandeira atua como árbitro final. Decisão é vinculante e pode incluir taxas adicionais.",
        riskLevel: "critical",
      },
    ],
    color: "red",
  },
];

// ---------------------------------------------------------------------------
// Dados — Sinais de Fraude (16 sinais em 4 categorias)
// ---------------------------------------------------------------------------

export const fraudSignals: FraudSignal[] = [
  // Device (4)
  {
    id: "sig-d01",
    name: "Device novo ou não reconhecido",
    description:
      "O dispositivo utilizado não tem histórico de transações anteriores com o portador. Pode indicar uso de dispositivo roubado ou emulador.",
    category: "Device",
    strength: "moderado",
    falsePositiveRisk: "alto",
  },
  {
    id: "sig-d02",
    name: "Proxy / VPN detectado",
    description:
      "O endereço IP está associado a serviço de proxy, VPN ou rede Tor. Fraudadores frequentemente mascaram sua localização real.",
    category: "Device",
    strength: "forte",
    falsePositiveRisk: "médio",
  },
  {
    id: "sig-d03",
    name: "Múltiplos cartões no mesmo device",
    description:
      "O dispositivo foi usado para transações com mais de 3 cartões diferentes em 24 horas. Padrão típico de teste de cartão.",
    category: "Device",
    strength: "forte",
    falsePositiveRisk: "baixo",
  },
  {
    id: "sig-d04",
    name: "Emulador de dispositivo",
    description:
      "Características do navegador ou dispositivo indicam ambiente emulado (headless browser, spoofing de user-agent).",
    category: "Device",
    strength: "forte",
    falsePositiveRisk: "baixo",
  },

  // Comportamental (4)
  {
    id: "sig-b01",
    name: "Navegação anormalmente rápida",
    description:
      "O tempo entre o acesso à página de produto e o checkout é muito inferior ao comportamento normal. Indica automação ou bot.",
    category: "Comportamental",
    strength: "moderado",
    falsePositiveRisk: "médio",
  },
  {
    id: "sig-b02",
    name: "Horário incomum de compra",
    description:
      "Transação realizada em horário atípico para o perfil do portador (ex.: madrugada em dia de semana). Pode indicar uso não autorizado.",
    category: "Comportamental",
    strength: "fraco",
    falsePositiveRisk: "alto",
  },
  {
    id: "sig-b03",
    name: "Mudança de endereço recente",
    description:
      "O endereço de entrega foi alterado pouco antes da compra. Fraudadores frequentemente redirecionam entregas para endereços temporários.",
    category: "Comportamental",
    strength: "moderado",
    falsePositiveRisk: "médio",
  },
  {
    id: "sig-b04",
    name: "Múltiplas tentativas de pagamento",
    description:
      "O comprador tentou múltiplos métodos de pagamento ou cartões em sequência. Comportamento associado a teste de cartões roubados.",
    category: "Comportamental",
    strength: "forte",
    falsePositiveRisk: "médio",
  },

  // Identidade (4)
  {
    id: "sig-i01",
    name: "Email descartável",
    description:
      "O email utilizado pertence a um provedor de emails temporários/descartáveis. Fraudadores usam emails descartáveis para evitar rastreamento.",
    category: "Identidade",
    strength: "forte",
    falsePositiveRisk: "baixo",
  },
  {
    id: "sig-i02",
    name: "Dados cadastrais inconsistentes",
    description:
      "Nome, endereço, telefone ou email não são consistentes entre si ou com dados públicos. Ex.: CEP não corresponde à cidade informada.",
    category: "Identidade",
    strength: "moderado",
    falsePositiveRisk: "médio",
  },
  {
    id: "sig-i03",
    name: "CPF/documento em lista negra",
    description:
      "O documento de identificação consta em bases de dados de fraude conhecida, SERASA ou listas de restrição do lojista.",
    category: "Identidade",
    strength: "forte",
    falsePositiveRisk: "baixo",
  },
  {
    id: "sig-i04",
    name: "Conta recém-criada",
    description:
      "A conta do comprador foi criada nos últimos minutos ou horas antes da compra. Contas novas têm risco significativamente maior.",
    category: "Identidade",
    strength: "moderado",
    falsePositiveRisk: "alto",
  },

  // Transacional (4)
  {
    id: "sig-t01",
    name: "Valor atípico para o segmento",
    description:
      "O valor da transação está significativamente acima da média do segmento do lojista ou do histórico do portador.",
    category: "Transacional",
    strength: "moderado",
    falsePositiveRisk: "alto",
  },
  {
    id: "sig-t02",
    name: "País do cartão diferente do IP",
    description:
      "O país de emissão do cartão (via BIN) não corresponde ao país do endereço IP. Indica possível uso cross-border fraudulento.",
    category: "Transacional",
    strength: "forte",
    falsePositiveRisk: "médio",
  },
  {
    id: "sig-t03",
    name: "Produto de alto risco",
    description:
      "O produto comprado pertence a categoria de alto risco para fraude: eletrônicos, gift cards, itens de luxo ou produtos digitais.",
    category: "Transacional",
    strength: "moderado",
    falsePositiveRisk: "alto",
  },
  {
    id: "sig-t04",
    name: "Endereço de entrega em ponto de coleta",
    description:
      "O endereço de entrega é uma caixa postal, ponto de coleta ou hotel. Fraudadores usam endereços anônimos para receber produtos.",
    category: "Transacional",
    strength: "moderado",
    falsePositiveRisk: "médio",
  },
];

// ---------------------------------------------------------------------------
// Dados — Ciclo de Vida do Chargeback (8 estágios)
// ---------------------------------------------------------------------------

export const chargebackLifecycle: ChargebackStage[] = [
  {
    step: 1,
    name: "Transação Original",
    description:
      "O portador do cartão realiza uma compra legítima ou fraudulenta. Os dados da transação, autenticação e entrega são registrados neste momento e servirão como evidência futura.",
    actors: ["Portador do Cartão", "Lojista", "Gateway de Pagamento"],
    deadlines: ["N/A — esta é a transação original"],
    requiredDocuments: [
      "Comprovante de autorização",
      "Logs de autenticação 3DS",
      "Dados do pedido (itens, valores)",
    ],
    merchantTips: [
      "Registre todas as evidências de autenticação no momento da compra",
      "Use descritor de cobrança claro na fatura do portador",
      "Ative 3D Secure para liability shift",
    ],
  },
  {
    step: 2,
    name: "Contestação pelo Portador",
    description:
      "O portador do cartão contesta a transação junto ao banco emissor. Pode alegar fraude, produto não recebido, produto diferente do anunciado ou cobrança duplicada.",
    actors: ["Portador do Cartão", "Banco Emissor"],
    deadlines: [
      "Até 120 dias após a transação (Visa)",
      "Até 120 dias após a transação (Mastercard)",
    ],
    requiredDocuments: [
      "Declaração do portador descrevendo a contestação",
      "Documentação de suporte (se aplicável)",
    ],
    merchantTips: [
      "Ofereça canais de atendimento visíveis para resolver antes do chargeback",
      "Política de reembolso clara e acessível reduz disputas",
      "Considere alertas de pré-disputa (Verifi, Ethoca) para resolver proativamente",
    ],
  },
  {
    step: 3,
    name: "Análise do Emissor",
    description:
      "O banco emissor avalia a contestação do portador. Se considera válida, inicia o chargeback formal junto à bandeira e debita provisoriamente o valor do adquirente.",
    actors: ["Banco Emissor", "Bandeira (Visa/Mastercard)"],
    deadlines: [
      "Emissor tem até 30 dias para analisar após contestação",
    ],
    requiredDocuments: [
      "Reason code da bandeira",
      "Formulário de chargeback padronizado",
    ],
    merchantTips: [
      "Monitore alertas de pré-chargeback para interceptar antes do débito",
      "Mantenha comunicação aberta com o adquirente sobre disputas frequentes",
    ],
  },
  {
    step: 4,
    name: "Notificação ao Lojista",
    description:
      "O adquirente notifica o lojista sobre o chargeback recebido. O valor é debitado provisoriamente da conta do lojista. Inicia-se o prazo para resposta.",
    actors: ["Adquirente", "Lojista"],
    deadlines: [
      "Lojista notificado em até 5 dias úteis após o chargeback",
      "Prazo de resposta: 30 dias (Visa) / 45 dias (Mastercard)",
    ],
    requiredDocuments: [
      "Notificação formal com reason code",
      "Detalhes da transação original",
      "Valor do chargeback e taxas aplicáveis",
    ],
    merchantTips: [
      "Aja rapidamente — o prazo de resposta é limitado",
      "Classifique o reason code para determinar a estratégia de defesa",
      "Avalie se vale a pena contestar com base no valor e probabilidade de ganho",
    ],
  },
  {
    step: 5,
    name: "Coleta de Evidências",
    description:
      "O lojista reúne toda documentação necessária para contestar o chargeback. A qualidade e completude das evidências determinam a probabilidade de ganho no representment.",
    actors: ["Lojista", "Equipe de Disputas"],
    deadlines: [
      "Dentro do prazo de resposta (30-45 dias a partir da notificação)",
    ],
    requiredDocuments: [
      "Comprovante de entrega com assinatura",
      "Logs de autenticação 3DS (CAVV, ECI)",
      "Correspondência com o cliente",
      "Política de reembolso aceita pelo cliente",
      "Screenshots do pedido e tracking de envio",
      "IP e device fingerprint do comprador",
    ],
    merchantTips: [
      "Evidências de 3DS com liability shift são altamente eficazes",
      "Comprovante de entrega com assinatura é essencial para disputes de não-recebimento",
      "Organize evidências em formato claro e cronológico",
    ],
  },
  {
    step: 6,
    name: "Representment",
    description:
      "O lojista submete as evidências ao adquirente para contestar o chargeback. O adquirente encaminha ao emissor, que avalia se as evidências são suficientes para reverter a disputa.",
    actors: ["Lojista", "Adquirente", "Banco Emissor"],
    deadlines: [
      "Submissão dentro do prazo de resposta",
      "Emissor tem 30 dias para avaliar as evidências (Visa)",
      "Emissor tem 45 dias para avaliar as evidências (Mastercard)",
    ],
    requiredDocuments: [
      "Formulário de representment preenchido",
      "Pacote completo de evidências",
      "Carta de contestação detalhando argumentos",
    ],
    merchantTips: [
      "Inclua todos os documentos na primeira submissão — raramente há segunda chance",
      "Referencie explicitamente o reason code e as regras da bandeira aplicáveis",
      "Taxa de ganho média do setor: 20-40% dependendo do reason code",
    ],
  },
  {
    step: 7,
    name: "Pré-Arbitragem",
    description:
      "Se o emissor mantém o chargeback após o representment, o lojista pode escalar para pré-arbitragem. É a última tentativa de resolução antes da arbitragem formal pela bandeira.",
    actors: ["Lojista", "Adquirente", "Banco Emissor", "Bandeira"],
    deadlines: [
      "30 dias após decisão do representment (Visa)",
      "45 dias após decisão do representment (Mastercard)",
    ],
    requiredDocuments: [
      "Evidências adicionais ou reforçadas",
      "Justificativa para escalar à pré-arbitragem",
    ],
    merchantTips: [
      "Avalie o custo-benefício: taxas de pré-arbitragem podem chegar a USD 500",
      "Só escale se tiver evidências adicionais convincentes",
      "Considere aceitar o chargeback se o valor for baixo",
    ],
  },
  {
    step: 8,
    name: "Arbitragem Final",
    description:
      "A bandeira (Visa ou Mastercard) atua como árbitro final. A decisão é vinculante para ambas as partes. Taxas de arbitragem são cobradas da parte perdedora.",
    actors: ["Bandeira (Visa/Mastercard)", "Adquirente", "Banco Emissor"],
    deadlines: [
      "Decisão final em até 60-90 dias",
      "Sem recurso adicional após decisão",
    ],
    requiredDocuments: [
      "Toda documentação anterior consolidada",
      "Formulário de arbitragem da bandeira",
    ],
    merchantTips: [
      "Taxa de arbitragem: USD 500 (Visa) / USD 300-500 (Mastercard)",
      "Parte perdedora arca com as taxas — avalie o risco financeiro",
      "Apenas ~2% dos chargebacks chegam à arbitragem",
      "Decisão é final e irrecorrível",
    ],
  },
];
