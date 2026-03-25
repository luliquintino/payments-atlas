"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const sectionStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  marginBottom: "1.25rem",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "var(--foreground)",
  marginBottom: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
  marginBottom: "0.75rem",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--foreground)",
  marginBottom: "0.5rem",
  marginTop: "1rem",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.8125rem",
};

const thStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  borderBottom: "2px solid var(--border)",
  background: "var(--surface)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--foreground)",
  verticalAlign: "top",
};

const highlightBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(59,130,246,0.25)",
  background: "rgba(59,130,246,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const codeBlockStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "#1e1e2e",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  color: "#cdd6f4",
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
  whiteSpace: "pre",
};

const warningBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "rgba(239,68,68,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DLocalDeepDivePage() {
  const quiz = getQuizForPage("/knowledge/psp/dlocal");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "visao-geral",
      title: "Visao Geral",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            dLocal foi fundada em 2016 em Montevideo, Uruguai, com foco exclusivo em mercados emergentes.
            A empresa fez IPO na NASDAQ em 2021 (DLO), tornando-se uma das primeiras fintechs latinas
            listadas nos EUA. Opera em 40+ paises na America Latina, Africa e Asia, conectando merchants
            internacionais a metodos de pagamento locais.
          </p>
          <p style={paragraphStyle}>
            O diferencial da dLocal e resolver a complexidade regulatoria e operacional de aceitar
            pagamentos em mercados emergentes — onde cada pais tem regulacoes distintas (BACEN no Brasil,
            CNBV no Mexico, RBI na India), metodos de pagamento unicos (PIX, OXXO, M-Pesa, UPI) e
            desafios de FX e settlement.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fundacao</td><td style={tdStyle}>2016, Montevideo, Uruguai</td></tr>
                <tr><td style={tdStyle}>IPO</td><td style={tdStyle}>2021 — NASDAQ (DLO)</td></tr>
                <tr><td style={tdStyle}>Paises</td><td style={tdStyle}>40+ (LatAm, Africa, Asia)</td></tr>
                <tr><td style={tdStyle}>Metodos de pagamento</td><td style={tdStyle}>600+ metodos locais</td></tr>
                <tr><td style={tdStyle}>Clientes</td><td style={tdStyle}>Amazon, Microsoft, Spotify, Uber, Shopify, Didi</td></tr>
                <tr><td style={tdStyle}>Modelo</td><td style={tdStyle}>Cross-border payment facilitator</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              One API, many markets
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Um merchant internacional integra uma unica API da dLocal e consegue aceitar PIX no Brasil,
              OXXO no Mexico, M-Pesa no Quenia e UPI na India — sem precisar de entidade local em
              cada pais, sem lidar com regulacoes locais, e recebendo settlement em USD ou EUR.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "modelo-negocio",
      title: "Modelo de Negocio",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            A dLocal funciona como um cross-border payment facilitator. Ela mantem entidades legais
            locais em cada mercado, absorvendo a complexidade regulatoria. O merchant internacional
            contrata a dLocal e ela cuida de tudo: acquiring local, metodos de pagamento, compliance
            regulatoria, FX e settlement.
          </p>
          <p style={subheadingStyle}>Como funciona o fluxo financeiro</p>
          <div style={codeBlockStyle}>
{`Consumidor no Brasil paga R$100 via PIX
    |
    v
dLocal recebe R$100 na entidade local brasileira
    |
    v
dLocal aplica FX spread (ex: 2.5% sobre mid-market rate)
    |
    v
dLocal deposita ~USD 18.50 na conta do merchant (apos FX + fees)
    |
    v
Settlement em USD (ou EUR) na conta bancaria internacional do merchant`}
          </div>
          <p style={subheadingStyle}>Fontes de receita</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Range Tipico</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Processing Fee</td><td style={tdStyle}>Taxa por transacao processada</td><td style={tdStyle}>1.5% - 5% (varia por pais e metodo)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>FX Spread</td><td style={tdStyle}>Diferenca entre taxa mid-market e taxa aplicada ao merchant</td><td style={tdStyle}>2% - 4% sobre mid-market</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Payout Fee</td><td style={tdStyle}>Taxa para enviar pagamentos (payouts) a recipients locais</td><td style={tdStyle}>Variavel por corredor</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que merchants internacionais usam dLocal
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Abrir uma entidade legal no Brasil leva 3-6 meses e exige compliance com BACEN, Receita
              Federal e regulacoes locais. Com dLocal, o merchant integra uma API e comeca a aceitar
              PIX, boleto e cartoes locais em semanas, recebendo em USD.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "arquitetura-tecnica",
      title: "Arquitetura Tecnica",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A arquitetura da dLocal e otimizada para o cenario cross-border: o merchant internacional
            envia uma chamada de API unica, e a dLocal roteia internamente para a entidade local
            correta, seleciona o adquirente/processador local e gerencia o fluxo de FX e settlement.
          </p>
          <p style={subheadingStyle}>Fluxo de Transacao Cross-Border</p>
          <div style={codeBlockStyle}>
{`International Merchant (EUA/Europa)
    |
    | 1. POST /payments (country=BR, currency=BRL, method=PIX)
    v
dLocal API Gateway (global)
    |
    | 2. Roteamento para entidade local
    v
dLocal Entidade Local (Brasil)
    |
    | 3. Processamento via parceiro local
    v
Processador/Adquirente Local (ex: banco parceiro para PIX)
    |
    | 4. Pagamento processado
    v
Consumidor paga via PIX (QR code / copia-e-cola)
    |
    | 5. Confirmacao
    v
dLocal recebe BRL na conta local
    |
    | 6. FX conversion
    v
dLocal converte BRL -> USD (com spread)
    |
    | 7. Settlement
    v
Merchant recebe USD na conta internacional`}
          </div>
          <p style={subheadingStyle}>Camadas da plataforma</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Camada</th>
                  <th style={thStyle}>Funcao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>API Gateway</td><td style={tdStyle}>Endpoint unico global. Roteia por country code para a entidade local correta.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Local Processing</td><td style={tdStyle}>Integracao com adquirentes e processadores locais em cada pais. Suporta 600+ metodos.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Compliance Engine</td><td style={tdStyle}>Gerencia requisitos regulatorios por pais (BACEN, CNBV, RBI, etc.).</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>FX Engine</td><td style={tdStyle}>Conversao de moeda com rates atualizados. Settlement em USD/EUR.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Smart Fields</td><td style={tdStyle}>Componentes de UI que se adaptam ao pais — mostra campos corretos para cada metodo local.</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "anatomia-api",
      title: "Anatomia da API",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            A API da dLocal e RESTful com payloads JSON. Autenticacao via headers X-Login, X-Trans-Key
            e X-Date (com assinatura HMAC). O campo <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>country</code> e obrigatorio
            em toda chamada — ele determina quais metodos de pagamento e regras regulatorias se aplicam.
          </p>
          <p style={subheadingStyle}>POST /payments — Pagamento com PIX (Brasil)</p>
          <div style={codeBlockStyle}>
{`// Request
POST /payments
X-Login: your_login
X-Trans-Key: your_trans_key
X-Date: 2024-01-15T10:30:00Z
Authorization: V2-HMAC-SHA256, Signature: xxxxx
Content-Type: application/json

{
  "amount": 150.00,                        // Valor em moeda local (BRL)
  "currency": "BRL",                       // ISO 4217
  "country": "BR",                         // ISO 3166-1 alpha-2 (OBRIGATORIO)
  "payment_method_id": "PIX",              // Metodo local
  "payment_method_flow": "REDIRECT",       // REDIRECT ou DIRECT
  "payer": {
    "name": "Joao Silva",
    "email": "joao@email.com",
    "document": "12345678901",             // CPF (obrigatorio no Brasil)
    "document_type": "CPF"
  },
  "order_id": "order-12345",              // ID unico do merchant
  "notification_url": "https://myapi.com/webhooks/dlocal",  // Webhook URL
  "description": "Assinatura Premium",
  "callback_url": "https://myshop.com/checkout/result"      // Redirect pos-pagamento
}

// Response
{
  "id": "PAY-123456789",
  "status": "PENDING",
  "status_detail": "The payment is pending",
  "amount": 150.00,
  "currency": "BRL",
  "country": "BR",
  "payment_method_id": "PIX",
  "payment_method_flow": "REDIRECT",
  "redirect_url": "https://pay.dlocal.com/pix/qr/...",    // URL do QR code PIX
  "order_id": "order-12345",
  "created_date": "2024-01-15T10:30:05.000Z",
  "payer": {
    "name": "Joao Silva",
    "document": "12345678901"
  }
}`}
          </div>
          <p style={subheadingStyle}>POST /payments — Cartao de Credito (Mexico)</p>
          <div style={codeBlockStyle}>
{`{
  "amount": 500.00,
  "currency": "MXN",
  "country": "MX",
  "payment_method_id": "CARD",
  "payment_method_flow": "DIRECT",
  "card": {
    "holder_name": "Carlos Garcia",
    "number": "4111111111111111",           // Ou usar token/Smart Fields
    "cvv": "123",
    "expiration_month": 12,
    "expiration_year": 2025,
    "installments": "3",                    // Parcelamento (quando suportado)
    "installments_id": "INS-001"
  },
  "payer": {
    "name": "Carlos Garcia",
    "email": "carlos@email.com",
    "document": "GACL900101HDFRRL09",      // CURP (Mexico)
    "document_type": "CURP"
  },
  "order_id": "order-mx-789",
  "notification_url": "https://myapi.com/webhooks/dlocal"
}`}
          </div>
          <p style={subheadingStyle}>POST /refunds — Reembolso</p>
          <div style={codeBlockStyle}>
{`POST /refunds
{
  "payment_id": "PAY-123456789",
  "amount": 50.00,                         // Reembolso parcial
  "currency": "BRL",
  "notification_url": "https://myapi.com/webhooks/dlocal"
}

// Response
{
  "id": "REF-987654321",
  "payment_id": "PAY-123456789",
  "status": "PENDING",
  "amount": 50.00,
  "currency": "BRL",
  "created_date": "2024-01-16T08:00:00.000Z"
}`}
          </div>
        </>
      ),
    },
    {
      id: "webhooks",
      title: "Webhooks",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Webhooks da dLocal sao enviados para a <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>notification_url</code> configurada
            em cada pagamento. Diferente de Stripe e Adyen que usam um endpoint global, a dLocal
            permite URLs diferentes por transacao — util para roteamento por pais ou produto.
          </p>
          <p style={subheadingStyle}>Exemplo: Pagamento Completado</p>
          <div style={codeBlockStyle}>
{`{
  "id": "PAY-123456789",
  "status": "PAID",
  "status_detail": "The payment was paid",
  "amount": 150.00,
  "currency": "BRL",
  "country": "BR",
  "payment_method_id": "PIX",
  "order_id": "order-12345",
  "created_date": "2024-01-15T10:30:05.000Z",
  "approved_date": "2024-01-15T10:31:22.000Z",
  "payer": {
    "name": "Joao Silva",
    "document": "12345678901"
  }
}`}
          </div>
          <p style={subheadingStyle}>Status Possiveis</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Quando</th>
                  <th style={thStyle}>Acao recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>PENDING</td><td style={tdStyle}>Pagamento criado, aguardando acao do consumidor (PIX, boleto, OXXO)</td><td style={tdStyle}>Mostrar instrucoes de pagamento, monitorar</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>PAID</td><td style={tdStyle}>Pagamento confirmado com sucesso</td><td style={tdStyle}>Liberar produto/servico, confirmar pedido</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>REJECTED</td><td style={tdStyle}>Pagamento recusado (cartao, limite, fraude)</td><td style={tdStyle}>Notificar cliente, oferecer alternativa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>CANCELLED</td><td style={tdStyle}>Pagamento cancelado (expirado ou pelo merchant)</td><td style={tdStyle}>Encerrar pedido, liberar estoque</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#3b82f6" }}>AUTHORIZED</td><td style={tdStyle}>Cartao autorizado, aguardando captura</td><td style={tdStyle}>Capturar quando pronto para enviar</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600, color: "#8b5cf6" }}>REFUNDED</td><td style={tdStyle}>Reembolso processado</td><td style={tdStyle}>Atualizar status, notificar cliente</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Validacao de webhooks
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Sempre valide webhooks chamando GET /payments/&#123;id&#125; para confirmar o status antes de
              processar. Webhooks nao tem assinatura criptografica como Stripe/Adyen — a validacao e
              feita por callback verification + IP whitelist.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "precificacao",
      title: "Modelo de Precificacao",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O pricing da dLocal e composto por duas partes principais: taxa de processamento (por transacao)
            e FX spread (margem sobre a taxa de cambio mid-market). As taxas variam significativamente
            por pais e metodo de pagamento.
          </p>
          <p style={subheadingStyle}>Taxas por Pais e Metodo</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pais</th>
                  <th style={thStyle}>Metodo</th>
                  <th style={thStyle}>Taxa Tipica</th>
                  <th style={thStyle}>Settlement</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td><td style={tdStyle}>PIX</td><td style={tdStyle}>2.5% - 4% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td><td style={tdStyle}>Cartao (Visa/MC)</td><td style={tdStyle}>3% - 5% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td><td style={tdStyle}>Boleto</td><td style={tdStyle}>R$3-5 fixo + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Mexico</td><td style={tdStyle}>OXXO</td><td style={tdStyle}>3% - 5% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Mexico</td><td style={tdStyle}>Cartao</td><td style={tdStyle}>3% - 5% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Colombia</td><td style={tdStyle}>PSE / Cartao</td><td style={tdStyle}>3.5% - 5.5% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>India</td><td style={tdStyle}>UPI / Cartao</td><td style={tdStyle}>2% - 4% + FX spread</td><td style={tdStyle}>USD</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Nigeria</td><td style={tdStyle}>Bank Transfer / Cartao</td><td style={tdStyle}>3% - 6% + FX spread</td><td style={tdStyle}>USD</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>FX Spread</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Como funciona o FX spread
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se a taxa mid-market USD/BRL e 5.00, a dLocal pode usar 5.12 (spread de ~2.4%). Em um
              pagamento de R$500, o merchant receberia ~USD 97.65 em vez de USD 100.00. O spread varia
              por pais (moedas volateis como ARS e NGN tem spreads maiores, 3-5%) e por volume do
              merchant.
            </p>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Custo total pode surpreender
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Ao somar processing fee (3-5%) + FX spread (2-4%), o custo total para processar um
              pagamento via dLocal pode chegar a 7-9% do valor. Parece alto, mas a alternativa — abrir
              entidade local, lidar com regulacoes, manter contas bancarias em cada pais — custa muito
              mais em operacional e compliance.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "melhores-casos",
      title: "Melhores Casos de Uso",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            A dLocal e a escolha natural para empresas internacionais que precisam aceitar pagamentos
            em mercados emergentes sem a complexidade de operar localmente.
          </p>
          <p style={subheadingStyle}>Quando escolher dLocal</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Por que dLocal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>SaaS global vendendo para LatAm</td><td style={tdStyle}>Aceita PIX, boleto, OXXO, PSE em uma API. Settlement em USD. Sem entidade local.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Streaming / Gaming</td><td style={tdStyle}>Netflix, Spotify, gaming companies usam dLocal para monetizar usuarios em 40+ mercados emergentes.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>E-commerce cross-border</td><td style={tdStyle}>Merchant internacional vendendo produtos para Brasil/Mexico/Colombia. Metodos locais aumentam conversao em 30-50%.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Marketplaces globais</td><td style={tdStyle}>Payouts para sellers em mercados emergentes. dLocal tambem oferece payouts (enviar dinheiro para recipients locais).</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Rideshare / Delivery (expansao LatAm)</td><td style={tdStyle}>Uber, Didi usam dLocal para processar pagamentos de riders e pagar drivers em moeda local.</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Quando NAO escolher dLocal</p>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Cenarios onde dLocal nao e ideal
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              <strong>Merchant domestico brasileiro:</strong> Se voce e uma empresa brasileira vendendo
              no Brasil, uma adquirente local (Cielo, Rede, Stone) ou um PSP como Stripe/Pagarme oferece
              taxas muito menores (sem FX spread). <strong>Single-country, baixo volume:</strong> O
              custo da dLocal so se justifica se voce opera em multiplos mercados emergentes.
              <strong> Merchants que precisam de POS:</strong> dLocal e 100% online, sem solucao
              presencial.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "dicas-integracao",
      title: "Dicas de Integracao",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Integrar com a dLocal requer atencao especial aos requisitos por pais — cada mercado tem
            campos obrigatorios diferentes, metodos de pagamento distintos e fluxos (redirect vs. direct)
            variados.
          </p>
          <p style={subheadingStyle}>Smart Fields</p>
          <p style={paragraphStyle}>
            Smart Fields sao componentes de UI da dLocal que se adaptam automaticamente ao pais.
            Quando o usuario seleciona Brasil, o campo CPF aparece; no Mexico, aparece CURP; na
            Colombia, CC. Isso simplifica muito a integracao multi-pais.
          </p>
          <p style={subheadingStyle}>Checklist de Integracao</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>1.</strong> Sempre envie o campo <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>country</code> — e obrigatorio e determina tudo (metodos, campos, regras).<br />
              <strong>2.</strong> Valide <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>document</code> e <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>document_type</code> por pais — CPF (BR), CURP (MX), CC (CO), PAN (IN).<br />
              <strong>3.</strong> Use Smart Fields para simplificar o frontend multi-pais.<br />
              <strong>4.</strong> Configure <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>notification_url</code> em toda transacao — webhooks sao a source of truth.<br />
              <strong>5.</strong> Trate fluxos <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>REDIRECT</code> (PIX, OXXO, boleto) e <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>DIRECT</code> (cartao) de forma diferente no frontend.<br />
              <strong>6.</strong> Use o sandbox com credenciais especificas por pais para testar cada mercado.<br />
              <strong>7.</strong> Valide webhooks chamando GET /payments/&#123;id&#125; antes de processar — nao ha assinatura criptografica.
            </p>
          </div>
          <p style={subheadingStyle}>Campos obrigatorios por pais</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pais</th>
                  <th style={thStyle}>Documento</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Formato</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Brasil</td><td style={tdStyle}>CPF</td><td style={tdStyle}>CPF</td><td style={tdStyle}>11 digitos (sem pontos/tracos)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Mexico</td><td style={tdStyle}>CURP</td><td style={tdStyle}>CURP</td><td style={tdStyle}>18 caracteres alfanumericos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Colombia</td><td style={tdStyle}>Cedula</td><td style={tdStyle}>CC</td><td style={tdStyle}>6-10 digitos</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Argentina</td><td style={tdStyle}>DNI / CUIT</td><td style={tdStyle}>DNI / CUIT</td><td style={tdStyle}>7-8 digitos (DNI) ou 11 (CUIT)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>India</td><td style={tdStyle}>PAN</td><td style={tdStyle}>PAN</td><td style={tdStyle}>10 caracteres alfanumericos</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "comparacao",
      title: "Comparacao: dLocal vs Adyen vs Stripe vs EBANX",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Para merchants internacionais vendendo em mercados emergentes, existem poucas opcoes
            especializadas. Abaixo, a comparacao entre as principais.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={{ ...thStyle, color: "var(--primary)" }}>dLocal</th>
                  <th style={thStyle}>Adyen</th>
                  <th style={thStyle}>Stripe</th>
                  <th style={thStyle}>EBANX</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Foco</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Mercados emergentes (40+ paises)</td>
                  <td style={tdStyle}>Global enterprise</td>
                  <td style={tdStyle}>Global developer-first</td>
                  <td style={tdStyle}>LatAm (15 paises)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Cobertura LatAm</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Excelente (18+ paises)</td>
                  <td style={tdStyle}>Boa (principais mercados)</td>
                  <td style={tdStyle}>Crescente (Brasil, Mexico)</td>
                  <td style={tdStyle}>Excelente (foco exclusivo)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Africa / Asia</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Sim (20+ paises)</td>
                  <td style={tdStyle}>Limitada</td>
                  <td style={tdStyle}>Limitada</td>
                  <td style={tdStyle}>Nao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Settlement</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>USD/EUR (cross-border)</td>
                  <td style={tdStyle}>Multi-currency local</td>
                  <td style={tdStyle}>Multi-currency local</td>
                  <td style={tdStyle}>USD/EUR</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Precisa de entidade local?</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Nao</td>
                  <td style={tdStyle}>Nao (mas exige contrato enterprise)</td>
                  <td style={tdStyle}>Sim (em muitos mercados)</td>
                  <td style={tdStyle}>Nao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Metodos locais</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>600+ (mais abrangente)</td>
                  <td style={tdStyle}>250+</td>
                  <td style={tdStyle}>Crescente</td>
                  <td style={tdStyle}>100+ (LatAm)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Ideal para</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Cross-border global para emergentes</td>
                  <td style={tdStyle}>Enterprise multi-canal</td>
                  <td style={tdStyle}>Startups, SaaS</td>
                  <td style={tdStyle}>Cross-border para LatAm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "armadilhas",
      title: "Armadilhas Comuns",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Erros reais de integracao com dLocal, especificos para o contexto cross-border e mercados emergentes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Armadilha</th>
                  <th style={thStyle}>Consequencia</th>
                  <th style={thStyle}>Como Evitar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao enviar country ou enviar errado</td>
                  <td style={tdStyle}>Erro 400 ou transacao processada no pais errado. Metodos de pagamento incorretos sao oferecidos ao consumidor. Settlement na moeda errada.</td>
                  <td style={tdStyle}>Valide country code (ISO 3166-1 alpha-2) no frontend e backend. Nunca assuma — derive do IP ou selecao explicita do usuario.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao tratar fluxos REDIRECT corretamente</td>
                  <td style={tdStyle}>Para PIX, boleto e OXXO, o pagamento e assincrono. Se o frontend nao redireciona o usuario para a pagina de pagamento ou nao mostra o QR code, o pagamento nunca e concluido.</td>
                  <td style={tdStyle}>Verifique payment_method_flow na response. Se REDIRECT, use redirect_url. Implemente polling ou webhooks para detectar PAID.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Currency mismatch com o pais</td>
                  <td style={tdStyle}>Enviar currency=USD com country=BR causa erro. Cada pais tem moedas permitidas. Enviar BRL para country=MX tambem falha.</td>
                  <td style={tdStyle}>Mantenha um mapping pais-moeda. BR=BRL, MX=MXN, CO=COP, AR=ARS, IN=INR. Valide antes de enviar.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao validar documentos por pais</td>
                  <td style={tdStyle}>CPF invalido no Brasil causa rejeicao. CURP com formato errado no Mexico falha. O erro nem sempre e claro na response.</td>
                  <td style={tdStyle}>Implemente validacao de documento no frontend (checksum do CPF, formato do CURP). Use Smart Fields que fazem isso automaticamente.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Ignorar o FX spread no calculo de preco</td>
                  <td style={tdStyle}>Merchant precifica produto em USD e assume conversao mid-market. Apos FX spread da dLocal (2-4%), a margem real e menor que o esperado. Em moedas volateis (ARS, NGN), o impacto e maior.</td>
                  <td style={tdStyle}>Inclua FX spread estimado no calculo de pricing. Monitore rates diariamente. Para moedas volateis, considere ajuste de preco semanal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          dLocal Deep Dive
        </h1>
        <p className="page-description">
          Guia completo da dLocal: cross-border para mercados emergentes, API com exemplos JSON,
          metodos de pagamento locais, FX spread, comparacao com concorrentes e armadilhas reais.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como a dLocal conecta merchants internacionais a metodos de pagamento locais em 40+ paises</li>
          <li>API com exemplos JSON para PIX, cartoes e reembolsos em diferentes paises</li>
          <li>Modelo de precificacao: processing fee + FX spread e impacto na margem</li>
          <li>Armadilhas especificas de cross-border: country codes, moedas, documentos e redirects</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>40+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>600+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Metodos Locais</div>
        </div>
      </div>

      {/* Content Sections */}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`}
          style={sectionStyle}
        >
          <h2 style={headingStyle}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
              background: "var(--primary)", color: "#fff",
            }}>
              {section.icon}
            </span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}

      {/* Quiz */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            Teste seu Conhecimento
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
