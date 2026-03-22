export type QuestionType = "multiple-choice" | "true-false" | "ordering" | "scenario";
export type Difficulty = "easy" | "medium" | "hard";

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
      },
      {
        id: "fs-3",
        question: "Qual a funcao de uma camara de compensacao (clearing house)?",
        type: "multiple-choice",
        difficulty: "medium",
        options: ["Emitir moeda", "Ser contraparte central e reduzir risco sistemico", "Processar pagamentos Pix", "Regular fintechs"],
        correctIndex: 1,
        explanation: "Camaras de compensacao atuam como contraparte central (CCP), garantindo que ambas as partes cumpram suas obrigacoes e reduzindo risco sistemico no mercado financeiro.",
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
      },
      {
        id: "cl-7",
        question: "O Compelling Evidence 3.0 (CE 3.0) da Visa pode ser usado para defender qualquer tipo de chargeback, não apenas fraude.",
        type: "true-false",
        difficulty: "medium",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. O CE 3.0 aplica-se EXCLUSIVAMENTE a chargebacks com reason code 10.4 (Fraud - Card Absent Environment). Para outros reason codes como 13.1 (não reconheço), 13.3 (não recebi) ou 13.6 (diferente do descrito), o merchant deve usar estratégias de defesa convencionais com as evidências específicas de cada código.",
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
      },
      {
        id: "cbd-3",
        question: "Os serviços de alertas pré-chargeback (CDRN, Ethoca) são gratuitos para o merchant.",
        type: "true-false",
        difficulty: "easy",
        options: ["Verdadeiro", "Falso"],
        correctIndex: 1,
        explanation: "Falso. Serviços como Verifi CDRN e Ethoca Alerts cobram por alerta, tipicamente R$5-15 por alerta recebido. Porém, o ROI é positivo: o custo de um alerta é muito menor que o custo total de um chargeback (R$250-675). Um merchant precisa deflectir apenas 3-5% dos alertas para ter break-even.",
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
      },
    ],
  },
];

export function getQuizForPage(route: string): PageQuiz | null {
  return QUIZZES.find((q) => q.pageRoute === route) || null;
}
