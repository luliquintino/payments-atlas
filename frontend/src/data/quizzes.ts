export type QuestionType = "multiple-choice" | "true-false" | "ordering" | "scenario";
export type Difficulty = "easy" | "medium" | "hard";

export type QuizCategory =
  | "fundamentos"      // Basics: layers, actors, flows
  | "autorizacao"      // Authorization, 3DS, fraud scoring
  | "liquidacao"       // Settlement, clearing, reconciliation
  | "fraude"           // Fraud, chargebacks, disputes
  | "infraestrutura"   // Banking systems, ISO 8583, networks
  | "produto"          // Product strategy, metrics, optimization
  | "crypto"           // Blockchain, stablecoins, DeFi
  | "regulacao";       // PCI, compliance, brand rules

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: string[];
  correctIndex: number;
  correctOrder?: number[];
  explanation: string;
  wrongExplanations?: Record<number, string>;
  scenario?: string;
  category?: QuizCategory;
}

export interface PageQuiz {
  pageRoute: string;
  questions: QuizQuestion[];
}

export const QUIZZES: PageQuiz[] = [
  // ────────────────────────────────────────────────────────────────
  // payments-map (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/explore/payments-map",
    questions: [
      {
        id: "pm-1",
        question: "Qual camada do stack de pagamentos lida diretamente com o cliente?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Processamento", "Experiencia", "Rede", "Liquidacao"],
        correctIndex: 1,
        explanation: "A camada de Experiencia inclui checkout UI, selecao de metodo de pagamento e SDKs mobile — tudo que o cliente ve e interage.",
        category: "fundamentos",
      },
      {
        id: "pm-2",
        question: "A camada de Settlement (Liquidacao) e responsavel por liquidar fundos entre as partes.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. A camada de Settlement realiza a transferencia definitiva de fundos entre adquirente, bandeira e emissor apos o clearing.",
        wrongExplanations: { 1: "Settlement e de fato a camada que transfere os fundos. Sem ela, a transacao seria apenas autorizada mas o dinheiro nunca mudaria de maos." },
        category: "fundamentos",
      },
      {
        id: "pm-3",
        question: "Ordene o fluxo de uma transacao de cartao, do inicio ao fim.",
        type: "ordering",
        difficulty: "medium",
        options: [
          "Cliente insere dados no checkout",
          "Gateway envia ao adquirente",
          "Adquirente roteia pela bandeira",
          "Emissor autoriza ou recusa",
          "Clearing reconcilia transacoes",
          "Settlement liquida fundos",
        ],
        correctIndex: -1,
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: "O fluxo segue: Experiencia (checkout) -> Gateway -> Adquirente -> Bandeira -> Emissor -> Clearing -> Settlement. Cada camada tem responsabilidade especifica.",
        category: "fundamentos",
      },
      {
        id: "pm-4",
        question: "Qual estrategia traria maior impacto imediato?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um PSP brasileiro esta expandindo para o Mexico e enfrenta taxa de autorizacao de 68% em transacoes cross-border com cartoes internacionais. O adquirente local reporta que a maioria das recusas sao soft declines do emissor.",
        options: [
          "Trocar para um adquirente local no Mexico",
          "Implementar retry inteligente com cascade entre adquirentes locais",
          "Adicionar Pix como metodo de pagamento no Mexico",
          "Aumentar o timeout da transacao para 60 segundos",
        ],
        correctIndex: 1,
        explanation: "Soft declines indicam que o emissor nao recusou definitivamente. Retry com cascade entre adquirentes locais permite reenviar por diferentes rotas, aumentando significativamente a taxa de aprovacao.",
        wrongExplanations: {
          0: "Trocar de adquirente nao resolve soft declines — o problema esta na comunicacao com o emissor, nao no adquirente em si.",
          2: "Pix e um sistema brasileiro. No Mexico, o equivalente seria SPEI/CoDi, mas isso nao resolve o problema de cartoes internacionais.",
          3: "Aumentar timeout nao ajuda em soft declines. O emissor ja respondeu — a resposta foi uma recusa reversivel, nao um timeout.",
        },
        category: "fundamentos",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // payment-rails (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/explore/payment-rails",
    questions: [
      {
        id: "pr-1",
        question: "Qual rail de pagamento tem liquidacao instantanea no Brasil?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Cartao de credito", "Pix", "Boleto bancario", "TED"],
        correctIndex: 1,
        explanation: "Pix e o sistema de pagamento instantaneo do Banco Central do Brasil, com liquidacao em segundos, 24/7, incluindo feriados.",
        category: "fundamentos",
      },
      {
        id: "pr-2",
        question: "Qual a principal vantagem do Pix sobre o boleto para o merchant?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Custo menor por transacao",
          "Liquidacao em tempo real e confirmacao imediata",
          "Nao exige conta bancaria do comprador",
          "Aceita pagamentos internacionais",
        ],
        correctIndex: 1,
        explanation: "A liquidacao em tempo real do Pix elimina o risco de inadimplencia do boleto (onde o cliente pode nao pagar) e permite confirmacao instantanea do pedido.",
        wrongExplanations: {
          0: "Embora o Pix geralmente seja mais barato, o principal diferencial para o merchant e a certeza e velocidade da liquidacao, nao apenas o custo.",
          2: "Tanto Pix quanto boleto exigem vinculacao a uma conta ou chave. Boleto pode ser pago em loteria sem conta, mas isso e do lado do pagador.",
          3: "Pix ainda nao opera internacionalmente. O Banco Central esta trabalhando em interoperabilidade, mas nao e uma vantagem atual.",
        },
        category: "fundamentos",
      },
      {
        id: "pr-3",
        question: "Boleto bancario e um metodo de pagamento irreversivel apos a compensacao.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. Diferente de cartoes (que tem chargeback), boleto pago e compensado nao pode ser estornado unilateralmente pelo pagador. Devolucoes exigem acordo entre as partes.",
        wrongExplanations: { 1: "Boleto compensado nao tem mecanismo de chargeback. O pagador nao pode reverter unilateralmente — diferente de cartoes de credito." },
        category: "fundamentos",
      },
      {
        id: "pr-4",
        question: "Qual combinacao de acoes otimizaria melhor o mix de pagamentos?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um e-commerce brasileiro processa 60% cartao, 30% Pix e 10% boleto. O boleto tem taxa de inadimplencia de 40% (boletos gerados mas nao pagos) e o custo de processamento de cartao e 3.2%. A margem liquida do negocio e 8%.",
        options: [
          "Eliminar boleto completamente e migrar tudo para cartao",
          "Oferecer desconto de 5% para Pix e reduzir prazo de vencimento do boleto para 24h",
          "Implementar parcelamento via Pix para substituir cartao de credito",
          "Aumentar o preco dos produtos em 3% para compensar custos",
        ],
        correctIndex: 1,
        explanation: "Desconto no Pix incentiva migracao do cartao (reduzindo custo de 3.2%) e prazo curto no boleto reduz inadimplencia. A combinacao melhora fluxo de caixa e margem sem perder conversao.",
        wrongExplanations: {
          0: "Eliminar boleto excluiria clientes sem conta bancaria ou cartao, reduzindo a base de clientes potenciais.",
          2: "Parcelamento via Pix ainda tem adocao limitada e nao resolve o problema de inadimplencia do boleto.",
          3: "Aumentar precos em 3% com margem de 8% pode prejudicar competitividade e reduzir volume total de vendas.",
        },
        category: "fundamentos",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // transaction-flows (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/explore/transaction-flows",
    questions: [
      {
        id: "tf-1",
        question: "Em uma transacao de cartao, quem toma a decisao final de aprovar ou recusar?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["O adquirente", "A bandeira", "O emissor", "O gateway"],
        correctIndex: 2,
        explanation: "O emissor (banco do portador) e quem autoriza ou recusa a transacao baseado no saldo, limites e regras de fraude do titular.",
        category: "fundamentos",
      },
      {
        id: "tf-2",
        question: "O adquirente pode aprovar uma transacao sem consultar o emissor.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Verdadeiro em casos excepcionais. No STIP (Stand-In Processing), quando o emissor esta indisponivel, a bandeira ou o adquirente pode aprovar transacoes dentro de parametros pre-definidos.",
        wrongExplanations: { 1: "Embora raro, o STIP (Stand-In Processing) permite aprovacao sem resposta do emissor. A bandeira assume o risco dentro de limites pre-acordados." },
        category: "fundamentos",
      },
      {
        id: "tf-3",
        question: "Ordene as etapas do fluxo de autorizacao de um cartao.",
        type: "ordering",
        difficulty: "medium",
        options: [
          "Gateway recebe dados do cartao",
          "Adquirente formata mensagem ISO 8583",
          "Bandeira roteia para o emissor",
          "Emissor valida e responde",
        ],
        correctIndex: -1,
        correctOrder: [0, 1, 2, 3],
        explanation: "O fluxo de autorizacao passa por Gateway -> Adquirente (ISO 8583) -> Bandeira (routing) -> Emissor (decisao). Cada etapa adiciona informacoes e validacoes.",
        category: "fundamentos",
      },
      {
        id: "tf-4",
        question: "Qual acao deve ser priorizada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Seu sistema de pagamentos detecta que 15% das transacoes com um emissor especifico estao dando timeout (sem resposta em 30 segundos). As transacoes retentadas apos timeout tem 60% de chance de serem aprovadas pelo mesmo emissor.",
        options: [
          "Aumentar o timeout para 60 segundos",
          "Implementar retry automatico apos 5 segundos de timeout com o mesmo emissor",
          "Bloquear transacoes para esse emissor temporariamente",
          "Enviar retentativas por outro adquirente imediatamente",
        ],
        correctIndex: 1,
        explanation: "Com 60% de aprovacao na retentativa com o mesmo emissor, retry automatico e a melhor opcao. O emissor provavelmente tem lentidao temporaria, nao rejeicao. Retry rapido captura a aprovacao.",
        wrongExplanations: {
          0: "Aumentar timeout deixa o cliente esperando mais tempo, prejudicando UX e aumentando abandono de carrinho.",
          2: "Bloquear o emissor impediria TODOS os clientes desse banco de comprar — perda massiva de receita desnecessaria.",
          3: "Enviar por outro adquirente sem tentar o mesmo emissor ignora os 60% de aprovacao que o retry simples capturaria.",
        },
        category: "fundamentos",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // financial-system (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/explore/financial-system",
    questions: [
      {
        id: "fs-1",
        question: "O que e um sistema RTGS?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Sistema de cartoes pre-pagos", "Sistema de liquidacao bruta em tempo real", "Rede de criptomoedas", "Protocolo de autenticacao bancaria"],
        correctIndex: 1,
        explanation: "RTGS (Real-Time Gross Settlement) liquida transacoes individualmente em tempo real, usado para transferencias de alto valor entre bancos.",
        category: "fundamentos",
      },
      {
        id: "fs-2",
        question: "O Banco Central do Brasil opera diretamente o sistema Pix.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. O BCB e o operador do SPI (Sistema de Pagamentos Instantaneos), a infraestrutura que processa as transacoes Pix, diferente de outros paises onde instant payments sao operados por entidades privadas.",
        wrongExplanations: { 1: "O Pix e operado diretamente pelo Banco Central, via SPI. Isso e diferente de sistemas como SEPA Instant na Europa, operados por entidades privadas." },
        category: "fundamentos",
      },
      {
        id: "fs-3",
        question: "Qual a funcao de uma camara de compensacao (clearing house)?",
        type: "multiple-choice",
        difficulty: "medium",
        options: ["Emitir moeda", "Ser contraparte central e reduzir risco sistemico", "Processar pagamentos Pix", "Regular fintechs"],
        correctIndex: 1,
        explanation: "Camaras de compensacao atuam como contraparte central (CCP), garantindo que ambas as partes cumpram suas obrigacoes e reduzindo risco sistemico no mercado financeiro.",
        category: "fundamentos",
      },
      {
        id: "fs-4",
        question: "Qual mecanismo seria mais eficaz para resolver o problema?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma fintech brasileira com licenca de SCD (Sociedade de Credito Direto) quer oferecer transferencias entre seus clientes com liquidacao instantanea, mas nao tem acesso direto ao STR (Sistema de Transferencia de Reservas). Atualmente depende de um banco parceiro que cobra R$0,50 por transacao.",
        options: [
          "Solicitar acesso direto ao STR como participante indireto",
          "Usar Pix para transferencias entre clientes com liquidacao via SPI",
          "Criar um ledger interno para transferencias entre clientes e liquidar em lote com o banco parceiro",
          "Migrar para licenca de banco para ter acesso ao STR",
        ],
        correctIndex: 2,
        explanation: "Um ledger interno permite transferencias instantaneas entre clientes sem custo unitario, liquidando apenas o saldo liquido com o banco parceiro. Isso reduz custos drasticamente e melhora UX.",
        wrongExplanations: {
          0: "SCDs nao tem acesso direto ao STR. Apenas instituicoes financeiras com reservas no BCB participam diretamente.",
          1: "Pix funcionaria mas cada transacao teria custo e a fintech dependeria do SPI. Para transferencias internas, o ledger e mais eficiente.",
          3: "Migrar para banco e um processo de anos e exige capital regulatorio muito maior. Nao e proporcional ao problema.",
        },
        category: "fundamentos",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // ecosystem-map (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/explore/ecosystem-map",
    questions: [
      {
        id: "em-1",
        question: "Qual e o papel de um PSP (Payment Service Provider)?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Emitir cartoes", "Intermediar entre comerciante e infraestrutura de pagamentos", "Regular o mercado", "Liquidar transacoes"],
        correctIndex: 1,
        explanation: "PSPs como Stripe, Adyen e PagSeguro intermediam entre o comerciante e a infraestrutura de pagamentos, simplificando a integracao tecnica e regulatoria.",
        category: "fundamentos",
      },
      {
        id: "em-2",
        question: "Um sub-adquirente tem conexao direta com as bandeiras de cartao.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O sub-adquirente usa o adquirente como intermediario para se conectar as bandeiras. Isso facilita a entrada de pequenos comerciantes mas adiciona uma camada de intermediacao.",
        wrongExplanations: { 0: "Sub-adquirentes (facilitadores) nao tem conexao direta com Visa/Mastercard. Eles operam sob o registro de um adquirente certificado." },
        category: "fundamentos",
      },
      {
        id: "em-3",
        question: "O que diferencia um emissor de um adquirente?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "O emissor processa pagamentos, o adquirente emite cartoes",
          "O emissor fornece cartoes ao consumidor, o adquirente processa pagamentos do comerciante",
          "Sao a mesma entidade com nomes diferentes",
          "O emissor opera apenas online, o adquirente apenas fisico",
        ],
        correctIndex: 1,
        explanation: "O emissor (ex: Itau, Nubank) fornece o cartao ao consumidor. O adquirente (ex: Cielo, Rede) processa pagamentos para o comerciante. Sao lados opostos da transacao.",
        category: "fundamentos",
      },
      {
        id: "em-4",
        question: "Qual modelo e mais vantajoso para a empresa neste cenario?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma marketplace brasileira com GMV de R$50M/mes esta pagando 3.8% de MDR usando um sub-adquirente. O volume justifica negociacao direta, mas a empresa nao quer gerenciar compliance PCI-DSS e split de pagamentos entre sellers.",
        options: [
          "Manter o sub-adquirente e negociar taxa menor",
          "Integrar diretamente com um adquirente e obter certificacao PCI-DSS",
          "Usar um PSP com modelo de orquestracao que gerencia PCI e split, conectando a multiplos adquirentes",
          "Criar infraestrutura propria de pagamentos",
        ],
        correctIndex: 2,
        explanation: "Um PSP orquestrador gerencia compliance PCI, split de pagamentos e conecta a multiplos adquirentes para melhor taxa. A marketplace ganha eficiencia sem a complexidade de certificacao propria.",
        wrongExplanations: {
          0: "Com R$50M/mes, a empresa tem poder de negociacao, mas o sub-adquirente sempre tera margem propria que infla o custo total.",
          1: "Certificacao PCI-DSS e cara e complexa. O objetivo e reduzir custo sem assumir essa responsabilidade.",
          3: "Criar infraestrutura propria exige licencas regulatorias, investimento de anos e equipe especializada — desproporcional ao problema.",
        },
        category: "fundamentos",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // banking-systems (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/infrastructure/banking-systems",
    questions: [
      {
        id: "bs-1",
        question: "O que e o core banking system?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Sistema de internet banking", "Sistema central que processa operacoes bancarias", "Sistema de seguranca", "Sistema de atendimento ao cliente"],
        correctIndex: 1,
        explanation: "Core banking e o sistema central que gerencia contas, transacoes, saldos e operacoes fundamentais do banco, funcionando 24/7.",
        category: "infraestrutura",
      },
      {
        id: "bs-2",
        question: "O ledger bancario registra apenas transacoes de credito.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O ledger (livro-razao) registra TODAS as transacoes contabeis — debitos e creditos. Cada lancamento tem uma contrapartida seguindo o principio de partidas dobradas.",
        wrongExplanations: { 0: "O ledger usa partidas dobradas: todo debito tem um credito correspondente. Ele registra todas as movimentacoes financeiras sem excecao." },
        category: "infraestrutura",
      },
      {
        id: "bs-3",
        question: "Ordene a evolucao tipica da infraestrutura de um banco digital.",
        type: "ordering",
        difficulty: "medium",
        options: [
          "BaaS (Banking as a Service) de terceiro",
          "Core banking proprio com ledger basico",
          "Multi-ledger com reconciliacao automatizada",
          "Plataforma completa com orquestracao de pagamentos",
        ],
        correctIndex: -1,
        correctOrder: [0, 1, 2, 3],
        explanation: "Bancos digitais tipicamente comecam com BaaS, migram para core proprio quando o volume justifica, evoluem para multi-ledger e depois para uma plataforma completa com orquestracao.",
        category: "infraestrutura",
      },
      {
        id: "bs-4",
        question: "Qual abordagem resolve melhor o problema?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um banco digital brasileiro detecta divergencias de saldo de R$2.3M em reconciliacao mensal. A investigacao mostra que transacoes Pix processadas entre 23h e 1h nao sao registradas no ledger devido a uma janela de manutencao do core banking legado.",
        options: [
          "Eliminar a janela de manutencao do core banking",
          "Implementar um ledger de transito (staging ledger) que acumula transacoes durante a janela e reconcilia ao retorno",
          "Pausar transacoes Pix durante a janela de manutencao",
          "Migrar todo o core banking para cloud imediatamente",
        ],
        correctIndex: 1,
        explanation: "Um staging ledger captura transacoes durante a indisponibilidade e sincroniza com o core apos o retorno. Solucao pragmatica que nao interrompe servicos nem exige migracao imediata.",
        wrongExplanations: {
          0: "Eliminar janela de manutencao em sistema legado pode causar instabilidade. Core banking legado frequentemente precisa de janelas para batch processing.",
          2: "Pausar Pix violaria regulacao do BCB que exige disponibilidade 24/7 e prejudicaria severamente a reputacao do banco.",
          3: "Migracao de core banking leva 18-36 meses. O problema de reconciliacao precisa de solucao imediata.",
        },
        category: "infraestrutura",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // settlement-systems (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/infrastructure/settlement-systems",
    questions: [
      {
        id: "ss-1",
        question: "Qual a diferenca entre liquidacao bruta e liquida?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Bruta e mais rapida que liquida",
          "Bruta liquida individualmente, liquida compensa antes de transferir",
          "Liquida e mais cara que bruta",
          "Nao ha diferenca pratica",
        ],
        correctIndex: 1,
        explanation: "Liquidacao bruta (RTGS) processa cada transacao individualmente. Liquidacao liquida (DNS) compensa as transacoes entre si primeiro, transferindo apenas o saldo liquido.",
        category: "liquidacao",
      },
      {
        id: "ss-2",
        question: "No Brasil, o Pix usa liquidacao bruta em tempo real (RTGS).",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. O SPI (Sistema de Pagamentos Instantaneos) usa liquidacao bruta em tempo real para cada transacao Pix, diferente de sistemas como boleto que usam compensacao liquida em lotes.",
        wrongExplanations: { 1: "O Pix de fato usa RTGS. Cada transacao e liquidada individualmente em tempo real pelo SPI, garantindo finalidade imediata." },
        category: "liquidacao",
      },
      {
        id: "ss-3",
        question: "O que e netting bilateral?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Compensacao entre dois participantes antes da liquidacao",
          "Liquidacao em duas moedas diferentes",
          "Transferencia entre duas contas do mesmo banco",
          "Backup de liquidacao em dois sistemas",
        ],
        correctIndex: 0,
        explanation: "Netting bilateral compensa obrigacoes entre duas partes: se A deve R$100 a B e B deve R$70 a A, apenas R$30 sao transferidos. Reduz volume de liquidacao e risco.",
        category: "liquidacao",
      },
      {
        id: "ss-4",
        question: "Qual estrategia de liquidacao e mais adequada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um adquirente brasileiro processa 500 mil transacoes/dia entre 200 merchants. Atualmente liquida cada transacao individualmente via TED, gerando custo de R$1.2M/mes em tarifas bancarias. 80% dos merchants recebem mais de uma transacao por dia.",
        options: [
          "Migrar toda liquidacao para Pix",
          "Implementar netting por merchant com liquidacao em lote diario via arquivo CNAB",
          "Reduzir a frequencia de liquidacao para semanal",
          "Negociar tarifa menor de TED com o banco",
        ],
        correctIndex: 1,
        explanation: "Netting por merchant consolida multiplas transacoes em um unico pagamento diario, reduzindo drasticamente o numero de transferencias. Arquivo CNAB automatiza o processo com os bancos.",
        wrongExplanations: {
          0: "Pix ainda tem custo por transacao para PJ e nao resolve o problema de volume — continuaria com 500 mil operacoes.",
          2: "Liquidacao semanal prejudicaria o fluxo de caixa dos merchants e poderia violar regulacao que exige D+1 ou D+2.",
          3: "Negociar tarifa e valido mas o problema fundamental e o volume de 500 mil TEDs individuais. Mesmo com desconto, o custo seria alto.",
        },
        category: "liquidacao",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // liquidity-treasury (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/infrastructure/liquidity-treasury",
    questions: [
      {
        id: "lt-1",
        question: "O que e gestao de liquidez?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Investir em acoes de alta liquidez",
          "Garantir fundos disponiveis para honrar obrigacoes no momento certo",
          "Vender ativos rapidamente no mercado",
          "Calcular impostos sobre transacoes",
        ],
        correctIndex: 1,
        explanation: "Gestao de liquidez assegura que a instituicao tenha fundos suficientes para honrar pagamentos e obrigacoes, equilibrando rentabilidade e disponibilidade.",
        category: "liquidacao",
      },
      {
        id: "lt-2",
        question: "Uma fintech de pagamentos nao precisa se preocupar com gestao de liquidez porque nao e um banco.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. Qualquer entidade que processa pagamentos precisa de gestao de liquidez. Uma fintech precisa garantir fundos para liquidar merchants, processar estornos e manter reservas regulatorias.",
        wrongExplanations: { 0: "Fintechs de pagamento tem obrigacoes de liquidacao com merchants e devem manter reservas. A falta de liquidez pode causar atrasos de pagamento e penalidades regulatorias." },
        category: "liquidacao",
      },
      {
        id: "lt-3",
        question: "O que e float em tesouraria de pagamentos?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Taxa de cambio flutuante",
          "Fundos em transito entre recebimento e liquidacao ao merchant",
          "Tipo de investimento de risco",
          "Margem de seguranca em reservas",
        ],
        correctIndex: 1,
        explanation: "Float e o dinheiro em transito — ja cobrado do consumidor mas ainda nao liquidado ao merchant. E uma fonte de receita para adquirentes/PSPs que podem investir esse capital temporariamente.",
        category: "liquidacao",
      },
      {
        id: "lt-4",
        question: "Qual estrategia de tesouraria e mais adequada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um PSP brasileiro tem R$80M em float medio diario. Atualmente o recurso fica em conta corrente sem remuneracao. O prazo medio de liquidacao para merchants e D+2. A taxa Selic esta em 13.75% a.a. e a regulacao exige que fundos de pagamento fiquem em conta especifica.",
        options: [
          "Investir 100% do float em titulos publicos de longo prazo",
          "Aplicar em CDB de liquidez diaria com lastro em titulo publico, respeitando limites regulatorios",
          "Manter tudo em conta corrente para seguranca",
          "Reduzir prazo de liquidacao para D+0 para eliminar o float",
        ],
        correctIndex: 1,
        explanation: "CDB com liquidez diaria permite remuneracao do float sem comprometer a disponibilidade para liquidacao. Com R$80M e Selic a 13.75%, a receita potencial e significativa.",
        wrongExplanations: {
          0: "Titulos de longo prazo imobilizariam recursos necessarios para liquidacao diaria. Risco de nao ter liquidez para pagar merchants.",
          2: "Manter R$80M sem remuneracao com Selic a 13.75% representa perda de ~R$11M/ano em custo de oportunidade.",
          3: "Eliminar float reduz receita de tesouraria e nem sempre e possivel operacionalmente. O float e um ativo valioso quando bem gerido.",
        },
        category: "liquidacao",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // blockchain-map (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/crypto/blockchain-map",
    questions: [
      {
        id: "bm-1",
        question: "O que e um mecanismo de consenso?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Acordo entre reguladores", "Metodo para validar transacoes na blockchain sem autoridade central", "Tipo de criptografia", "Protocolo de comunicacao entre wallets"],
        correctIndex: 1,
        explanation: "Mecanismo de consenso (PoW, PoS, etc.) e como os nos da rede concordam sobre quais transacoes sao validas, sem uma autoridade central.",
        category: "crypto",
      },
      {
        id: "bm-2",
        question: "Layer 2 e mais segura que Layer 1 porque processa transacoes fora da chain principal.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. Layer 2 herda seguranca da Layer 1, mas adiciona premissas de confianca adicionais. A L1 e a base de seguranca; L2 otimiza velocidade e custo com trade-offs de seguranca.",
        wrongExplanations: { 0: "Layer 2 sacrifica algum grau de seguranca/descentralizacao em troca de escalabilidade. A seguranca da L2 depende e e derivada da L1." },
        category: "crypto",
      },
      {
        id: "bm-3",
        question: "Qual a diferenca entre Layer 1 e Layer 2?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "L1 e mais rapido que L2",
          "L1 e a blockchain base, L2 sao solucoes de escalabilidade sobre ela",
          "L2 e mais seguro que L1",
          "Sao a mesma coisa com nomes diferentes",
        ],
        correctIndex: 1,
        explanation: "Layer 1 e a blockchain principal (Bitcoin, Ethereum). Layer 2 sao protocolos construidos sobre L1 para aumentar velocidade e reduzir custos (Lightning Network, Arbitrum).",
        category: "crypto",
      },
      {
        id: "bm-4",
        question: "Qual arquitetura melhor atende os requisitos?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma empresa brasileira de supply chain finance quer tokenizar duplicatas mercantis na blockchain. Requisitos: transacoes privadas entre as partes, custo por transacao abaixo de US$0.01, integracao com sistemas bancarios existentes e conformidade com regulacao CVM.",
        options: [
          "Ethereum mainnet com smart contracts publicos",
          "Bitcoin com Lightning Network",
          "Blockchain permissionada (ex: Hyperledger) com bridge para rede publica",
          "Polygon PoS com contratos abertos",
        ],
        correctIndex: 2,
        explanation: "Blockchain permissionada atende privacidade e custo baixo. Bridge para rede publica permite transparencia quando necessario. Hyperledger e amplamente usado em supply chain finance por bancos.",
        wrongExplanations: {
          0: "Ethereum mainnet tem custo de gas alto e transacoes publicas — nao atende privacidade nem custo abaixo de $0.01.",
          1: "Bitcoin/Lightning nao suporta smart contracts complexos necessarios para tokenizacao de duplicatas.",
          3: "Polygon e mais barato que Ethereum mas transacoes sao publicas, nao atendendo requisito de privacidade entre partes.",
        },
        category: "crypto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // stablecoin-systems (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/crypto/stablecoin-systems",
    questions: [
      {
        id: "sc-1",
        question: "O que garante o valor de uma stablecoin lastreada em fiat?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Algoritmos matematicos", "Reservas em moeda fiduciaria mantidas pelo emissor", "Mineracao de criptomoedas", "Contratos inteligentes auto-ajustaveis"],
        correctIndex: 1,
        explanation: "Stablecoins lastreadas em fiat (USDT, USDC) mantem reservas equivalentes em dolares, titulos do tesouro ou equivalentes de caixa para garantir a paridade 1:1.",
        category: "crypto",
      },
      {
        id: "sc-2",
        question: "Uma stablecoin algoritmica nao precisa de reservas para manter sua paridade.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto em teoria. Stablecoins algoritmicas usam mecanismos de mint/burn e incentivos economicos para manter paridade, sem reservas diretas. Porem, como demonstrou o colapso do UST/Luna, esse modelo tem riscos significativos.",
        wrongExplanations: { 1: "Por design, stablecoins algoritmicas nao mantem reservas diretas. Usam mecanismos de oferta/demanda, embora esse modelo tenha falhado em casos como UST." },
        category: "crypto",
      },
      {
        id: "sc-3",
        question: "Qual o principal risco de uma stablecoin com reservas em titulos de longo prazo?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Risco de hacking da blockchain",
          "Descasamento de liquidez entre resgates imediatos e ativos de longo prazo",
          "Risco de inflacao da moeda de lastro",
          "Risco de a blockchain parar de funcionar",
        ],
        correctIndex: 1,
        explanation: "Se muitos holders resgatarem ao mesmo tempo, a stablecoin pode nao ter liquidez imediata se as reservas estao em titulos de longo prazo — similar a uma corrida bancaria.",
        category: "crypto",
      },
      {
        id: "sc-4",
        question: "Qual modelo de stablecoin seria mais adequado?",
        type: "scenario",
        difficulty: "hard",
        scenario: "O Banco Central do Brasil esta avaliando como uma stablecoin lastreada em BRL poderia operar no Drex (Real Digital). Os requisitos sao: rastreabilidade total, conformidade com regulacao cambial, interoperabilidade com o sistema bancario e capacidade de congelamento judicial.",
        options: [
          "Stablecoin descentralizada tipo DAI com governanca da comunidade",
          "Stablecoin emitida por instituicao regulada com smart contract permissionado e funcoes administrativas",
          "Stablecoin algoritmica sem reservas para reduzir custo",
          "USDC adaptado para BRL mantendo a infraestrutura da Circle",
        ],
        correctIndex: 1,
        explanation: "O Drex requer controle regulatorio: rastreabilidade, congelamento judicial e conformidade. Smart contract permissionado com funcoes admin atende todos os requisitos mantendo a programabilidade.",
        wrongExplanations: {
          0: "Modelo descentralizado nao permite congelamento judicial nem rastreabilidade plena exigidos pelo regulador brasileiro.",
          2: "Algoritmica sem reservas e incompativel com os requisitos de seguranca e estabilidade de um banco central.",
          3: "USDC e denominado em dolar e infraestrutura americana. Para BRL seria necessario emissor brasileiro regulado pelo BCB.",
        },
        category: "crypto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // defi-protocols (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/crypto/defi-protocols",
    questions: [
      {
        id: "dp-1",
        question: "O que e um AMM (Automated Market Maker)?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Um robo de trading automatizado", "Protocolo que usa pools de liquidez em vez de order books", "Uma exchange centralizada automatizada", "Um tipo de stablecoin"],
        correctIndex: 1,
        explanation: "AMMs como Uniswap usam pools de liquidez e formulas matematicas (x*y=k) para precificar ativos, permitindo trocas sem order book tradicional.",
        category: "crypto",
      },
      {
        id: "dp-2",
        question: "Em DeFi, impermanent loss ocorre quando um provedor de liquidez perde dinheiro comparado a simplesmente manter os ativos.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. Impermanent loss acontece quando o preco dos ativos no pool muda em relacao ao momento do deposito. Quanto maior a divergencia de preco, maior a perda comparada ao hold.",
        wrongExplanations: { 1: "Impermanent loss e real e mensuravel. Se voce deposita ETH+USDC em um pool e o preco do ETH sobe 100%, voce teria mais valor fazendo hold do que no pool." },
        category: "crypto",
      },
      {
        id: "dp-3",
        question: "O que e um flash loan?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Emprestimo rapido entre amigos",
          "Emprestimo sem colateral que deve ser pago na mesma transacao",
          "Emprestimo com taxa de juros muito baixa",
          "Emprestimo garantido por NFTs",
        ],
        correctIndex: 1,
        explanation: "Flash loans permitem pegar emprestimo sem colateral desde que o valor seja devolvido na mesma transacao blockchain. Usados para arbitragem, liquidacoes e reestruturacao de posicoes.",
        category: "crypto",
      },
      {
        id: "dp-4",
        question: "Qual protocolo DeFi melhor atende a necessidade?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma empresa brasileira de comercio exterior quer reduzir custo de remessa internacional de USD para BRL. Atualmente paga 2.5% de spread cambial via banco. O volume mensal e US$2M. A empresa tem equipe tecnica capaz de operar wallets e smart contracts.",
        options: [
          "Usar Uniswap para trocar USDC por token BRL",
          "Fazer bridge de USDC para rede Solana e usar Jupiter para swap",
          "Implementar rota USDC -> stablecoin BRL em DEX, com off-ramp via exchange regulada no Brasil",
          "Manter o banco e negociar spread menor",
        ],
        correctIndex: 2,
        explanation: "A rota USDC -> stablecoin BRL via DEX com off-ramp regulado combina custo baixo do DeFi com conformidade regulatoria brasileira. O off-ramp converte stablecoin em BRL via TED/Pix.",
        wrongExplanations: {
          0: "Uniswap na Ethereum tem gas alto e tokens BRL com pouca liquidez, gerando slippage excessivo para US$2M/mes.",
          1: "Jupiter/Solana tem taxas baixas mas o off-ramp para BRL ainda seria necessario e a liquidez de tokens BRL e limitada.",
          3: "Com US$2M/mes pagando 2.5% de spread, a economia potencial de ~US$30-40K/mes com DeFi justifica a implementacao.",
        },
        category: "crypto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // features (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/knowledge/features",
    questions: [
      {
        id: "kf-1",
        question: "O que e tokenizacao de rede (network tokenization)?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Criar criptomoedas", "Substituir o numero do cartao por um token seguro emitido pela bandeira", "Autenticar usuarios por biometria", "Comprimir dados de rede"],
        correctIndex: 1,
        explanation: "Network tokenization substitui o PAN (numero real do cartao) por um token unico emitido pela bandeira, reduzindo risco de fraude e simplificando compliance PCI-DSS.",
        category: "produto",
      },
      {
        id: "kf-2",
        question: "3D Secure 2.0 sempre exige que o portador insira uma senha ou codigo.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O 3DS 2.0 suporta autenticacao frictionless — o emissor pode aprovar silenciosamente baseado em dados de risco (device, historico, geolocalizacao) sem exigir interacao do portador.",
        wrongExplanations: { 0: "3DS 2.0 foi redesenhado para reduzir friccao. O emissor pode aprovar sem challenge se os dados de risco indicarem baixo risco. Isso melhora conversao." },
        category: "produto",
      },
      {
        id: "kf-3",
        question: "Qual a vantagem de Account Updater para pagamentos recorrentes?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Permite parcelamento automatico",
          "Atualiza automaticamente dados de cartoes expirados ou renovados",
          "Reduz o valor das taxas de processamento",
          "Elimina a necessidade de autenticacao",
        ],
        correctIndex: 1,
        explanation: "Account Updater recebe automaticamente novos dados (numero, validade) quando um cartao e renovado ou substituido, evitando recusas em cobranças recorrentes (assinaturas, mensalidades).",
        category: "produto",
      },
      {
        id: "kf-4",
        question: "Qual feature de pagamento deve ser priorizada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma plataforma de SaaS B2B brasileira com 15 mil assinantes tem taxa de involuntary churn de 8% ao mes — ou seja, assinaturas canceladas por falha no pagamento recorrente. Analise mostra que 60% das falhas sao cartoes expirados e 25% sao soft declines.",
        options: [
          "Implementar 3D Secure em todas as cobranças",
          "Account Updater para cartoes expirados + retry inteligente para soft declines",
          "Migrar todos os clientes para Pix recorrente",
          "Enviar email pedindo atualizacao do cartao 30 dias antes do vencimento",
        ],
        correctIndex: 1,
        explanation: "Account Updater resolve os 60% de cartoes expirados automaticamente. Retry inteligente com diferentes horarios/MIDs captura boa parte dos 25% de soft declines. Juntos atacam 85% do problema.",
        wrongExplanations: {
          0: "3DS em recorrente adiciona friccao e nao resolve cartao expirado. Pode ate aumentar churn se o challenge falhar.",
          2: "Pix recorrente ainda tem baixa adocao em B2B e exigiria migracao complexa de 15 mil assinantes.",
          3: "Email tem taxa de abertura de ~20-30%. Resolver 60% de churn com acao manual do cliente e ineficiente comparado a automacao.",
        },
        category: "produto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // business-rules (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/knowledge/business-rules",
    questions: [
      {
        id: "br-1",
        question: "Por que existem limites de valor por transacao?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Para aumentar receita do adquirente", "Para mitigar risco de fraude e lavagem de dinheiro", "Para reduzir custos de rede", "Por limitacao tecnica dos sistemas"],
        correctIndex: 1,
        explanation: "Limites de valor sao controles de risco que ajudam a prevenir fraude, lavagem de dinheiro e uso nao autorizado de instrumentos de pagamento.",
        category: "regulacao",
      },
      {
        id: "br-2",
        question: "O MDR (Merchant Discount Rate) e pago pelo consumidor final.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O MDR e pago pelo comerciante (merchant) ao adquirente. E descontado do valor da venda antes de ser repassado. O consumidor paga o preco cheio do produto.",
        wrongExplanations: { 0: "O MDR e descontado do valor recebido pelo merchant. Se a venda e R$100 e MDR e 3%, o merchant recebe R$97. O consumidor nao paga taxa adicional." },
        category: "regulacao",
      },
      {
        id: "br-3",
        question: "O que e interchange fee?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Taxa cobrada pelo gateway de pagamento",
          "Taxa paga pelo adquirente ao emissor em cada transacao de cartao",
          "Taxa de cambio entre moedas",
          "Taxa do Banco Central para transferencias",
        ],
        correctIndex: 1,
        explanation: "Interchange e a taxa que flui do adquirente para o emissor em cada transacao. No Brasil, o BCB regulou tetos de interchange para debito em 0.5% e para pre-pagos em 0.7%.",
        category: "regulacao",
      },
      {
        id: "br-4",
        question: "Qual estrutura de precificacao e mais adequada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um marketplace brasileiro quer implementar split de pagamento entre sellers. O GMV e R$30M/mes com ticket medio de R$150. Atualmente 70% e cartao credito parcelado (media 4x), 25% Pix e 5% boleto. O marketplace cobra 12% de comissao dos sellers.",
        options: [
          "MDR fixo de 4% para todos os metodos, descontando da comissao do seller",
          "MDR diferenciado por metodo + antecipacao de recebiveis automatica para sellers em parcelado",
          "Cobrar taxa fixa de R$1 por transacao independente do metodo",
          "Repassar 100% do custo de processamento ao comprador como taxa de conveniencia",
        ],
        correctIndex: 1,
        explanation: "MDR diferenciado reflete o custo real de cada metodo (Pix e mais barato que cartao). Antecipacao automatica em parcelado monetiza o float e oferece valor ao seller que recebe antes.",
        wrongExplanations: {
          0: "MDR fixo de 4% cobra demais no Pix (custo real ~0.5%) e pode nao cobrir cartao parcelado em 4x. Nao otimiza receita.",
          2: "Taxa fixa de R$1 em ticket de R$150 e apenas 0.67%, nao cobre o custo real de cartao credito que pode chegar a 4-5% em parcelado.",
          3: "Taxa de conveniencia ao comprador reduz conversao e pode violar regras das bandeiras que proibem surcharge em cartao de credito.",
        },
        category: "regulacao",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // fraud-map (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/fraud/fraud-map",
    questions: [
      {
        id: "fm-1",
        question: "Qual a primeira linha de defesa contra fraude em pagamentos?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Revisao manual de pedidos", "Regras de velocidade e triagem pre-autorizacao", "Chargeback", "Bloqueio de cartao pelo banco"],
        correctIndex: 1,
        explanation: "Regras de velocidade, device fingerprinting e analise comportamental formam a primeira barreira — antes da transacao ser enviada ao emissor.",
        category: "fraude",
      },
      {
        id: "fm-2",
        question: "Friendly fraud e quando o proprio titular do cartao disputa uma compra legitima que ele fez.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto. Friendly fraud ocorre quando o titular faz a compra mas depois abre chargeback alegando nao reconhecer. Representa parcela significativa dos chargebacks no e-commerce brasileiro.",
        wrongExplanations: { 1: "Friendly fraud e exatamente isso — fraude 'amigavel' onde o comprador real contesta sua propria compra. E diferente de fraude com cartao roubado." },
        category: "fraude",
      },
      {
        id: "fm-3",
        question: "O que e velocity check em prevencao de fraude?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Verificar a velocidade da internet do comprador",
          "Monitorar quantidade de transacoes por cartao/device/IP em janela de tempo",
          "Medir tempo de resposta do sistema antifraude",
          "Testar velocidade de processamento da transacao",
        ],
        correctIndex: 1,
        explanation: "Velocity check monitora padroes como numero de transacoes por cartao em 1 hora, tentativas por IP em 24h, etc. Padroes anormais indicam possivel ataque ou teste de cartao.",
        category: "fraude",
      },
      {
        id: "fm-4",
        question: "Qual estrategia antifraude e mais eficaz para este cenario?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um e-commerce de eletronicos brasileiro detecta aumento de 300% em chargebacks em 2 semanas. Analise mostra: 80% dos chargebacks sao de pedidos com entrega em SP capital, pagos com cartoes emitidos em outros estados, todos com 3DS aprovado, ticket medio de R$3.500.",
        options: [
          "Bloquear todas as vendas acima de R$3.000",
          "Exigir selfie com documento para pedidos de alto valor com endereco de entrega diferente do cadastro do cartao",
          "Implementar regra que recusa cartoes de fora do estado de entrega",
          "Desabilitar 3D Secure para reduzir aprovacoes fraudulentas",
        ],
        correctIndex: 1,
        explanation: "Selfie com documento para compras de alto valor com discrepancia geografica adiciona verificacao de identidade sem bloquear vendas legitimas. 3DS aprovado indica que os fraudadores tem acesso ao celular da vitima.",
        wrongExplanations: {
          0: "Bloquear vendas acima de R$3K eliminaria boa parte das vendas legitimas de eletronicos, onde ticket alto e normal.",
          2: "Recusar cartoes de outro estado bloquearia viajantes, presentes e compras corporativas — alto indice de falsos positivos.",
          3: "Desabilitar 3DS removeria uma camada de protecao e transferiria liability de volta ao merchant. O problema nao e o 3DS em si.",
        },
        category: "fraude",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // fraud-signals (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/fraud/fraud-signals",
    questions: [
      {
        id: "fsg-1",
        question: "O que e device fingerprinting?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Impressao digital biometrica do usuario", "Identificacao unica do dispositivo baseada em seus atributos tecnicos", "Senha do aparelho celular", "Certificado digital instalado"],
        correctIndex: 1,
        explanation: "Device fingerprinting cria um identificador unico combinando atributos do dispositivo (browser, OS, resolucao, plugins, timezone) para detectar dispositivos associados a fraude.",
        category: "fraude",
      },
      {
        id: "fsg-2",
        question: "Um endereco de IP e suficiente para identificar um fraudador de forma confiavel.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. IPs podem ser compartilhados (NAT, coworking, celular), mascarados por VPN/proxy, ou dinamicos. IP e um sinal util mas nunca suficiente sozinho — deve ser combinado com outros indicadores.",
        wrongExplanations: { 0: "IP e facilmente manipulavel com VPN e pode ser compartilhado por milhares de usuarios. Nenhum sinal isolado e suficiente para identificar fraude de forma confiavel." },
        category: "fraude",
      },
      {
        id: "fsg-3",
        question: "O que indica um sinal de BIN attack?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Um unico cartao fazendo muitas compras",
          "Multiplas tentativas com numeros de cartao sequenciais do mesmo BIN em pouco tempo",
          "Compra com cartao internacional",
          "Transacao de alto valor em loja nova",
        ],
        correctIndex: 1,
        explanation: "BIN attack e quando fraudadores testam numeros de cartao sequenciais (mesmo BIN/primeiros 6 digitos) em alta velocidade para encontrar numeros validos. Velocity check por BIN detecta isso.",
        category: "fraude",
      },
      {
        id: "fsg-4",
        question: "Qual conjunto de sinais indica maior risco neste contexto?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Seu sistema antifraude processa uma transacao com os seguintes sinais: device novo (primeira vez visto), email criado ha 2 dias, endereco de entrega em favela conhecida por drop shipping, cartao premium (Black/Infinite) com nome diferente do cadastro, horario 3h da manha, VPN detectada.",
        options: [
          "Apenas VPN e horario sao relevantes — o resto e circunstancial",
          "O device novo e o email recente sao os sinais mais criticos",
          "A combinacao de TODOS os sinais em conjunto indica alto risco — nenhum isolado e definitivo",
          "Cartao premium com nome diferente e o unico sinal verdadeiramente critico",
        ],
        correctIndex: 2,
        explanation: "Antifraude eficaz avalia a combinacao de sinais, nao sinais isolados. Cada sinal individualmente poderia ser inocente, mas a confluencia de device novo + email recente + VPN + endereco + nome divergente + horario atipico indica risco elevado.",
        wrongExplanations: {
          0: "VPN e horario sao sinais, mas ignorar os demais seria negligencia. Device novo + email recente sao fortemente correlacionados com fraude.",
          1: "Device novo e email recente sao importantes, mas a analise deve considerar TODOS os sinais em contexto. Omitir VPN e endereco de drop seria falha.",
          3: "Nome diferente pode ter explicacao inocente (presente, cartao corporativo). Nenhum sinal unico deve ser considerado definitivo sem contexto.",
        },
        category: "fraude",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // chargeback-lifecycle (4 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/fraud/chargeback-lifecycle",
    questions: [
      {
        id: "cl-1",
        question: "Qual o prazo tipico que o portador tem para abrir um chargeback?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["7 dias", "30 dias", "120 dias", "1 ano"],
        correctIndex: 2,
        explanation: "A maioria das bandeiras permite ao portador abrir um chargeback em ate 120 dias apos a transacao, embora prazos variem por tipo de disputa e bandeira.",
        category: "fraude",
      },
      {
        id: "cl-2",
        question: "O merchant sempre perde dinheiro em um chargeback, mesmo quando contesta com sucesso.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Correto na pratica. Mesmo vencendo o representment, o merchant arca com custo operacional de documentacao e tempo. Alem disso, ha taxa de chargeback cobrada pelo adquirente que geralmente nao e devolvida.",
        wrongExplanations: { 1: "Mesmo vencendo a disputa, o merchant paga taxa de chargeback (R$15-50 por caso) e custo operacional de coleta de evidencias. O processo nunca e gratuito." },
        category: "fraude",
      },
      {
        id: "cl-3",
        question: "O que e representment no ciclo de chargeback?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Segunda cobranca ao cliente",
          "Resposta do comerciante a disputa com evidencias para reverter o chargeback",
          "Reembolso automatico ao portador",
          "Cancelamento definitivo da transacao",
        ],
        correctIndex: 1,
        explanation: "Representment e quando o merchant contesta o chargeback enviando evidencias (comprovante de entrega, logs de acesso, politica aceita) para reverter a decisao em seu favor.",
        category: "fraude",
      },
      {
        id: "cl-4",
        question: "Qual abordagem maximizaria a taxa de win no representment?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um servico de streaming brasileiro tem taxa de chargeback de 1.2% (acima do threshold de 1% da Visa). 70% dos chargebacks sao 'subscription not recognized' (reason code 13.1). O servico tem 500 mil assinantes e cobra R$29.90/mes. A taxa de win em representment atual e 15%.",
        options: [
          "Contratar empresa de representment automatizado e contestar 100% dos chargebacks",
          "Mudar nome do descriptor de cobranca para incluir nome do servico + URL de suporte + telefone",
          "Oferecer reembolso automatico para todos os chargebacks para ficar abaixo do threshold",
          "Implementar descriptor claro + pagina de reconhecimento pre-chargeback + alerta por email antes da cobranca",
        ],
        correctIndex: 3,
        explanation: "Abordagem multi-camada: descriptor claro reduz 'nao reconheco', pagina de reconhecimento desvia disputas antes de virar chargeback, e alerta previo lembra o assinante. Atacar a causa raiz e melhor que contestar depois.",
        wrongExplanations: {
          0: "Contestar 100% sem melhorar o descriptor nao resolve a causa raiz. Com 70% de 'nao reconheco', o problema e o nome confuso na fatura.",
          1: "Melhorar descriptor ajuda mas sozinho nao basta para sair do threshold de 1.2%. Precisa de abordagem multi-camada.",
          2: "Reembolso automatico reduz taxa de chargeback mas custa R$179K/mes (1.2% de 500K x R$29.90) e incentiva abuso.",
        },
        category: "fraude",
      },
      {
        id: "cl-5",
        question: "Qual é o custo real estimado de um chargeback de R$100 para o merchant, considerando todas as taxas e custos operacionais?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "R$100 (apenas o valor da transação)",
          "R$125 (valor + taxa do adquirente)",
          "R$250-350 (valor + taxa + custo operacional)",
          "R$500-675 (valor + taxa + ops + multa potencial)",
        ],
        correctIndex: 2,
        explanation: "O custo real de um chargeback vai muito além do valor da transação. Inclui: valor (R$100) + taxa de chargeback do adquirente (R$15-50) + custo operacional de análise e documentação (R$40-100) + tempo da equipe. Sem multa de programa de monitoramento, o custo total fica entre R$250-350. Com multa (VDMP/ECM), pode chegar a R$675+.",
        category: "fraude",
      },
      {
        id: "cl-6",
        question: "Um merchant tem chargeback rate de 0.85% na Visa com 95 disputas/mês. O rate está subindo 0.05% ao mês. Em quantos meses ele provavelmente entrará no programa VDMP da Visa?",
        type: "scenario",
        difficulty: "hard",
        options: [
          "Já está no VDMP",
          "1 mês",
          "2 meses",
          "Não entrará — está abaixo dos thresholds",
        ],
        correctIndex: 1,
        explanation: "O VDMP da Visa requer AMBOS os critérios: chargeback rate ≥ 0.9% E ≥ 100 disputas/mês. Atualmente: rate 0.85% (abaixo) e 95 disputas (abaixo). Com crescimento de 0.05%/mês no rate e proporcional em volume, em 1 mês terá ~0.90% e ~100 disputas, atingindo ambos os thresholds simultaneamente.",
        category: "fraude",
      },
      {
        id: "cl-7",
        question: "O Compelling Evidence 3.0 (CE 3.0) da Visa pode ser usado para defender qualquer tipo de chargeback, não apenas fraude.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O CE 3.0 aplica-se EXCLUSIVAMENTE a chargebacks com reason code 10.4 (Fraud - Card Absent Environment). Para outros reason codes como 13.1 (não reconheço), 13.3 (não recebi) ou 13.6 (diferente do descrito), o merchant deve usar estratégias de defesa convencionais com as evidências específicas de cada código.",
        category: "fraude",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // metrics-tree (3 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/diagnostics/metrics-tree",
    questions: [
      {
        id: "mt-1",
        question: "Qual metrica indica a saude geral do funil de pagamentos?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["Taxa de fraude", "Taxa de autorizacao (aprovacao)", "Tempo de liquidacao", "Custo por transacao"],
        correctIndex: 1,
        explanation: "A taxa de autorizacao e a metrica raiz — indica que percentual das tentativas de pagamento sao aprovadas pelo emissor, sendo o indicador mais direto da saude do funil.",
        category: "produto",
      },
      {
        id: "mt-2",
        question: "Uma queda na taxa de autorizacao sempre indica problema no seu sistema de pagamento.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. A queda pode ser causada por fatores externos: emissor com problema, mudanca de regras da bandeira, queda de energia no data center do emissor, ou aumento de transacoes fraudulentas pelos seus clientes.",
        wrongExplanations: { 0: "Muitas causas de queda na taxa de autorizacao sao externas ao seu sistema: problemas no emissor, mudancas de regras de bandeira, fraude de terceiros, etc." },
        category: "produto",
      },
      {
        id: "mt-3",
        question: "Qual investigacao deve ser priorizada?",
        type: "scenario",
        difficulty: "hard",
        scenario: "A taxa de autorizacao geral caiu de 92% para 85% nas ultimas 4 horas. Ao segmentar por bandeira: Visa esta em 91% (normal), Mastercard caiu para 72% (era 93%). Ao segmentar por adquirente: Cielo normal, Rede com queda em Mastercard. Sem mudancas no seu sistema.",
        options: [
          "Verificar se ha problema no seu gateway de pagamento",
          "Contatar a Mastercard para reportar problema de rede",
          "Investigar a conexao Rede-Mastercard e avaliar cascade para Cielo em transacoes Mastercard",
          "Pausar todas as transacoes ate resolver o problema",
        ],
        correctIndex: 2,
        explanation: "Os dados indicam problema especifico na rota Rede + Mastercard. Cascade (redirecionar Mastercard para Cielo) e a acao imediata. Em paralelo, investigar a causa com Rede/Mastercard.",
        wrongExplanations: {
          0: "Os dados mostram que o problema e especifico de Rede + Mastercard. Se fosse seu gateway, todas as bandeiras/adquirentes seriam afetados.",
          1: "Mastercard via Cielo esta normal (91%). O problema e na rota especifica Rede-Mastercard, nao na Mastercard em geral.",
          3: "Pausar todas as transacoes causaria perda total de receita. A acao correta e redirecionar apenas o trafego afetado.",
        },
        category: "produto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // payments-dashboard (3 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/observability/payments-dashboard",
    questions: [
      {
        id: "pd-1",
        question: "Por que monitorar a taxa de aprovacao por BIN e importante?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Para design visual do dashboard",
          "Para identificar problemas especificos por emissor",
          "Para calcular impostos",
          "Para fins de marketing",
        ],
        correctIndex: 1,
        explanation: "Monitorar por BIN permite identificar quando um emissor especifico esta recusando mais que o normal, possibilitando acao direcionada como contato com o emissor ou ajuste de routing.",
        category: "produto",
      },
      {
        id: "pd-2",
        question: "Um dashboard de pagamentos deve ser atualizado em tempo real para todos os indicadores.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. Nem todos os indicadores precisam de tempo real. Taxa de autorizacao e fraude sim, mas metricas como receita mensal, custo por transacao e NPS podem ser atualizadas em intervalos maiores.",
        wrongExplanations: { 0: "Tempo real para tudo consome recursos desnecessarios. Indicadores operacionais (auth rate) precisam de tempo real; indicadores estrategicos (receita mensal) podem ser batch." },
        category: "produto",
      },
      {
        id: "pd-3",
        question: "Qual alerta deve ter prioridade maxima?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Seu dashboard mostra 3 alertas simultaneos: (A) Taxa de autorizacao caiu 2% na ultima hora, (B) Latencia media do gateway subiu de 200ms para 1.2s, (C) Taxa de fraude confirmada subiu 0.3% no ultimo dia. Volume total esta normal.",
        options: [
          "Alerta A — queda na taxa de autorizacao e sempre mais critico",
          "Alerta B — latencia alta do gateway pode causar timeouts em cascata afetando todos os indicadores",
          "Alerta C — fraude tem impacto financeiro direto",
          "Todos tem a mesma prioridade",
        ],
        correctIndex: 1,
        explanation: "Latencia de 1.2s (6x o normal) pode causar timeouts em cadeia, afetando taxa de autorizacao E experiencia do usuario. Provavelmente o Alerta A ja e consequencia do B. Resolver B pode resolver A.",
        wrongExplanations: {
          0: "A queda de 2% na auth rate provavelmente e CONSEQUENCIA da latencia alta (B). Resolver B deve normalizar A.",
          2: "0.3% de aumento em fraude confirmada ao longo de 1 dia e preocupante mas nao urgente como latencia 6x que afeta todas as transacoes AGORA.",
          3: "Em incident response, priorizar o alerta que pode ser causa raiz dos demais e mais eficaz do que tratar todos igualmente.",
        },
        category: "produto",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // chargeback-deep-dive (5 questions)
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/knowledge/chargeback-deep-dive",
    questions: [
      {
        id: "cbd-1",
        question: "Para um chargeback Visa com reason code 10.4 (fraude CNP), qual é a evidência MAIS forte que o merchant pode apresentar?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Email de confirmação do pedido",
          "Comprovante de entrega assinado",
          "Log de autenticação 3DS com liability shift",
          "Screenshot do carrinho de compras",
        ],
        correctIndex: 2,
        explanation: "O log de autenticação 3DS com liability shift é a evidência mais forte porque demonstra que o portador foi autenticado pelo emissor, transferindo a responsabilidade da fraude para o emissor. Em muitos casos, chargebacks com 3DS + liability shift são automaticamente revertidos. CE 3.0 com device matching é comparável em efetividade.",
        category: "fraude",
      },
      {
        id: "cbd-2",
        question: "Um e-commerce de moda tem 60% dos chargebacks com reason code 13.1 (Cardholder Does Not Recognize). Qual é a ação preventiva mais eficaz?",
        type: "scenario",
        difficulty: "hard",
        options: [
          "Aumentar o fraud scoring threshold",
          "Implementar 3D Secure em todas as transações",
          "Otimizar o soft descriptor na fatura do cartão para incluir nome da loja e número do pedido",
          "Contratar mais analistas de fraude",
        ],
        correctIndex: 2,
        explanation: "Reason code 13.1 significa que o portador não reconhece a cobrança na fatura. A causa raiz é geralmente um descriptor confuso (ex: 'PAG*INTERMEDIARIO' ao invés de 'LOJA EXEMPLO*PED123'). Otimizar o soft descriptor resolve a causa raiz. 3DS ajuda com liability shift mas não resolve o não-reconhecimento. Fraud scoring não se aplica — o portador é legítimo.",
        category: "fraude",
      },
      {
        id: "cbd-3",
        question: "Os serviços de alertas pré-chargeback (CDRN, Ethoca) são gratuitos para o merchant.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. Serviços como Verifi CDRN e Ethoca Alerts cobram por alerta, tipicamente R$5-15 por alerta recebido. Porém, o ROI é positivo: o custo de um alerta é muito menor que o custo total de um chargeback (R$250-675). Um merchant precisa deflectir apenas 3-5% dos alertas para ter break-even.",
        category: "fraude",
      },
      {
        id: "cbd-4",
        question: "Um marketplace de viagens está no 4º mês do programa VDMP da Visa com chargeback rate de 1.2%. Qual é a multa mensal aproximada e o risco imediato?",
        type: "scenario",
        difficulty: "hard",
        options: [
          "Sem multa — VDMP é apenas monitoramento",
          "R$5.000/mês com risco de aumento para R$25.000",
          "USD $10.000/mês com revisão obrigatória de compliance",
          "USD $50/mês por chargeback acima do threshold",
        ],
        correctIndex: 2,
        explanation: "No 4º mês do VDMP, as multas da Visa escalam significativamente. Meses 1-4 têm multas progressivas de $50-$10.000/mês. A partir do 5º mês, multas podem chegar a $25.000/mês. Além da multa, a Visa exige: plano de remediação em 10 dias, revisão de compliance pelo adquirente, e possível restrição de processamento se o rate não cair.",
        category: "fraude",
      },
      {
        id: "cbd-5",
        question: "Ordene as etapas do fluxo operacional de gestão de um chargeback, do início ao fim:",
        type: "ordering",
        difficulty: "medium",
        options: [
          "Alerta recebido → Classificar reason code → Avaliar fight/accept → Coletar evidências → Submeter representment → Acompanhar resultado → Documentar aprendizado",
          "Classificar reason code → Alerta recebido → Coletar evidências → Avaliar fight/accept → Submeter representment → Documentar aprendizado → Acompanhar resultado",
          "Alerta recebido → Avaliar fight/accept → Classificar reason code → Submeter representment → Coletar evidências → Acompanhar resultado → Documentar aprendizado",
          "Coletar evidências → Alerta recebido → Classificar reason code → Avaliar fight/accept → Submeter representment → Acompanhar resultado → Documentar aprendizado",
        ],
        correctIndex: 0,
        explanation: "O fluxo correto é: 1) Receber o alerta/notificação, 2) Classificar o reason code para entender o tipo de disputa, 3) Avaliar se vale a pena contestar (fight) ou aceitar (accept) baseado no valor, evidências disponíveis e win rate histórico, 4) Coletar evidências específicas para o reason code, 5) Submeter o representment dentro do prazo, 6) Acompanhar o resultado, 7) Documentar o aprendizado para melhorar a prevenção futura.",
        category: "fraude",
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  // Quiz Hub — 44 new expert-level questions
  // ────────────────────────────────────────────────────────────────
  {
    pageRoute: "/quiz",
    questions: [
      // ── Fundamentos (4) ──
      {
        id: "qh-fund-1",
        question: "Qual estrategia deve ser adotada primeiro?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um PSP processa 1M transacoes/mes. 60% cartao, 30% PIX, 10% boleto. O modulo de settlement fica offline por 2 horas durante o pico noturno.",
        options: [
          "Migrar todo o settlement para cloud imediatamente",
          "Implementar fila de settlement com retry e reconciliacao automatica pos-recovery",
          "Pausar transacoes de cartao durante a janela de indisponibilidade",
          "Dobrar a capacidade do servidor de settlement",
        ],
        correctIndex: 1,
        explanation: "Uma fila resiliente com retry garante que nenhuma transacao seja perdida durante o downtime. A reconciliacao automatica pos-recovery corrige divergencias sem intervencao manual.",
        wrongExplanations: {
          0: "Migracao para cloud e projeto de longo prazo e nao resolve o problema imediato de 2h de downtime.",
          2: "Pausar transacoes de cartao durante 2h causaria perda massiva de receita — 60% do volume.",
          3: "Dobrar capacidade nao resolve se o problema e indisponibilidade do modulo, nao performance.",
        },
        category: "fundamentos",
      },
      {
        id: "qh-fund-2",
        question: "Qual e a diferenca fundamental entre um gateway e um orquestrador de pagamentos?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Gateway processa pagamentos, orquestrador apenas roteia",
          "Gateway conecta a um unico adquirente, orquestrador gerencia multiplos provedores com logica inteligente de roteamento",
          "Sao a mesma coisa com nomes diferentes",
          "Orquestrador e mais barato que gateway",
        ],
        correctIndex: 1,
        explanation: "O gateway e o ponto de conexao tecnica com o adquirente. O orquestrador adiciona logica de roteamento inteligente, cascade entre provedores, retry e otimizacao de taxa de aprovacao.",
        wrongExplanations: {
          0: "Ambos processam pagamentos, mas o orquestrador faz mais do que apenas rotear — ele otimiza custo, aprovacao e resiliencia.",
          2: "Sao categorias distintas. Um orquestrador pode incluir funcoes de gateway, mas o inverso nao e verdadeiro.",
          3: "Custo depende do provedor, nao da categoria. Orquestradores geralmente custam mais por oferecerem mais valor.",
        },
        category: "fundamentos",
      },
      {
        id: "qh-fund-3",
        question: "Qual modelo deve adotar?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma fintech quer processar pagamentos sem ser regulada como instituicao de pagamento pelo Banco Central. O volume esperado e R$5M/mes.",
        options: [
          "Operar como sub-adquirente sob o registro de um adquirente certificado",
          "Obter licenca de instituicao de pagamento antes de comecar",
          "Ignorar a regulacao e comecar a operar diretamente",
          "Usar apenas Pix sem intermediario",
        ],
        correctIndex: 0,
        explanation: "Como sub-adquirente (facilitador de pagamentos), a fintech opera sob o registro do adquirente, que assume a responsabilidade regulatoria. Modelo comum para fintechs em fase inicial.",
        wrongExplanations: {
          1: "Licenca de IP exige capital minimo, compliance extenso e meses de processo. Desproporcional para inicio de operacao.",
          2: "Operar sem regulacao e ilegal e sujeita a multas e encerramento da operacao pelo BCB.",
          3: "Pix sem intermediario exige ser participante do SPI, o que requer ser instituicao regulada.",
        },
        category: "fundamentos",
      },
      {
        id: "qh-fund-4",
        question: "Quantas camadas tem o stack de pagamentos tipico (da experiencia a liquidacao)?",
        type: "multiple-choice",
        difficulty: "easy",
        options: ["3 camadas", "5 camadas", "7 camadas", "10 camadas"],
        correctIndex: 1,
        explanation: "O stack tipico tem 5 camadas: Experiencia (checkout), Gateway/Processamento, Rede (bandeiras), Clearing (compensacao) e Settlement (liquidacao).",
        category: "fundamentos",
      },

      // ── Autorizacao (5) ──
      {
        id: "qh-auth-1",
        question: "Qual estrategia combinada maximizaria a aprovacao?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um e-commerce tem taxa de autorizacao de 68% em transacoes internacionais. BIN analysis mostra 40% dos declines sao soft declines. O merchant usa apenas um adquirente local.",
        options: [
          "Adicionar 3DS em todas as transacoes internacionais",
          "Implementar retry inteligente em soft declines + cascade para adquirente internacional + network tokenization",
          "Bloquear transacoes internacionais e focar no mercado local",
          "Aumentar o valor minimo de transacao para reduzir volume de recusas",
        ],
        correctIndex: 1,
        explanation: "Retry captura soft declines reversiveis. Cascade para adquirente internacional melhora routing. Network tokenization aumenta auth rate em 2-5% por fornecer dados mais ricos ao emissor.",
        wrongExplanations: {
          0: "3DS melhora liability mas pode reduzir conversao em mercados sem SCA obrigatorio. Nao resolve soft declines.",
          2: "Bloquear internacionais elimina receita potencial. O problema e otimizacao, nao viabilidade.",
          3: "Valor minimo nao muda a taxa de autorizacao — apenas reduz volume total sem resolver a causa.",
        },
        category: "autorizacao",
      },
      {
        id: "qh-auth-2",
        question: "O que isso indica sobre o perfil dos clientes e qual feature pode mitigar?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um merchant recebe decline code '51' (insufficient funds) em 30% das recusas. O ticket medio e R$450 e a maioria dos clientes usa cartao de credito.",
        options: [
          "Clientes sao fraudadores — aumentar fraud scoring",
          "Clientes atingem limite do cartao — oferecer parcelamento e retry em horarios de renovacao de limite",
          "Problema no adquirente — trocar de processador",
          "Desabilitar cartao de credito e migrar para Pix",
        ],
        correctIndex: 1,
        explanation: "Code 51 indica saldo/limite insuficiente. Parcelamento reduz o valor por fatura. Retry em inicio de ciclo (quando limite renova) captura aprovacoes. Indica base de clientes com limite apertado.",
        wrongExplanations: {
          0: "Code 51 e saldo insuficiente, nao fraude. Tratar clientes legitimos como fraudadores reduz a base de clientes.",
          2: "O decline vem do emissor, nao do adquirente. Trocar processador nao muda a decisao do banco emissor.",
          3: "Desabilitar cartao eliminaria 70% das transacoes aprovadas. O problema e especifico dos 30% recusados.",
        },
        category: "autorizacao",
      },
      {
        id: "qh-auth-3",
        question: "Qual a diferenca entre pre-authorization e incremental authorization?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Pre-auth bloqueia o valor total, incremental adiciona valores a uma autorizacao existente",
          "Pre-auth e para cartao de debito, incremental para credito",
          "Sao a mesma operacao com nomes diferentes",
          "Incremental e mais rapido que pre-auth",
        ],
        correctIndex: 0,
        explanation: "Pre-authorization reserva um valor estimado (ex: hotel reserva R$500). Incremental authorization permite adicionar valores apos a pre-auth (ex: frigobar +R$50) sem nova autorizacao completa.",
        wrongExplanations: {
          1: "Ambos funcionam com cartao de credito. Pre-auth em debito e raro e depende do emissor.",
          2: "Sao operacoes distintas no fluxo de autorizacao com mensagens ISO diferentes.",
          3: "Velocidade depende do emissor, nao do tipo de autorizacao.",
        },
        category: "autorizacao",
      },
      {
        id: "qh-auth-4",
        question: "Em que cenario um stand-in processing (STIP) e ativado e quais sao os riscos?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "Quando o merchant solicita manualmente — sem riscos",
          "Quando o emissor esta indisponivel — risco de aprovacoes que o emissor recusaria",
          "Quando a bandeira esta em manutencao — risco de timeout",
          "Quando o adquirente perde conexao — risco de duplicidade",
        ],
        correctIndex: 1,
        explanation: "STIP e ativado quando o emissor nao responde no tempo limite. A bandeira aprova com base em parametros pre-definidos. O risco e aprovar transacoes que o emissor recusaria (fraude, limite excedido).",
        wrongExplanations: {
          0: "STIP e automatico, nao manual. E sempre ha risco — a decisao e tomada sem consultar o emissor.",
          2: "Se a bandeira esta em manutencao, a transacao falha completamente. STIP depende da bandeira estar operacional.",
          3: "STIP e ativado pela indisponibilidade do emissor, nao do adquirente.",
        },
        category: "autorizacao",
      },
      {
        id: "qh-auth-5",
        question: "O que e um soft decline vs hard decline e por que a distincao e crucial para retry logic?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Soft e temporario e pode ser retentado; hard e permanente e retry seria desperdicio",
          "Soft e para valores baixos; hard para valores altos",
          "Soft e do adquirente; hard e do emissor",
          "Nao ha diferenca pratica — ambos devem ser retentados",
        ],
        correctIndex: 0,
        explanation: "Soft declines (timeout, emissor temporariamente indisponivel) podem ser revertidos com retry. Hard declines (cartao cancelado, fraude confirmada) sao definitivos — retentar gera custo sem beneficio.",
        wrongExplanations: {
          1: "A distincao nao e por valor, mas pela natureza da recusa — temporaria vs permanente.",
          2: "Ambos os tipos podem vir do emissor. A origem nao define se e soft ou hard.",
          3: "Retentar hard declines gera custo de processamento e pode prejudicar a reputacao do merchant com a bandeira.",
        },
        category: "autorizacao",
      },

      // ── Liquidacao (4) ──
      {
        id: "qh-liq-1",
        question: "Qual e o impacto financeiro para o seller?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um marketplace processa R$10M/mes com 500 sellers. Settlement e D+30 para cartao. Um seller que fatura R$100K/mes quer antecipar recebiveis com desagio de 1.8%/mes.",
        options: [
          "O seller perde R$1.800 por mes em desagio",
          "O seller ganha R$100K imediatamente sem custo",
          "O seller paga R$1.800 de desagio mas ganha 30 dias de capital de giro — net positivo se o custo de capital proprio for maior que 1.8%/mes",
          "O impacto e neutro porque o marketplace absorve o custo",
        ],
        correctIndex: 2,
        explanation: "Antecipacao custa R$1.800/mes (1.8% de R$100K). Se o seller usa esse capital para gerar retorno acima de 1.8%/mes (ex: estoque, investimento), e net positivo. A decisao depende do custo de oportunidade.",
        wrongExplanations: {
          0: "Perda nominal de R$1.800 ignora o beneficio de ter o capital 30 dias antes. O custo de oportunidade pode superar o desagio.",
          1: "Antecipacao nunca e gratis — o desagio e o custo do valor do dinheiro no tempo.",
          3: "O marketplace ganha com o desagio — e uma fonte de receita, nao um custo absorvido.",
        },
        category: "liquidacao",
      },
      {
        id: "qh-liq-2",
        question: "Explique a diferenca entre gross settlement e net settlement e quando cada um e mais eficiente.",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "Gross e para valores altos com necessidade de finalidade imediata; net e para alto volume com contrapartes recorrentes",
          "Gross e mais barato que net em todos os cenarios",
          "Net e mais seguro porque consolida as transacoes",
          "Nao ha diferenca pratica — sao intercambiaveis",
        ],
        correctIndex: 0,
        explanation: "Gross settlement (RTGS) liquida individualmente — ideal para transferencias de alto valor que precisam de finalidade imediata. Net settlement compensa obrigacoes antes — eficiente quando ha alto volume bilateral.",
        wrongExplanations: {
          1: "Gross exige mais liquidez (cada transacao individual) e pode ser mais caro em tarifas. Net reduz volume de liquidacao.",
          2: "Net settlement introduz risco de contraparte no periodo entre compensacao e liquidacao. Gross elimina esse risco.",
          3: "Sao mecanismos fundamentalmente diferentes com trade-offs claros de custo, risco e velocidade.",
        },
        category: "liquidacao",
      },
      {
        id: "qh-liq-3",
        question: "O que e a registradora de recebiveis e qual seu papel no ecossistema de pagamentos brasileiro?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Sistema que registra reclamacoes de consumidores",
          "Infraestrutura que registra e rastreia recebiveis de cartao, permitindo uso como garantia de credito",
          "Banco que processa boletos",
          "Orgao regulador de fintechs",
        ],
        correctIndex: 1,
        explanation: "A registradora (TAG, CERC, CIP) registra os recebiveis de cartao de cada merchant, criando transparencia para uso como lastro em operacoes de credito e antecipacao.",
        wrongExplanations: {
          0: "Reclamacoes sao tratadas pelo Procon e BCB, nao pela registradora.",
          2: "Registradoras nao processam pagamentos — apenas registram a existencia e titularidade dos recebiveis.",
          3: "Regulacao e do BCB. Registradoras sao entidades autorizadas para registro de recebiveis.",
        },
        category: "liquidacao",
      },
      {
        id: "qh-liq-4",
        question: "Quais sao as 3 causas mais provaveis e como investigar cada uma?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um adquirente descobre uma discrepancia de R$50K na reconciliacao diaria entre o arquivo de settlement da bandeira e o ledger interno.",
        options: [
          "Fraude interna — acionar auditoria imediatamente",
          "Transacoes duplicadas no ledger, chargebacks nao processados, e transacoes de timezone diferente nao capturadas — investigar cada via cruzamento de dados",
          "Erro de software — reiniciar o sistema de reconciliacao",
          "A bandeira errou o arquivo — solicitar reenvio",
        ],
        correctIndex: 1,
        explanation: "As 3 causas mais comuns: 1) Duplicidade no ledger (cruzar IDs unicos), 2) Chargebacks processados pela bandeira mas nao refletidos (cruzar TCxx reports), 3) Cut-off de timezone diferente (verificar janela de processamento).",
        wrongExplanations: {
          0: "Fraude interna e possivel mas rara. Investigar causas operacionais primeiro e mais eficiente e provavel.",
          2: "Reiniciar nao resolve discrepancias existentes e pode agravar o problema se houver transacoes em processamento.",
          3: "Assumir erro da bandeira sem investigar internamente e negligente. A maioria das discrepancias e interna.",
        },
        category: "liquidacao",
      },

      // ── Fraude (5) ──
      {
        id: "qh-fraud-1",
        question: "Qual plano de acao em 90 dias reduziria o rate abaixo de 0.9%?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um merchant de delivery tem chargeback rate de 1.3% (acima do VDMP). 70% sao reason code 13.1 (merchandise not received). A empresa ja usa 3DS.",
        options: [
          "Aumentar fraud scoring para recusar mais transacoes",
          "Implementar proof of delivery com foto + GPS, notificacoes proativas de entrega, e portal de resolucao pre-chargeback",
          "Parar de aceitar cartao e migrar para PIX",
          "Oferecer reembolso automatico em toda reclamacao",
        ],
        correctIndex: 1,
        explanation: "13.1 e 'nao recebi'. Proof of delivery com evidencia forte + notificacao proativa resolve a causa raiz. Portal de resolucao desvia disputas antes de virarem chargeback formal.",
        wrongExplanations: {
          0: "O problema nao e fraude — e entrega. Fraud scoring nao reduz chargebacks de 'nao recebi' de clientes legitimos.",
          2: "Migrar para PIX eliminaria chargebacks mas reduziria drasticamente a conversao em delivery.",
          3: "Reembolso automatico incentiva abuso e custa mais que resolver a causa raiz das reclamacoes.",
        },
        category: "fraude",
      },
      {
        id: "qh-fraud-2",
        question: "Qual e a diferenca operacional entre Verifi CDRN e Ethoca Alerts? Em que cenario cada um e mais eficaz?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "CDRN intercepta antes do chargeback formal via Visa; Ethoca alerta via Mastercard e emissores — CDRN melhor para Visa-heavy, Ethoca para multi-bandeira",
          "Sao servicos identicos de empresas diferentes",
          "CDRN e gratis para merchants; Ethoca e pago",
          "CDRN previne fraude; Ethoca previne chargebacks",
        ],
        correctIndex: 0,
        explanation: "CDRN (Verifi/Visa) intercepta disputas na rede Visa antes de virar chargeback. Ethoca (Mastercard) recebe alertas de emissores multi-bandeira. Idealmente, usar ambos para cobertura maxima.",
        wrongExplanations: {
          1: "Tem integracoes, cobertura de bandeira e mecanismos diferentes. Sao complementares, nao substitutos.",
          2: "Ambos cobram por alerta. O custo por alerta e menor que o custo de um chargeback.",
          3: "Ambos previnem chargebacks, nao fraude diretamente. A fraude ja ocorreu — eles evitam que vire disputa formal.",
        },
        category: "fraude",
      },
      {
        id: "qh-fraud-3",
        question: "O que isso indica?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um banco emissor detecta um aumento de 300% em TC40 reports de um MID especifico, mas os chargebacks nao aumentaram proporcionalmente.",
        options: [
          "Os TC40 sao falsos positivos — ignorar",
          "Fraude confirmada mas portadores ainda nao contestaram — wave de chargebacks esta a caminho em 30-90 dias",
          "O sistema de deteccao esta com defeito",
          "O merchant esta reembolsando antes do chargeback",
        ],
        correctIndex: 1,
        explanation: "TC40 sao reports de fraude confirmada pelo emissor. Se chargebacks nao acompanham, e porque portadores ainda nao foram notificados ou nao contestaram. Historicamente, chargebacks seguem TC40 com delay de 30-90 dias.",
        wrongExplanations: {
          0: "TC40 sao fraude confirmada pelo emissor, nao falsos positivos. Ignorar seria negligencia grave.",
          2: "Aumento de 300% em TC40 de um MID especifico indica problema no merchant, nao no sistema de deteccao.",
          3: "Possivel parcialmente, mas aumento de 300% em TC40 sem reembolsos proporcionais indica fraude real nao tratada.",
        },
        category: "fraude",
      },
      {
        id: "qh-fraud-4",
        question: "O que e Compelling Evidence 3.0 e para qual reason code ele se aplica?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Evidencia fotografica para qualquer chargeback",
          "Framework da Visa que usa device fingerprint e dados historicos para defender chargebacks de fraude CNP (reason code 10.4)",
          "Sistema de pontuacao de risco da Mastercard",
          "Requisito PCI para armazenamento de dados",
        ],
        correctIndex: 1,
        explanation: "CE 3.0 da Visa permite defender chargebacks 10.4 (fraude CNP) provando que o mesmo device/IP fez transacoes anteriores nao disputadas. Se match em 2+ data points, o chargeback e revertido automaticamente.",
        wrongExplanations: {
          0: "CE 3.0 usa dados digitais (device, IP), nao fotos. E exclusivo para reason code 10.4.",
          2: "CE 3.0 e programa da Visa, nao Mastercard. Mastercard tem seu proprio programa de defesa.",
          3: "CE 3.0 nao tem relacao com PCI. E um mecanismo de defesa contra chargebacks.",
        },
        category: "fraude",
      },
      {
        id: "qh-fraud-5",
        question: "Qual combinacao de features reduziria chargebacks sem impactar a receita?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma empresa SaaS cobra R$49.90/mes de 200K assinantes. 0.8% de chargeback rate com 60% reason code 13.2 (cancelled recurring). Portadores alegam que cancelaram mas continuaram sendo cobrados.",
        options: [
          "Implementar 3DS em todas as cobranças recorrentes",
          "Cancellation confirmation page + email de pre-cobranca 7 dias antes + link facil de cancelamento + CDRN/Ethoca alerts",
          "Parar de cobrar clientes que reclamam",
          "Reduzir o preco para R$29.90 para diminuir reclamacoes",
        ],
        correctIndex: 1,
        explanation: "O problema e friccao no cancelamento. Facilitar cancelamento + email previo + portal de reconhecimento previne 13.2. CDRN/Ethoca intercepta disputas antes de virar chargeback.",
        wrongExplanations: {
          0: "3DS em recorrente adiciona friccao sem resolver o problema de cancelamento. Pode aumentar churn involuntario.",
          2: "Parar de cobrar sem resolver o processo incentiva abuso e reduz receita desnecessariamente.",
          3: "O preco nao e o problema — e a dificuldade de cancelar. Reduzir preco diminui receita sem resolver a causa.",
        },
        category: "fraude",
      },

      // ── Infraestrutura (4) ──
      {
        id: "qh-infra-1",
        question: "Qual e a diferenca entre ISO 8583 e ISO 20022 e por que a industria esta migrando?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "ISO 8583 usa campos binarios fixos; ISO 20022 usa XML/JSON rico — migracao para suportar dados mais detalhados e interoperabilidade global",
          "ISO 20022 e mais rapido que ISO 8583",
          "ISO 8583 e para cartoes, ISO 20022 e para PIX — nao ha migracao",
          "Sao protocolos intercambiaveis sem diferenca pratica",
        ],
        correctIndex: 0,
        explanation: "ISO 8583 e bitmap-based com campos limitados. ISO 20022 (XML) suporta dados ricos (nome do beneficiario, proposito do pagamento) e padrao global. SWIFT, Pix e SEPA ja usam 20022.",
        wrongExplanations: {
          1: "Velocidade depende da implementacao, nao do protocolo. ISO 20022 pode ate ser mais lento por mensagens maiores.",
          2: "ISO 20022 e usado em muitos contextos alem do PIX. A migracao de ISO 8583 para 20022 e tendencia global em cartoes tambem.",
          3: "Sao fundamentalmente diferentes em estrutura, capacidade de dados e flexibilidade.",
        },
        category: "infraestrutura",
      },
      {
        id: "qh-infra-2",
        question: "Quais sao os 4 componentes tecnicos essenciais e em que ordem devem ser implementados?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma bandeira regional quer implementar tokenizacao de rede para seus cartoes.",
        options: [
          "Token vault, lifecycle management, cryptogram generation, issuer integration — nessa ordem",
          "Website novo, app mobile, marketing, parcerias",
          "Firewall, antivirus, backup, monitoring",
          "Database, API, frontend, deploy",
        ],
        correctIndex: 0,
        explanation: "Token vault armazena mapeamento PAN-token. Lifecycle management gerencia provisioning/de-provisioning. Cryptogram generation cria provas de posse. Issuer integration conecta com emissores para validacao.",
        wrongExplanations: {
          1: "Marketing e UX sao importantes mas nao sao componentes tecnicos de tokenizacao de rede.",
          2: "Seguranca generica nao e tokenizacao. Tokenizacao tem componentes especificos do ecossistema de pagamentos.",
          3: "Componentes genericos de software nao refletem a arquitetura especifica necessaria para tokenizacao de rede.",
        },
        category: "infraestrutura",
      },
      {
        id: "qh-infra-3",
        question: "O que e o SPI (Sistema de Pagamentos Instantaneos) e como ele se relaciona com o PIX?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "SPI e o app do PIX para celular",
          "SPI e a infraestrutura do BCB que processa e liquida transacoes PIX em tempo real",
          "SPI e o nome antigo do PIX",
          "SPI e um sistema privado operado pelos bancos",
        ],
        correctIndex: 1,
        explanation: "O SPI e a infraestrutura centralizada do Banco Central que processa e liquida transacoes PIX em RTGS. O PIX e o produto/arranjo; o SPI e o 'motor' que o faz funcionar.",
        wrongExplanations: {
          0: "SPI e infraestrutura backend, nao um app. Os apps sao dos bancos/fintechs que se conectam ao SPI.",
          2: "SPI e PIX coexistem — sao coisas diferentes. PIX e o arranjo de pagamento; SPI e a infraestrutura.",
          3: "SPI e operado pelo Banco Central, nao pelos bancos. Isso garante neutralidade e disponibilidade.",
        },
        category: "infraestrutura",
      },
      {
        id: "qh-infra-4",
        question: "Quais sao as 3 areas mais provaveis de gargalo?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um processador de pagamentos processa 10K TPS em pico. A latencia P99 e de 3.2 segundos (acima do SLA de 2s).",
        options: [
          "Database queries nao otimizadas, conexoes de rede com emissores saturadas, e fila de processamento sem escala horizontal",
          "O problema e apenas de bandwidth de internet",
          "Servidores web insuficientes — adicionar mais maquinas resolve",
          "O SLA de 2s e irrealista para 10K TPS — renegociar",
        ],
        correctIndex: 0,
        explanation: "Em processamento de pagamentos, os gargalos tipicos sao: 1) DB (queries lentas em alto volume), 2) Network I/O (conexoes com emissores/bandeiras saturadas), 3) Processing queue (fila sem auto-scaling).",
        wrongExplanations: {
          1: "Bandwidth puro raramente e o gargalo — mensagens de pagamento sao pequenas (<1KB). O problema e latencia, nao throughput.",
          2: "Mais maquinas web nao resolve se o gargalo esta no database ou nas conexoes externas.",
          3: "2s P99 para pagamentos e padrao da industria. Emissores esperam resposta rapida; timeout excessivo gera STIP.",
        },
        category: "infraestrutura",
      },

      // ── Produto (5) ──
      {
        id: "qh-prod-1",
        question: "Quais features precisam ser adaptadas e quais novas sao necessarias?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Voce e PM de pagamentos em um e-commerce que quer expandir de Brasil para Mexico e Colombia.",
        options: [
          "Apenas traduzir o checkout para espanhol",
          "Adicionar metodos locais (OXXO/SPEI no Mexico, PSE/Nequi na Colombia), adaptar anti-fraude para BINs locais, compliance fiscal local, e moeda/parcelamento local",
          "Usar o mesmo setup brasileiro com cartoes internacionais",
          "Contratar um parceiro local e delegar 100% dos pagamentos",
        ],
        correctIndex: 1,
        explanation: "Expansao LATAM exige: metodos de pagamento locais (cada pais tem os seus), regras antifraude adaptadas, compliance tributario local, moedas locais e modalidades de parcelamento especificas.",
        wrongExplanations: {
          0: "Traduzir o checkout e necessario mas insuficiente. Sem metodos locais, a conversao sera muito baixa.",
          2: "Cartoes internacionais tem taxa de aprovacao baixa e custo alto em cross-border. Metodos locais sao essenciais.",
          3: "Delegar 100% reduz controle sobre experiencia e margem. O ideal e ter parceiro com integracao propria.",
        },
        category: "produto",
      },
      {
        id: "qh-prod-2",
        question: "Quais 3 estrategias combinadas teriam maior impacto?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um marketplace quer reduzir o MDR efetivo de 3.2% para abaixo de 2.5%. Volume: R$50M/mes. 70% cartao credito, 30% debito/PIX.",
        options: [
          "Negociar MDR menor com o adquirente atual",
          "Migrar para IC++ pricing, implementar local acquiring com routing inteligente, e incentivar migracao de credito para PIX com desconto",
          "Passar o custo do MDR ao comprador como taxa",
          "Reduzir o volume processado para negociar melhor taxa",
        ],
        correctIndex: 1,
        explanation: "IC++ revela interchange real (mais transparente). Local acquiring otimiza rota de menor custo. Migrar volume para PIX (custo ~0.5%) reduz MDR medio. Combinacao ataca os 3 componentes do custo.",
        wrongExplanations: {
          0: "Negociar sozinho e limitado. Sem mudar a estrutura (IC++, routing, mix de metodos), a reducao maxima e pequena.",
          2: "Surcharge em cartao de credito pode violar regras das bandeiras e reduz conversao significativamente.",
          3: "Reduzir volume piora o poder de negociacao, nao melhora. Volume alto e alavanca de negociacao.",
        },
        category: "produto",
      },
      {
        id: "qh-prod-3",
        question: "O que e IC++ (Interchange Plus Plus) e por que e mais transparente que pricing bundled?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "IC++ separa interchange, taxa da bandeira e markup do adquirente — permite ao merchant ver e otimizar cada componente individualmente",
          "IC++ e um desconto progressivo por volume",
          "IC++ e um modelo de pricing da Visa exclusivamente",
          "IC++ e mais caro que bundled mas mais rapido",
        ],
        correctIndex: 0,
        explanation: "IC++ decompoe o MDR em: Interchange (vai ao emissor) + Scheme fee (vai a bandeira) + Acquirer markup. Merchant ve exatamente quanto paga a quem e pode otimizar (ex: routing para menor interchange).",
        wrongExplanations: {
          1: "IC++ nao e desconto por volume — e um modelo de transparencia de pricing. Volume pode negociar o markup, mas a estrutura e fixa.",
          2: "IC++ e modelo de mercado usado por qualquer adquirente, nao exclusivo de bandeira.",
          3: "IC++ frequentemente e mais barato para merchants de alto volume por permitir otimizacao do mix de interchange.",
        },
        category: "produto",
      },
      {
        id: "qh-prod-4",
        question: "Qual e o impacto do parcelado lojista vs parcelado emissor no interchange e no fluxo de caixa do merchant?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Nao ha diferenca — parcelamento e sempre igual",
          "Parcelado lojista: merchant financia e recebe em parcelas; parcelado emissor: emissor financia, merchant recebe a vista, mas interchange e maior",
          "Parcelado emissor e sempre mais barato para o merchant",
          "Parcelado lojista nao existe mais no Brasil",
        ],
        correctIndex: 1,
        explanation: "No parcelado emissor, o banco financia o cliente e o merchant recebe o valor integral rapidamente, mas o interchange e significativamente maior. No parcelado lojista, o merchant recebe parcelado (D+30, D+60...) mas o interchange e menor.",
        wrongExplanations: {
          0: "Sao modalidades diferentes com impacto significativo em custo e fluxo de caixa.",
          2: "Depende. Parcelado lojista tem interchange menor mas impacta fluxo de caixa. A melhor opcao depende do custo de capital do merchant.",
          3: "Parcelado lojista e amplamente utilizado no Brasil, especialmente em marketplaces.",
        },
        category: "produto",
      },
      {
        id: "qh-prod-5",
        question: "Qual estrutura regulatoria e mais adequada e por que?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma fintech quer lancar um produto de credito usando recebiveis de cartao como lastro.",
        options: [
          "Operar como SCD (Sociedade de Credito Direto) usando recebiveis proprios como garantia",
          "Criar um FIDC (Fundo de Investimento em Direitos Creditorios) para securitizar recebiveis de terceiros e distribuir cotas",
          "Emprestar diretamente sem regulacao usando capital proprio",
          "Usar SCD para originacao e FIDC para funding — combinacao que permite escala com custo de capital otimizado",
        ],
        correctIndex: 3,
        explanation: "SCD origina o credito com regulacao adequada. FIDC securitiza os recebiveis para captar funding de investidores a custo menor. A combinacao permite escalar sem limitar ao capital proprio da fintech.",
        wrongExplanations: {
          0: "SCD sozinha limita a escala ao capital proprio da empresa. Sem FIDC, o funding e restrito.",
          1: "FIDC sozinho nao origina credito — precisa de um originador regulado (SCD, SEP ou banco).",
          2: "Emprestar sem regulacao e ilegal no Brasil. A atividade de credito exige autorizacao do BCB.",
        },
        category: "produto",
      },

      // ── Crypto (3) ──
      {
        id: "qh-crypto-1",
        question: "Quais sao os 3 maiores desafios regulatorios e tecnicos?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma exchange quer permitir pagamentos em stablecoin para merchants no Brasil.",
        options: [
          "Nao ha desafios — stablecoins ja sao regulamentadas",
          "Compliance cambial (stablecoin USD = operacao de cambio), tributacao de ganho de capital em cada transacao, e latencia de confirmacao na blockchain vs experiencia de checkout",
          "Apenas o desafio tecnico de integracao com wallets",
          "O unico desafio e convencer merchants a aceitar",
        ],
        correctIndex: 1,
        explanation: "1) BCB pode classificar stablecoin USD como operacao cambial (exige licenca). 2) Cada transacao pode gerar evento tributavel (ganho/perda de capital). 3) Tempo de confirmacao blockchain vs expectativa de checkout instantaneo.",
        wrongExplanations: {
          0: "Marco Legal dos Criptoativos (Lei 14.478) existe mas regulamentacao especifica de pagamentos com stablecoins ainda esta em desenvolvimento.",
          2: "Integracao tecnica e o menor dos desafios. Compliance regulatorio e tributario sao os maiores obstaculos.",
          3: "Merchants precisam de incentivo economico (custo menor, liquidacao mais rapida) e seguranca juridica para aceitar.",
        },
        category: "crypto",
      },
      {
        id: "qh-crypto-2",
        question: "O que e MEV (Maximal Extractable Value) e como ele pode afetar pagamentos on-chain?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "MEV e uma taxa fixa de mineracao",
          "MEV e o valor que validadores podem extrair reordenando transacoes — em pagamentos, pode causar front-running e sandwich attacks que alteram o preco de swaps",
          "MEV e uma metrica de performance de blockchain",
          "MEV nao afeta pagamentos, apenas DeFi",
        ],
        correctIndex: 1,
        explanation: "MEV permite que validadores reordenem transacoes para lucro. Em pagamentos com swap (ex: pagar em ETH por produto em USDC), um atacante pode fazer sandwich attack, comprando antes e vendendo depois, aumentando o custo.",
        wrongExplanations: {
          0: "MEV nao e taxa fixa — e valor variavel que depende das oportunidades de reordenacao em cada bloco.",
          2: "MEV e um problema economico/de seguranca, nao uma metrica de performance.",
          3: "MEV afeta qualquer transacao on-chain que envolva swap de ativos, incluindo pagamentos.",
        },
        category: "crypto",
      },
      {
        id: "qh-crypto-3",
        question: "Qual a diferenca entre uma stablecoin algoritmica e uma com lastro em fiat?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Nao ha diferenca — ambas mantem paridade 1:1",
          "Algoritmica usa mecanismos de oferta/demanda para manter paridade; lastreada mantem reservas reais em moeda fiat ou equivalentes",
          "Lastreada e descentralizada; algoritmica e centralizada",
          "Algoritmica e mais segura por nao depender de reservas",
        ],
        correctIndex: 1,
        explanation: "Stablecoin lastreada (USDT, USDC) mantem reservas reais. Algoritmica (ex: UST) usa mecanismos de mint/burn e arbitragem. O colapso do UST/Luna mostrou que algoritmica tem riscos significativos de depegging.",
        wrongExplanations: {
          0: "O mecanismo de manter paridade e fundamentalmente diferente e com riscos distintos.",
          2: "USDT/USDC sao lastreadas E centralizadas. Descentralizacao nao define o tipo de lastro.",
          3: "O colapso do UST/Luna demonstrou que algoritmica sem reservas e significativamente mais arriscada.",
        },
        category: "crypto",
      },

      // ── Regulacao (4) ──
      {
        id: "qh-reg-1",
        question: "Qual e o custo mensal estimado e qual programa deve ser priorizado?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Um merchant e notificado que entrou no VDMP (Visa) e ECM (Mastercard) simultaneamente. O chargeback rate e 1.1% com 150 disputas/mes.",
        options: [
          "Sem custo adicional — ambos sao apenas monitoramento",
          "VDMP primeiro: multas comecam em $50/mes e escalam rapidamente; ECM tem periodo de graca maior. Custo combinado pode chegar a $10K+/mes apos 4 meses",
          "ECM primeiro porque Mastercard e mais rigida",
          "Ignorar ambos e focar em vendas",
        ],
        correctIndex: 1,
        explanation: "VDMP da Visa escala multas mais rapidamente (a partir do mes 1). ECM da Mastercard tem periodo de observacao inicial. Priorizar VDMP reduz custo imediato. Custo combinado pode ultrapassar $10K/mes se nao resolvido.",
        wrongExplanations: {
          0: "Ambos os programas aplicam multas financeiras reais que escalam mensalmente. Nao sao apenas monitoramento.",
          2: "Visa (VDMP) tem escalacao de multas mais agressiva nos primeiros meses. ECM tem periodo de graca inicial.",
          3: "Ignorar pode levar a multas de $75K+/mes e eventual encerramento do MID. Risco existencial para o negocio.",
        },
        category: "regulacao",
      },
      {
        id: "qh-reg-2",
        question: "Quais sao as diferencas entre PCI DSS v3.2.1 e v4.0 e como elas impactam merchants?",
        type: "multiple-choice",
        difficulty: "hard",
        options: [
          "v4.0 adiciona requisitos de MFA obrigatorio, customized approach para validacao, e monitoramento continuo — merchants tem ate marco 2025 para migrar",
          "Nao ha diferencas significativas — apenas numeracao",
          "v4.0 e mais simples e menos restritiva",
          "v4.0 elimina a necessidade de scan trimestral",
        ],
        correctIndex: 0,
        explanation: "PCI DSS v4.0 traz: MFA para todos os acessos ao CDE, customized approach (flexibilidade na implementacao), testes de seguranca mais frequentes, e foco em seguranca continua vs compliance pontual.",
        wrongExplanations: {
          1: "v4.0 e a maior atualizacao do PCI DSS em anos, com mudancas significativas em autenticacao, monitoramento e flexibilidade.",
          2: "v4.0 e mais rigorosa em varios aspectos, especialmente MFA e monitoramento continuo.",
          3: "Scans trimestrais continuam obrigatorios. v4.0 adiciona mais requisitos de monitoramento, nao remove.",
        },
        category: "regulacao",
      },
      {
        id: "qh-reg-3",
        question: "O que e SCA (Strong Customer Authentication) e em quais regioes e obrigatorio?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Autenticacao biometrica obrigatoria globalmente",
          "Autenticacao de dois fatores em pagamentos online obrigatoria na Europa (PSD2) e no UK — exige 2 de 3: algo que o usuario sabe, tem ou e",
          "Sistema de scoring de credito americano",
          "Protocolo de criptografia para cartoes chip",
        ],
        correctIndex: 1,
        explanation: "SCA e parte da PSD2 europeia: exige 2 fatores de autenticacao (conhecimento + posse + inerencia) em pagamentos online. Obrigatorio na EEA e UK. Brasil nao tem SCA obrigatorio, mas 3DS 2.0 e similar.",
        wrongExplanations: {
          0: "SCA nao e apenas biometria e nao e global. E multi-fator e obrigatoria em regioes especificas.",
          2: "SCA e europeu. Score de credito americano e FICO — conceitos completamente diferentes.",
          3: "SCA e para autenticacao de pagamentos online, nao criptografia de chip.",
        },
        category: "regulacao",
      },
      {
        id: "qh-reg-4",
        question: "Quais licencas, regulacoes e infraestrutura tecnica sao necessarias?",
        type: "scenario",
        difficulty: "hard",
        scenario: "Uma empresa quer operar como sub-acquirer (facilitador de pagamentos) no Brasil.",
        options: [
          "Nenhuma licenca — basta integrar com um adquirente",
          "Registro no BCB como instituicao de pagamento, contrato com adquirente certificado, compliance PCI-DSS, KYC/AML de sub-merchants, e sistema de split de pagamentos",
          "Apenas CNPJ e conta bancaria",
          "Licenca de banco comercial do BCB",
        ],
        correctIndex: 1,
        explanation: "Sub-acquirer precisa: 1) Registro no BCB (Res. 80/2021), 2) Contrato com adquirente, 3) PCI-DSS (se processa dados de cartao), 4) KYC/AML dos sub-merchants, 5) Infraestrutura de split e settlement.",
        wrongExplanations: {
          0: "Desde a Circular 3.682/2013, facilitadores precisam de registro no BCB. Operar sem e irregular.",
          2: "CNPJ e conta sao necessarios mas insuficientes. Regulacao especifica de pagamentos e obrigatoria.",
          3: "Licenca de banco e desproporcional. Sub-acquirer precisa de registro como instituicao de pagamento, nao licenca bancaria completa.",
        },
        category: "regulacao",
      },

      // ── Extra hard questions for depth ──
      {
        id: "qh-extra-1",
        question: "Qual e o impacto de network tokenization na taxa de autorizacao?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Nenhum impacto mensuravel",
          "Aumento tipico de 2-5% na taxa de autorizacao por fornecer dados mais ricos e atualizados ao emissor",
          "Reducao na taxa de autorizacao por adicionar complexidade",
          "Impacto apenas em transacoes internacionais",
        ],
        correctIndex: 1,
        explanation: "Network tokens sao atualizados automaticamente quando o cartao e renovado, eliminando recusas por cartao expirado. Alem disso, fornecem cryptograms que aumentam a confianca do emissor.",
        wrongExplanations: {
          0: "Estudos de Visa e Mastercard mostram aumento de 2-5% consistente com network tokenization.",
          2: "A complexidade e abstraida pelo token service provider. O emissor recebe dados melhores, nao piores.",
          3: "O impacto e em todas as transacoes, especialmente recorrentes (onde cartao expirado e causa comum de recusa).",
        },
        category: "autorizacao",
      },
      {
        id: "qh-extra-2",
        question: "Por que a taxa de interchange e diferente entre debito e credito no Brasil?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Nao ha diferenca — interchange e igual",
          "Credito tem interchange maior porque o emissor financia o portador; debito tem teto regulado pelo BCB",
          "Debito e mais caro porque e mais rapido",
          "A diferenca e apenas por preferencia das bandeiras",
        ],
        correctIndex: 1,
        explanation: "Em credito, o emissor assume risco de inadimplencia e financia o portador — interchange maior compensa esse risco. Em debito, BCB regulou teto de 0.5% (Circ. 3.887/2018) por ser dinheiro disponivel.",
        category: "fundamentos",
      },
      {
        id: "qh-extra-3",
        question: "O que e BIN (Bank Identification Number) e para que e usado?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Codigo de barras do boleto",
          "Primeiros 6-8 digitos do cartao que identificam emissor, tipo de cartao e pais de emissao",
          "Numero da agencia bancaria",
          "Identificador de transacao unico",
        ],
        correctIndex: 1,
        explanation: "O BIN identifica o emissor (ex: Itau, Nubank), tipo (credito/debito), bandeira, nivel (Gold/Platinum) e pais. E essencial para routing, fraud scoring e analytics.",
        category: "fundamentos",
      },
      {
        id: "qh-extra-4",
        question: "O que significa liability shift no contexto de 3D Secure?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "O merchant paga menos impostos",
          "A responsabilidade por fraude transfere do merchant para o emissor quando 3DS e autenticado com sucesso",
          "O consumidor assume a responsabilidade",
          "A bandeira paga o chargeback",
        ],
        correctIndex: 1,
        explanation: "Com 3DS autenticado, se houver chargeback por fraude, o emissor (nao o merchant) arca com o custo. Isso e liability shift — incentivo para merchants implementarem 3DS.",
        category: "autorizacao",
      },
      {
        id: "qh-extra-5",
        question: "O que e acquirer BIN table e qual sua importancia no processamento?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Tabela de precos do adquirente",
          "Tabela que mapeia BINs para emissores e determina routing, interchange e regras de processamento aplicaveis",
          "Lista de cartoes bloqueados",
          "Registro de transacoes historicas",
        ],
        correctIndex: 1,
        explanation: "A BIN table e mantida pelas bandeiras e usada pelo adquirente para identificar o emissor, determinar interchange aplicavel, regras de roteamento e features disponiveis (tokenizacao, 3DS, etc).",
        wrongExplanations: {
          0: "BIN table e tecnica, nao comercial. Precos sao definidos em contrato, nao na BIN table.",
          2: "Listas de bloqueio sao parte de fraud prevention, nao da BIN table.",
          3: "Historico de transacoes e armazenado em sistemas de reporting, nao na BIN table.",
        },
        category: "infraestrutura",
      },
      {
        id: "qh-extra-6",
        question: "Uma transacao aprovada e capturada pode ser revertida pelo emissor sem chargeback?",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 0,
        explanation: "Verdadeiro. O emissor pode reverter via retrieval request (request for information) antes do chargeback formal. Alem disso, alertas CDRN/Ethoca permitem resolucao sem chargeback. Existem tambem reversais automaticas em duplicidade.",
        wrongExplanations: { 1: "Existem mecanismos pre-chargeback como retrieval requests e alertas de fraude que permitem resolucao sem disputa formal." },
        category: "fraude",
      },
      {
        id: "qh-extra-7",
        question: "O que e tokenizacao de comercio (merchant tokenization) e como difere de network tokenization?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Sao a mesma coisa",
          "Merchant tokenization e gerida pelo PSP/merchant (token interno); network tokenization e emitida pela bandeira e reconhecida por todo o ecossistema",
          "Network tokenization e mais insegura",
          "Merchant tokenization substitui completamente network tokenization",
        ],
        correctIndex: 1,
        explanation: "Merchant token e interno (PCI scope reduzido mas limitado aquele merchant). Network token e emitido pela bandeira, reconhecido por emissores globalmente, e atualizado automaticamente quando cartao muda.",
        wrongExplanations: {
          0: "Sao escopos fundamentalmente diferentes. Merchant token e local; network token e global.",
          2: "Network tokenization e mais segura por incluir cryptogram de dominio e atualizacao automatica.",
          3: "Sao complementares. Merchant token reduz PCI scope; network token melhora autorizacao.",
        },
        category: "autorizacao",
      },
      {
        id: "qh-extra-8",
        question: "O que e o conceito de 'payment orchestration' e por que esta crescendo?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Apenas um termo de marketing para gateway",
          "Camada que gerencia multiplos provedores de pagamento com routing inteligente, retry, cascade e otimizacao de custo/aprovacao",
          "Sistema de musica para lojas",
          "Processo manual de reconciliacao",
        ],
        correctIndex: 1,
        explanation: "Payment orchestration abstrai a complexidade de multiplos PSPs/adquirentes, adicionando logica de negocio para maximizar aprovacao, minimizar custo e garantir resiliencia automaticamente.",
        category: "produto",
      },
      {
        id: "qh-extra-9",
        question: "O que e um ARN (Acquirer Reference Number) e para que serve?",
        type: "multiple-choice",
        difficulty: "medium",
        options: [
          "Numero de telefone do adquirente",
          "Identificador unico de uma transacao atribuido pelo adquirente, usado para rastreamento em disputas e reconciliacao cross-party",
          "Codigo de autorizacao do emissor",
          "Numero de serie do terminal POS",
        ],
        correctIndex: 1,
        explanation: "O ARN e um identificador de 23 digitos que permite rastrear uma transacao entre adquirente, bandeira e emissor. Essencial para resolver disputas, rastrear settlement e reconciliar entre partes.",
        wrongExplanations: {
          0: "ARN e identificador de transacao, nao informacao de contato.",
          2: "O codigo de autorizacao e emitido pelo emissor. ARN e do adquirente — sao identificadores diferentes.",
          3: "O numero de serie do POS e um identificador de hardware, nao de transacao.",
        },
        category: "infraestrutura",
      },
      {
        id: "qh-extra-10",
        question: "Qual e a relacao entre MDR, interchange e acquirer markup?",
        type: "multiple-choice",
        difficulty: "easy",
        options: [
          "Sao taxas independentes somadas na fatura",
          "MDR = interchange + scheme fee + acquirer markup — e a taxa total paga pelo merchant",
          "MDR e interchange sao a mesma coisa",
          "Acquirer markup e sempre maior que interchange",
        ],
        correctIndex: 1,
        explanation: "MDR e a taxa total que o merchant paga. Ela e composta por: interchange (vai ao emissor) + scheme fee (vai a bandeira) + markup do adquirente. No modelo IC++, cada componente e visivel.",
        category: "regulacao",
      },
    ],
  },
];

