export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PageQuiz {
  pageRoute: string;
  questions: QuizQuestion[];
}

export const QUIZZES: PageQuiz[] = [
  {
    pageRoute: "/explore/payments-map",
    questions: [
      { id: "pm-1", question: "Qual camada do stack de pagamentos lida diretamente com o usuário final?", options: ["Processamento", "Experiência", "Rede", "Liquidação"], correctIndex: 1, explanation: "A camada de Experiência inclui checkout UI, seleção de método de pagamento e SDKs mobile — tudo que o cliente vê e interage." },
      { id: "pm-2", question: "O que faz a camada de Orquestração?", options: ["Processa transações bancárias", "Roteia pagamentos e gerencia retentativas", "Autentica o portador do cartão", "Liquida fundos entre bancos"], correctIndex: 1, explanation: "A Orquestração é responsável por smart routing, retry logic, cascading entre adquirentes e split de pagamentos." },
      { id: "pm-3", question: "Quantas camadas tem o stack moderno de pagamentos?", options: ["3", "4", "6", "8"], correctIndex: 2, explanation: "São 6 camadas: Experiência, Orquestração, Processamento, Rede, Bancário e Liquidação." },
    ],
  },
  {
    pageRoute: "/explore/payment-rails",
    questions: [
      { id: "pr-1", question: "Qual trilho oferece liquidação instantânea no Brasil?", options: ["Cartão de crédito", "PIX", "SEPA", "ACH"], correctIndex: 1, explanation: "PIX é o sistema de pagamento instantâneo do Banco Central do Brasil, com liquidação em segundos, 24/7." },
      { id: "pr-2", question: "Qual é a faixa típica de taxas para cartões de crédito?", options: ["0% - 0.5%", "0.5% - 1%", "1.5% - 3.5%", "5% - 10%"], correctIndex: 2, explanation: "Cartões tipicamente cobram entre 1.5% e 3.5% incluindo interchange, taxa da bandeira e markup do adquirente." },
      { id: "pr-3", question: "O que significa 'reversibilidade' em trilhos de pagamento?", options: ["Velocidade de liquidação", "Capacidade de estornar/disputar uma transação", "Taxa de conversão", "Cobertura geográfica"], correctIndex: 1, explanation: "Reversibilidade refere-se à capacidade de desfazer uma transação — cartões têm chargeback, PIX tem MED, transferências bancárias são geralmente irreversíveis." },
    ],
  },
  {
    pageRoute: "/explore/transaction-flows",
    questions: [
      { id: "tf-1", question: "Em um pagamento com cartão, quem autoriza a transação?", options: ["O adquirente", "A bandeira", "O emissor", "O gateway"], correctIndex: 2, explanation: "O emissor (banco do portador) é quem autoriza ou recusa a transação baseado no saldo, limites e regras de fraude." },
      { id: "tf-2", question: "O que acontece na etapa de 'clearing'?", options: ["Dinheiro é transferido", "Transações são reconciliadas entre partes", "Cartão é validado", "Fraude é detectada"], correctIndex: 1, explanation: "Clearing é o processo de reconciliação onde as transações são agrupadas e os valores líquidos são calculados antes da liquidação." },
    ],
  },
  {
    pageRoute: "/explore/ecosystem-map",
    questions: [
      { id: "em-1", question: "Qual é o papel de um PSP (Payment Service Provider)?", options: ["Emitir cartões", "Intermediar entre comerciante e adquirente", "Regular o mercado", "Liquidar transações"], correctIndex: 1, explanation: "PSPs como Stripe, Adyen e PagSeguro fazem a intermediação entre o comerciante e a infraestrutura de pagamentos, simplificando a integração." },
      { id: "em-2", question: "O que diferencia um adquirente de um sub-adquirente?", options: ["O volume de transações", "O adquirente tem conexão direta com as bandeiras", "O sub-adquirente é mais barato", "Não há diferença"], correctIndex: 1, explanation: "O adquirente tem conexão direta com as bandeiras (Visa, Mastercard). O sub-adquirente usa o adquirente como intermediário, facilitando a entrada de pequenos comerciantes." },
    ],
  },
  {
    pageRoute: "/explore/financial-system",
    questions: [
      { id: "fs-1", question: "O que é um sistema RTGS?", options: ["Sistema de cartões", "Sistema de liquidação bruta em tempo real", "Rede de criptomoedas", "Protocolo de autenticação"], correctIndex: 1, explanation: "RTGS (Real-Time Gross Settlement) liquida transações individualmente em tempo real, usado para transferências de alto valor entre bancos." },
      { id: "fs-2", question: "Qual a função de uma câmara de compensação (clearing house)?", options: ["Emitir moeda", "Ser contraparte central e reduzir risco", "Processar cartões", "Regular fintechs"], correctIndex: 1, explanation: "Câmaras de compensação atuam como contraparte central (CCP), garantindo que ambas as partes cumpram suas obrigações e reduzindo risco sistêmico." },
    ],
  },
  {
    pageRoute: "/infrastructure/banking-systems",
    questions: [
      { id: "bs-1", question: "O que é o core banking system?", options: ["Sistema de internet banking", "Sistema central que processa operações bancárias", "Sistema de segurança", "Sistema de atendimento"], correctIndex: 1, explanation: "Core banking é o sistema central que gerencia contas, transações, saldos e operações fundamentais do banco, funcionando 24/7." },
      { id: "bs-2", question: "O que significa 'ledger' no contexto bancário?", options: ["Protocolo de rede", "Livro-razão de transações", "Tipo de conta", "Sistema de fraude"], correctIndex: 1, explanation: "Ledger é o livro-razão que registra todas as transações contábeis, mantendo o registro autoritativo de saldos e movimentações." },
    ],
  },
  {
    pageRoute: "/infrastructure/settlement-systems",
    questions: [
      { id: "ss-1", question: "Qual a diferença entre liquidação bruta e líquida?", options: ["Bruta é mais rápida", "Bruta liquida individualmente, líquida compensa antes", "Líquida é mais cara", "Não há diferença prática"], correctIndex: 1, explanation: "Liquidação bruta (RTGS) processa cada transação individualmente. Liquidação líquida (DNS) compensa as transações entre si primeiro, transferindo apenas o saldo líquido." },
    ],
  },
  {
    pageRoute: "/infrastructure/liquidity-treasury",
    questions: [
      { id: "lt-1", question: "O que é gestão de liquidez?", options: ["Investir em ações", "Garantir que há fundos disponíveis para honrar obrigações", "Vender ativos rapidamente", "Calcular impostos"], correctIndex: 1, explanation: "Gestão de liquidez assegura que a instituição tenha fundos suficientes para honrar pagamentos e obrigações no momento certo, equilibrando rentabilidade e disponibilidade." },
    ],
  },
  {
    pageRoute: "/crypto/blockchain-map",
    questions: [
      { id: "bm-1", question: "O que é um mecanismo de consenso?", options: ["Acordo entre reguladores", "Método para validar transações na blockchain", "Tipo de criptografia", "Protocolo de comunicação"], correctIndex: 1, explanation: "Mecanismo de consenso (PoW, PoS, etc.) é como os nós da rede concordam sobre quais transações são válidas, sem uma autoridade central." },
      { id: "bm-2", question: "Qual a diferença entre Layer 1 e Layer 2?", options: ["L1 é mais rápido", "L1 é a blockchain base, L2 são soluções de escalabilidade sobre ela", "L2 é mais seguro", "São a mesma coisa"], correctIndex: 1, explanation: "Layer 1 é a blockchain principal (Bitcoin, Ethereum). Layer 2 são protocolos construídos sobre L1 para aumentar velocidade e reduzir custos (Lightning Network, Arbitrum)." },
    ],
  },
  {
    pageRoute: "/crypto/stablecoin-systems",
    questions: [
      { id: "sc-1", question: "O que garante o valor de uma stablecoin lastreada em fiat?", options: ["Algoritmos matemáticos", "Reservas em moeda fiduciária mantidas pelo emissor", "Mineração", "Contratos inteligentes"], correctIndex: 1, explanation: "Stablecoins lastreadas em fiat (USDT, USDC) mantêm reservas equivalentes em dólares, títulos do tesouro ou equivalentes de caixa para garantir a paridade 1:1." },
    ],
  },
  {
    pageRoute: "/crypto/defi-protocols",
    questions: [
      { id: "dp-1", question: "O que é um AMM (Automated Market Maker)?", options: ["Um robô de trading", "Protocolo que usa pools de liquidez em vez de order books", "Uma exchange centralizada", "Um tipo de stablecoin"], correctIndex: 1, explanation: "AMMs como Uniswap usam pools de liquidez e fórmulas matemáticas (x*y=k) para precificar ativos, permitindo trocas sem order book tradicional." },
    ],
  },
  {
    pageRoute: "/knowledge/features",
    questions: [
      { id: "kf-1", question: "O que é tokenização de rede (network tokenization)?", options: ["Criar criptomoedas", "Substituir dados do cartão por tokens seguros", "Autenticar usuários", "Comprimir dados de rede"], correctIndex: 1, explanation: "Network tokenization substitui o PAN (número do cartão) por um token único, reduzindo o risco de fraude e simplificando compliance PCI-DSS." },
    ],
  },
  {
    pageRoute: "/knowledge/business-rules",
    questions: [
      { id: "br-1", question: "Por que existem limites de valor por transação?", options: ["Para aumentar receita", "Para mitigar risco de fraude e lavagem", "Para reduzir custos de rede", "Por limitação técnica"], correctIndex: 1, explanation: "Limites de valor são controles de risco que ajudam a prevenir fraude, lavagem de dinheiro e uso não autorizado de instrumentos de pagamento." },
    ],
  },
  {
    pageRoute: "/fraud/fraud-map",
    questions: [
      { id: "fm-1", question: "Qual a primeira linha de defesa contra fraude em pagamentos?", options: ["Revisão manual", "Regras de velocidade e triagem pré-autorização", "Chargeback", "Bloqueio de cartão"], correctIndex: 1, explanation: "A triagem pré-autorização com regras de velocidade, device fingerprinting e análise de comportamento é a primeira barreira antes mesmo da transação ser enviada ao emissor." },
      { id: "fm-2", question: "O que é 'friendly fraud'?", options: ["Fraude entre amigos", "Titular legítimo disputa compra que fez", "Fraude com desconto", "Phishing social"], correctIndex: 1, explanation: "Friendly fraud ocorre quando o próprio titular do cartão faz a compra mas depois abre uma disputa alegando não reconhecer, representando uma parcela significativa dos chargebacks." },
    ],
  },
  {
    pageRoute: "/fraud/fraud-signals",
    questions: [
      { id: "fsg-1", question: "O que é device fingerprinting?", options: ["Impressão digital biométrica", "Identificação única do dispositivo baseada em seus atributos", "Senha do aparelho", "Certificado digital"], correctIndex: 1, explanation: "Device fingerprinting cria um identificador único combinando atributos do dispositivo (browser, OS, resolução, plugins) para detectar dispositivos associados a fraude." },
    ],
  },
  {
    pageRoute: "/fraud/chargeback-lifecycle",
    questions: [
      { id: "cl-1", question: "Qual o prazo típico que o portador tem para abrir um chargeback?", options: ["7 dias", "30 dias", "120 dias", "1 ano"], correctIndex: 2, explanation: "A maioria das bandeiras permite ao portador abrir um chargeback em até 120 dias após a transação, embora prazos variem por tipo de disputa e bandeira." },
      { id: "cl-2", question: "O que é representment no ciclo de chargeback?", options: ["Segunda cobrança", "Resposta do comerciante à disputa com evidências", "Reembolso automático", "Cancelamento do cartão"], correctIndex: 1, explanation: "Representment é quando o comerciante contesta o chargeback enviando evidências (comprovante de entrega, logs, etc.) para reverter a decisão em seu favor." },
    ],
  },
  {
    pageRoute: "/diagnostics/metrics-tree",
    questions: [
      { id: "mt-1", question: "Qual métrica indica a saúde geral do funil de pagamentos?", options: ["Taxa de fraude", "Taxa de autorização", "Tempo de liquidação", "Custo por transação"], correctIndex: 1, explanation: "A taxa de autorização (aprovação) é a métrica raiz — indica que percentual das tentativas de pagamento são aprovadas pelo emissor, sendo o indicador mais direto da saúde do funil." },
    ],
  },
  {
    pageRoute: "/observability/payments-dashboard",
    questions: [
      { id: "pd-1", question: "Por que monitorar a taxa de aprovação por BIN é importante?", options: ["Para design do dashboard", "Para identificar problemas específicos por emissor", "Para calcular impostos", "Para marketing"], correctIndex: 1, explanation: "Monitorar por BIN permite identificar quando um emissor específico está recusando mais transações que o normal, possibilitando ação direcionada como contato com o emissor ou ajuste de routing." },
    ],
  },
];

export function getQuizForPage(route: string): PageQuiz | null {
  return QUIZZES.find((q) => q.pageRoute === route) || null;
}