export function getQuizForPage(route: string): PageQuiz | null {
  return QUIZZES.find((q) => q.pageRoute === route) || null;
}

export function getQuestionsByCategory(category: QuizCategory): QuizQuestion[] {
  return QUIZZES.flatMap(q => q.questions).filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: Difficulty): QuizQuestion[] {
  return QUIZZES.flatMap(q => q.questions).filter(q => q.difficulty === difficulty);
}

export function getAllQuestions(): QuizQuestion[] {
  return QUIZZES.flatMap(q => q.questions);
}

// ---------------------------------------------------------------------------
// Standalone Quiz System — organized by theme with 30+ questions each
// ---------------------------------------------------------------------------

export interface StandaloneQuestion {
  id: string;
  theme: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTheme {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const QUIZ_THEMES: QuizTheme[] = [
  { id: "fundamentos", name: "Fundamentos de Pagamentos", icon: "💳", description: "Conceitos basicos, camadas, atores e fluxos" },
  { id: "autorizacao", name: "Autorizacao & Processamento", icon: "⚡", description: "Fluxo de autorizacao, 3DS, tokenizacao, retry" },
  { id: "fraude", name: "Fraude & Risco", icon: "🛡️", description: "Prevencao, deteccao, scoring e vetores de ataque" },
  { id: "liquidacao", name: "Liquidacao & Settlement", icon: "🏦", description: "Clearing, reconciliacao, split e agenda" },
  { id: "infraestrutura", name: "Infraestrutura Bancaria", icon: "🏛️", description: "ISO 8583, redes, SPB, CIP e messaging" },
  { id: "crypto", name: "Crypto & DeFi", icon: "🔗", description: "Blockchain, stablecoins, DeFi e regulacao" },
  { id: "compliance", name: "Compliance & Regulacao", icon: "📋", description: "PCI DSS, LGPD, Bacen, KYC/AML" },
  { id: "antecipacao", name: "Antecipacao & Credito", icon: "💰", description: "Recebiveis, FIDC, SCD e cessao" },
  { id: "bandeiras", name: "Regras de Bandeiras", icon: "🃏", description: "Visa, Mastercard, Elo, interchange e programas" },
  { id: "chargeback", name: "Chargeback & Disputas", icon: "⚖️", description: "Reason codes, defesa, VDMP/EFM e KPIs" },
];

export const STANDALONE_QUIZZES: StandaloneQuestion[] = [
  // ============================================================================
  // THEME: Fundamentos de Pagamentos (30 questions)
  // ============================================================================
  { id: "fund-e1", theme: "fundamentos", difficulty: "easy", question: "Qual e o papel principal do gateway de pagamento?", options: ["Emitir cartoes de credito", "Conectar o comerciante ao adquirente/processador", "Liquidar fundos entre bancos", "Aprovar ou recusar transacoes"], correctIndex: 1, explanation: "O gateway atua como interface tecnica entre o comerciante e o ecossistema de pagamentos, transmitindo dados da transacao ao adquirente ou processador." },
  { id: "fund-e2", theme: "fundamentos", difficulty: "easy", question: "O que significa a sigla PSP no contexto de pagamentos?", options: ["Payment Security Protocol", "Payment Service Provider", "Primary Settlement Platform", "Prepaid Service Program"], correctIndex: 1, explanation: "PSP (Payment Service Provider) e a empresa que fornece servicos de processamento de pagamentos aos comerciantes, incluindo gateway, adquirencia e gestao de risco." },
  { id: "fund-e3", theme: "fundamentos", difficulty: "easy", question: "Qual entidade e responsavel por aprovar ou recusar uma transacao de cartao?", options: ["O adquirente", "A bandeira", "O emissor", "O gateway"], correctIndex: 2, explanation: "O emissor (banco que emitiu o cartao) e quem toma a decisao final de aprovar ou recusar a transacao com base no saldo, limite e regras de risco." },
  { id: "fund-e4", theme: "fundamentos", difficulty: "easy", question: "O que e interchange fee?", options: ["Taxa cobrada pelo gateway ao comerciante", "Taxa paga pelo adquirente ao emissor em cada transacao", "Taxa de manutencao do terminal POS", "Taxa cobrada pela bandeira ao portador do cartao"], correctIndex: 1, explanation: "Interchange e a taxa que o adquirente paga ao emissor em cada transacao de cartao. E a maior parcela do MDR e remunera o emissor pelo risco de credito." },
  { id: "fund-e5", theme: "fundamentos", difficulty: "easy", question: "Qual a diferenca entre captura e autorizacao?", options: ["Sao a mesma coisa", "Autorizacao reserva o valor; captura confirma a cobranca", "Captura ocorre antes da autorizacao", "Autorizacao e feita pelo comerciante; captura pelo banco"], correctIndex: 1, explanation: "Autorizacao reserva o limite no cartao do portador. A captura confirma que a transacao deve ser cobrada de fato, geralmente apos o envio do produto ou prestacao do servico." },
  { id: "fund-e6", theme: "fundamentos", difficulty: "easy", question: "O que e MDR (Merchant Discount Rate)?", options: ["Taxa de desconto do emissor ao portador", "Taxa total cobrada do comerciante sobre cada transacao", "Percentual de fraude aceito pelo comerciante", "Taxa de cambio em transacoes internacionais"], correctIndex: 1, explanation: "MDR e a taxa percentual cobrada do comerciante a cada venda. Compoe-se de interchange (emissor) + scheme fee (bandeira) + markup (adquirente)." },
  { id: "fund-e7", theme: "fundamentos", difficulty: "easy", question: "Qual camada do stack de pagamentos inclui PIX, TED e cartoes?", options: ["Camada de experiencia", "Camada de metodos de pagamento (rails)", "Camada de liquidacao", "Camada de compliance"], correctIndex: 1, explanation: "PIX, TED, cartoes e boleto sao diferentes trilhos (rails) de pagamento — cada um com suas proprias regras, velocidade e custo." },
  { id: "fund-e8", theme: "fundamentos", difficulty: "easy", question: "O que e um acquirer (adquirente)?", options: ["Banco que emite o cartao ao consumidor", "Empresa que processa pagamentos em nome do comerciante", "Rede que conecta emissores e adquirentes", "Software de checkout online"], correctIndex: 1, explanation: "O adquirente e a instituicao financeira que faz o credenciamento do comerciante e processa as transacoes de cartao junto as bandeiras." },
  { id: "fund-e9", theme: "fundamentos", difficulty: "easy", question: "Qual e a principal vantagem do PIX sobre o boleto bancario?", options: ["Menor taxa de fraude", "Liquidacao instantanea 24/7", "Maior limite de valor", "Funciona sem internet"], correctIndex: 1, explanation: "O PIX liquida em tempo real, 24 horas por dia, 7 dias por semana, enquanto o boleto pode levar ate 3 dias uteis para compensacao." },
  { id: "fund-e10", theme: "fundamentos", difficulty: "easy", question: "O que e tokenizacao no contexto de pagamentos?", options: ["Converter moeda fiduciaria em criptomoeda", "Substituir dados sensiveis do cartao por um identificador unico", "Dividir uma transacao em parcelas", "Codificar mensagens entre gateway e adquirente"], correctIndex: 1, explanation: "Tokenizacao substitui o PAN (numero real do cartao) por um token unico, reduzindo o escopo PCI e aumentando a seguranca." },
  { id: "fund-m1", theme: "fundamentos", difficulty: "medium", question: "Em um modelo four-party, quais sao as quatro partes?", options: ["Comerciante, Gateway, Processador, Banco Central", "Portador, Emissor, Adquirente, Comerciante", "Bandeira, Adquirente, Emissor, Regulador", "Gateway, PSP, Banco, Consumidor"], correctIndex: 1, explanation: "O modelo four-party (ou four-corner) envolve: Portador (cardholder), Emissor (issuer), Adquirente (acquirer) e Comerciante (merchant). A bandeira atua como rede conectando emissor e adquirente." },
  { id: "fund-m2", theme: "fundamentos", difficulty: "medium", question: "Qual a diferenca entre modelo three-party e four-party?", options: ["Three-party tem menos seguranca", "No three-party, a mesma entidade e emissora e adquirente", "Three-party nao suporta credito", "Four-party e exclusivo para cartoes virtuais"], correctIndex: 1, explanation: "No modelo three-party (Amex, por exemplo), a mesma entidade atua como emissor e adquirente. No four-party (Visa/Mastercard), essas funcoes sao separadas." },
  { id: "fund-m3", theme: "fundamentos", difficulty: "medium", question: "O que acontece quando um comerciante faz uma venda de R$100 com MDR de 2%?", options: ["Recebe R$100 e paga R$2 depois", "Recebe R$98 na liquidacao", "Recebe R$100 menos impostos", "Recebe R$102 com o MDR"], correctIndex: 1, explanation: "O comerciante recebe R$98 (R$100 - 2% de MDR). O MDR e descontado diretamente do valor liquidado pelo adquirente." },
  { id: "fund-m4", theme: "fundamentos", difficulty: "medium", question: "Qual e o papel da bandeira (scheme) em uma transacao de cartao?", options: ["Aprovar ou recusar a transacao", "Definir regras, rotear mensagens e garantir interoperabilidade", "Liquidar fundos diretamente ao comerciante", "Emitir o cartao ao consumidor"], correctIndex: 1, explanation: "A bandeira (Visa, Mastercard, etc) define regras do ecossistema, roteia mensagens entre adquirente e emissor, e garante que todas as partes sigam os mesmos padroes." },
  { id: "fund-m5", theme: "fundamentos", difficulty: "medium", question: "O que e soft descriptor em uma transacao?", options: ["Codigo interno do processador", "Nome que aparece na fatura do portador do cartao", "Tipo de criptografia usada na mensagem", "Categoria do comerciante no cadastro"], correctIndex: 1, explanation: "Soft descriptor e o texto que aparece no extrato/fatura do portador, identificando a compra. Um descriptor ruim aumenta chargebacks por 'nao reconhecimento'." },
  { id: "fund-m6", theme: "fundamentos", difficulty: "medium", question: "Em que momento a transacao se torna irrevogavel no fluxo de cartao?", options: ["Na autorizacao", "Na captura", "No clearing/settlement", "Nunca — pode sempre haver chargeback"], correctIndex: 2, explanation: "A transacao se torna financeiramente efetiva no settlement. Porem, mesmo apos settlement, o portador ainda pode iniciar um chargeback dentro dos prazos da bandeira." },
  { id: "fund-m7", theme: "fundamentos", difficulty: "medium", question: "Qual a principal diferenca entre adquirencia e sub-adquirencia?", options: ["Sub-adquirente tem licenca propria com as bandeiras", "O adquirente conecta-se diretamente as bandeiras; o sub-adquirente usa um adquirente como intermediario", "Sub-adquirente so processa PIX", "Nao ha diferenca regulatoria entre eles"], correctIndex: 1, explanation: "O sub-adquirente (facilitador) nao tem conexao direta com as bandeiras — usa a infraestrutura de um adquirente licenciado, simplificando o onboarding de comerciantes." },
  { id: "fund-m8", theme: "fundamentos", difficulty: "medium", question: "O que e MCC (Merchant Category Code)?", options: ["Codigo de seguranca do terminal", "Classificacao do tipo de negocio do comerciante", "Numero de identificacao da transacao", "Codigo de erro retornado pelo emissor"], correctIndex: 1, explanation: "MCC e um codigo de 4 digitos que classifica o tipo de negocio (restaurante, posto, e-commerce, etc). Emissores usam MCCs para regras de autorizacao e programas de beneficios." },
  { id: "fund-m9", theme: "fundamentos", difficulty: "medium", question: "Qual a diferenca entre void e refund?", options: ["Sao sinonimos", "Void cancela antes do clearing; refund devolve apos liquidacao", "Void e para credito; refund para debito", "Refund e mais rapido que void"], correctIndex: 1, explanation: "Void cancela uma transacao antes dela entrar no clearing, liberando o limite imediatamente. Refund devolve o valor apos a transacao ja ter sido liquidada." },
  { id: "fund-m10", theme: "fundamentos", difficulty: "medium", question: "O que significa BIN no contexto de cartoes?", options: ["Bank Identification Number — primeiros 6-8 digitos do cartao", "Banking Integration Network", "Bilateral Interchange Negotiation", "Base Issuer Notification"], correctIndex: 0, explanation: "BIN (Bank Identification Number) sao os primeiros 6-8 digitos do cartao que identificam o emissor, bandeira, tipo de produto (credito/debito) e pais de emissao." },
  { id: "fund-h1", theme: "fundamentos", difficulty: "hard", question: "Um marketplace com GMV de R$200M/ano opera como sub-adquirente. Qual o principal risco regulatorio?", options: ["Nao ter certificacao PCI DSS", "Operar sem registro como instituicao de pagamento no Bacen", "Ultrapassar limite de transacoes do adquirente", "Nao oferecer PIX como metodo de pagamento"], correctIndex: 1, explanation: "Marketplaces que intermediam pagamentos com esse volume precisam de registro como Instituicao de Pagamento no Bacen. Operar sem registro configura exercicio irregular de atividade financeira." },
  { id: "fund-h2", theme: "fundamentos", difficulty: "hard", question: "Um PSP observa que sua taxa de autorizacao caiu 5% em transacoes com cartoes internacionais. Qual investigacao deve priorizar?", options: ["Verificar se o gateway esta com timeout elevado", "Analisar response codes por BIN range e verificar se emissores estrangeiros estao aplicando novas regras de risco cross-border", "Checar se o certificado SSL do checkout expirou", "Aumentar o limite de valor por transacao"], correctIndex: 1, explanation: "Queda de autorizacao cross-border geralmente esta relacionada a regras de risco dos emissores estrangeiros. Analisar por BIN range e response code revela se e um emissor especifico ou padrao generalizado." },
  { id: "fund-h3", theme: "fundamentos", difficulty: "hard", question: "Qual a implicacao de usar Network Token vs PAN token para transacoes recorrentes?", options: ["Nao ha diferenca pratica", "Network Token atualiza automaticamente quando o cartao e reemitido, mantendo a taxa de autorizacao", "PAN token e mais seguro que Network Token", "Network Token so funciona para transacoes presenciais"], correctIndex: 1, explanation: "Network Tokens (emitidos pela bandeira) atualizam automaticamente quando um cartao e reemitido ou expira, evitando falhas em cobranças recorrentes. PAN tokens ficam invalidos com cartao novo." },
  { id: "fund-h4", theme: "fundamentos", difficulty: "hard", question: "Em um modelo de split payment com 3 sellers, como o adquirente deve tratar a liquidacao se um dos sellers tiver chargeback?", options: ["Debita o valor total do marketplace", "Debita apenas do seller que recebeu o chargeback, mantendo os outros intactos", "Congela toda a liquidacao ate resolver a disputa", "Reparte o chargeback igualmente entre os 3 sellers"], correctIndex: 1, explanation: "Em split payment bem implementado, cada seller tem sua propria agenda de recebiveis. O chargeback deve afetar apenas o seller responsavel pela transacao disputada." },
  { id: "fund-h5", theme: "fundamentos", difficulty: "hard", question: "Por que a taxa de interchange de cartao de debito e regulamentada pelo Bacen no Brasil, mas a de credito nao?", options: ["Debito tem maior risco de fraude", "O Bacen decidiu regular debito primeiro por ser mais usado pela populacao de menor renda, garantindo inclusao financeira", "Credito nao gera interchange", "A bandeira ja regula credito internamente"], correctIndex: 1, explanation: "O Bacen regulou o interchange de debito (teto de 0.5%) para reduzir custos ao comerciante e promover inclusao financeira, ja que debito e mais usado por populacao de menor renda." },
  { id: "fund-h6", theme: "fundamentos", difficulty: "hard", question: "Qual o impacto de um BIN incorreto na tabela de roteamento de um adquirente?", options: ["Nenhum — a bandeira corrige automaticamente", "Transacoes podem ser enviadas ao emissor errado, causando recusas ou atrasos no clearing", "Apenas afeta transacoes internacionais", "Causa problema somente no settlement"], correctIndex: 1, explanation: "BIN tables desatualizadas podem rotear transacoes incorretamente, gerando recusas por emissor invalido, falhas de clearing e ate cobranças duplicadas em cenarios de retry." },
  { id: "fund-h7", theme: "fundamentos", difficulty: "hard", question: "Um PSP processa R$500M/mes e quer virar adquirente. Qual o principal desafio tecnico?", options: ["Implementar checkout online", "Obter conexao direta com as bandeiras (certificacao e infraestrutura ISO 8583)", "Contratar mais desenvolvedores", "Conseguir clientes comerciantes"], correctIndex: 1, explanation: "A transicao de sub-adquirente para adquirente exige conexao direta com Visa/Mastercard (certificacao, switches, HSM, ISO 8583), alem de licencas regulatorias e capital minimo." },
  { id: "fund-h8", theme: "fundamentos", difficulty: "hard", question: "Em qual cenario o adquirente assume risco de credito diretamente?", options: ["Quando o emissor recusa a transacao", "Quando liquida o comerciante antes de receber da bandeira e o comerciante sofre chargeback", "Quando o PIX falha", "Quando o gateway esta fora do ar"], correctIndex: 1, explanation: "Se o adquirente antecipa o valor ao comerciante (D+0, D+1) e depois ocorre chargeback, o adquirente precisa recuperar o valor do comerciante. Se o comerciante faliu, o adquirente absorve a perda." },
  { id: "fund-h9", theme: "fundamentos", difficulty: "hard", question: "Qual a diferenca fundamental entre payment facilitator e marketplace em termos de fluxo de fundos?", options: ["Nao ha diferenca", "O payment facilitator recebe e redistribui os fundos; o marketplace pode usar split direto no adquirente sem tocar nos fundos", "Marketplace nao pode processar cartoes", "Payment facilitator e regulado; marketplace nao"], correctIndex: 1, explanation: "Payment facilitator (PF) recebe o valor total e redistribui aos sub-merchants. Marketplaces modernos usam split no adquirente, onde o fundo vai direto para cada seller sem passar pelo marketplace." },
  { id: "fund-h10", theme: "fundamentos", difficulty: "hard", question: "Por que transacoes card-not-present (CNP) tem interchange maior que card-present (CP)?", options: ["CNP usa mais banda de rede", "O risco de fraude em CNP e significativamente maior, e o interchange compensa o emissor por esse risco", "CP tem menor valor medio", "CNP envolve mais partes na transacao"], correctIndex: 1, explanation: "Transacoes CNP (e-commerce) tem risco de fraude 5-10x maior que CP (presencial). O interchange mais alto compensa o emissor pelo risco adicional de aprovar sem verificacao fisica do cartao." },

  // ============================================================================
  // THEME: Autorizacao & Processamento (30 questions)
  // ============================================================================
  { id: "auth-e1", theme: "autorizacao", difficulty: "easy", question: "O que e 3D Secure (3DS)?", options: ["Protocolo de criptografia de dados", "Protocolo de autenticacao do portador durante compras online", "Sistema de backup de transacoes", "Metodo de pagamento alternativo"], correctIndex: 1, explanation: "3D Secure e um protocolo que adiciona uma camada de autenticacao do portador em transacoes CNP, transferindo a responsabilidade de fraude para o emissor quando bem-sucedido." },
  { id: "auth-e2", theme: "autorizacao", difficulty: "easy", question: "O que significa response code '00' em uma autorizacao?", options: ["Transacao recusada", "Transacao aprovada", "Cartao invalido", "Timeout na comunicacao"], correctIndex: 1, explanation: "Response code '00' e o codigo universal de aprovacao. Significa que o emissor autorizou a transacao com sucesso." },
  { id: "auth-e3", theme: "autorizacao", difficulty: "easy", question: "O que e um soft decline?", options: ["Recusa definitiva pelo emissor", "Recusa temporaria que pode ser resolvida com retry", "Erro no gateway", "Cancelamento pelo portador"], correctIndex: 1, explanation: "Soft decline e uma recusa temporaria (ex: limite momentaneamente insuficiente, timeout) que pode ser revertida com retry. Hard decline e definitiva (cartao cancelado, fraude confirmada)." },
  { id: "auth-e4", theme: "autorizacao", difficulty: "easy", question: "O que e AVS (Address Verification Service)?", options: ["Servico de verificacao de antivirus", "Verificacao do endereco de cobranca do portador junto ao emissor", "Sistema de validacao do adquirente", "Protocolo de seguranca da bandeira"], correctIndex: 1, explanation: "AVS compara o endereco informado pelo portador no checkout com o endereco cadastrado no emissor. E uma ferramenta antifraude comum em mercados como EUA e UK." },
  { id: "auth-e5", theme: "autorizacao", difficulty: "easy", question: "Qual e a funcao do CVV/CVC?", options: ["Identificar o banco emissor", "Servir como codigo de seguranca para transacoes CNP", "Criptografar a comunicacao", "Definir o limite do cartao"], correctIndex: 1, explanation: "CVV/CVC (Card Verification Value/Code) e o codigo de 3-4 digitos no cartao que prova que o comprador tem o cartao fisico em maos durante compras CNP." },
  { id: "auth-e6", theme: "autorizacao", difficulty: "easy", question: "O que e pre-autorizacao?", options: ["Autorizacao feita antes do comerciante existir", "Reserva de valor no cartao sem captura imediata", "Autorizacao automatica sem verificacao", "Primeiro passo do cadastro do comerciante"], correctIndex: 1, explanation: "Pre-autorizacao reserva um valor no limite do cartao (ex: hotel, locadora de carros) sem debitar. A captura do valor real ocorre depois, podendo ser menor que o pre-autorizado." },
  { id: "auth-e7", theme: "autorizacao", difficulty: "easy", question: "O que e BIN lookup?", options: ["Consultar o saldo do cartao", "Identificar emissor, bandeira e tipo de cartao pelos primeiros digitos", "Verificar se o cartao esta bloqueado", "Consultar historico de transacoes"], correctIndex: 1, explanation: "BIN lookup usa os primeiros 6-8 digitos do cartao para identificar o emissor, bandeira, pais de emissao e tipo (credito/debito/prepago), permitindo roteamento e regras de risco." },
  { id: "auth-e8", theme: "autorizacao", difficulty: "easy", question: "O que acontece se a captura nao for feita apos autorizacao?", options: ["A transacao e aprovada automaticamente", "A autorizacao expira e o limite e liberado ao portador", "O comerciante e multado", "O emissor cobra o valor mesmo sem captura"], correctIndex: 1, explanation: "Se o comerciante nao capturar dentro do prazo (geralmente 5-30 dias dependendo da bandeira/MCC), a autorizacao expira e o limite reservado volta para o portador." },
  { id: "auth-m1", theme: "autorizacao", difficulty: "medium", question: "Qual a diferenca entre 3DS 1.0 e 3DS 2.0?", options: ["3DS 2.0 elimina completamente a autenticacao", "3DS 2.0 usa analise de risco com mais dados e permite autenticacao frictionless", "3DS 1.0 e mais seguro", "Nao ha diferenca significativa"], correctIndex: 1, explanation: "3DS 2.0 envia 10x mais dados ao emissor para analise de risco, permitindo autenticacao silenciosa (frictionless) em transacoes de baixo risco, reduzindo abandono de 30% para menos de 5%." },
  { id: "auth-m2", theme: "autorizacao", difficulty: "medium", question: "O que e liability shift no contexto de 3DS?", options: ["Transferencia de dados entre sistemas", "A responsabilidade por fraude passa do comerciante para o emissor quando 3DS e usado", "O emissor assume a operacao do gateway", "O comerciante passa a emitir cartoes"], correctIndex: 1, explanation: "Com 3DS autenticado com sucesso, se houver fraude, o emissor (nao o comerciante) e responsavel pelo chargeback. Isso incentiva comerciantes a implementar 3DS." },
  { id: "auth-m3", theme: "autorizacao", difficulty: "medium", question: "O que e cascade routing em processamento de pagamentos?", options: ["Roteamento sequencial por multiplos adquirentes em caso de recusa", "Envio paralelo para todos os adquirentes simultaneamente", "Roteamento baseado em localizacao geografica", "Backup de dados em cascata"], correctIndex: 0, explanation: "Cascade routing reenvia a transacao para um segundo (ou terceiro) adquirente quando o primeiro recusa. E eficaz para soft declines e pode aumentar a taxa de aprovacao em 3-8%." },
  { id: "auth-m4", theme: "autorizacao", difficulty: "medium", question: "Qual response code indica 'Do Not Honor' e o que significa?", options: ["Response code 05 — o emissor recusou sem especificar motivo", "Response code 14 — cartao invalido", "Response code 51 — saldo insuficiente", "Response code 00 — aprovada"], correctIndex: 0, explanation: "Response code 05 (Do Not Honor) e a recusa mais generica do emissor. Pode indicar regras internas de risco, limite, ou outros fatores que o emissor nao revela ao comerciante." },
  { id: "auth-m5", theme: "autorizacao", difficulty: "medium", question: "O que e account updater e por que e importante para recorrencias?", options: ["Sistema de atualizacao de cadastro do comerciante", "Servico que atualiza automaticamente dados de cartoes reemitidos para manter cobranças ativas", "Ferramenta de atualizacao de firmware do terminal", "Sistema de atualizacao de regras de fraude"], correctIndex: 1, explanation: "Account Updater e um servico das bandeiras que atualiza automaticamente numeros e datas de cartoes reemitidos, evitando falhas em cobranças recorrentes por dados desatualizados." },
  { id: "auth-m6", theme: "autorizacao", difficulty: "medium", question: "Qual a diferenca entre authorization reversal e void?", options: ["Sao a mesma coisa", "Reversal desfaz a autorizacao em tempo real; void cancela antes do batch de clearing", "Void e mais rapido que reversal", "Reversal so funciona para debito"], correctIndex: 1, explanation: "Authorization reversal libera o hold no cartao imediatamente via mensagem online. Void cancela antes do batch de clearing ser enviado. Ambos evitam que a transacao va para settlement." },
  { id: "auth-m7", theme: "autorizacao", difficulty: "medium", question: "Por que retry automatico em hard declines e problematico?", options: ["Aumenta custo de processamento", "Gera recusas repetidas que prejudicam o score do comerciante com a bandeira e podem gerar multas", "Nao ha problema em fazer retry em hard decline", "Sobrecarrega o gateway"], correctIndex: 1, explanation: "Retry em hard declines (cartao cancelado, fraude) gera tentativas inuteis que as bandeiras monitoram. Excesso de retries invalidos pode colocar o comerciante em programas de monitoramento e gerar multas." },
  { id: "auth-m8", theme: "autorizacao", difficulty: "medium", question: "O que e network tokenization e como difere de gateway tokenization?", options: ["Sao a mesma coisa com nomes diferentes", "Network token e emitido pela bandeira e atualiza automaticamente; gateway token e interno e nao atualiza", "Gateway token e mais seguro", "Network token so funciona offline"], correctIndex: 1, explanation: "Network tokens sao emitidos por Visa/Mastercard e vinculados ao dispositivo/comerciante, atualizando automaticamente com cartao novo. Gateway tokens sao mapeamentos internos que ficam invalidos com cartao reemitido." },
  { id: "auth-m9", theme: "autorizacao", difficulty: "medium", question: "O que e dual message vs single message em processamento?", options: ["Dual message usa dois protocolos; single usa um", "Dual message separa autorizacao e clearing; single message faz tudo em uma mensagem", "Single message e mais lento", "Dual message e exclusivo para e-commerce"], correctIndex: 1, explanation: "Dual message (cartao de credito) separa autorizacao (online) e clearing (batch). Single message (debito/PIX) autoriza e liquida em uma unica mensagem, ideal para transacoes instantaneas." },
  { id: "auth-m10", theme: "autorizacao", difficulty: "medium", question: "O que e zero-dollar authorization?", options: ["Transacao gratuita sem taxas", "Verificacao de validade do cartao sem cobrar nenhum valor", "Erro de processamento", "Autorizacao com valor zerado por fraude"], correctIndex: 1, explanation: "Zero-dollar auth (ou account verification) valida se o cartao esta ativo e os dados estao corretos sem reservar nenhum valor. Usado em cadastros de cartao e setup de recorrencias." },
  { id: "auth-h1", theme: "autorizacao", difficulty: "hard", question: "Um e-commerce tem taxa de autorizacao de 75% em transacoes com 3DS challenge. Qual estrategia otimizaria sem aumentar fraude?", options: ["Desativar 3DS completamente", "Implementar exemptions para transacoes de baixo risco (TRA) e otimizar dados enviados no 3DS 2.0", "Aumentar o timeout do 3DS para 5 minutos", "Exigir 3DS em todas as transacoes"], correctIndex: 1, explanation: "Transaction Risk Analysis (TRA) exemptions permitem pular challenge em transacoes de baixo risco. Enviar mais dados de device/behavioral no 3DS 2.0 aumenta aprovacao frictionless mantendo a seguranca." },
  { id: "auth-h2", theme: "autorizacao", difficulty: "hard", question: "Em uma mensagem ISO 8583, qual DE (Data Element) contem o codigo de resposta da autorizacao?", options: ["DE 38 — Authorization Code", "DE 39 — Response Code", "DE 41 — Terminal ID", "DE 43 — Card Acceptor Name"], correctIndex: 1, explanation: "DE 39 (Response Code) contem o codigo de 2 digitos que indica o resultado da autorizacao (00=aprovada, 05=do not honor, 51=insufficient funds, etc)." },
  { id: "auth-h3", theme: "autorizacao", difficulty: "hard", question: "Um PSP processa transacoes recorrentes e observa queda de 15% na taxa de autorizacao todo mes de janeiro. Qual a causa mais provavel?", options: ["Aumento de fraude no inicio do ano", "Cartoes sendo reemitidos/expirados no final do ano e dados desatualizados nas recorrencias", "Emissores com sistemas em manutencao", "Menor consumo no pos-festas"], correctIndex: 1, explanation: "Muitos cartoes tem data de expiracao em dezembro. Em janeiro, as cobranças recorrentes falham por dados desatualizados. Implementar Account Updater resolve esse problema." },
  { id: "auth-h4", theme: "autorizacao", difficulty: "hard", question: "Qual o risco de implementar retry automatico com intervalo fixo de 1 hora em soft declines?", options: ["Nenhum risco — e a pratica recomendada", "Violar regras de retry das bandeiras que exigem intervalos crescentes e limites de tentativas", "Sobrecarregar o gateway", "Aumentar a taxa de fraude"], correctIndex: 1, explanation: "Bandeiras (Visa, Mastercard) tem regras especificas de retry: intervalos minimos crescentes, limites de tentativas por periodo, e response codes que proibem retry. Violar gera multas e bloqueios." },
  { id: "auth-h5", theme: "autorizacao", difficulty: "hard", question: "Por que a taxa de autorizacao de uma wallet digital (Apple Pay/Google Pay) e tipicamente maior que cartao digitado?", options: ["Wallets tem limite maior", "A criptografia da wallet e melhor", "Network token + criptograma unico por transacao aumentam confianca do emissor na autenticidade", "Emissores favorecem Big Tech"], correctIndex: 2, explanation: "Wallets digitais usam network tokens com criptogramas unicos por transacao, provando que o dispositivo autorizado iniciou o pagamento. Isso dá ao emissor mais confianca, aumentando aprovacao em 2-6%." },
  { id: "auth-h6", theme: "autorizacao", difficulty: "hard", question: "Um adquirente recebe response code 65 (Exceeded Retry Limit) de um emissor. O que isso indica?", options: ["O portador excedeu o limite do cartao", "O comerciante ja fez tentativas demais com esse cartao e o emissor esta bloqueando retries", "O emissor esta fora do ar", "O cartao foi roubado"], correctIndex: 1, explanation: "Response code 65 indica que o emissor detectou excesso de tentativas de autorizacao para o mesmo cartao. Continuar tentando pode gerar multas da bandeira e prejudicar a reputacao do comerciante." },
  { id: "auth-h7", theme: "autorizacao", difficulty: "hard", question: "Qual a vantagem do MIT (Merchant Initiated Transaction) framework da Visa para recorrencias?", options: ["Permite cobranças sem autorizacao", "Categoriza transacoes por tipo (recurring, installment, resubmission) com regras especificas de retry e liability", "Reduz o interchange para zero", "Elimina a necessidade de tokenizacao"], correctIndex: 1, explanation: "MIT framework classifica transacoes iniciadas pelo comerciante por tipo especifico, cada um com regras proprias de retry, isenções e liability. Isso otimiza aprovacao e compliance simultaneamente." },
  { id: "auth-h8", theme: "autorizacao", difficulty: "hard", question: "Em qual cenario o comerciante perde o liability shift mesmo com 3DS autenticado?", options: ["Nunca — 3DS sempre protege o comerciante", "Quando a transacao e processada como recurring subsequente sem novo 3DS, ou quando o montante capturado excede o autorizado", "Quando o emissor aprova rapidamente", "Quando o portador usa cartao virtual"], correctIndex: 1, explanation: "O liability shift pode ser perdido se: a captura exceder o valor autorizado, a transacao for recurring sem referencia ao 3DS original, ou se o comerciante nao enviar o ECI/CAVV corretos." },
  { id: "auth-h9", theme: "autorizacao", difficulty: "hard", question: "O que e intelligent routing e como difere de cascade?", options: ["Sao a mesma coisa", "Intelligent routing escolhe o melhor adquirente antes da primeira tentativa baseado em dados historicos; cascade tenta sequencialmente apos recusa", "Intelligent routing e mais lento", "Cascade e uma forma de intelligent routing"], correctIndex: 1, explanation: "Intelligent routing analisa BIN, MCC, valor, historico de aprovacao por adquirente e custo antes de enviar a transacao. Cascade e reativo (tenta outro apos recusa). O ideal e combinar ambos." },
  { id: "auth-h10", theme: "autorizacao", difficulty: "hard", question: "Por que a Mastercard exige que retries de MIT usem o campo 'trace ID' da transacao original?", options: ["Para fins estatisticos apenas", "Para vincular a tentativa original e evitar cobrancas duplicadas, garantindo que o emissor reconheca como retry e nao nova transacao", "Para rastreamento de fraude", "Requisito tecnico sem impacto funcional"], correctIndex: 1, explanation: "O trace ID vincula o retry a transacao original, permitindo que o emissor identifique corretamente como retry (e nao nova cobranca). Sem ele, o emissor pode tratar como transacao duplicada e recusar." },

  // ============================================================================
  // THEME: Fraude & Risco (30 questions)
  // ============================================================================
  { id: "fraud-e1", theme: "fraude", difficulty: "easy", question: "O que e friendly fraud?", options: ["Fraude cometida por funcionarios da empresa", "Portador legitimo disputa uma compra que ele mesmo fez", "Fraude entre amigos que compartilham cartao", "Fraude com valor baixo"], correctIndex: 1, explanation: "Friendly fraud ocorre quando o portador faz uma compra legitima mas depois disputa como fraude no emissor, seja por nao reconhecer o descriptor, arrependimento ou ma-fe." },
  { id: "fraud-e2", theme: "fraude", difficulty: "easy", question: "O que e card testing?", options: ["Teste de estresse do sistema de pagamento", "Fraudadores testam cartoes roubados com transacoes pequenas para verificar se estao ativos", "Teste de qualidade do cartao fisico", "Verificacao de BIN pelo emissor"], correctIndex: 1, explanation: "Card testing e quando fraudadores fazem muitas transacoes de baixo valor para verificar quais cartoes roubados estao ativos antes de fazer compras maiores." },
  { id: "fraud-e3", theme: "fraude", difficulty: "easy", question: "O que e device fingerprinting?", options: ["Leitura da impressao digital no celular", "Coleta de atributos do dispositivo para criar identificacao unica", "Criptografia dos dados do cartao", "Verificacao de GPS do portador"], correctIndex: 1, explanation: "Device fingerprinting coleta informacoes como browser, OS, resolucao, timezone, plugins para criar uma 'impressao digital' unica do dispositivo, ajudando a identificar fraudadores." },
  { id: "fraud-e4", theme: "fraude", difficulty: "easy", question: "O que e velocity check?", options: ["Verificacao da velocidade da internet", "Regra que limita numero de transacoes por cartao/IP/device em um periodo", "Teste de performance do gateway", "Medição de tempo de resposta do emissor"], correctIndex: 1, explanation: "Velocity check detecta padroes anomalos como muitas transacoes do mesmo cartao em curto periodo, indicando possivel fraude ou card testing." },
  { id: "fraud-e5", theme: "fraude", difficulty: "easy", question: "O que e phishing no contexto de fraude de pagamentos?", options: ["Ataque tecnico ao servidor do banco", "Tecnica de enganar usuarios para revelar dados sensiveis como senhas e dados de cartao", "Interceptacao de comunicacao entre sistemas", "Clonagem fisica do cartao"], correctIndex: 1, explanation: "Phishing usa emails, sites ou mensagens falsos que imitam entidades legitimas para enganar vitimas e capturar credenciais, dados de cartao e outras informacoes sensiveis." },
  { id: "fraud-e6", theme: "fraude", difficulty: "easy", question: "Qual a diferenca entre fraude de identidade e account takeover?", options: ["Sao a mesma coisa", "Fraude de identidade cria contas com dados roubados; ATO invade contas existentes", "Account takeover e mais raro", "Fraude de identidade so ocorre presencialmente"], correctIndex: 1, explanation: "Fraude de identidade usa dados pessoais roubados para criar novas contas. Account takeover (ATO) compromete contas existentes de usuarios legitimos para fazer transacoes fraudulentas." },
  { id: "fraud-e7", theme: "fraude", difficulty: "easy", question: "O que e chargeback no contexto de fraude?", options: ["Cobranca adicional ao comerciante", "Processo onde o portador contesta uma transacao e o emissor reverte o valor", "Multa aplicada pela bandeira", "Taxa de processamento de fraude"], correctIndex: 1, explanation: "Chargeback e o mecanismo de protecao ao consumidor onde o portador contesta uma transacao no emissor, que inicia processo de reversao do valor junto ao adquirente e comerciante." },
  { id: "fraud-e8", theme: "fraude", difficulty: "easy", question: "O que e um sistema antifraude baseado em regras?", options: ["Sistema que usa inteligencia artificial", "Sistema que bloqueia/aprova transacoes com base em regras pre-definidas (ex: valor > R$5000, pais diferente)", "Sistema operado manualmente", "Sistema da bandeira de cartao"], correctIndex: 1, explanation: "Sistemas baseados em regras usam condicoes pre-definidas (valor, pais, horario, device) para classificar transacoes como suspeitas ou nao. Sao simples mas inflexiveis e geram falsos positivos." },
  { id: "fraud-m1", theme: "fraude", difficulty: "medium", question: "Qual a diferenca entre fraud scoring e fraud rules?", options: ["Sao abordagens identicas", "Scoring usa ML para calcular probabilidade; rules usam condicoes binarias pre-definidas", "Rules sao mais precisas que scoring", "Scoring so funciona para cartoes"], correctIndex: 1, explanation: "Fraud scoring usa modelos de ML que calculam uma probabilidade (0-100) de fraude. Rules sao condicoes if-then rigidas. A combinacao de ambos e a pratica mais eficaz." },
  { id: "fraud-m2", theme: "fraude", difficulty: "medium", question: "O que e triangulation fraud?", options: ["Fraude envolvendo tres bancos", "Fraudador cria loja falsa, recebe pedido real, compra com cartao roubado e envia ao cliente", "Ataque a tres camadas do sistema", "Fraude com tres cartoes diferentes"], correctIndex: 1, explanation: "Na triangulation fraud, o fraudador monta loja com precos baixos, recebe pedidos reais, compra o produto com cartao roubado em loja legitima e envia ao cliente real. O dono do cartao roubado sofre o chargeback." },
  { id: "fraud-m3", theme: "fraude", difficulty: "medium", question: "Por que a taxa de falso positivo e tao critica quanto a taxa de fraude real?", options: ["Falsos positivos nao sao criticos", "Cada falso positivo bloqueia uma venda legitima, causando perda de receita e experiencia ruim do cliente", "Falsos positivos aumentam a fraude real", "So importa para e-commerce de luxo"], correctIndex: 1, explanation: "Falsos positivos bloqueiam clientes reais: estima-se que para cada R$1 de fraude evitado, R$30 sao perdidos em vendas legitimas bloqueadas. O equilibrio entre fraude e falso positivo e o grande desafio." },
  { id: "fraud-m4", theme: "fraude", difficulty: "medium", question: "O que e behavioral biometrics como ferramenta antifraude?", options: ["Reconhecimento facial no checkout", "Analise de padroes de digitacao, movimentacao do mouse e interacao com o dispositivo", "Verificacao de impressao digital no celular", "Analise de voz durante ligacao telefonica"], correctIndex: 1, explanation: "Behavioral biometrics analisa como o usuario interage (velocidade de digitacao, padrao de scroll, pressao no touch) para diferenciar o usuario real de um fraudador ou bot." },
  { id: "fraud-m5", theme: "fraude", difficulty: "medium", question: "O que e BIN attack e como detectar?", options: ["Ataque ao servidor do banco emissor", "Tentativa massiva de gerar numeros de cartao validos a partir de BINs conhecidos, detectavel por alta taxa de recusas em sequencia", "Ataque DDoS ao sistema de autorizacao", "Fraude com BINs internacionais"], correctIndex: 1, explanation: "BIN attack gera numeros sequenciais a partir de BINs conhecidos, tentando encontrar cartoes validos. Detecta-se por alto volume de tentativas com numeros sequenciais e alta taxa de recusa." },
  { id: "fraud-m6", theme: "fraude", difficulty: "medium", question: "Qual o papel do consortium data em prevencao de fraude?", options: ["Dados compartilhados entre bancos centrais", "Dados de fraude compartilhados entre comerciantes/PSPs que permitem identificar padroes cross-merchant", "Dados publicos de cartoes roubados", "Informacoes de credito dos consumidores"], correctIndex: 1, explanation: "Consortium data agrega informacoes de fraude de multiplos comerciantes, permitindo identificar fraudadores que atacam varias lojas com os mesmos dados de cartao ou device." },
  { id: "fraud-m7", theme: "fraude", difficulty: "medium", question: "O que e a diferenca entre first-party fraud e third-party fraud?", options: ["First-party e online; third-party e presencial", "First-party e cometida pelo proprio portador; third-party por alguem usando dados roubados de outra pessoa", "First-party e mais grave legalmente", "Nao ha diferenca pratica"], correctIndex: 1, explanation: "First-party fraud (friendly fraud) e quando o proprio portador faz a disputa desonesta. Third-party fraud e quando um criminoso usa dados roubados de outra pessoa para comprar." },
  { id: "fraud-m8", theme: "fraude", difficulty: "medium", question: "O que e risk-based authentication (RBA)?", options: ["Autenticacao com pergunta de seguranca", "Nivel de autenticacao varia conforme o risco calculado da transacao — baixo risco pula desafio", "Autenticacao biometrica obrigatoria", "Sistema de autenticacao do emissor"], correctIndex: 1, explanation: "RBA avalia o risco da transacao em tempo real (valor, device, comportamento) e aplica autenticacao proporcional: baixo risco = frictionless, alto risco = challenge (OTP, biometria)." },
  { id: "fraud-m9", theme: "fraude", difficulty: "medium", question: "O que e a window de chargeback e por que importa para gestao de fraude?", options: ["Tempo para o comerciante processar a venda", "Periodo em que o portador pode disputar (120-540 dias), afetando por quanto tempo o comerciante carrega risco", "Prazo para o emissor aprovar transacoes", "Tempo de liquidacao do adquirente"], correctIndex: 1, explanation: "A chargeback window (geralmente 120 dias, ate 540 para alguns tipos) define por quanto tempo uma transacao pode ser contestada. Comerciantes com ciclo de entrega longo ficam expostos por mais tempo." },
  { id: "fraud-m10", theme: "fraude", difficulty: "medium", question: "O que e address mismatch como indicador de fraude?", options: ["Erro de digitacao do CEP", "Quando endereco de entrega difere significativamente do endereco de cobranca do cartao", "Conflito entre endereco do emissor e do adquirente", "Comerciante com endereco incorreto no cadastro"], correctIndex: 1, explanation: "Quando o endereco de entrega e muito diferente do endereco de cobranca (especialmente em cidades/estados diferentes), pode indicar que alguem usa cartao roubado para enviar produto a outro endereco." },
  { id: "fraud-h1", theme: "fraude", difficulty: "hard", question: "Um e-commerce de eletronicos tem taxa de chargeback de 0.95% e recebeu notificacao do VDMP da Visa. Qual sequencia de acoes e mais eficaz?", options: ["Bloquear todas as transacoes internacionais", "Implementar 3DS obrigatorio, revisar regras de fraude, adicionar RDR/CDRN, e criar programa de resolucao pre-dispute", "Aumentar o preco para cobrir as perdas", "Trocar de adquirente"], correctIndex: 1, explanation: "VDMP exige acoes multiplas: 3DS reduz fraude com liability shift, RDR/CDRN resolve disputas antes de virarem chargeback, e resolucao pre-dispute (Verifi/Ethoca) previne o registro do chargeback." },
  { id: "fraud-h2", theme: "fraude", difficulty: "hard", question: "Qual a limitacao principal de modelos de ML supervisionado em deteccao de fraude?", options: ["Sao lentos demais para tempo real", "Dependem de labels historicos que tem atraso (fraude so e confirmada semanas/meses depois) e nao detectam padroes ineditos", "Nao funcionam com dados de cartao", "Exigem muitos dados pessoais"], correctIndex: 1, explanation: "Modelos supervisionados treinam com fraudes conhecidas, que so sao confirmadas semanas apos ocorrerem. Novos padroes de fraude nao existem no training data. Modelos nao-supervisionados (anomaly detection) complementam essa limitacao." },
  { id: "fraud-h3", theme: "fraude", difficulty: "hard", question: "Um PSP observa aumento de 300% em card testing vindo de IPs diferentes mas com o mesmo fingerprint de browser. Qual a melhor abordagem?", options: ["Bloquear todos os IPs detectados", "Implementar rate limiting por device fingerprint + CAPTCHA adaptativo + 3DS no primeiro uso do cartao", "Desativar pagamentos com cartao temporariamente", "Notificar todos os emissores"], correctIndex: 1, explanation: "IPs mudam facilmente (VPN/proxy), mas o device fingerprint persiste. Rate limiting por fingerprint e mais eficaz. CAPTCHA adaptativo impede bots e 3DS no primeiro uso valida a posse do cartao." },
  { id: "fraud-h4", theme: "fraude", difficulty: "hard", question: "O que e enumeration attack e como difere de card testing?", options: ["Sao a mesma coisa", "Enumeration tenta descobrir combinacoes validas de PAN+CVV+expiry por tentativa e erro; card testing valida cartoes ja completos", "Enumeration e um ataque ao emissor; card testing ao comerciante", "Card testing usa bots; enumeration e manual"], correctIndex: 1, explanation: "Enumeration ataca APIs de pagamento tentando sistematicamente combinacoes de CVV/expiry para um PAN ate encontrar a combinacao correta. Card testing valida cartoes cujos dados completos ja foram obtidos." },
  { id: "fraud-h5", theme: "fraude", difficulty: "hard", question: "Por que a taxa de fraude sozinha nao e uma boa metrica de performance do sistema antifraude?", options: ["Porque fraude e rara demais para medir", "Porque nao captura o custo de falsos positivos — o antifraude pode estar bloqueando vendas legitimas para manter a taxa baixa", "Porque os emissores ja previnem toda fraude", "Porque a taxa muda muito rapido"], correctIndex: 1, explanation: "Um sistema que bloqueia tudo tera fraude zero mas revenue zero. A metrica correta combina taxa de fraude + taxa de falso positivo + taxa de aprovacao. O objetivo e minimizar fraude com impacto minimo em vendas legitimas." },
  { id: "fraud-h6", theme: "fraude", difficulty: "hard", question: "Qual tecnica de fraude explora a janela entre autorizacao e clearing?", options: ["Phishing", "O fraudador faz compra, recebe o produto na janela pre-clearing, e depois contesta antes da captura ou explora void/refund", "Skimming", "Man-in-the-middle"], correctIndex: 1, explanation: "Fraudadores exploram a janela autorizacao-clearing para receber mercadoria antes que o comerciante possa confirmar legitimidade. Atraso na captura + entrega rapida criam vulnerabilidade temporal." },
  { id: "fraud-h7", theme: "fraude", difficulty: "hard", question: "O que e synthetic identity fraud e por que e particularmente dificil de detectar?", options: ["Fraude com cartao clonado", "Criacao de identidade combinando dados reais e ficticios, construindo historico de credito real antes de 'bust out'", "Uso de identidade de pessoa falecida", "Fraude corporativa"], correctIndex: 1, explanation: "Synthetic identity combina CPF real com dados ficticios, constroi historico de credito por meses/anos fazendo pagamentos em dia, depois maximiza credito e desaparece. Sem vitima real reclamando, e muito dificil detectar." },
  { id: "fraud-h8", theme: "fraude", difficulty: "hard", question: "Em um modelo de ML para fraude, por que o balanceamento de classes e critico?", options: ["Nao e critico — dados desbalanceados funcionam bem", "Fraude representa menos de 1% das transacoes; sem balanceamento o modelo aprende a classificar tudo como 'nao-fraude' e ter 99% de acuracia ilusoria", "Balanceamento e necessario so para modelos simples", "Afeta apenas a velocidade do treinamento"], correctIndex: 1, explanation: "Com 0.1-1% de fraude, um modelo naive que sempre diz 'nao-fraude' tem 99%+ de acuracia. Tecnicas como SMOTE, undersampling ou class weights sao essenciais para o modelo aprender padroes de fraude reais." },
  { id: "fraud-h9", theme: "fraude", difficulty: "hard", question: "O que e a estrategia de 'fraud ring detection' e qual tecnologia a habilita?", options: ["Deteccao de fraude por machine learning", "Uso de graph analytics para identificar conexoes ocultas entre contas, dispositivos e transacoes que formam redes organizadas de fraude", "Monitoramento de redes sociais de fraudadores", "Analise de padroes de voz em call centers"], correctIndex: 1, explanation: "Graph analytics revela conexoes ocultas: mesmo device em 50 contas, enderecos compartilhados, padroes de transacoes coordenadas. Redes de fraude organizada sao invisiveis em analise individual mas claras em grafos." },
  { id: "fraud-h10", theme: "fraude", difficulty: "hard", question: "Qual o trade-off ao implementar 3DS mandatorio em todas as transacoes de um e-commerce?", options: ["Nenhum trade-off — mais seguranca e sempre melhor", "Reduce fraude e chargeback mas aumenta abandono no checkout (especialmente 3DS challenge) e pode reduzir conversao em 10-30%", "Apenas aumenta custo de processamento", "Elimina toda necessidade de antifraude"], correctIndex: 1, explanation: "3DS mandatorio reduz fraude em 60-80% mas aumenta fricção. Challenge 3DS tem abandono de 20-30%. A estrategia otima e usar 3DS seletivamente: exemptions para baixo risco, challenge para alto risco." },

  // ============================================================================
  // THEME: Liquidacao & Settlement (30 questions)
  // ============================================================================
  { id: "liq-e1", theme: "liquidacao", difficulty: "easy", question: "O que e clearing em pagamentos?", options: ["Processo de limpeza de dados", "Processo de troca de informacoes financeiras entre adquirente e emissor para reconciliar transacoes", "Limpeza de transacoes fraudulentas", "Processo de autorizacao"], correctIndex: 1, explanation: "Clearing e a fase onde informacoes detalhadas das transacoes sao trocadas entre adquirente e emissor via bandeira, determinando os valores liquidos a serem transferidos no settlement." },
  { id: "liq-e2", theme: "liquidacao", difficulty: "easy", question: "O que significa D+2 na liquidacao?", options: ["Deadline de 2 meses", "Valor disponivel para o comerciante 2 dias uteis apos a transacao", "Desconto de 2%", "Dois dias para o portador contestar"], correctIndex: 1, explanation: "D+2 significa que o comerciante recebe o valor 2 dias uteis apos a captura da transacao. E o prazo padrao de liquidacao para credito a vista no Brasil." },
  { id: "liq-e3", theme: "liquidacao", difficulty: "easy", question: "O que e split de pagamento?", options: ["Divisao de uma compra em parcelas", "Distribuicao automatica do valor de uma transacao entre multiplos recebedores", "Pagamento dividido entre dois cartoes", "Split de rede entre adquirentes"], correctIndex: 1, explanation: "Split de pagamento divide automaticamente o valor entre marketplace e sellers (ou entre sub-contas), cada um recebendo sua parte na liquidacao." },
  { id: "liq-e4", theme: "liquidacao", difficulty: "easy", question: "O que e agenda de recebiveis?", options: ["Calendario de pagamentos do portador", "Cronograma de valores futuros que o comerciante tem a receber do adquirente", "Agenda de reunioes do time financeiro", "Lista de cobranças pendentes"], correctIndex: 1, explanation: "A agenda de recebiveis mostra todos os valores futuros que o comerciante recebera, organizados por data de liquidacao. E a base para antecipacao de recebiveis." },
  { id: "liq-e5", theme: "liquidacao", difficulty: "easy", question: "Qual a diferenca entre liquidacao bruta e liquida?", options: ["Nao ha diferenca", "Bruta liquida cada transacao individualmente; liquida compensa posicoes e transfere apenas o saldo", "Bruta e mais rapida", "Liquida e exclusiva para PIX"], correctIndex: 1, explanation: "Liquidacao bruta (RTGS) transfere cada transacao individualmente em tempo real. Liquidacao liquida (netting) compensa debitos e creditos entre as partes e transfere apenas a diferenca." },
  { id: "liq-e6", theme: "liquidacao", difficulty: "easy", question: "O que e reconciliacao em pagamentos?", options: ["Processo de unir dois sistemas de pagamento", "Comparacao entre registros de transacoes de diferentes fontes para garantir consistencia", "Reuniao entre adquirente e comerciante", "Recalculo de taxas"], correctIndex: 1, explanation: "Reconciliacao compara registros de transacoes do gateway, adquirente, banco e sistema interno do comerciante para identificar discrepancias e garantir que tudo bata." },
  { id: "liq-e7", theme: "liquidacao", difficulty: "easy", question: "O que e settlement em pagamentos?", options: ["Negociacao de taxas", "Transferencia efetiva de fundos entre as partes apos o clearing", "Configuracao inicial do terminal", "Acordo comercial entre partes"], correctIndex: 1, explanation: "Settlement e a transferencia efetiva de dinheiro entre as partes (emissor paga bandeira, bandeira paga adquirente, adquirente paga comerciante) apos o clearing ter determinado os valores." },
  { id: "liq-e8", theme: "liquidacao", difficulty: "easy", question: "O que e um extrato de liquidacao?", options: ["Extrato bancario do portador", "Relatorio detalhado enviado pelo adquirente ao comerciante com transacoes e valores liquidados", "Documento regulatorio do Bacen", "Nota fiscal da transacao"], correctIndex: 1, explanation: "O extrato de liquidacao detalha cada transacao processada, taxas cobradas e valor liquido depositado. E o documento-chave para a reconciliacao do comerciante." },
  { id: "liq-m1", theme: "liquidacao", difficulty: "medium", question: "Por que o prazo de liquidacao para cartao de credito parcelado e diferente do a vista?", options: ["Nao ha diferenca", "Cada parcela e liquidada no seu respectivo vencimento (D+30, D+60, etc), espelhando o fluxo de recebimento do emissor", "Parcelado liquida mais rapido", "So depende do adquirente"], correctIndex: 1, explanation: "No parcelado lojista, cada parcela e liquidada separadamente: 1a parcela em D+30, 2a em D+60, etc. O adquirente recebe do emissor conforme cada parcela vence e repassa ao comerciante." },
  { id: "liq-m2", theme: "liquidacao", difficulty: "medium", question: "O que e net settlement e quando e usado?", options: ["Liquidacao via internet", "Compensacao de debitos e creditos entre duas partes para transferir apenas o saldo liquido", "Liquidacao em tempo real", "Settlement exclusivo para PIX"], correctIndex: 1, explanation: "Net settlement compensa posicoes: se o banco A deve R$100 ao banco B e B deve R$70 ao A, transfere-se apenas R$30. Usado em clearing houses para reduzir volume de transferencias." },
  { id: "liq-m3", theme: "liquidacao", difficulty: "medium", question: "Qual o papel da CIP (Camara Interbancaria de Pagamentos) na liquidacao?", options: ["Regular os bancos", "Operar a infraestrutura de clearing e settlement interbancario no Brasil", "Emitir cartoes de pagamento", "Fiscalizar fraudes"], correctIndex: 1, explanation: "A CIP opera sistemas de clearing e settlement interbancario no Brasil, incluindo a infraestrutura do PIX, SLC (compensacao de cheques) e SILOC (liquidacao de boletos)." },
  { id: "liq-m4", theme: "liquidacao", difficulty: "medium", question: "O que e holdback e quando um adquirente aplica?", options: ["Bonus retido para o proximo mes", "Retencao de parte do valor liquidado como garantia contra chargebacks futuros", "Bloqueio do cartao do portador", "Retencao de impostos"], correctIndex: 1, explanation: "Holdback (ou reserve) e quando o adquirente retém parte do valor liquidado (ex: 5-10%) como garantia contra chargebacks futuros. Comum em comerciantes de alto risco ou novos." },
  { id: "liq-m5", theme: "liquidacao", difficulty: "medium", question: "Como funciona a liquidacao de PIX entre bancos diferentes?", options: ["Transferencia direta entre os bancos", "Via sistema de liquidacao do Bacen (SPI) com liquidacao bruta em tempo real", "Via boleto interbancario", "Via bandeira de cartao"], correctIndex: 1, explanation: "PIX usa o SPI (Sistema de Pagamentos Instantaneos) do Bacen para liquidar em tempo real (RTGS). Cada transferencia e liquidada individualmente na conta PI dos participantes no Bacen." },
  { id: "liq-m6", theme: "liquidacao", difficulty: "medium", question: "O que e chargeback reversal no contexto de liquidacao?", options: ["Cancelamento da compra", "Processo onde o adquirente debita o valor do chargeback da conta do comerciante", "Devolucao do produto", "Reversao da autorizacao"], correctIndex: 1, explanation: "Quando um chargeback e aceito, o adquirente debita o valor (mais taxa de chargeback) da proxima liquidacao do comerciante ou de sua reserva. O fluxo de fundos e: comerciante -> adquirente -> bandeira -> emissor -> portador." },
  { id: "liq-m7", theme: "liquidacao", difficulty: "medium", question: "O que e o conceito de float na liquidacao?", options: ["Erro de arredondamento", "Periodo em que o dinheiro esta em transito e pode ser usado/investido pela parte que o detem", "Variacao cambial", "Taxa de juros do adquirente"], correctIndex: 1, explanation: "Float e o tempo entre o debito e o credito final. Quem detem o dinheiro nesse periodo pode investir/usar. Adquirentes que liquidam em D+30 tem float significativo que gera receita financeira." },
  { id: "liq-m8", theme: "liquidacao", difficulty: "medium", question: "O que e o regime de registro de recebiveis e por que foi criado?", options: ["Sistema de registro de clientes", "Obrigacao de registrar recebiveis em registradoras autorizadas para dar transparencia e permitir uso como garantia de credito", "Registro de comerciantes no adquirente", "Sistema de nota fiscal eletronica"], correctIndex: 1, explanation: "O Bacen exige que recebiveis de cartao sejam registrados em registradoras (TAG, CERC, CIP) para dar transparencia ao mercado, evitar trava duplicada e permitir que comerciantes usem recebiveis como garantia de credito em qualquer banco." },
  { id: "liq-m9", theme: "liquidacao", difficulty: "medium", question: "O que e interchange revert e quando ocorre?", options: ["Quando o emissor devolve o interchange", "Quando a taxa de interchange e recalculada no clearing por diferenca entre qualificacao na autorizacao e dados reais", "Quando o comerciante negocia redução de interchange", "Quando a bandeira muda suas taxas"], correctIndex: 1, explanation: "Interchange revert ocorre quando a qualificacao de interchange na autorizacao difere da qualificacao final no clearing (ex: transacao autenticada na auth mas nao no clearing), resultando em cobranca de interchange diferente." },
  { id: "liq-m10", theme: "liquidacao", difficulty: "medium", question: "O que sao unidades de recebiveis (URs)?", options: ["Moeda digital do Bacen", "Fracao padronizada de recebiveis futuros de um comerciante que pode ser negociada e usada como garantia", "Unidades de medida de transacoes", "Creditos do programa de fidelidade"], correctIndex: 1, explanation: "URs sao a forma padronizada como os recebiveis sao registrados nas registradoras: combinacao de comerciante + adquirente + bandeira + data de liquidacao. Podem ser gravadas, cedidas ou dadas em garantia." },
  { id: "liq-h1", theme: "liquidacao", difficulty: "hard", question: "Um marketplace tem sellers em 3 paises diferentes. Qual o maior desafio de settlement cross-border?", options: ["Traduzir as faturas", "Gerenciar multiplas moedas, regras de FX, compliance regulatorio local e timing de liquidacao diferente por jurisdicao", "Encontrar adquirentes internacionais", "Configurar o gateway para multiplos idiomas"], correctIndex: 1, explanation: "Settlement cross-border envolve: conversao de moeda (quando e a que taxa?), regulacao local de remessa (IOF, controle cambial), prazos de liquidacao diferentes por pais, e compliance KYC/AML em cada jurisdicao." },
  { id: "liq-h2", theme: "liquidacao", difficulty: "hard", question: "Qual o risco sistêmico se uma clearing house principal falhar no meio do processo de netting?", options: ["Apenas atraso na liquidacao", "Exposição de contraparte para todos os participantes, potencial efeito cascata de inadimplência e risco de congelamento do sistema financeiro", "Nenhum — ha backups automaticos", "Apenas afeta os bancos menores"], correctIndex: 1, explanation: "Se uma CCP (Central Counterparty) falha durante netting, todas as posicoes compensadas ficam indefinidas. Participantes que contavam com receber nao recebem, gerando cascata de inadimplencia — por isso CCPs sao altamente reguladas com fundos de garantia." },
  { id: "liq-h3", theme: "liquidacao", difficulty: "hard", question: "Um adquirente identifica que 30% de suas discrepancias de reconciliacao vem de transacoes com captura parcial. Qual a causa raiz?", options: ["Erro no banco de dados", "A diferenca entre valor autorizado e capturado nao e tratada corretamente no matching, gerando falsos alertas de discrepancia", "Fraude no comerciante", "Bug no terminal POS"], correctIndex: 1, explanation: "Captura parcial (capturar menos que o autorizado, comum em pre-auth de hotel/aluguel) cria diferenca entre authorization file e clearing file. Se o sistema de reconciliacao nao trata esse cenario, gera falsos alertas de discrepancia." },
  { id: "liq-h4", theme: "liquidacao", difficulty: "hard", question: "O que e o conceito de 'settlement risk' e como o modelo RTGS o mitiga?", options: ["Risco de taxas muito altas", "Risco de uma parte nao entregar sua obrigacao apos a outra ja ter entregado; RTGS mitiga com liquidacao simultanea e irrevogavel em tempo real", "Risco de atraso na compensacao", "Risco do banco central falir"], correctIndex: 1, explanation: "Settlement risk (ou Herstatt risk) e o risco de descasamento: parte A entrega mas parte B nao. RTGS liquida em tempo real com finalidade (irrevogavel) usando fundos ja disponiveis no banco central, eliminando esse risco." },
  { id: "liq-h5", theme: "liquidacao", difficulty: "hard", question: "Como o modelo de gravame de recebiveis afeta a decisao de credito para um comerciante?", options: ["Nao afeta — credito e independente de recebiveis", "Recebiveis gravados (dados em garantia) reduzem a disponibilidade de colateral para novos emprestimos, enquanto recebiveis livres aumentam capacidade de credito", "Gravame bloqueia toda liquidacao", "So afeta emprestimos do mesmo adquirente"], correctIndex: 1, explanation: "Se o comerciante ja gravou 80% dos recebiveis com um banco, restam apenas 20% livres para novos creditos. As registradoras permitem consultar em tempo real o % livre vs gravado de cada comerciante." },
  { id: "liq-h6", theme: "liquidacao", difficulty: "hard", question: "Qual o impacto de um erro na tabela de interchange do clearing file?", options: ["Nenhum — e corrigido automaticamente", "O adquirente pode pagar interchange errado ao emissor, causando disputa financeira e necessidade de ajuste manual no proximo ciclo", "Apenas afeta o reporting", "O comerciante nao recebe nenhum valor"], correctIndex: 1, explanation: "Interchange incorreto no clearing gera cobrança errada. Se o adquirente paga interchange a mais, perde margem. Se paga a menos, o emissor abre disputa. Ambos geram ajustes manuais custosos e atrasos." },
  { id: "liq-h7", theme: "liquidacao", difficulty: "hard", question: "Por que a interoperabilidade entre registradoras de recebiveis e critica para o ecossistema?", options: ["Para fins estatisticos", "Sem interoperabilidade, um comerciante poderia gravar o mesmo recebivel em registradoras diferentes, criando colateral fantasma", "Apenas para compliance regulatorio", "Para reduzir custos operacionais"], correctIndex: 1, explanation: "Interoperabilidade garante que o gravame feito na TAG seja visivel na CERC e CIP. Sem isso, o mesmo recebivel poderia ser dado em garantia para dois bancos diferentes, criando risco sistêmico de colateral duplicado." },
  { id: "liq-h8", theme: "liquidacao", difficulty: "hard", question: "Em qual cenario o timing de settlement cria oportunidade de arbitragem para um PSP?", options: ["Quando pode liquidar em D+0 ao comerciante e receber do adquirente em D+30", "Nao existe arbitragem em settlement", "Quando as taxas de cambio mudam", "Quando ha feriados bancarios"], correctIndex: 0, explanation: "Se o PSP recebe do adquirente em D+30 mas pode cobrar do comerciante para liquidar em D+0 (antecipacao), ele usa capital proprio ou funding para antecipar e cobra taxa de deságio — gerando receita financeira no spread temporal." },
  { id: "liq-h9", theme: "liquidacao", difficulty: "hard", question: "O que e delivery vs payment (DVP) e como se aplica a pagamentos?", options: ["Entrega versus pagamento na compra online", "Principio onde a transferencia do ativo e a transferencia do pagamento ocorrem simultaneamente e condicionalmente", "Metodo de entrega de cartao fisico", "Protocolo de comunicacao entre bancos"], correctIndex: 1, explanation: "DVP garante que a entrega do ativo so ocorre se o pagamento for feito, e vice-versa. Em pagamentos, aplica-se ao settlement de cartoes onde fundos e informacoes de clearing sao trocados simultaneamente para eliminar risco de contraparte." },
  { id: "liq-h10", theme: "liquidacao", difficulty: "hard", question: "Um adquirente processa 500M de transacoes/mes e quer reduzir sua necessidade de capital para liquidacao. Qual estrategia?", options: ["Cobrar mais MDR", "Otimizar o timing de funding usando netting mais eficiente e matching de prazos entre recebimento da bandeira e pagamento ao comerciante", "Reduzir o numero de comerciantes", "Investir em marketing"], correctIndex: 1, explanation: "A principal alavanca e o matching de prazos: receber da bandeira no mesmo dia ou antes de pagar o comerciante. Netting eficiente entre muitas transacoes reduz os valores brutos de transferencia, diminuindo a necessidade de capital." },

  // ============================================================================
  // THEME: Infraestrutura Bancaria (30 questions)
  // ============================================================================
  { id: "infra-e1", theme: "infraestrutura", difficulty: "easy", question: "O que e ISO 8583?", options: ["Norma de seguranca para data centers", "Padrao internacional de mensageria para transacoes financeiras com cartao", "Protocolo de internet banking", "Certificacao de terminais POS"], correctIndex: 1, explanation: "ISO 8583 e o padrao de mensagens usado globalmente para transacoes de cartao. Define o formato das mensagens trocadas entre terminais, adquirentes, bandeiras e emissores." },
  { id: "infra-e2", theme: "infraestrutura", difficulty: "easy", question: "O que e SPB (Sistema de Pagamentos Brasileiro)?", options: ["Software de processamento bancario", "Conjunto de sistemas e normas que disciplinam transferencias de fundos e liquidacao no Brasil", "Servico de PIX do Bacen", "Sistema de boletos"], correctIndex: 1, explanation: "O SPB e o arcabouço completo que inclui STR, SPI, CIP, COMPE e outras infraestruturas que permitem transferencias, compensacao e liquidacao no sistema financeiro brasileiro." },
  { id: "infra-e3", theme: "infraestrutura", difficulty: "easy", question: "O que e HSM (Hardware Security Module)?", options: ["Modulo de hardware para jogos", "Dispositivo fisico que gera, armazena e gerencia chaves criptograficas com seguranca", "Hub de Servicos de Messaging", "Hardware de Switch de Mensagens"], correctIndex: 1, explanation: "HSM e um dispositivo fisico tamper-proof que protege chaves criptograficas usadas em processamento de PINs, geracao de criptogramas e operacoes de seguranca em pagamentos." },
  { id: "infra-e4", theme: "infraestrutura", difficulty: "easy", question: "O que e STR (Sistema de Transferencia de Reservas)?", options: ["Sistema de rastreamento de transacoes", "Sistema RTGS do Bacen para liquidacao bruta em tempo real entre bancos", "Sistema de transmissao de relatorios", "Servico de transferencias recorrentes"], correctIndex: 1, explanation: "O STR e o sistema de liquidacao RTGS (Real Time Gross Settlement) operado pelo Bacen. Todas as transferencias de alto valor entre bancos sao liquidadas individualmente em tempo real no STR." },
  { id: "infra-e5", theme: "infraestrutura", difficulty: "easy", question: "O que e um switch de pagamentos?", options: ["Botao fisico no terminal POS", "Sistema que roteia mensagens de transacao entre diferentes participantes da rede de pagamento", "Troca de adquirente pelo comerciante", "Sistema de backup de transacoes"], correctIndex: 1, explanation: "O switch de pagamentos roteia mensagens ISO 8583 entre adquirentes, bandeiras e emissores, direcionando cada transacao para a rota correta com base no BIN, bandeira e tipo de transacao." },
  { id: "infra-e6", theme: "infraestrutura", difficulty: "easy", question: "O que e SWIFT no contexto bancario?", options: ["Tipo de transacao rapida", "Rede global de mensageria interbancaria para comunicacao segura entre bancos", "Sistema de pagamentos do Bacen", "Protocolo de criptografia"], correctIndex: 1, explanation: "SWIFT (Society for Worldwide Interbank Financial Telecommunication) e a rede global que permite bancos trocarem mensagens padronizadas para transferencias internacionais e outras operacoes." },
  { id: "infra-e7", theme: "infraestrutura", difficulty: "easy", question: "O que e EMV?", options: ["Protocolo de email bancario", "Padrao de chip para cartoes de pagamento criado por Europay, Mastercard e Visa", "Sistema de mensageria do Bacen", "Formato de extrato bancario"], correctIndex: 1, explanation: "EMV e o padrao de chip presente em cartoes de pagamento. Usa criptografia dinamica para cada transacao, sendo muito mais seguro que a tarja magnetica." },
  { id: "infra-e8", theme: "infraestrutura", difficulty: "easy", question: "O que e SPI (Sistema de Pagamentos Instantaneos)?", options: ["Sistema de pagamentos internacionais", "Infraestrutura do Bacen que operacionaliza o PIX", "Sistema de processamento interbancario", "Servico de PIX internacional"], correctIndex: 1, explanation: "O SPI e a infraestrutura operada pelo Bacen especificamente para o PIX, processando transferencias instantaneas 24/7 com liquidacao em tempo real entre participantes." },
  { id: "infra-m1", theme: "infraestrutura", difficulty: "medium", question: "Qual a diferenca entre RTGS e DNS (Deferred Net Settlement)?", options: ["Sao a mesma coisa com nomes diferentes", "RTGS liquida cada transacao individualmente em tempo real; DNS acumula transacoes e liquida o saldo liquido em horarios definidos", "DNS e mais seguro que RTGS", "RTGS so funciona para valores baixos"], correctIndex: 1, explanation: "RTGS processa cada transferencia individualmente em tempo real (STR, Fedwire). DNS acumula transacoes e compensa periodicamente, transferindo apenas o saldo liquido (COMPE, ACH). RTGS elimina risco de contraparte; DNS e mais eficiente em volume." },
  { id: "infra-m2", theme: "infraestrutura", difficulty: "medium", question: "O que sao Data Elements (DEs) na mensagem ISO 8583?", options: ["Tipos de dados no banco de dados", "Campos numerados que carregam informacoes especificas da transacao (PAN, valor, data, response code)", "Elementos de design do terminal", "Dados demograficos do portador"], correctIndex: 1, explanation: "DEs sao os campos da mensagem ISO 8583, cada um com posicao e formato definidos: DE 2 (PAN), DE 4 (valor), DE 39 (response code), DE 41 (terminal ID), etc. O bitmap indica quais DEs estao presentes na mensagem." },
  { id: "infra-m3", theme: "infraestrutura", difficulty: "medium", question: "O que e DICT no contexto do PIX?", options: ["Dicionario de termos financeiros", "Diretorio de Identificadores de Contas Transacionais — base de dados de chaves PIX", "Sistema de diagnostico de transacoes", "Dicionario de codigos de erro"], correctIndex: 1, explanation: "O DICT e o componente do PIX que mapeia chaves (CPF, celular, email, aleatoria) para contas bancarias. Quando voce paga via chave PIX, o DICT resolve a chave para a conta destino." },
  { id: "infra-m4", theme: "infraestrutura", difficulty: "medium", question: "O que e message type indicator (MTI) em ISO 8583?", options: ["Indicador de prioridade da mensagem", "Codigo de 4 digitos no inicio da mensagem que identifica versao, classe, funcao e origem", "Tipo de terminal que enviou a mensagem", "Metrica de tempo de resposta"], correctIndex: 1, explanation: "MTI e o codigo de 4 digitos que inicia cada mensagem ISO 8583. Ex: 0100 = authorization request, 0110 = authorization response, 0200 = financial request, 0400 = reversal. Cada digito indica versao, classe, funcao e origem." },
  { id: "infra-m5", theme: "infraestrutura", difficulty: "medium", question: "Como o Bacen garante alta disponibilidade do SPI para o PIX funcionar 24/7?", options: ["Usando servidores na nuvem publica", "Infraestrutura redundante com sites de contingencia, janela de manutencao minima e SLAs rigorosos para participantes", "Delegando operacao aos bancos", "Processamento em batch com fila"], correctIndex: 1, explanation: "O SPI opera com infraestrutura redundante, sites geograficamente distribuidos, failover automatico e SLAs rigorosos. Participantes devem manter disponibilidade de 99.5%+ para permanecer no ecossistema." },
  { id: "infra-m6", theme: "infraestrutura", difficulty: "medium", question: "O que e PIN block e como e transmitido?", options: ["Bloqueio do cartao apos 3 tentativas", "PIN criptografado em formato padronizado transmitido do terminal ao emissor via chain de criptografia", "Bloco de notas com PINs", "Filtro de PINs invalidos"], correctIndex: 1, explanation: "O PIN digitado no terminal e imediatamente criptografado em um 'PIN block' (formatos ISO 0-4) usando chave do HSM. E transmitido criptografado por toda a chain (terminal->adquirente->bandeira->emissor), sendo decriptado apenas no HSM do emissor." },
  { id: "infra-m7", theme: "infraestrutura", difficulty: "medium", question: "O que e COMPE e qual seu papel?", options: ["Competicao entre bancos", "Sistema de Compensacao de Pagamentos — clearing de cheques e boletos no Brasil", "Comite de pagamentos eletronicos", "Compartilhamento de dados"], correctIndex: 1, explanation: "COMPE (Centralizadora da Compensacao de Cheques e Outros Papeis) e operada pelo Banco do Brasil e processa a compensacao de cheques. Historicamente muito importante, hoje com volume declinante pelo PIX." },
  { id: "infra-m8", theme: "infraestrutura", difficulty: "medium", question: "O que e tokenization service provider (TSP) e quem opera?", options: ["Servico de token digital", "Servico operado pelas bandeiras que gera e gerencia network tokens vinculados a PANs", "Provedor de criptomoedas", "Sistema de autenticacao biometrica"], correctIndex: 1, explanation: "TSPs sao operados pelas bandeiras (Visa Token Service, Mastercard Digital Enablement Service) e gerenciam o ciclo de vida dos network tokens: emissao, mapeamento PAN<->token, atualizacao e invalidacao." },
  { id: "infra-m9", theme: "infraestrutura", difficulty: "medium", question: "O que e PCI PIN Security?", options: ["Seguranca de senhas de internet banking", "Conjunto de requisitos para protecao de PINs em toda a cadeia de processamento de cartoes", "Protocolo de criptografia do PIX", "Padrao de seguranca para cartoes contactless"], correctIndex: 1, explanation: "PCI PIN Security define requisitos para protecao de PINs desde o ponto de captura (terminal) ate o emissor: criptografia, gerenciamento de chaves, seguranca de HSMs e transporte seguro." },
  { id: "infra-m10", theme: "infraestrutura", difficulty: "medium", question: "O que e account-to-account (A2A) payment e como se relaciona com infraestrutura bancaria?", options: ["Pagamento entre contas da mesma pessoa", "Transferencia direta entre contas bancarias sem intermediarios de cartao, usando infraestrutura bancaria (PIX, SEPA, ACH)", "Pagamento automatico de contas", "Account to Account nao existe"], correctIndex: 1, explanation: "A2A payments transferem fundos diretamente entre contas bancarias via rails bancarios (PIX, SEPA Instant, ACH, Faster Payments) sem passar por redes de cartao, eliminando interchange e reduzindo custo." },
  { id: "infra-h1", theme: "infraestrutura", difficulty: "hard", question: "Qual o impacto de latencia acima de 500ms no processamento ISO 8583 para transacoes presenciais?", options: ["Nenhum impacto perceptivel", "Timeouts na autorizacao, reversals automaticos do terminal e experiencia degradada que pode gerar transacoes duplicadas", "Apenas afeta a reconciliacao", "So impacta transacoes online"], correctIndex: 1, explanation: "Em transacoes presenciais, terminais tem timeout tipico de 30-60s. Latencia alta causa timeouts que geram reversals automaticos. Se a auth original for processada depois, cria inconsistencia que resulta em cobranca duplicada ou perda de venda." },
  { id: "infra-h2", theme: "infraestrutura", difficulty: "hard", question: "Por que a rotacao de chaves criptograficas (key rotation) em HSMs e critica e qual o risco de nao fazer?", options: ["E apenas boa pratica sem risco real", "Chaves comprometidas ou com longo tempo de uso aumentam superficie de ataque; um HSM com chave comprometida pode expor todos os PINs processados", "So e necessario para PCI compliance", "A rotacao e automatica e nao precisa de gestao"], correctIndex: 1, explanation: "Se uma chave criptografica for comprometida, todas as transacoes protegidas por ela ficam vulneraveis. Rotacao regular limita a janela de exposicao. Um HSM com master key comprometida expoe potencialmente milhoes de PINs." },
  { id: "infra-h3", theme: "infraestrutura", difficulty: "hard", question: "Qual a diferenca arquitetural entre SPI (PIX) e o modelo usado por Faster Payments (UK)?", options: ["Sao identicos", "SPI usa liquidacao bruta no banco central (RTGS); Faster Payments usa prefunding e settlement periodico em net", "Faster Payments e mais rapido", "SPI nao tem interoperabilidade"], correctIndex: 1, explanation: "O SPI liquida cada PIX individualmente no Bacen em tempo real (modelo RTGS). Faster Payments usa prefunding (bancos depositam garantia antecipada) e faz net settlement periodico, criando risco de credito residual que o SPI evita." },
  { id: "infra-h4", theme: "infraestrutura", difficulty: "hard", question: "Um banco precisa migrar de ISO 8583 para ISO 20022 para mensageria de pagamentos. Qual o maior desafio tecnico?", options: ["Mudar a linguagem de programacao", "Mapear campos ISO 8583 (bitmap com DEs fixos) para estrutura XML/JSON rica do ISO 20022, mantendo compatibilidade retroativa", "Comprar novos servidores", "Treinar a equipe"], correctIndex: 1, explanation: "ISO 20022 tem estrutura semantica muito mais rica que ISO 8583. O mapeamento nao e 1:1: um DE pode mapear para multiplos campos XML. Manter operacao dual (8583+20022) durante migracao requer translation layer robusta." },
  { id: "infra-h5", theme: "infraestrutura", difficulty: "hard", question: "O que e o conceito de 'settlement finality' e por que e critico para infraestrutura de pagamentos?", options: ["Prazo final de liquidacao", "Garantia legal e tecnica de que uma transacao liquidada e irrevogavel e nao pode ser desfeita, essencial para seguranca juridica", "Finalizacao do dia de operacao", "Ultimo horario para transferencias"], correctIndex: 1, explanation: "Settlement finality significa que apos liquidacao no banco central, a transferencia e legalmente irrevogavel — nem insolvencia de uma das partes pode reverter. Sem essa garantia, todo o sistema de pagamentos teria risco sistêmico inaceitavel." },
  { id: "infra-h6", theme: "infraestrutura", difficulty: "hard", question: "Qual o papel do QR Code dinamico no PIX e por que e mais seguro que o estatico?", options: ["Nao ha diferenca de seguranca", "QR Code dinamico inclui valor, identificador unico e expiracao, vinculado a uma transacao especifica, impedindo reutilizacao", "Dinamico tem melhor resolucao", "Estatico e mais seguro por ser permanente"], correctIndex: 1, explanation: "QR dinâmico gera um payload unico por transacao com valor fixo, ID de transacao e tempo de expiracao. Nao pode ser reutilizado, alterado ou compartilhado para outra transacao. QR estatico pode ser reutilizado, criando risco de pagamento errado." },
  { id: "infra-h7", theme: "infraestrutura", difficulty: "hard", question: "O que e point-to-point encryption (P2PE) e como difere de end-to-end encryption (E2EE)?", options: ["Sao a mesma coisa", "P2PE e certificado pelo PCI Council com requisitos especificos de HSM e key management; E2EE e conceito generico sem certificacao padrao", "E2EE e mais seguro", "P2PE so funciona com chip EMV"], correctIndex: 1, explanation: "P2PE e um padrao PCI com certificacao especifica: criptografia no ponto de interacao (terminal) ate o ponto de decriptacao (HSM do processador), com key injection segura e dispositivos validados. E2EE e o conceito generico sem certificacao padrao." },
  { id: "infra-h8", theme: "infraestrutura", difficulty: "hard", question: "Qual o impacto do PIX na infraestrutura de TED e DOC?", options: ["Nenhum — coexistem sem impacto", "PIX reduziu drasticamente o volume de TED/DOC, levando o Bacen a encerrar DOC e TEC, e pressionar bancos a repensar infraestrutura legada", "PIX substituiu completamente TED e DOC", "TED e DOC ficaram mais rapidos"], correctIndex: 1, explanation: "O PIX capturou a grande maioria das transferencias que antes iam por TED e DOC. O Bacen encerrou o DOC em 2024. TED ainda existe para valores muito altos e integracao com sistemas legados, mas com volume muito reduzido." },
  { id: "infra-h9", theme: "infraestrutura", difficulty: "hard", question: "Em qual cenario o 'stand-in processing' da bandeira e ativado?", options: ["Quando o comerciante solicita", "Quando o emissor esta indisponivel e a bandeira processa autorizacoes em nome do emissor usando parametros pre-configurados", "Quando ha fraude detectada", "Quando o adquirente muda de bandeira"], correctIndex: 1, explanation: "Stand-in processing (STIP) e ativado quando o emissor nao responde dentro do timeout. A bandeira (Visa/Mastercard) aprova ou recusa usando limites pre-configurados pelo emissor, evitando que todas as transacoes sejam recusadas durante a indisponibilidade." },
  { id: "infra-h10", theme: "infraestrutura", difficulty: "hard", question: "Por que o Open Finance Brasil exige APIs padronizadas e qual o impacto na infraestrutura bancaria?", options: ["Apenas para cumprir regulacao sem impacto real", "Obriga bancos a expor dados e servicos via APIs padronizadas, exigindo modernizacao de sistemas legados, API gateways, consent management e interoperabilidade", "So afeta fintechs", "Reduz custos de infraestrutura imediatamente"], correctIndex: 1, explanation: "Open Finance exige que bancos exponham dados (fase 2), iniciem pagamentos (fase 3) e compartilhem produtos via APIs padronizadas. Isso forca modernizacao de core banking legado, implementacao de API gateways robustos e gestao granular de consentimento." },

  // ============================================================================
  // THEME: Crypto & DeFi (30 questions)
  // ============================================================================
  { id: "cry-e1", theme: "crypto", difficulty: "easy", question: "O que e uma stablecoin?", options: ["Criptomoeda que so sobe de valor", "Criptomoeda com valor atrelado a um ativo estavel como dolar", "Moeda digital do banco central", "Qualquer criptomoeda popular"], correctIndex: 1, explanation: "Stablecoins sao criptomoedas projetadas para manter paridade com um ativo (geralmente USD). Exemplos: USDC, USDT, DAI. Usam mecanismos como reservas fiat, colateral crypto ou algoritmos." },
  { id: "cry-e2", theme: "crypto", difficulty: "easy", question: "O que e uma wallet de criptomoedas?", options: ["Conta em exchange", "Software ou hardware que armazena chaves privadas para acessar criptomoedas na blockchain", "Carteira digital como Apple Pay", "Conta bancaria em moeda digital"], correctIndex: 1, explanation: "Uma crypto wallet armazena as chaves privadas que permitem assinar transacoes na blockchain. A wallet nao 'contem' as criptos — elas existem na blockchain — mas sem a chave privada nao ha acesso." },
  { id: "cry-e3", theme: "crypto", difficulty: "easy", question: "O que e blockchain?", options: ["Software de contabilidade bancaria", "Livro-razao distribuido e imutavel que registra transacoes em blocos encadeados criptograficamente", "Rede social para traders", "Banco de dados centralizado criptografado"], correctIndex: 1, explanation: "Blockchain e um registro distribuido onde transacoes sao agrupadas em blocos, cada um contendo o hash do bloco anterior, formando uma cadeia imutavel mantida por rede descentralizada." },
  { id: "cry-e4", theme: "crypto", difficulty: "easy", question: "O que e gas fee no Ethereum?", options: ["Taxa de energia eletrica para mineracao", "Taxa paga para compensar o poder computacional necessario para processar transacoes na rede", "Imposto sobre transacoes cripto", "Taxa de conversao de moeda"], correctIndex: 1, explanation: "Gas fee e a taxa paga aos validadores da rede Ethereum para processar e validar transacoes. Varia com a demanda da rede — em periodos de congestionamento, gas fees podem ser muito altos." },
  { id: "cry-e5", theme: "crypto", difficulty: "easy", question: "O que e DeFi?", options: ["Moeda digital do governo", "Financas descentralizadas — servicos financeiros construidos em blockchain sem intermediarios tradicionais", "Deficiencia financeira", "Sistema de debugging financeiro"], correctIndex: 1, explanation: "DeFi (Decentralized Finance) sao protocolos construidos em blockchain que oferecem servicos financeiros (emprestimos, trading, yield) sem bancos ou intermediarios, usando smart contracts." },
  { id: "cry-e6", theme: "crypto", difficulty: "easy", question: "O que e uma exchange de criptomoedas?", options: ["Local fisico para troca de moedas", "Plataforma que permite comprar, vender e negociar criptomoedas", "Protocolo DeFi", "Sistema de pagamento instantaneo"], correctIndex: 1, explanation: "Exchanges sao plataformas (centralizadas como Binance ou descentralizadas como Uniswap) que permitem trocar moedas fiat por criptomoedas e negociar entre diferentes criptoativos." },
  { id: "cry-e7", theme: "crypto", difficulty: "easy", question: "O que e CBDC?", options: ["Central Bank Digital Currency — moeda digital emitida pelo banco central", "Crypto Bank Data Center", "Central Blockchain Development Company", "Currency Based on Decentralized Computing"], correctIndex: 0, explanation: "CBDC (Central Bank Digital Currency) e uma moeda digital emitida e garantida pelo banco central do pais. O DREX e a CBDC brasileira em desenvolvimento pelo Bacen." },
  { id: "cry-e8", theme: "crypto", difficulty: "easy", question: "O que e um smart contract?", options: ["Contrato juridico digital", "Programa autoexecutavel armazenado na blockchain que executa quando condicoes pre-definidas sao atendidas", "Contrato entre exchange e usuario", "Acordo entre mineradores"], correctIndex: 1, explanation: "Smart contracts sao codigos imutaveis na blockchain que executam automaticamente quando condicoes sao satisfeitas. Sao a base de DeFi, NFTs e aplicacoes descentralizadas." },
  { id: "cry-m1", theme: "crypto", difficulty: "medium", question: "Qual a diferenca entre USDC e USDT em termos de lastro e transparencia?", options: ["Sao identicos", "USDC tem reservas auditadas regularmente com maior transparencia; USDT tem historico de questionamentos sobre composicao do lastro", "USDT e mais transparente", "Nenhum tem lastro real"], correctIndex: 1, explanation: "USDC (Circle) publica atestacoes mensais de reservas auditadas por firmas independentes. USDT (Tether) historicamente enfrentou questionamentos sobre a composicao real de suas reservas, embora tenha melhorado divulgacao." },
  { id: "cry-m2", theme: "crypto", difficulty: "medium", question: "O que e um AMM (Automated Market Maker)?", options: ["Sistema automatico de marketing", "Protocolo que usa pools de liquidez e formulas matematicas para precificar assets sem order book", "Bot de trading automatico", "Mercado automatico de acoes"], correctIndex: 1, explanation: "AMMs (Uniswap, Curve) substituem order books por pools de liquidez. A formula x*y=k determina o preco baseado na proporcao de ativos no pool. Qualquer pessoa pode fornecer liquidez e ganhar taxas." },
  { id: "cry-m3", theme: "crypto", difficulty: "medium", question: "O que e impermanent loss em pools de liquidez?", options: ["Perda permanente de criptomoedas", "Diferenca de valor entre manter os assets em pool vs segurar separadamente, causada por variacao de preco", "Perda por taxa de gas", "Hack do protocolo"], correctIndex: 1, explanation: "Quando o preco relativo dos assets no pool muda, o LP (liquidity provider) fica com mais do asset que caiu e menos do que subiu. A 'perda' e vs simplesmente ter segurado os assets fora do pool." },
  { id: "cry-m4", theme: "crypto", difficulty: "medium", question: "O que e DREX e qual sua relacao com o sistema financeiro brasileiro?", options: ["Exchange brasileira de crypto", "CBDC brasileira (Real Digital) que visa tokenizar ativos financeiros e criar infraestrutura de DvP em blockchain", "Sistema de debito em tempo real", "Protocolo DeFi brasileiro"], correctIndex: 1, explanation: "DREX e a CBDC atacadista do Bacen, focada em tokenizar ativos financeiros (titulos, recebiveis) e permitir DvP (delivery vs payment) programavel via smart contracts em plataforma DLT permissionada." },
  { id: "cry-m5", theme: "crypto", difficulty: "medium", question: "O que e bridge em blockchain?", options: ["Conexao entre mineradores", "Protocolo que permite transferir ativos entre blockchains diferentes", "Ponte entre exchange e banco", "Sistema de backup de blockchain"], correctIndex: 1, explanation: "Bridges conectam blockchains diferentes (ex: Ethereum<->Polygon), permitindo mover ativos entre redes. Sao criticos para interoperabilidade mas historicamente foram alvo de hacks bilionarios (Ronin, Wormhole)." },
  { id: "cry-m6", theme: "crypto", difficulty: "medium", question: "Qual a diferenca entre custodial e non-custodial wallet?", options: ["Custodial e para guardar; non-custodial para transacionar", "Custodial: terceiro guarda as chaves privadas. Non-custodial: o usuario controla suas proprias chaves", "Non-custodial e menos segura", "Custodial so funciona offline"], correctIndex: 1, explanation: "Em custodial wallets (exchanges), a plataforma guarda suas chaves — mais conveniente mas com risco de hack/insolvencia da plataforma. Non-custodial (MetaMask): voce controla as chaves — mais seguro mas com responsabilidade total." },
  { id: "cry-m7", theme: "crypto", difficulty: "medium", question: "O que e yield farming?", options: ["Mineracao de Bitcoin", "Estrategia de mover capital entre protocolos DeFi para maximizar retorno em tokens e taxas", "Investimento em agronegocio tokenizado", "Staking em exchange centralizada"], correctIndex: 1, explanation: "Yield farming envolve fornecer liquidez a protocolos DeFi, staking em pools, e mover capital entre oportunidades para maximizar APY. Combina taxas de trading, rewards em tokens nativos e composicao de retornos." },
  { id: "cry-m8", theme: "crypto", difficulty: "medium", question: "O que e oracle em blockchain?", options: ["Sistema de previsao de precos", "Servico que fornece dados externos (precos, clima, eventos) para smart contracts que nao conseguem acessar dados fora da blockchain", "Banco de dados on-chain", "Sistema de votacao descentralizado"], correctIndex: 1, explanation: "Oracles (Chainlink, Pyth) sao servicos que trazem dados do mundo real para a blockchain. Smart contracts nao acessam APIs externas; oracles fornecem dados como precos de ativos, resultados de eventos, etc." },
  { id: "cry-m9", theme: "crypto", difficulty: "medium", question: "O que e MEV (Maximal Extractable Value)?", options: ["Valor maximo de mineracao", "Lucro que validadores podem extrair reordenando, incluindo ou excluindo transacoes em um bloco", "Metrica de eficiencia de validacao", "Valor minimo de exchange"], correctIndex: 1, explanation: "MEV e o lucro que validadores/miners podem obter ao manipular a ordem das transacoes em um bloco: front-running trades, sandwich attacks, liquidacoes oportunistas. E um problema fundamental de blockchains publicas." },
  { id: "cry-m10", theme: "crypto", difficulty: "medium", question: "O que e Layer 2 e por que existe?", options: ["Segunda camada de seguranca", "Solucoes construidas sobre a blockchain principal para aumentar velocidade e reduzir custos de transacao", "Segundo nivel de mineracao", "Backup da blockchain"], correctIndex: 1, explanation: "Layer 2 (Arbitrum, Optimism, Lightning Network) processa transacoes fora da cadeia principal e depois ancora os resultados nela. Resolve o trilema de escalabilidade: mais velocidade e menor custo mantendo seguranca da L1." },
  { id: "cry-h1", theme: "crypto", difficulty: "hard", question: "Qual o risco sistêmico de stablecoins algoritmicas como demonstrado pelo colapso do UST/Luna?", options: ["Apenas perda para investidores", "Descolamento em espiral ('death spiral') onde perda de confianca desvaloriza o token de governanca, impossibilitando re-peg e destruindo ambos os tokens", "Risco limitado ao protocolo", "Nenhum — algoritmos se auto-corrigem"], correctIndex: 1, explanation: "UST mantinha paridade via mecanismo de mint/burn com LUNA. Quando UST perdeu o peg, a pressao de venda criou emissao massiva de LUNA, que desvalorizou LUNA, impossibilitando o re-peg — destruindo $40B em valor." },
  { id: "cry-h2", theme: "crypto", difficulty: "hard", question: "Por que bridges cross-chain sao o elo mais fraco na seguranca de DeFi?", options: ["Sao muito lentas", "Concentram TVL massivo em smart contracts complexos que custodiam assets de multiplas chains, criando alvo atrativo com superficie de ataque ampla", "Cobram taxas altas", "Nao usam criptografia"], correctIndex: 1, explanation: "Bridges custodiam bilhoes em assets enquanto 'traduzem' entre chains. Seus smart contracts sao complexos (multiplas chains, signatures, provas) e um unico bug compromete todo o TVL. Ronin ($625M), Wormhole ($320M) e Nomad ($190M) exemplificam isso." },
  { id: "cry-h3", theme: "crypto", difficulty: "hard", question: "Qual a diferenca entre optimistic rollup e zk-rollup como solucoes de escalabilidade?", options: ["Sao identicos", "Optimistic assume transacoes validas com periodo de contestacao; zk-rollup usa provas criptograficas para validacao instantanea sem periodo de espera", "Optimistic e mais rapido para saques", "Zk-rollup nao garante seguranca da L1"], correctIndex: 1, explanation: "Optimistic rollups (Arbitrum, Optimism) postam transacoes assumindo validade, com 7 dias para contestacao. Zk-rollups (zkSync, StarkNet) geram provas matematicas de validade — saques sao mais rapidos e nao dependem de contestacao." },
  { id: "cry-h4", theme: "crypto", difficulty: "hard", question: "Como o DREX pode impactar a estrutura de liquidacao de pagamentos no Brasil?", options: ["Nao tera impacto", "Permite settlement atomico (DvP) de ativos tokenizados em tempo real via smart contracts, reduzindo risco de contraparte e intermediarios", "Substituira o PIX completamente", "So funcionara para transacoes internacionais"], correctIndex: 1, explanation: "DREX permite que ativos tokenizados (titulos publicos, recebiveis, imoveis) sejam liquidados instantaneamente contra Real tokenizado via smart contracts, eliminando camaras de clearing e reduzindo settlement de D+1/D+2 para T+0." },
  { id: "cry-h5", theme: "crypto", difficulty: "hard", question: "O que e flash loan e por que nao tem equivalente nas financas tradicionais?", options: ["Emprestimo rapido com garantia", "Emprestimo sem colateral que deve ser emprestado e devolvido na mesma transacao atomica; possivel por atomicidade de transacoes blockchain", "Emprestimo com taxa zero", "Financiamento rapido via DeFi"], correctIndex: 1, explanation: "Flash loans emprestam qualquer valor sem colateral, desde que o emprestimo seja devolvido na mesma transacao. Se nao for devolvido, toda a transacao reverte. Isso so e possivel pela atomicidade de transacoes blockchain — impossivel em TradFi." },
  { id: "cry-h6", theme: "crypto", difficulty: "hard", question: "Qual o impacto regulatorio do framework MiCA (Markets in Crypto-Assets) da UE para stablecoins?", options: ["Nenhum impacto real", "Exige reservas 100% em ativos de alta qualidade, limita volume de transacoes diarias e requer licenciamento especifico para emissores significativos", "Proibe stablecoins na Europa", "Apenas exige KYC"], correctIndex: 1, explanation: "MiCA classifica stablecoins em EMTs (e-money tokens) e ARTs (asset-referenced tokens). Exige 100% de reservas em ativos liquidos, testes de estresse, limites de volume para ARTs significativos, e licenciamento como instituicao financeira." },
  { id: "cry-h7", theme: "crypto", difficulty: "hard", question: "O que e MEV-boost e como mitiga o problema de MEV no Ethereum pos-merge?", options: ["Aumenta a velocidade de mineracao", "Separa o papel de construir blocos (builder) e propor blocos (proposer), criando mercado competitivo que distribui MEV de forma mais justa", "Elimina MEV completamente", "So funciona para validadores grandes"], correctIndex: 1, explanation: "MEV-boost implementa PBS (Proposer-Builder Separation): builders especializados otimizam a construcao do bloco e competem para que proposers (validadores) escolham o bloco mais lucrativo. Isso democratiza acesso a MEV e reduz centralizacao." },
  { id: "cry-h8", theme: "crypto", difficulty: "hard", question: "Qual o risco de re-staking protocols como EigenLayer para a seguranca do Ethereum?", options: ["Nenhum risco — mais staking e sempre melhor", "Alavancagem de seguranca: o mesmo ETH stakado garante multiplos servicos, mas um slashing event pode cascatear, reduzindo seguranca da rede base", "Apenas risco de rendimento menor", "So afeta tokens pequenos"], correctIndex: 1, explanation: "Re-staking permite usar ETH ja stakado para garantir servicos adicionais. Mas se o validador for slashed em um servico, perde ETH que tambem garantia o Ethereum base. Risco de cascata de slashing pode reduzir seguranca sistêmica." },
  { id: "cry-h9", theme: "crypto", difficulty: "hard", question: "Por que a integracao de pagamentos fiat-to-crypto ('on-ramp/off-ramp') e o principal gargalo para adocao mainstream?", options: ["Porque crypto e muito complexo", "Compliance KYC/AML, custos de conversao, latencia de settlement, fragmentacao regulatoria entre jurisdicoes e risco de contraparte nas exchanges", "Porque bancos proibem crypto", "Falta de interesse dos consumidores"], correctIndex: 1, explanation: "On/off-ramps enfrentam: KYC/AML complexo (regulacao varia por pais), taxas de conversao altas (3-5%), settlement lento (fiat demora dias para chegar na exchange), risco de contraparte, e bancos que desbancarizam exchanges." },
  { id: "cry-h10", theme: "crypto", difficulty: "hard", question: "O que e account abstraction (ERC-4337) e como melhora a experiencia de pagamentos em blockchain?", options: ["Conta anonima para privacidade", "Permite contas programaveis com social recovery, pagamento de gas em qualquer token, transacoes em batch e regras de gasto customizaveis", "Abstrai a necessidade de blockchain", "Cria contas sem endereco"], correctIndex: 1, explanation: "Account abstraction transforma wallets em smart contracts programaveis: permite pagar gas em stablecoins (nao precisa ETH), usar social recovery (amigos recuperam acesso), batching de transacoes, e regras customizaveis — crucial para UX de pagamentos." },

  // ============================================================================
  // THEME: Compliance & Regulacao (30 questions)
  // ============================================================================
  { id: "comp-e1", theme: "compliance", difficulty: "easy", question: "O que e PCI DSS?", options: ["Protocolo de pagamentos do Bacen", "Padrao de seguranca de dados para empresas que processam cartoes de pagamento", "Processador de cartoes internacional", "Programa de compliance digital"], correctIndex: 1, explanation: "PCI DSS (Payment Card Industry Data Security Standard) e o padrao global que define requisitos de seguranca para qualquer empresa que armazena, processa ou transmite dados de cartao." },
  { id: "comp-e2", theme: "compliance", difficulty: "easy", question: "O que e KYC?", options: ["Keep Your Card", "Know Your Customer — processo de verificacao de identidade do cliente", "Key Yield Calculation", "Knowledge of Your Compliance"], correctIndex: 1, explanation: "KYC (Know Your Customer) e o processo obrigatorio de verificar a identidade dos clientes antes de estabelecer relacao comercial, incluindo documentos, comprovante de endereco e verificacao de dados." },
  { id: "comp-e3", theme: "compliance", difficulty: "easy", question: "O que e AML?", options: ["Automated Machine Learning", "Anti-Money Laundering — prevencao a lavagem de dinheiro", "Advanced Market Liquidity", "Account Management Layer"], correctIndex: 1, explanation: "AML (Anti-Money Laundering) e o conjunto de leis, regulacoes e procedimentos para detectar e prevenir lavagem de dinheiro e financiamento ao terrorismo." },
  { id: "comp-e4", theme: "compliance", difficulty: "easy", question: "O que e LGPD?", options: ["Lei de Governanca de Pagamentos Digitais", "Lei Geral de Protecao de Dados — lei brasileira de privacidade", "Limite Geral de Dados Processados", "Lei de Gestao de Dados Publicos"], correctIndex: 1, explanation: "LGPD e a lei brasileira de protecao de dados pessoais (equivalente ao GDPR europeu). Define regras para coleta, armazenamento e uso de dados pessoais, com multas de ate 2% do faturamento." },
  { id: "comp-e5", theme: "compliance", difficulty: "easy", question: "Quem regula as instituicoes de pagamento no Brasil?", options: ["A bandeira de cartao", "O Banco Central do Brasil (Bacen)", "A Receita Federal", "A CVM"], correctIndex: 1, explanation: "O Bacen e o regulador e supervisor das instituicoes de pagamento no Brasil, definindo regras de autorizacao, operacao, capital minimo e padroes de seguranca." },
  { id: "comp-e6", theme: "compliance", difficulty: "easy", question: "O que e PEP (Pessoa Politicamente Exposta)?", options: ["Pessoa que trabalha em tecnologia", "Individuo que ocupa ou ocupou cargo publico relevante, sujeito a due diligence aprimorada", "Pessoa com muitas contas bancarias", "Profissional de pagamentos eletronicos"], correctIndex: 1, explanation: "PEP e qualquer pessoa que ocupa cargo publico relevante (politicos, magistrados, diretores de estatais) e seus familiares. Requerem KYC reforçado por risco elevado de corrupcao/lavagem." },
  { id: "comp-e7", theme: "compliance", difficulty: "easy", question: "O que e SAR (Suspicious Activity Report)?", options: ["Relatorio de vendas anual", "Relatorio de atividade suspeita comunicado as autoridades financeiras", "Sistema automatico de reconciliacao", "Relatorio de seguranca de acesso"], correctIndex: 1, explanation: "SAR (ou COAF no Brasil) e o relatorio que instituicoes financeiras devem enviar as autoridades quando identificam transacoes suspeitas de lavagem de dinheiro ou financiamento ao terrorismo." },
  { id: "comp-e8", theme: "compliance", difficulty: "easy", question: "O que e a resolucao 80 do Bacen?", options: ["Regula o PIX", "Regulamenta instituicoes de pagamento no Brasil, definindo tipos e requisitos", "Define taxas de cartao", "Regra sobre seguranca cibernetica"], correctIndex: 1, explanation: "A Resolucao BCB 80/2021 regulamenta os arranjos e instituicoes de pagamento no Brasil, definindo categorias (emissor, credenciador, iniciador), requisitos de capital, governanca e operacao." },
  { id: "comp-m1", theme: "compliance", difficulty: "medium", question: "Qual a diferenca entre PCI DSS Level 1 e Level 4?", options: ["Level 1 e menos rigoroso", "Level 1 exige auditoria on-site por QSA para quem processa >6M transacoes/ano; Level 4 permite SAQ para <20K transacoes/ano", "A numeracao e aleatoria", "Level 4 exige mais controles"], correctIndex: 1, explanation: "PCI DSS classifica por volume: Level 1 (>6M tx/ano) exige auditoria presencial por QSA certificado. Level 4 (<20K tx e-commerce) permite auto-avaliacao (SAQ). Quanto maior o volume, mais rigorosa a validacao." },
  { id: "comp-m2", theme: "compliance", difficulty: "medium", question: "O que e tokenizacao como estrategia de reducao de escopo PCI?", options: ["Criar tokens de fidelidade", "Substituir dados de cartao por tokens irrversiveis reduz o numero de sistemas que precisam estar em escopo PCI", "Criptografar dados em transito", "Usar cartoes virtuais"], correctIndex: 1, explanation: "Ao tokenizar no ponto de entrada (gateway/PSP), os sistemas internos nunca veem o PAN real — apenas tokens sem valor fora do contexto. Isso reduz drasticamente o escopo PCI (menos sistemas para auditar e proteger)." },
  { id: "comp-m3", theme: "compliance", difficulty: "medium", question: "O que e a Circular 3.978 do Bacen e o que ela exige?", options: ["Regulamenta o PIX", "Estabelece politica de prevencao a lavagem de dinheiro e financiamento ao terrorismo para instituicoes financeiras", "Define limites de transferencia", "Regula criptomoedas no Brasil"], correctIndex: 1, explanation: "A Circular 3.978 obriga instituicoes financeiras a implementar politicas de PLD/FT: KYC robusto, monitoramento de transacoes, comunicacao ao COAF, registro de operacoes e treinamento de funcionarios." },
  { id: "comp-m4", theme: "compliance", difficulty: "medium", question: "O que e o COAF e qual seu papel?", options: ["Comissao de Organizacao de Ativos Financeiros", "Conselho de Controle de Atividades Financeiras — UIF brasileira que recebe e analisa comunicacoes de atividades suspeitas", "Comite de Operacoes de Alto Frequencia", "Central de Operacoes Anti-Fraude"], correctIndex: 1, explanation: "O COAF e a Unidade de Inteligencia Financeira (UIF) do Brasil. Recebe comunicacoes de transacoes suspeitas de instituicoes financeiras, analisa e encaminha para investigacao quando ha indicios de lavagem ou terrorismo." },
  { id: "comp-m5", theme: "compliance", difficulty: "medium", question: "O que e due diligence aprimorada (EDD)?", options: ["Auditoria de seguranca do sistema", "Processo de verificacao mais rigoroso para clientes de alto risco (PEPs, paises de risco, setores sensiveis)", "Diligencia no desenvolvimento de software", "Due diligence padrao com prazo menor"], correctIndex: 1, explanation: "EDD (Enhanced Due Diligence) aplica verificacoes adicionais para clientes de alto risco: origem dos fundos, beneficiario final, aprovacao de nivel gerencial, monitoramento mais frequente e documentacao adicional." },
  { id: "comp-m6", theme: "compliance", difficulty: "medium", question: "O que e sandbox regulatorio do Bacen?", options: ["Ambiente de testes para desenvolvedores", "Programa que permite empresas testarem produtos inovadores com regulacao flexibilizada por tempo limitado", "Caixa de areia para treinamento", "Sistema de simulacao de transacoes"], correctIndex: 1, explanation: "O sandbox regulatorio do Bacen permite que empresas inovadoras testem produtos e servicos financeiros com requisitos regulatorios flexibilizados por periodo definido, promovendo inovacao com supervisao." },
  { id: "comp-m7", theme: "compliance", difficulty: "medium", question: "O que sao listas restritivas (sanctions lists) e como afetam pagamentos?", options: ["Listas de comerciantes bloqueados", "Listas de individuos/entidades sancionados (OFAC, UE, ONU) que devem ser verificadas antes de processar transacoes", "Listas de cartoes invalidos", "Registros de fraude compartilhados"], correctIndex: 1, explanation: "Listas restritivas (OFAC, UE, UN) contem individuos, empresas e paises sancionados. Toda transacao financeira deve ser verificada contra essas listas — processar pagamento para entidade sancionada gera multas milionarias." },
  { id: "comp-m8", theme: "compliance", difficulty: "medium", question: "O que e a Resolucao 4.893 do Bacen sobre seguranca cibernetica?", options: ["Regula o PIX", "Exige que instituicoes financeiras implementem politica de seguranca cibernetica, plano de resposta a incidentes e gestao de riscos de TI", "Define padroes de criptografia", "Regula open banking"], correctIndex: 1, explanation: "A Resolucao 4.893 obriga instituicoes financeiras e de pagamento a ter: politica de seguranca cibernetica aprovada pela diretoria, plano de resposta a incidentes, gestao de riscos de TI e comunicacao de incidentes relevantes ao Bacen." },
  { id: "comp-m9", theme: "compliance", difficulty: "medium", question: "O que e beneficiario final (UBO) e por que e importante?", options: ["Beneficiario de uma transferencia PIX", "Pessoa fisica que efetivamente controla ou se beneficia de uma entidade juridica, essencial para prevencao de lavagem", "Cliente final do comerciante", "Ultimo recebedor de um split de pagamento"], correctIndex: 1, explanation: "UBO (Ultimate Beneficial Owner) e a pessoa fisica que, direta ou indiretamente, controla ou se beneficia de uma empresa. Identificar UBOs e obrigatorio em KYC para evitar que criminosos usem empresas de fachada para lavar dinheiro." },
  { id: "comp-m10", theme: "compliance", difficulty: "medium", question: "O que e a diferenca entre instituicao de pagamento e instituicao financeira no Brasil?", options: ["Nao ha diferenca", "IP nao pode fazer intermediacao financeira (captar depositos, conceder emprestimos com recursos proprios); IF pode", "IP e mais regulada", "IF nao pode processar pagamentos"], correctIndex: 1, explanation: "Instituicoes de pagamento (IPs) so podem operar servicos de pagamento (emissao, credenciamento, iniciacao). Nao podem captar depositos ou conceder credito com recursos proprios (exceto SCD). Instituicoes financeiras (IFs) tem escopo mais amplo." },
  { id: "comp-h1", theme: "compliance", difficulty: "hard", question: "Uma fintech quer operar como SCD (Sociedade de Credito Direto). Quais os requisitos regulatorios principais?", options: ["Apenas registro no Bacen", "Autorizacao do Bacen, capital minimo de R$1M, operacao exclusivamente digital, credito com recursos proprios e compliance completo de PLD/FT", "Mesmo requisitos de banco comercial", "Nao ha regulacao especifica"], correctIndex: 1, explanation: "SCD exige: autorizacao especifica do Bacen, capital minimo R$1M, operacoes exclusivamente por plataforma eletronica, emprestimos com recursos proprios (nao capta depositos), compliance PLD/FT, e nao pode ser controlada por IF tradicional." },
  { id: "comp-h2", theme: "compliance", difficulty: "hard", question: "Qual o impacto da GDPR/LGPD no processamento de pagamentos cross-border?", options: ["Nenhum — dados de pagamento sao isentos", "Transferencia internacional de dados pessoais requer base legal adequada, podendo exigir clausulas contratuais padrao ou consentimento especifico", "Apenas afeta marketing", "So se aplica a empresas europeias"], correctIndex: 1, explanation: "Pagamentos cross-border envolvem transferencia internacional de dados pessoais (nome, email, IP). LGPD/GDPR exigem base legal para essa transferencia: clausulas contratuais padrao, decisao de adequacao ou consentimento especifico. Violacoes geram multas pesadas." },
  { id: "comp-h3", theme: "compliance", difficulty: "hard", question: "Um PSP descobre que um sub-merchant esta processando transacoes de jogo online (MCC 7995) sem licenca. Qual o risco?", options: ["Apenas perda de receita do merchant", "Multas da bandeira, risco de perda de licenca de adquirencia, exposição a lavagem de dinheiro e responsabilidade solidaria regulatoria", "Nenhum — e responsabilidade do sub-merchant", "Apenas risco reputacional"], correctIndex: 1, explanation: "Jogos online (MCC 7995) sao atividades de alto risco regulatorio. O PSP/adquirente tem responsabilidade solidaria: multas de Visa/Mastercard ($25K-$100K), risco de perder licenca, implicacoes de PLD/FT e potencial acao penal." },
  { id: "comp-h4", theme: "compliance", difficulty: "hard", question: "O que e transaction laundering e por que e mais dificil de detectar que lavagem tradicional?", options: ["Lavagem de transacoes de cartao", "Processo onde um merchant legitimo processa transacoes em nome de negocios ilegais, escondendo a verdadeira natureza do negocio no fluxo de pagamento", "Limpeza de dados transacionais", "Fraude de estorno"], correctIndex: 1, explanation: "Transaction laundering usa merchants legitimos como fachada para processar pagamentos de negocios ilegais. E dificil detectar porque as transacoes parecem normais — o PSP ve um e-commerce de roupas mas o dinheiro vem de atividade ilicita." },
  { id: "comp-h5", theme: "compliance", difficulty: "hard", question: "Qual a responsabilidade de um payment facilitator sobre o KYC dos seus sub-merchants?", options: ["Nenhuma — cada sub-merchant e responsavel", "O PF e diretamente responsavel pelo onboarding, monitoramento continuo e compliance de todos os sub-merchants perante regulador e bandeiras", "Apenas verificacao inicial", "Responsabilidade compartilhada igualmente"], correctIndex: 1, explanation: "O payment facilitator assume responsabilidade total: deve fazer KYC de cada sub-merchant, monitorar transacoes, detectar atividades suspeitas e reportar ao regulador. Se um sub-merchant lavar dinheiro, o PF responde perante Bacen e bandeiras." },
  { id: "comp-h6", theme: "compliance", difficulty: "hard", question: "O que e PCI DSS v4.0 e quais as principais mudancas em relacao a v3.2.1?", options: ["Apenas atualizacao de numero de versao", "Abordagem customizada (alem de definida), autenticacao multi-fator expandida, criptografia mais forte e seguranca continua vs pontual", "Reducao de requisitos", "Foco exclusivo em cloud"], correctIndex: 1, explanation: "PCI DSS v4.0 introduz: abordagem customizada (custom approach) alem da definida, MFA obrigatorio para todo acesso administrativo, criptografia mais forte, monitoramento continuo de seguranca, e foco em security-as-a-process vs compliance pontual." },
  { id: "comp-h7", theme: "compliance", difficulty: "hard", question: "Como o principio de 'privacy by design' da LGPD impacta a arquitetura de um sistema de pagamentos?", options: ["Apenas adiciona disclaimers no checkout", "Exige minimizacao de dados, criptografia, pseudonimizacao, retencao limitada e separacao de dados pessoais desde a concepcao do sistema", "Apenas compliance documental", "So afeta dados de marketing"], correctIndex: 1, explanation: "Privacy by design exige: coletar apenas dados necessarios para o pagamento, criptografar em repouso e transito, pseudonimizar onde possivel, definir politicas de retencao e delete, e segregar dados pessoais do fluxo transacional desde o design." },
  { id: "comp-h8", theme: "compliance", difficulty: "hard", question: "Qual o risco de compliance ao implementar pagamentos instantaneos (PIX) com limites altos sem monitoramento adequado?", options: ["Nenhum — PIX e seguro por design", "Exposição a lavagem de dinheiro e fraude em velocidade instantanea, sem janela para intervencao manual, exigindo monitoramento em tempo real", "Apenas risco operacional", "Risco limitado a fraude de cartao"], correctIndex: 1, explanation: "PIX com limites altos + liquidacao instantanea significa que fundos ilicitos podem ser movidos e sacados antes de qualquer intervencao. Exige monitoramento PLD/FT em tempo real, com regras de velocity, blacklists e analise comportamental pre-transacao." },
  { id: "comp-h9", theme: "compliance", difficulty: "hard", question: "O que e a Travel Rule (FATF Recommendation 16) e como afeta pagamentos crypto?", options: ["Regra para viagens internacionais", "Obriga provedores de servicos de crypto a compartilhar dados do remetente e destinatario acima de certo valor entre si", "Regra de limite de transferencia", "Regulacao de cambio para viajantes"], correctIndex: 1, explanation: "A Travel Rule exige que VASPs (exchanges, custodiantes) transmitam dados do remetente e beneficiario (nome, endereco, conta) para o VASP destinatario em transacoes acima de USD/EUR 1.000. Visa prevenir lavagem de dinheiro em transacoes crypto." },
  { id: "comp-h10", theme: "compliance", difficulty: "hard", question: "Um PSP descobre um breach de dados que comprometeu 100K numeros de cartao. Quais sao as obrigacoes regulatorias imediatas?", options: ["Apenas corrigir a vulnerabilidade", "Notificar bandeiras (Visa/MC incident response), Bacen, ANPD (LGPD), titulares de dados, realizar forensic por PCI QSA e preservar evidencias", "Notificar apenas os clientes", "Aguardar investigacao antes de notificar"], correctIndex: 1, explanation: "Data breach de cartoes exige: notificacao imediata as bandeiras (Visa GCAR, MC ADC), comunicacao ao Bacen e ANPD (LGPD), contratacao de PCI Forensic Investigator (PFI), notificacao aos titulares, preservacao de logs e evidencias, e remediacao documentada." },

  // ============================================================================
  // THEME: Antecipacao & Credito (30 questions)
  // ============================================================================
  { id: "ant-e1", theme: "antecipacao", difficulty: "easy", question: "O que e antecipacao de recebiveis?", options: ["Pagamento adiantado ao fornecedor", "Adiantar o recebimento de valores futuros de vendas a cartao antes do prazo normal de liquidacao", "Emprestimo pessoal", "Adiantamento de salario"], correctIndex: 1, explanation: "Antecipacao de recebiveis permite que o comerciante receba hoje os valores que so seriam pagos futuramente (ex: vendas parceladas que seriam liquidadas em 30, 60, 90 dias)." },
  { id: "ant-e2", theme: "antecipacao", difficulty: "easy", question: "O que e deságio na antecipacao?", options: ["Percentual de fraude", "Taxa cobrada para antecipar o valor, representando o custo do dinheiro no tempo", "Desconto no preco do produto", "Taxa de administracao do cartao"], correctIndex: 1, explanation: "Deságio e a taxa aplicada ao valor antecipado. Se o comerciante tem R$10.000 para receber em 30 dias e antecipa com deságio de 2%, recebe R$9.800 hoje." },
  { id: "ant-e3", theme: "antecipacao", difficulty: "easy", question: "O que e uma registradora de recebiveis?", options: ["Sistema de registro de clientes", "Entidade autorizada pelo Bacen a registrar e controlar recebiveis de cartao dos comerciantes", "Registro de transacoes no Bacen", "Maquina de registro de vendas"], correctIndex: 1, explanation: "Registradoras (TAG, CERC, CIP) registram todos os recebiveis de cartao dos comerciantes, dando transparencia e permitindo uso como garantia de credito em qualquer instituicao financeira." },
  { id: "ant-e4", theme: "antecipacao", difficulty: "easy", question: "Qual a diferenca entre antecipacao automatica e sob demanda?", options: ["Nao ha diferenca", "Automatica antecipa todas as vendas automaticamente; sob demanda o comerciante escolhe quando e quanto antecipar", "Automatica e gratuita", "Sob demanda e mais cara"], correctIndex: 1, explanation: "Antecipacao automatica converte todo o fluxo futuro em liquidacao imediata (ex: tudo para D+1). Sob demanda permite ao comerciante escolher quais recebiveis antecipar quando precisar de caixa." },
  { id: "ant-e5", theme: "antecipacao", difficulty: "easy", question: "O que e FIDC?", options: ["Fundo de Investimento Digital Cripto", "Fundo de Investimento em Direitos Creditorios — veiculo que compra recebiveis", "Federacao de Instituicoes de Credito", "Fundo Internacional de Desenvolvimento Comercial"], correctIndex: 1, explanation: "FIDC e um fundo de investimento que compra direitos creditorios (recebiveis) de empresas, antecipando valores. Investidores compram cotas do FIDC e recebem retorno conforme os recebiveis sao pagos." },
  { id: "ant-e6", theme: "antecipacao", difficulty: "easy", question: "O que e SCD (Sociedade de Credito Direto)?", options: ["Sistema de credito descentralizado", "Instituicao financeira que concede credito exclusivamente por plataforma digital com recursos proprios", "Sociedade de cartao de debito", "Sistema de consulta de dividas"], correctIndex: 1, explanation: "SCD e um tipo de instituicao financeira regulada pelo Bacen que opera exclusivamente de forma digital, concedendo credito com recursos proprios. E o modelo usado por fintechs de credito." },
  { id: "ant-e7", theme: "antecipacao", difficulty: "easy", question: "O que e cessao de recebiveis?", options: ["Cancelamento de recebiveis", "Transferencia de direitos sobre recebiveis futuros para outra parte, geralmente para obter credito", "Registro de recebiveis", "Bloqueio de recebiveis por fraude"], correctIndex: 1, explanation: "Cessao e a transferencia dos direitos sobre recebiveis para outra parte (banco, FIDC). O cessionario passa a ser o titular do recebivel e recebe o pagamento quando vencer." },
  { id: "ant-e8", theme: "antecipacao", difficulty: "easy", question: "Por que recebiveis de cartao sao considerados boa garantia?", options: ["Porque sao digitais", "Porque o risco de credito esta no emissor (banco grande), nao no comerciante", "Porque sao regulados pelo Bacen", "Porque tem valor baixo"], correctIndex: 1, explanation: "Recebiveis de cartao sao 'performados' — o risco de nao pagamento esta no emissor (bancos grandes) e nao no comerciante. Se o comerciante vende e o cartao e aprovado, o emissor vai pagar. Isso faz dos recebiveis garantia de alta qualidade." },
  { id: "ant-m1", theme: "antecipacao", difficulty: "medium", question: "Como o regime de registro de recebiveis mudou o mercado de antecipacao?", options: ["Nao mudou nada", "Deu transparencia ao mercado, permitiu comerciantes usar recebiveis como garantia em qualquer banco, e criou portabilidade", "Aumentou as taxas de antecipacao", "Eliminou a antecipacao"], correctIndex: 1, explanation: "Antes do registro, so o adquirente sabia dos recebiveis. Com registro obrigatorio nas registradoras, qualquer banco pode consultar a agenda livre do comerciante e oferecer credito com recebiveis como garantia, aumentando concorrência e reduzindo taxas." },
  { id: "ant-m2", theme: "antecipacao", difficulty: "medium", question: "O que e trava de domicilio bancario?", options: ["Bloqueio da conta corrente", "Vinculacao de recebiveis de cartao a um banco especifico como garantia de emprestimo", "Endereco fixo para recebimento", "Obrigacao de manter conta em um banco especifico"], correctIndex: 1, explanation: "Trava de domicilio e quando o comerciante 'trava' seus recebiveis em um banco como garantia de credito. Os valores sao direcionados para esse banco ate a divida ser quitada." },
  { id: "ant-m3", theme: "antecipacao", difficulty: "medium", question: "Qual a diferenca entre antecipacao e emprestimo com garantia de recebiveis?", options: ["Sao a mesma coisa", "Na antecipacao o adquirente adianta o proprio recebivel; no emprestimo o banco usa recebiveis como colateral de um emprestimo tradicional", "Emprestimo tem taxa menor", "Antecipacao nao tem custo"], correctIndex: 1, explanation: "Antecipacao: o adquirente adianta diretamente o valor que ja seria pago ao comerciante (deságio simples). Emprestimo com garantia: banco concede emprestimo separado e 'trava' recebiveis como colateral — sao produtos diferentes com tributacao e regulacao distintas." },
  { id: "ant-m4", theme: "antecipacao", difficulty: "medium", question: "O que e a taxa CDI e como se relaciona com antecipacao?", options: ["Taxa de cartao de debito", "Taxa basica interbancaria usada como referencia para precificar o deságio de antecipacao", "Taxa cobrada pelo COAF", "Taxa de seguro de recebiveis"], correctIndex: 1, explanation: "CDI (Certificado de Deposito Interbancario) e a taxa basica de juros entre bancos. O deságio de antecipacao e geralmente precificado como CDI + spread. Se CDI sobe, antecipacao fica mais cara." },
  { id: "ant-m5", theme: "antecipacao", difficulty: "medium", question: "O que e a estrutura de cotas senior/subordinada em um FIDC?", options: ["Tipos de investidores", "Cotas senior tem prioridade de pagamento; subordinadas absorvem perdas primeiro, protegendo as senior", "Cotas de valor diferente", "Classificacao por prazo"], correctIndex: 1, explanation: "Em FIDCs, cotas subordinadas absorvem as primeiras perdas (default nos recebiveis), protegendo cotistas senior. Cotas senior tem menor risco e menor retorno; subordinadas tem maior risco e retorno. A relação sub/senior determina o 'colchão' de proteção." },
  { id: "ant-m6", theme: "antecipacao", difficulty: "medium", question: "O que e opt-in e opt-out no contexto de recebiveis?", options: ["Escolha de receber ou nao emails", "Opt-in: comerciante escolhe quem pode negociar seus recebiveis; opt-out: todos podem acessar por padrao", "Opcao de antecipar ou nao", "Entrada e saida de programa de fidelidade"], correctIndex: 1, explanation: "No modelo de registro, opt-out (padrao do Bacen) significa que todos os participantes podem consultar a agenda de recebiveis. Opt-in seria o comerciante precisar autorizar cada consulta. O opt-out promove concorrência." },
  { id: "ant-m7", theme: "antecipacao", difficulty: "medium", question: "O que e a agenda de recebiveis 'livre'?", options: ["Agenda sem compromissos", "Recebiveis futuros que nao estao gravados ou comprometidos com nenhum credor", "Lista de recebiveis cancelados", "Agenda disponivel para consulta publica"], correctIndex: 1, explanation: "Agenda livre sao os recebiveis futuros que nao estao 'travados' como garantia de nenhum credito. E o colateral disponivel que o comerciante pode usar para obter novos emprestimos." },
  { id: "ant-m8", theme: "antecipacao", difficulty: "medium", question: "O que e 'credit as a service' no contexto de pagamentos?", options: ["Servico de atendimento ao credito", "Modelo onde fintechs oferecem credito integrado a plataformas/marketplaces usando infraestrutura de terceiros (BaaS)", "Credito via cartao de servico", "Consultoria de credito"], correctIndex: 1, explanation: "Credit as a Service permite que plataformas ofereçam credito aos seus usuarios sem ser instituicao financeira, usando infraestrutura de um parceiro regulado (SCD, banco) via APIs. O marketplace oferece a UX, o parceiro o regulatorio." },
  { id: "ant-m9", theme: "antecipacao", difficulty: "medium", question: "Qual a diferenca entre desconto de duplicatas e antecipacao de recebiveis de cartao?", options: ["Sao a mesma coisa", "Duplicatas sao titulos de credito entre empresas (B2B); recebiveis de cartao vem do fluxo de pagamento com consumidor e tem risco diferente", "Duplicatas sao mais arriscadas", "Recebiveis de cartao nao podem ser antecipados"], correctIndex: 1, explanation: "Duplicatas envolvem risco do comprador corporativo (pode nao pagar). Recebiveis de cartao envolvem risco do emissor (banco grande). Por isso, recebiveis de cartao geralmente tem taxas menores — o risco de credito e melhor." },
  { id: "ant-m10", theme: "antecipacao", difficulty: "medium", question: "O que e a portabilidade de recebiveis e por que e importante?", options: ["Mudar de adquirente", "Capacidade do comerciante de direcionar seus recebiveis para qualquer banco, nao ficando preso ao adquirente", "Portabilidade de credito", "Transferir recebiveis entre comerciantes"], correctIndex: 1, explanation: "Portabilidade permite ao comerciante direcionar recebiveis de qualquer adquirente para o banco de sua escolha. Antes, ficava 'preso' ao adquirente para antecipacao. Com portabilidade, pode buscar melhores taxas em qualquer IF." },
  { id: "ant-h1", theme: "antecipacao", difficulty: "hard", question: "Um FIDC de recebiveis de cartao apresenta inadimplencia de 2% quando o historico era 0.3%. Qual a investigacao prioritaria?", options: ["Trocar a administradora do fundo", "Verificar se a originacao inclui recebiveis 'nao-performados' (sem autorizacao confirmada) ou se ha concentracao de cedentes em dificuldade financeira", "Aumentar a taxa de deságio", "Suspender todas as operacoes"], correctIndex: 1, explanation: "Inadimplência atipica em recebiveis de cartao sugere: inclusão de recebiveis nao-performados (transacoes nao confirmadas), chargebacks nao previstos, concentracao em cedentes com alto chargeback, ou fraude na originacao. Recebiveis performados de cartao tem inadimplencia proxima de zero." },
  { id: "ant-h2", theme: "antecipacao", difficulty: "hard", question: "Qual o impacto de uma alta taxa de chargeback na capacidade de antecipacao de um comerciante?", options: ["Nenhum — sao independentes", "Chargebacks reduzem o valor liquido dos recebiveis e aumentam o risco percebido, levando a menores volumes antecipados e maiores taxas", "Apenas afeta o seguro do comerciante", "So impacta se chargeback superar 5%"], correctIndex: 1, explanation: "Alta taxa de chargeback: reduz o valor real dos recebiveis (parte sera estornada), aumenta o risco do cessionario, leva adquirentes e bancos a reduzirem o percentual antecipavel (ex: de 100% para 80%) e aplicar deságio maior." },
  { id: "ant-h3", theme: "antecipacao", difficulty: "hard", question: "Como funciona a estrutura de cessao onerosa vs cessao fiduciaria de recebiveis?", options: ["Sao a mesma coisa", "Na onerosa, o cessionario compra o recebivel (assume propriedade); na fiduciaria, o recebivel e dado em garantia mas a propriedade se consolida no credor so em caso de inadimplencia", "Onerosa e gratuita; fiduciaria e paga", "Fiduciaria nao existe para recebiveis"], correctIndex: 1, explanation: "Cessao onerosa: venda definitiva do recebivel — o FIDC/banco vira dono. Cessao fiduciaria: recebivel como garantia — comerciante mantem propriedade, mas se nao pagar o emprestimo, a propriedade se consolida no credor. Implicacoes tributarias e falimentares sao diferentes." },
  { id: "ant-h4", theme: "antecipacao", difficulty: "hard", question: "Qual o risco de 'daisy-chaining' em operacoes com recebiveis e como o registro mitiga?", options: ["Risco de cadeia de emails", "Mesmo recebivel ser dado em garantia para multiplos credores; o registro centralizado impede porque torna visivel todos os gravames existentes", "Risco de multiplas antecipacoes do mesmo valor", "Risco de transferencia entre adquirentes"], correctIndex: 1, explanation: "Sem registro centralizado, um comerciante poderia gravar o mesmo recebivel em dois bancos diferentes (fraude). As registradoras impedem isso: ao tentar gravar, o sistema verifica se o recebivel ja esta comprometido, bloqueando a duplicidade." },
  { id: "ant-h5", theme: "antecipacao", difficulty: "hard", question: "Um marketplace quer oferecer credito aos sellers usando recebiveis futuros como garantia. Qual estrutura regulatoria?", options: ["Pode operar diretamente sem regulacao", "Precisa de parceiro regulado (SCD/banco) para conceder credito, usar registradoras para gravar recebiveis e garantir segregacao entre fluxo de pagamento e credito", "So precisa de FIDC", "Nao e possivel legalmente"], correctIndex: 1, explanation: "O marketplace nao pode conceder credito diretamente (nao e IF). Precisa: parceiro SCD/banco para originar credito, registradoras para gravar recebiveis como garantia, e segregacao clara entre operacao de pagamento e operacao de credito para compliance regulatorio." },
  { id: "ant-h6", theme: "antecipacao", difficulty: "hard", question: "O que e a 'conta de liquidacao obrigatoria' e como afetou o mercado de recebiveis?", options: ["Conta especifica para impostos", "Conta no adquirente/instituicao domicilio onde os recebiveis sao liquidados, dando visibilidade e controle ao credor sobre o fluxo de caixa do comerciante", "Conta de emergencia do Bacen", "Conta compartilhada entre bancos"], correctIndex: 1, explanation: "A conta de liquidacao e onde os recebiveis sao efetivamente pagos. Com o registro e a trava, o credor pode direcionar recebiveis para uma conta especifica, garantindo que o fluxo passe por ele antes de chegar ao comerciante — aumentando a seguranca do credito." },
  { id: "ant-h7", theme: "antecipacao", difficulty: "hard", question: "Qual a implicacao tributaria de antecipacao de recebiveis vs emprestimo para o comerciante?", options: ["Nao ha diferenca tributaria", "Antecipacao pode ser tratada como desconto comercial (sem IOF); emprestimo incide IOF sobre o principal e prazo, afetando custo efetivo total", "Antecipacao paga mais impostos", "IOF incide igualmente em ambos"], correctIndex: 1, explanation: "Antecipacao pelo adquirente pode ser tratada como deducao do MDR (sem IOF). Emprestimo com garantia de recebiveis incide IOF (0.38% + taxa diaria). A diferenca tributaria e significativa no custo efetivo total para o comerciante." },
  { id: "ant-h8", theme: "antecipacao", difficulty: "hard", question: "Como o open finance pode impactar o mercado de antecipacao de recebiveis?", options: ["Nao tem relacao", "Dados abertos de fluxo de caixa e transacoes permitem melhor scoring de credito, mais competição entre credores e ofertas personalizadas ao comerciante", "Apenas facilita PIX", "Reduz a necessidade de antecipacao"], correctIndex: 1, explanation: "Open finance permite que credores acessem dados de fluxo de caixa, transacoes e comportamento financeiro do comerciante em multiplos bancos. Isso melhora a analise de risco, permite ofertas personalizadas e aumenta a competição entre credores." },
  { id: "ant-h9", theme: "antecipacao", difficulty: "hard", question: "O que e 'true sale' em cessao de recebiveis e por que e critico para FIDC?", options: ["Venda em loja fisica", "Transferencia definitiva de propriedade dos recebiveis sem direito de regresso, essencial para que o FIDC nao seja afetado por falencia do cedente", "Venda com desconto maximo", "Venda automatica de recebiveis"], correctIndex: 1, explanation: "True sale garante que os recebiveis cedidos ao FIDC sao definitivamente do fundo e nao voltam para a massa falida se o cedente quebrar. Sem true sale, o FIDC fica exposto ao risco de falencia do cedente, afetando os cotistas." },
  { id: "ant-h10", theme: "antecipacao", difficulty: "hard", question: "Qual o impacto de interoperabilidade entre registradoras para o custo de credito do comerciante?", options: ["Nenhum impacto", "Permite que qualquer credor consulte a agenda livre em todas as registradoras, aumentando competição e reduzindo o custo de credito para o comerciante", "Aumenta custos operacionais", "So beneficia os bancos grandes"], correctIndex: 1, explanation: "Com interoperabilidade, um banco pode consultar recebiveis do comerciante em TAG, CERC e CIP simultaneamente, ter visao completa da capacidade de credito e oferecer melhores condições. Sem interoperabilidade, cada credor so ve 'parte do puzzle', limitando competição." },

  // ============================================================================
  // THEME: Regras de Bandeiras (30 questions)
  // ============================================================================
  { id: "band-e1", theme: "bandeiras", difficulty: "easy", question: "Quais sao as principais bandeiras de cartao que operam no Brasil?", options: ["Visa, Mastercard, PIX e Boleto", "Visa, Mastercard, Elo, American Express, Hipercard e Diners", "Visa e Mastercard apenas", "Elo e Hipercard apenas"], correctIndex: 1, explanation: "No Brasil operam: Visa (maior share global), Mastercard (segunda maior), Elo (brasileira, da parceria entre bancos), Amex (three-party), Hipercard (brasileira, do Itau) e Diners Club." },
  { id: "band-e2", theme: "bandeiras", difficulty: "easy", question: "O que e scheme fee?", options: ["Taxa de esquema de fraude", "Taxa cobrada pela bandeira a cada transacao processada pela sua rede", "Fee de adesao ao cartao", "Taxa de emissao de cartao"], correctIndex: 1, explanation: "Scheme fee e a taxa que a bandeira (Visa, Mastercard) cobra por cada transacao que passa pela sua rede. Compoe o MDR junto com interchange e markup do adquirente." },
  { id: "band-e3", theme: "bandeiras", difficulty: "easy", question: "O que e a Elo e como surgiu?", options: ["Fintech de pagamentos", "Bandeira brasileira criada por Banco do Brasil, Bradesco e Caixa para competir com Visa e Mastercard no mercado domestico", "Divisao do Itau", "Empresa de terminais POS"], correctIndex: 1, explanation: "Elo e a bandeira brasileira criada em 2011 pela parceria entre Banco do Brasil, Bradesco e Caixa Economica Federal, para criar competição domestica contra Visa e Mastercard." },
  { id: "band-e4", theme: "bandeiras", difficulty: "easy", question: "O que e interchange qualification?", options: ["Qualificacao do comerciante", "Classificacao da transacao que determina a taxa de interchange aplicavel baseada em criterios como MCC, tipo de cartao e canal", "Exame para adquirentes", "Certificacao de terminais"], correctIndex: 1, explanation: "Cada transacao e classificada em uma 'qualification tier' baseada no MCC, tipo de cartao (standard, premium, corporate), canal (presencial, e-commerce, recorrente), e dados enviados. Cada tier tem uma taxa de interchange diferente." },
  { id: "band-e5", theme: "bandeiras", difficulty: "easy", question: "O que e downgrade de interchange?", options: ["Melhoria na taxa", "Quando uma transacao nao atende criterios de qualificacao e recebe interchange mais alto que o esperado", "Reducao do limite do cartao", "Queda no ranking da bandeira"], correctIndex: 1, explanation: "Downgrade ocorre quando dados obrigatorios nao sao enviados (AVS, Level II/III data) ou a transacao nao atende criterios (timeout, captura tardia). A transacao 'cai' para um tier mais caro de interchange." },
  { id: "band-e6", theme: "bandeiras", difficulty: "easy", question: "O que sao programas de monitoramento de chargeback das bandeiras?", options: ["Programas de fidelidade", "Programas que monitoram e penalizam comerciantes com taxas de chargeback acima dos limites definidos", "Monitoramento de fraude do portador", "Programas de treinamento"], correctIndex: 1, explanation: "Visa (VDMP/VFMP) e Mastercard (ECM/EFM) monitoram taxas de chargeback e fraude. Comerciantes que excedem limites (ex: >0.9% de chargebacks) entram em programas com multas crescentes e risco de descredenciamento." },
  { id: "band-e7", theme: "bandeiras", difficulty: "easy", question: "O que e BIN table e quem a mantem?", options: ["Tabela de precos de terminais", "Base de dados que mapeia ranges de BIN para emissor, bandeira e tipo de cartao, mantida pelas bandeiras", "Tabela de usuarios bloqueados", "Banco de informacoes de negocio"], correctIndex: 1, explanation: "BIN tables sao bases de dados que mapeiam os primeiros digitos do cartao para seu emissor, bandeira, pais e tipo (credito/debito/prepago). Sao mantidas pelas bandeiras e distribuidoras para roteamento correto." },
  { id: "band-e8", theme: "bandeiras", difficulty: "easy", question: "O que e co-branding de cartao?", options: ["Cartao com dois chips", "Cartao emitido em parceria entre emissor e uma marca/empresa, oferecendo beneficios especificos", "Cartao que funciona em duas bandeiras", "Cartao corporativo compartilhado"], correctIndex: 1, explanation: "Co-branding e quando um emissor lanca cartao em parceria com uma marca (Azul Itaucard, Nubank Ultravioleta). O cartao traz beneficios especificos da marca parceira para fidelizar clientes." },
  { id: "band-m1", theme: "bandeiras", difficulty: "medium", question: "Qual a diferenca entre interchange regulado e livre no Brasil?", options: ["Nao ha regulacao no Brasil", "Debito tem interchange regulado pelo Bacen (teto de 0.5%); credito tem interchange livre definido pelas bandeiras", "Ambos sao regulados igualmente", "Credito e regulado; debito nao"], correctIndex: 1, explanation: "No Brasil, o Bacen regulou o interchange de debito com teto de 0.5% (Resolucao BCB 246). Interchange de credito nao tem teto regulado — as bandeiras definem livremente suas tabelas, que variam por MCC, produto e canal." },
  { id: "band-m2", theme: "bandeiras", difficulty: "medium", question: "O que e o programa Visa Direct?", options: ["Marketing direto da Visa", "Plataforma de push payments que permite enviar fundos diretamente para cartoes, contas bancarias e wallets", "Vendas diretas de cartoes", "Atendimento direto da Visa"], correctIndex: 1, explanation: "Visa Direct permite 'push payments' — enviar dinheiro diretamente para um cartao, conta ou wallet. Usado para disbursements, refunds, P2P e pagamentos a gig workers, com liquidacao em ate 30 minutos." },
  { id: "band-m3", theme: "bandeiras", difficulty: "medium", question: "O que e a diferenca entre Visa e Mastercard no tratamento de parcelado no Brasil?", options: ["Nao ha diferenca", "Ambas tem regras especificas de interchange e compliance para parcelado, mas com estruturas e nomenclaturas diferentes", "Visa nao aceita parcelado", "Mastercard nao opera no Brasil"], correctIndex: 1, explanation: "Ambas aceitam parcelado no Brasil mas com regras proprias de interchange (tabelas diferentes por numero de parcelas), compliance de retry, treatment codes e requisitos de dados na mensageria." },
  { id: "band-m4", theme: "bandeiras", difficulty: "medium", question: "O que e o Mastercard Gateway?", options: ["Terminal fisico da Mastercard", "Servico de gateway de pagamento da Mastercard que oferece processamento, tokenizacao e seguranca integrados", "Portal de acesso ao sistema Mastercard", "Rede privada entre emissores"], correctIndex: 1, explanation: "Mastercard Gateway (anteriormente MiGS) e o servico de gateway que a Mastercard oferece, incluindo processamento multi-adquirente, tokenizacao, 3DS hosting e integracao com a rede Mastercard." },
  { id: "band-m5", theme: "bandeiras", difficulty: "medium", question: "O que sao Level II/III data e por que impactam o interchange?", options: ["Niveis de seguranca do cartao", "Dados adicionais da transacao (impostos, frete, itens) exigidos para interchange qualificado em transacoes B2B/governo", "Niveis de acesso ao sistema da bandeira", "Tipos de cartao corporativo"], correctIndex: 1, explanation: "Level II inclui dados de imposto e codigo do cliente. Level III detalha itens (SKU, quantidade, valor unitario). Enviar esses dados em transacoes com cartao corporativo/purchase card qualifica para interchange menor." },
  { id: "band-m6", theme: "bandeiras", difficulty: "medium", question: "O que e a diferenca entre cartao premium e standard em termos de interchange?", options: ["Nao ha diferenca", "Cartoes premium (Infinite, Black) tem interchange maior porque oferecem mais beneficios ao portador que o emissor precisa financiar", "Premium tem interchange menor", "So difere no design do cartao"], correctIndex: 1, explanation: "Cartoes premium (Visa Infinite, Mastercard Black) tem interchange 40-60% maior que standard. O interchange mais alto financia beneficios como salas VIP, seguros e programas de pontos robustos que esses cartoes oferecem." },
  { id: "band-m7", theme: "bandeiras", difficulty: "medium", question: "O que e Visa Token Service (VTS)?", options: ["Servico de criptomoeda da Visa", "Plataforma de tokenizacao da Visa que gera e gerencia network tokens para substituir PANs em transacoes digitais", "Token de acesso a API da Visa", "Servico de verificacao de cartao"], correctIndex: 1, explanation: "VTS gera network tokens que substituem o PAN real em transacoes digitais. Os tokens sao vinculados ao comerciante/dispositivo, atualizam automaticamente com cartao novo e melhoram taxas de autorizacao." },
  { id: "band-m8", theme: "bandeiras", difficulty: "medium", question: "O que e o conceito de 'acquiring territory' nas regras de bandeira?", options: ["Area geografica do adquirente", "Regra que define que o adquirente deve estar no mesmo pais/regiao do comerciante para processar como transacao domestica", "Territorio de vendas da bandeira", "Area de cobertura do terminal"], correctIndex: 1, explanation: "Bandeiras exigem que o adquirente esteja no mesmo territorio do comerciante para a transacao ser domestica. Se o adquirente esta em outro pais, a transacao e classificada como cross-border e tem interchange/taxas diferentes." },
  { id: "band-m9", theme: "bandeiras", difficulty: "medium", question: "O que e RDR (Rapid Dispute Resolution) da Visa?", options: ["Resolucao rapida de duvidas", "Sistema automatizado que resolve disputas antes de virarem chargebacks formais, usando regras pre-definidas pelo comerciante", "Relatorio de disputas", "Registro de devolucoes"], correctIndex: 1, explanation: "RDR permite que o comerciante defina regras automaticas (ex: reembolsar disputas abaixo de R$100). Quando o portador disputa, a Visa aplica as regras e resolve sem gerar chargeback formal — melhorando a taxa de chargeback do comerciante." },
  { id: "band-m10", theme: "bandeiras", difficulty: "medium", question: "O que e Ethoca e como complementa o RDR?", options: ["Moeda digital da Mastercard", "Servico de alerta da Mastercard que notifica comerciante sobre disputas em tempo real para resolver antes do chargeback", "Sistema de autenticacao", "Plataforma de e-commerce"], correctIndex: 1, explanation: "Ethoca (Mastercard) envia alertas em tempo real quando um portador inicia disputa. O comerciante pode emitir reembolso proativo antes do chargeback ser registrado, evitando que conte na taxa de chargeback." },
  { id: "band-h1", theme: "bandeiras", difficulty: "hard", question: "Um comerciante esta no programa VDMP da Visa (standard). Quais sao as multas e o que acontece se nao sair em 12 meses?", options: ["Apenas advertencia", "Multas crescentes mensais (de $25K a $50K+), possivel aumento de valores e risco de descredenciamento pela bandeira se nao reduzir chargebacks abaixo do threshold", "Bloqueio imediato de transacoes", "So paga multa unica"], correctIndex: 1, explanation: "VDMP standard: multas mensais crescentes ($25K nos primeiros meses, escalando). Se nao sair em 12 meses: multas aumentam significativamente, adquirente pode ser multado tambem, e a Visa pode exigir descredenciamento do comerciante." },
  { id: "band-h2", theme: "bandeiras", difficulty: "hard", question: "Qual a diferenca entre VDMP (Visa Dispute Monitoring Program) e VFMP (Visa Fraud Monitoring Program)?", options: ["Sao o mesmo programa", "VDMP monitora taxa total de chargebacks; VFMP monitora especificamente chargebacks de fraude (TC10) com thresholds diferentes", "VFMP e mais brando", "VDMP e opcional"], correctIndex: 1, explanation: "VDMP mede chargebacks totais (threshold: 0.9% e 100 chargebacks). VFMP mede apenas chargebacks de fraude com TC10 (threshold: 0.65% e 75 chargebacks). Um comerciante pode estar em ambos simultaneamente." },
  { id: "band-h3", theme: "bandeiras", difficulty: "hard", question: "Como a Mastercard calcula o 'EFM basis point ratio' para seu programa de monitoramento?", options: ["Numero de chargebacks / numero de transacoes", "Valor em USD dos chargebacks de fraude / valor total em USD das transacoes, multiplicado por 10000", "Numero de reclamacoes / clientes ativos", "Porcentagem simples de chargebacks"], correctIndex: 1, explanation: "O EFM (Excessive Fraud Merchant) da Mastercard usa basis points: (valor USD de chargebacks de fraude / valor USD total de transacoes) x 10000. Threshold: 35 basis points + minimo de $50K em fraude + 1000 transacoes." },
  { id: "band-h4", theme: "bandeiras", difficulty: "hard", question: "Qual o impacto da regra de 'compelling evidence 3.0' da Visa para disputas de fraude?", options: ["Nao muda nada para o comerciante", "Permite que o comerciante prove que o portador fez transacoes legitimas anteriores com mesmo device/IP/conta, revertendo o chargeback de fraude", "Apenas documenta a fraude", "Elimina todos os chargebacks"], correctIndex: 1, explanation: "CE 3.0 permite reverter chargebacks de fraude (TC10) se o comerciante provar que o mesmo device, IP ou credencial foi usado em 2+ transacoes anteriores nao-disputadas dentro de 365 dias. Prova que o 'fraudador' e o proprio portador." },
  { id: "band-h5", theme: "bandeiras", difficulty: "hard", question: "O que e o Visa Account Attack Intelligence e como ajuda comerciantes?", options: ["Inteligencia de ataque a contas Visa", "Ferramenta da Visa que identifica e alerta sobre ataques de enumeracao/card testing usando inteligencia de rede global", "Sistema de bloqueio de contas", "Ferramenta de auditoria de seguranca"], correctIndex: 1, explanation: "VAAI analisa padroes de transacao em toda a rede Visa para detectar card testing e enumeration attacks. Envia alertas proativos aos adquirentes/comerciantes, permitindo bloqueio antes que o ataque escale." },
  { id: "band-h6", theme: "bandeiras", difficulty: "hard", question: "Qual a regra de retry da Mastercard para transacoes recusadas com response code 51 (insufficient funds)?", options: ["Pode retry imediatamente quantas vezes quiser", "Maximo de 10 retries em 24h para o mesmo PAN, com intervalos minimos, e o retry deve incluir o trace ID original", "Retry proibido para response 51", "1 retry por hora"], correctIndex: 1, explanation: "Mastercard limita retries por PAN/merchant: maximo de retries em 24h, com intervalos minimos entre tentativas. O trace ID deve vincular ao original. Exceder limites gera multas no programa de monitoramento de retries (MRAP)." },
  { id: "band-h7", theme: "bandeiras", difficulty: "hard", question: "O que e a regra de 'no surcharge' das bandeiras e como varia entre paises?", options: ["Regra que proibe taxas extras em todas as transacoes mundialmente", "Proibe ou limita cobrar sobretaxa do portador por pagar com cartao, mas regulacao local pode permitir ou proibir, prevalecendo sobre regra da bandeira", "Nao existe essa regra", "So se aplica a credito"], correctIndex: 1, explanation: "Bandeiras proibem surcharge por padrao, mas legislacao local prevalece. Na Australia e UE, surcharge e permitido (limitado ao custo). No Brasil, cobranca diferenciada por metodo de pagamento e permitida desde 2017." },
  { id: "band-h8", theme: "bandeiras", difficulty: "hard", question: "Como o 'interchange++' pricing difere do 'blended rate' e qual beneficia mais o comerciante de grande porte?", options: ["Sao identicos", "Interchange++ repassa interchange real + scheme fee + markup transparente; blended cobra taxa unica. Interchange++ beneficia grandes volumes pois permite otimizar cada transacao", "Blended e sempre mais barato", "Interchange++ so existe na Europa"], correctIndex: 1, explanation: "Interchange++ (IC++) e transparente: o comerciante paga interchange real (varia por cartao) + scheme fee + markup fixo do adquirente. Blended cobra uma taxa unica que 'embute' tudo. Comerciantes grandes preferem IC++ pois podem otimizar interchange." },
  { id: "band-h9", theme: "bandeiras", difficulty: "hard", question: "O que e Mastercard Decision Intelligence e como afeta a taxa de autorizacao?", options: ["Sistema de business intelligence", "Modelo de IA da Mastercard que fornece scoring de risco ao emissor em tempo real para melhorar decisoes de autorizacao", "Dashboard de metricas", "Ferramenta de pricing"], correctIndex: 1, explanation: "Decision Intelligence usa AI/ML da Mastercard para analisar cada transacao e fornecer um score de risco ao emissor em tempo real. Ajuda emissores a aprovar transacoes legitimas que normalmente seriam recusadas, aumentando a taxa de aprovacao." },
  { id: "band-h10", theme: "bandeiras", difficulty: "hard", question: "Qual a implicacao das regras de domestic processing da bandeira quando um PSP brasileiro usa adquirente estrangeiro?", options: ["Nenhuma — PSP pode usar qualquer adquirente", "Transacoes domesticas processadas por adquirente estrangeiro sao classificadas como cross-border, pagando interchange e scheme fees mais altos", "Apenas afeta transacoes internacionais", "A bandeira reclassifica automaticamente"], correctIndex: 1, explanation: "Se um comerciante brasileiro usa adquirente registrado no exterior, todas as transacoes (mesmo com cartoes brasileiros) sao classificadas como cross-border. Isso gera interchange 2-3x maior e scheme fees adicionais de cross-border processing." },

  // ============================================================================
  // THEME: Chargeback & Disputas (30 questions)
  // ============================================================================
  { id: "cb-e1", theme: "chargeback", difficulty: "easy", question: "O que inicia um chargeback?", options: ["O comerciante", "O portador do cartao contesta a transacao junto ao emissor", "A bandeira automaticamente", "O adquirente"], correctIndex: 1, explanation: "O chargeback e iniciado pelo portador, que contesta a transacao no emissor. O emissor avalia a contestacao e, se procedente, inicia o processo formal de chargeback contra o adquirente/comerciante." },
  { id: "cb-e2", theme: "chargeback", difficulty: "easy", question: "O que e um reason code de chargeback?", options: ["Codigo de desconto", "Codigo que identifica o motivo da disputa (fraude, produto nao recebido, cobranca duplicada, etc)", "Codigo de seguranca do cartao", "Numero de rastreamento da transacao"], correctIndex: 1, explanation: "Reason codes sao codigos padronizados pelas bandeiras que identificam o motivo do chargeback. Visa usa codigos como 10.4 (fraude), 13.1 (mercadoria nao recebida). Mastercard tem sua propria codificacao." },
  { id: "cb-e3", theme: "chargeback", difficulty: "easy", question: "O que e representment?", options: ["Representacao juridica", "Resposta do comerciante ao chargeback com evidencias para contestar a disputa", "Segundo chargeback", "Relatorio de fraude"], correctIndex: 1, explanation: "Representment e quando o comerciante contesta o chargeback enviando evidencias (comprovante de entrega, log de IP, comunicacao com cliente) ao adquirente para reverter a decisão do emissor." },
  { id: "cb-e4", theme: "chargeback", difficulty: "easy", question: "Qual a diferenca entre chargeback e refund?", options: ["Sao a mesma coisa", "Refund e iniciado voluntariamente pelo comerciante; chargeback e imposto pelo emissor via processo de disputa", "Chargeback e mais rapido", "Refund so funciona com PIX"], correctIndex: 1, explanation: "Refund e uma devolucao voluntaria do comerciante. Chargeback e um processo forcado onde o emissor debita o comerciante. Chargebacks tem custo adicional (taxa de chargeback) e contam nas metricas de monitoramento." },
  { id: "cb-e5", theme: "chargeback", difficulty: "easy", question: "Quanto tempo o portador tem para iniciar um chargeback na maioria dos casos?", options: ["7 dias", "120 dias da transacao ou da data esperada de entrega", "30 dias", "1 ano"], correctIndex: 1, explanation: "O prazo padrao e 120 dias da transacao ou da data esperada de entrega (o que for posterior). Para alguns reason codes (servicos nao prestados, assinaturas), pode chegar a 540 dias." },
  { id: "cb-e6", theme: "chargeback", difficulty: "easy", question: "O que e taxa de chargeback?", options: ["Percentual de taxa cobrado no cartao", "Taxa administrativa cobrada do comerciante a cada chargeback recebido, alem do valor da transacao", "Taxa de juros sobre chargeback", "Percentual de desconto por volume"], correctIndex: 1, explanation: "Alem de perder o valor da transacao, o comerciante paga uma taxa fixa por chargeback (tipicamente R$30-80). Essa taxa e cobrada pelo adquirente independente de quem ganha a disputa." },
  { id: "cb-e7", theme: "chargeback", difficulty: "easy", question: "O que e pre-arbitracao?", options: ["Processo antes do julgamento", "Fase da disputa onde o emissor contesta a representacao do comerciante antes de ir para arbitracao da bandeira", "Mediacao entre portador e comerciante", "Negociacao de taxas"], correctIndex: 1, explanation: "Pre-arbitracao e a segunda rodada de disputa: apos o representment do comerciante, se o emissor discordar, entra em pre-arbitracao. Se nao resolver, vai para arbitracao final da bandeira." },
  { id: "cb-e8", theme: "chargeback", difficulty: "easy", question: "O que significa 'win rate' em chargebacks?", options: ["Taxa de aprovacao de transacoes", "Percentual de chargebacks que o comerciante consegue reverter com sucesso via representment", "Taxa de vitoria em vendas", "Percentual de disputas abertas"], correctIndex: 1, explanation: "Win rate e o percentual de chargebacks contestados que o comerciante vence. Um win rate de 40% significa que de cada 10 representments, 4 sao revertidos a favor do comerciante." },
  { id: "cb-m1", theme: "chargeback", difficulty: "medium", question: "Qual a diferenca entre reason code 10.4 (Visa) e 4837 (Mastercard)?", options: ["Sao identicos", "Ambos sao fraude mas Visa 10.4 e fraude em transacao card-not-present; Mastercard 4837 e fraude geral 'no cardholder authorization'", "10.4 e mais grave", "4837 e para transacoes presenciais"], correctIndex: 1, explanation: "Visa 10.4 (Card Absent Environment) e especifico para CNP fraud. Mastercard 4837 (No Cardholder Authorization) e mais amplo, cobrindo fraude onde o portador nao autorizou a transacao. As evidencias necessarias para representment diferem." },
  { id: "cb-m2", theme: "chargeback", difficulty: "medium", question: "O que e CDRN (Cardholder Dispute Resolution Network) da Visa?", options: ["Rede de resolucao de conflitos", "Sistema que permite comerciantes receberem notificacao previa de disputas para resolver antes do chargeback formal", "Rede de comunicacao entre portadores", "Central de devolucao de valores"], correctIndex: 1, explanation: "CDRN (via Verifi) notifica o comerciante quando uma disputa e iniciada, dando janela de 72h para emitir refund antes que se torne chargeback formal. Evita que a disputa conte no ratio de chargeback." },
  { id: "cb-m3", theme: "chargeback", difficulty: "medium", question: "Qual a diferenca entre first chargeback e second chargeback (pre-arbitration)?", options: ["Sao a mesma coisa em momentos diferentes", "First chargeback e a disputa inicial; pre-arbitracao ocorre quando emissor contesta o representment do comerciante", "Second chargeback e sobre valor diferente", "Nao existe second chargeback"], correctIndex: 1, explanation: "First chargeback: disputa inicial do portador. O comerciante envia representment. Se o emissor discorda, inicia pre-arbitracao (second chargeback). Se ainda nao resolver, vai para arbitracao da bandeira (decisao final)." },
  { id: "cb-m4", theme: "chargeback", difficulty: "medium", question: "Por que o descriptor e tao importante na prevencao de chargebacks?", options: ["E apenas um detalhe estetico", "Descriptor claro evita que o portador nao reconheca a compra na fatura e inicie chargeback por 'nao reconhecimento'", "Ajuda no processamento da transacao", "Exigencia legal apenas"], correctIndex: 1, explanation: "Chargebacks por 'nao reconhecimento' (reason code 13.3 Visa) sao muito comuns. Se o portador ve 'PAG*XPTO123' na fatura e nao entende, disputa. Um descriptor claro como 'LOJA MARIA - SAPATOS' evita isso." },
  { id: "cb-m5", theme: "chargeback", difficulty: "medium", question: "O que e compelling evidence no contexto de representment?", options: ["Prova criminal de fraude", "Documentacao que prova que a transacao foi legitima e feita pelo portador: IP, device, entrega confirmada", "Evidencia de que o comerciante e confiavel", "Depoimento do portador"], correctIndex: 1, explanation: "Compelling evidence inclui: tracking de entrega com assinatura, log de IP/device matching outras compras, comunicacao do portador, autenticacao 3DS, historico de transacoes sem disputa do mesmo dispositivo." },
  { id: "cb-m6", theme: "chargeback", difficulty: "medium", question: "Qual o impacto financeiro total de um chargeback de R$100 para o comerciante?", options: ["Perde R$100 apenas", "Perde R$100 (valor) + custo do produto/servico + taxa de chargeback + custo operacional de gestao da disputa", "Perde R$50 (metade)", "Perde R$100 + 50% de multa"], correctIndex: 1, explanation: "O custo total e: valor da transacao (R$100) + custo do produto ja entregue + taxa de chargeback (~R$50) + tempo da equipe gerindo a disputa. Em media, o custo total e 2.5-3x o valor do chargeback." },
  { id: "cb-m7", theme: "chargeback", difficulty: "medium", question: "O que e chargeback de 'servico nao prestado' e como difere de 'produto nao recebido'?", options: ["Sao o mesmo reason code", "Servico nao prestado e para servicos/assinaturas cancelados; produto nao recebido e para bens fisicos nao entregues — evidencias de defesa diferem", "So muda o nome", "Servico nao tem chargeback"], correctIndex: 1, explanation: "Produto nao recebido requer evidencia de entrega (tracking, assinatura). Servico nao prestado requer prova de que o servico foi entregue/acessado (logs de acesso, uso da plataforma, confirmacao). Defesas completamente diferentes." },
  { id: "cb-m8", theme: "chargeback", difficulty: "medium", question: "O que e a regra de '15/1000' da Mastercard ECM?", options: ["Limite de transacoes por dia", "Threshold de 15 chargebacks em 1000 transacoes (1.5%) para entrada no programa Excessive Chargeback Merchant", "Prazo de 15 dias para 1000 reais", "Limite de representment"], correctIndex: 1, explanation: "Mastercard ECM tem thresholds baseados em ratio (1.5% = 15 em 1000 transacoes) E minimo absoluto (100 chargebacks). Se ambos forem excedidos, o comerciante entra no programa com multas crescentes." },
  { id: "cb-m9", theme: "chargeback", difficulty: "medium", question: "O que e deflection de chargebacks?", options: ["Desviar chargebacks para outro comerciante", "Resolver disputas antes que se tornem chargebacks formais usando alerts (Ethoca), RDR ou refund proativo", "Recusar chargebacks automaticamente", "Transferir responsabilidade ao portador"], correctIndex: 1, explanation: "Deflection intercepta disputas antes do chargeback formal: Ethoca alerts notificam em tempo real, RDR resolve automaticamente por regras, e equipe proativa oferece refund direto ao portador. O objetivo e que a disputa nunca vire chargeback." },
  { id: "cb-m10", theme: "chargeback", difficulty: "medium", question: "Qual a importancia do prazo de representment e o que acontece se for perdido?", options: ["Pode representar a qualquer momento", "O comerciante tem prazo limitado (tipicamente 30 dias) para enviar representment; se perder, o chargeback e aceito automaticamente", "O prazo e de 1 ano", "O adquirente representa automaticamente"], correctIndex: 1, explanation: "O prazo de representment e tipicamente 30 dias (varia por bandeira e reason code). Se o comerciante nao enviar evidencias nesse prazo, o chargeback e aceito automaticamente e o valor e debitado definitivamente." },
  { id: "cb-h1", theme: "chargeback", difficulty: "hard", question: "Um e-commerce de assinaturas tem 60% dos chargebacks com reason code 13.2 (Visa - cancelled recurring). Qual estrategia mais eficaz?", options: ["Tornar cancelamento mais dificil", "Implementar notificacao pre-cobranca, simplificar cancelamento, usar Account Updater para nao cobrar cartoes cancelados, e comunicar claramente termos de renovacao", "Bloquear chargebacks automaticamente", "Cobrar anualmente em vez de mensalmente"], correctIndex: 1, explanation: "Chargebacks de recorrencia cancelada indicam: portador tentou cancelar sem sucesso, nao sabia da renovacao, ou cartao foi reemitido sem update. Notificacao pre-cobranca (7 dias antes), cancelamento em 1 clique e termos claros reduzem drasticamente esse tipo." },
  { id: "cb-h2", theme: "chargeback", difficulty: "hard", question: "Qual o custo-beneficio de usar Ethoca + RDR + CDRN simultaneamente vs escolher apenas um?", options: ["Um e suficiente — nao precisa dos tres", "Cada servico cobre etapas diferentes da disputa; juntos maximizam deflection mas custam mais, exigindo analise de ROI por volume e tipo de chargeback", "Os tres fazem a mesma coisa", "Usar todos e obrigatorio pelas bandeiras"], correctIndex: 1, explanation: "Ethoca (alert pre-chargeback), RDR (resolucao automatica da Visa) e CDRN (Verifi/Visa) cobrem momentos diferentes da disputa. Juntos cobrem 80-90% das disputas, mas cada um tem custo por disputa resolvida. O ROI depende do volume e custo medio do chargeback." },
  { id: "cb-h3", theme: "chargeback", difficulty: "hard", question: "Como a analise de root cause de chargebacks difere entre fraude real (third-party) e friendly fraud?", options: ["Nao difere — tratamento e o mesmo", "Fraude real requer fortalecer autenticacao/antifraude; friendly fraud requer melhorar descriptor, comunicacao e processo de contestacao", "Friendly fraud nao pode ser combatida", "Fraude real e responsabilidade apenas do emissor"], correctIndex: 1, explanation: "Root causes diferentes exigem acoes diferentes: fraude real -> 3DS, antifraude, velocity checks. Friendly fraud -> descriptor claro, notificacao pre-cobranca, cancelamento facil, CE 3.0, e defesa com historico de compras do mesmo device." },
  { id: "cb-h4", theme: "chargeback", difficulty: "hard", question: "Um marketplace tem seller com taxa de chargeback de 5%. Qual a responsabilidade do marketplace?", options: ["Nenhuma — e responsabilidade do seller", "O marketplace/adquirente e responsavel perante a bandeira pelo chargeback, podendo ser penalizado com multas e entrada em programas de monitoramento", "So o seller e penalizado", "A bandeira ignora marketplaces"], correctIndex: 1, explanation: "Perante a bandeira, o MID (Merchant ID) do marketplace e o que aparece. Se um seller gera 5% de chargebacks, o marketplace todo entra em VDMP/ECM. O marketplace deve monitorar sellers, criar limites e desativar sellers problematicos proativamente." },
  { id: "cb-h5", theme: "chargeback", difficulty: "hard", question: "O que e o processo de arbitracao da bandeira e qual o custo?", options: ["Processo judicial com juiz", "Decisao final da bandeira quando emissor e comerciante nao concordam; custa centenas a milhares de dolares e a parte perdedora paga", "Mediacao gratuita", "Processo automatico sem custo"], correctIndex: 1, explanation: "Arbitracao e a decisao final da bandeira. Custos: Visa cobra ~$500 por arbitracao (parte perdedora paga). Mastercard tem taxas similares. A bandeira revisa toda evidencia e decide irreversivelmente. E o 'tribunal final' do ecossistema de cartoes." },
  { id: "cb-h6", theme: "chargeback", difficulty: "hard", question: "Como o 3DS 2.0 com liability shift impacta a estrategia de chargeback de um comerciante?", options: ["Elimina todos os chargebacks", "Chargebacks de fraude (TC10) em transacoes 3DS autenticadas sao responsabilidade do emissor, mas chargebacks de servico (nao recebido, defeito) permanecem com o comerciante", "3DS nao tem relacao com chargeback", "Aumenta chargebacks"], correctIndex: 1, explanation: "Com 3DS autenticado: fraude = emissor paga (liability shift). Mas chargebacks de 'produto nao recebido', 'defeito', 'cancelamento de recorrencia' continuam responsabilidade do comerciante. 3DS protege contra fraude, nao contra disputas de servico." },
  { id: "cb-h7", theme: "chargeback", difficulty: "hard", question: "Qual a estrategia otima de representment: contestar todos os chargebacks ou ser seletivo?", options: ["Sempre contestar todos", "Ser seletivo: contestar quando ha evidencia forte, aceitar quando o custo de representment excede o valor recuperavel", "Nunca contestar — nao vale a pena", "Contestar aleatoriamente para confundir emissores"], correctIndex: 1, explanation: "Representment seletivo e otimo: analisar evidencias disponiveis, calcular win rate historico por reason code, e contestar quando (probabilidade de ganhar x valor) > (custo de montar a defesa). Contestar sem evidencia desperdiça recursos." },
  { id: "cb-h8", theme: "chargeback", difficulty: "hard", question: "O que e 'double refund' e como ocorre em operacoes de chargeback?", options: ["Reembolso duplicado intencional", "Quando comerciante emite refund E o portador ganha chargeback sobre a mesma transacao, resultando em perda dupla", "Refund em duas parcelas", "Politica de satisfacao garantida"], correctIndex: 1, explanation: "Double refund acontece quando: portador reclama, comerciante emite refund proativamente, mas o portador ja havia iniciado chargeback no emissor. Resultado: comerciante perde o valor duas vezes. Prevencao: verificar se ha chargeback pendente antes de reembolsar." },
  { id: "cb-h9", theme: "chargeback", difficulty: "hard", question: "Como construir um modelo preditivo de chargeback e quais features sao mais relevantes?", options: ["Nao e possivel prever chargebacks", "Usar historico de disputas com features: MCC, ticket medio, device fingerprint, historico do portador, descriptor match, tempo de entrega, e tipo de produto", "Apenas analisar o valor da transacao", "Usar o mesmo modelo de fraude"], correctIndex: 1, explanation: "Modelo preditivo de chargeback usa: produto digital vs fisico, tempo de entrega, descriptor clarity score, historico de disputa do BIN, canal (recurring vs one-time), device risk score, e customer lifetime value. Difere de fraude — muitos chargebacks vem de transacoes 'legítimas'." },
  { id: "cb-h10", theme: "chargeback", difficulty: "hard", question: "Um PSP gerencia 10.000 comerciantes e precisa monitorar risco de chargeback proativamente. Qual abordagem?", options: ["Verificar manualmente cada comerciante mensalmente", "Implementar sistema de early warning com thresholds progressivos, alertas automaticos em 50%/75%/90% dos limites de bandeira, e acao corretiva automatizada", "Apenas monitorar quando a bandeira notificar", "Terceirizar todo o monitoramento"], correctIndex: 1, explanation: "Monitoramento proativo: dashboards em tempo real por MID, alertas automaticos quando comerciante atinge 50% do threshold (precoce), 75% (urgente) e 90% (critico). Acoes automaticas: habilitar 3DS obrigatorio, ativar RDR/alerts, e se necessario, restringir processamento." },

  // Extra easy questions to reach 30 per theme
  { id: "auth-e9", theme: "autorizacao", difficulty: "easy", question: "O que e timeout em uma transacao de pagamento?", options: ["Tempo de validade do cartao", "Quando a resposta do emissor nao chega dentro do prazo esperado", "Pausa programada no processamento", "Tempo de espera do cliente no checkout"], correctIndex: 1, explanation: "Timeout ocorre quando o emissor nao responde dentro do prazo definido (tipicamente 30-60s). A transacao fica sem resposta e o terminal/gateway trata como recusa por timeout." },
  { id: "auth-e10", theme: "autorizacao", difficulty: "easy", question: "O que e batch processing em pagamentos?", options: ["Processamento em tempo real", "Envio de multiplas transacoes agrupadas de uma vez para clearing e settlement", "Processamento de um unico pagamento", "Backup de transacoes"], correctIndex: 1, explanation: "Batch processing agrupa transacoes do dia e envia em lote para clearing, ao inves de processar cada uma individualmente. E o modelo padrao de clearing de cartoes de credito." },
  { id: "fraud-e9", theme: "fraude", difficulty: "easy", question: "O que e blacklist (lista negra) em prevencao de fraude?", options: ["Lista de clientes VIP", "Lista de cartoes, emails, IPs ou devices associados a fraude confirmada que sao bloqueados automaticamente", "Lista de comerciantes premiados", "Registro de transacoes aprovadas"], correctIndex: 1, explanation: "Blacklists contem identificadores (BINs, emails, IPs, device IDs) associados a fraudes anteriores. Transacoes que matcham sao automaticamente bloqueadas ou sinalizadas para revisao." },
  { id: "fraud-e10", theme: "fraude", difficulty: "easy", question: "O que e chargeback fraud?", options: ["Fraude cometida pelo adquirente", "Quando o portador faz uma compra legitima e depois contesta falsamente como fraude para receber o dinheiro de volta", "Fraude no processo de compensacao", "Erro de sistema que gera chargeback"], correctIndex: 1, explanation: "Chargeback fraud (ou friendly fraud) e quando o portador faz uma compra real, recebe o produto/servico, e depois contesta como fraude no emissor para ficar com o produto e receber o dinheiro de volta." },
  { id: "liq-e9", theme: "liquidacao", difficulty: "easy", question: "O que e D+0 na liquidacao?", options: ["Dia zero do contrato", "Valor disponivel para o comerciante no mesmo dia da transacao", "Data de vencimento do cartao", "Prazo de cancelamento"], correctIndex: 1, explanation: "D+0 significa liquidacao no mesmo dia da transacao. O comerciante recebe o valor imediatamente (geralmente com taxa de antecipacao embutida)." },
  { id: "liq-e10", theme: "liquidacao", difficulty: "easy", question: "O que e netting em liquidacao?", options: ["Pescaria de transacoes", "Compensacao de debitos e creditos entre partes para transferir apenas a diferenca liquida", "Calculo de taxas", "Rede de pagamentos"], correctIndex: 1, explanation: "Netting compensa posicoes opostas: se A deve R$100 a B e B deve R$70 a A, transfere-se apenas R$30 de A para B, reduzindo o volume de transferencias." },
  { id: "infra-e9", theme: "infraestrutura", difficulty: "easy", question: "O que e um terminal POS?", options: ["Software de gestao empresarial", "Dispositivo usado pelo comerciante para aceitar pagamentos com cartao (maquininha)", "Protocolo de seguranca", "Sistema de ponto de venda online"], correctIndex: 1, explanation: "POS (Point of Sale) e o dispositivo fisico (maquininha) que le o cartao (chip, tarja, contactless), captura o PIN e envia a transacao ao adquirente para processamento." },
  { id: "infra-e10", theme: "infraestrutura", difficulty: "easy", question: "O que e NFC em pagamentos?", options: ["Network Financial Control", "Near Field Communication — tecnologia de comunicacao sem fio de curto alcance para pagamentos contactless", "National Finance Code", "New Financial Channel"], correctIndex: 1, explanation: "NFC (Near Field Communication) permite pagamentos por aproximacao: o cartao ou celular se comunica com o terminal a poucos centimetros de distancia, sem necessidade de inserir ou passar o cartao." },
  { id: "cry-e9", theme: "crypto", difficulty: "easy", question: "O que e mineracao de criptomoedas?", options: ["Extrair minerais digitais", "Processo de validar transacoes e adicionar blocos a blockchain usando poder computacional", "Criar novas exchanges", "Comprar criptomoedas em promocao"], correctIndex: 1, explanation: "Mineracao e o processo onde computadores resolvem problemas matematicos complexos para validar transacoes e adicionar novos blocos a blockchain. Mineradores sao recompensados com novas moedas." },
  { id: "cry-e10", theme: "crypto", difficulty: "easy", question: "O que e Proof of Stake (PoS)?", options: ["Prova de participacao em ICO", "Mecanismo de consenso onde validadores sao selecionados com base na quantidade de moedas que possuem em stake", "Protocolo de stablecoin", "Sistema de votacao descentralizado"], correctIndex: 1, explanation: "Proof of Stake seleciona validadores proporcionalmente a quantidade de moedas que depositam como garantia (stake). E mais eficiente energeticamente que Proof of Work (mineracao)." },
  { id: "comp-e9", theme: "compliance", difficulty: "easy", question: "O que e due diligence em pagamentos?", options: ["Diligencia na entrega de produtos", "Processo de investigacao e verificacao de informacoes sobre clientes, parceiros ou transacoes antes de estabelecer relacao", "Auditoria de codigo", "Processo de instalacao de terminal"], correctIndex: 1, explanation: "Due diligence e a investigacao previa que instituicoes financeiras fazem sobre clientes e parceiros para avaliar riscos de lavagem, fraude e compliance antes de iniciar relacao comercial." },
  { id: "comp-e10", theme: "compliance", difficulty: "easy", question: "O que e screening de sancoes?", options: ["Triagem medica de funcionarios", "Verificacao de nomes de clientes e transacoes contra listas de sancoes internacionais", "Teste de seguranca do sistema", "Avaliacao de performance"], correctIndex: 1, explanation: "Screening de sancoes verifica se clientes, beneficiarios ou partes de uma transacao estao em listas restritivas (OFAC, UE, ONU). E obrigatorio para todas as instituicoes financeiras." },
  { id: "ant-e9", theme: "antecipacao", difficulty: "easy", question: "Quem pode antecipar recebiveis de cartao?", options: ["Apenas o Banco Central", "O adquirente, bancos e FIDCs autorizados", "Apenas o comerciante", "Somente fintechs"], correctIndex: 1, explanation: "Recebiveis podem ser antecipados pelo proprio adquirente (que detem a agenda), bancos (que concedem credito com recebiveis como garantia) ou FIDCs (que compram os recebiveis)." },
  { id: "ant-e10", theme: "antecipacao", difficulty: "easy", question: "O que acontece com o valor quando o comerciante antecipa um recebivel?", options: ["Recebe o valor integral", "Recebe o valor com desconto (deságio) proporcional ao prazo antecipado", "Paga taxa fixa independente do prazo", "O valor e convertido em credito"], correctIndex: 1, explanation: "Ao antecipar, o comerciante recebe o valor menos o deságio, que e proporcional ao prazo: quanto mais longe o vencimento original, maior o desconto aplicado." },
  { id: "band-e9", theme: "bandeiras", difficulty: "easy", question: "O que e American Express (Amex) no modelo de pagamentos?", options: ["Apenas uma bandeira como Visa", "Opera como modelo three-party: e bandeira, emissora e adquirente ao mesmo tempo", "E um banco brasileiro", "E uma fintech de PIX"], correctIndex: 1, explanation: "A Amex opera no modelo three-party (closed loop): atua simultaneamente como bandeira, emissora e adquirente, controlando toda a cadeia. Visa e Mastercard sao four-party (open loop)." },
  { id: "band-e10", theme: "bandeiras", difficulty: "easy", question: "O que e contactless payment?", options: ["Pagamento sem internet", "Pagamento por aproximacao do cartao ou celular no terminal, sem necessidade de inserir ou digitar senha em valores baixos", "Pagamento sem contato com o comerciante", "Pagamento automatico de contas"], correctIndex: 1, explanation: "Contactless usa tecnologia NFC para pagamento por aproximacao. Em valores abaixo do limite (geralmente R$200 no Brasil), nao exige senha, tornando a transacao mais rapida e conveniente." },
  { id: "cb-e9", theme: "chargeback", difficulty: "easy", question: "O que e a taxa de chargeback de um comerciante?", options: ["Taxa cobrada por transacao", "Percentual de transacoes que resultam em chargeback em relacao ao total de transacoes", "Taxa paga ao portador", "Desconto no MDR"], correctIndex: 1, explanation: "A taxa de chargeback e calculada como (numero de chargebacks / numero total de transacoes) x 100. As bandeiras monitoram essa taxa e penalizam comerciantes que excedem limites (ex: 0.9% na Visa)." },
  { id: "cb-e10", theme: "chargeback", difficulty: "easy", question: "Quais sao os tipos mais comuns de chargeback?", options: ["Apenas fraude", "Fraude (real e amigavel), produto nao recebido, produto defeituoso, cobranca duplicada e nao reconhecimento", "Apenas nao reconhecimento", "Apenas produto defeituoso"], correctIndex: 1, explanation: "Os tipos principais sao: fraude real (third-party), friendly fraud, produto nao recebido, produto diferente do descrito, cobranca duplicada e nao reconhecimento na fatura. Cada um tem reason code e defesa diferentes." },
];

export function getStandaloneQuestionsByTheme(theme: string): StandaloneQuestion[] {
  return STANDALONE_QUIZZES.filter(q => q.theme === theme);
}

export function getStandaloneQuestionsByDifficulty(theme: string, difficulty: Difficulty): StandaloneQuestion[] {
  return STANDALONE_QUIZZES.filter(q => q.theme === theme && q.difficulty === difficulty);
}

export function getStandaloneQuestionCount(theme: string): number {
  return STANDALONE_QUIZZES.filter(q => q.theme === theme).length;
}
