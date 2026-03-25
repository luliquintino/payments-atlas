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

export default function APIDesignPage() {
  const quiz = getQuizForPage("/knowledge/api-design");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "rest-patterns",
      title: "REST API Patterns para Pagamentos",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            APIs de pagamento seguem principios REST com adaptacoes especificas para o dominio financeiro.
            O design resource-oriented organiza endpoints em torno de entidades do ciclo de vida de uma
            transacao, nao em torno de acoes — isso simplifica a evolucao da API e alinha com o modelo
            mental de quem integra.
          </p>
          <p style={subheadingStyle}>Recursos Base</p>
          <div style={codeBlockStyle}>
{`POST   /v1/payments              # Criar pagamento (authorization)
GET    /v1/payments/:id          # Consultar pagamento
POST   /v1/payments/:id/capture  # Capturar pagamento autorizado
POST   /v1/payments/:id/cancel   # Cancelar/void
POST   /v1/refunds               # Criar reembolso
GET    /v1/refunds/:id           # Consultar reembolso
GET    /v1/webhooks              # Listar webhook endpoints
POST   /v1/webhooks              # Registrar webhook endpoint
GET    /v1/balance                # Saldo da conta`}
          </div>
          <p style={subheadingStyle}>Versionamento</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Pros</th>
                  <th style={thStyle}>Contras</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>URL Path</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>/v1/payments</td><td style={tdStyle}>Simples, visivel, cacheavel</td><td style={tdStyle}>URLs mudam entre versoes</td></tr>
                <tr><td style={tdStyle}>Header</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>Stripe-Version: 2024-06-20</td><td style={tdStyle}>URLs estaveis, granular</td><td style={tdStyle}>Menos visivel, mais complexo</td></tr>
                <tr><td style={tdStyle}>Query Param</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>?version=2</td><td style={tdStyle}>Facil de testar</td><td style={tdStyle}>Poluicao de URL, problemas de cache</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Convencoes de Naming</p>
          <p style={paragraphStyle}>
            Recursos no plural (<code>payments</code>, <code>refunds</code>), kebab-case para
            compostos (<code>payment-methods</code>), sub-recursos para relacoes hierarquicas
            (<code>/payments/:id/captures</code>). Evite verbos nos endpoints — use HTTP methods
            para indicar a acao (POST=criar, GET=ler, PUT=atualizar, DELETE=remover).
          </p>
          <p style={subheadingStyle}>HATEOAS para State Machine de Pagamento</p>
          <div style={codeBlockStyle}>
{`{
  "id": "pay_abc123",
  "status": "authorized",
  "amount": 15000,
  "currency": "BRL",
  "_links": {
    "self":    { "href": "/v1/payments/pay_abc123" },
    "capture": { "href": "/v1/payments/pay_abc123/capture", "method": "POST" },
    "cancel":  { "href": "/v1/payments/pay_abc123/cancel", "method": "POST" }
  }
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Na pratica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              A maioria dos PSPs (Stripe, Adyen, Braintree) usa URL path versioning com date-based
              headers para breaking changes menores. HATEOAS e raro em APIs de pagamento reais, mas
              retornar as acoes disponiveis no response (allowed_actions) e um pattern util que
              evita que o integrador tente capturar um pagamento ja capturado.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "autenticacao",
      title: "Autenticacao e Autorizacao",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            APIs de pagamento lidam com operacoes financeiras irreversiveis — a autenticacao precisa ser
            robusta sem sacrificar a experiencia do developer. O modelo mais comum e um par de chaves
            publica/secreta, complementado por OAuth 2.0 para cenarios de plataforma.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metodo</th>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Seguranca</th>
                  <th style={thStyle}>Complexidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>API Keys (public/secret)</td>
                  <td style={tdStyle}>Integracoes server-to-server diretas</td>
                  <td style={tdStyle}>Alta — secret key nunca exposta ao browser</td>
                  <td style={tdStyle}>Baixa</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>OAuth 2.0</td>
                  <td style={tdStyle}>Plataformas, marketplaces, connect accounts</td>
                  <td style={tdStyle}>Alta — scoped tokens, refresh, revocation</td>
                  <td style={tdStyle}>Media-Alta</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>HMAC-SHA256</td>
                  <td style={tdStyle}>Verificacao de webhooks</td>
                  <td style={tdStyle}>Alta — garante autenticidade e integridade</td>
                  <td style={tdStyle}>Baixa</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>mTLS</td>
                  <td style={tdStyle}>Conexoes acquirer-to-acquirer, PCI Level 1</td>
                  <td style={tdStyle}>Muito alta — certificado mutual</td>
                  <td style={tdStyle}>Alta</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>API Key Authentication (Bearer Token)</p>
          <div style={codeBlockStyle}>
{`# Secret key no header Authorization (server-side only)
curl https://api.psp.com/v1/payments \\
  -H "Authorization: Bearer YOUR_SECRET_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 15000, "currency": "BRL"}'

# Public key para tokenizacao client-side (browser/mobile)
const stripe = Stripe("YOUR_PUBLIC_KEY_HERE");`}
          </div>
          <p style={subheadingStyle}>Webhook Signature Verification (HMAC-SHA256)</p>
          <div style={codeBlockStyle}>
{`import hmac, hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode("utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

# Usage:
# signature = request.headers["X-Webhook-Signature"]
# verify_webhook(request.body, signature, webhook_secret)`}
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Erro critico comum
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Nunca exponha a secret key no frontend (JavaScript client-side). Use a public key para
              tokenizacao e a secret key apenas no backend. Se a secret key vazar, um atacante pode
              criar charges, emitir refunds e acessar dados de clientes. Implemente rotacao de chaves
              com suporte a multiplas chaves ativas simultaneamente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "idempotencia",
      title: "Idempotencia",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Em pagamentos, idempotencia e a propriedade mais critica da API. Sem ela, um timeout de rede
            seguido de retry pode resultar em cobranca duplicada — o pior cenario possivel para o usuario
            e para o merchant. A implementacao correta garante que repetir a mesma requisicao N vezes
            produz exatamente o mesmo efeito que executar uma vez.
          </p>
          <p style={subheadingStyle}>Idempotency-Key Header</p>
          <div style={codeBlockStyle}>
{`POST /v1/payments HTTP/1.1
Host: api.psp.com
Authorization: Bearer sk_live_xxx
Idempotency-Key: order_12345_attempt_1
Content-Type: application/json

{
  "amount": 15000,
  "currency": "BRL",
  "payment_method": "pm_card_visa",
  "description": "Pedido #12345"
}`}
          </div>
          <p style={subheadingStyle}>Response (primeira chamada)</p>
          <div style={codeBlockStyle}>
{`HTTP/1.1 201 Created
Idempotency-Key: order_12345_attempt_1
Idempotent-Replayed: false

{
  "id": "pay_abc123",
  "status": "authorized",
  "amount": 15000,
  "currency": "BRL",
  "idempotency_key": "order_12345_attempt_1"
}`}
          </div>
          <p style={subheadingStyle}>Response (retry — mesma resposta cached)</p>
          <div style={codeBlockStyle}>
{`HTTP/1.1 200 OK
Idempotency-Key: order_12345_attempt_1
Idempotent-Replayed: true

{
  "id": "pay_abc123",
  "status": "authorized",
  "amount": 15000,
  "currency": "BRL",
  "idempotency_key": "order_12345_attempt_1"
}`}
          </div>
          <p style={subheadingStyle}>Fluxo de Processamento</p>
          <div style={codeBlockStyle}>
{`Client envia POST /v1/payments com Idempotency-Key
    |
    v
Server recebe request
    |
    +---> Key ja existe no cache?
    |         |
    |         SIM --> Request body identico?
    |         |         |
    |         |         SIM --> Retorna response cached (Idempotent-Replayed: true)
    |         |         |
    |         |         NAO --> HTTP 422 "Idempotency key already used with different params"
    |         |
    |         NAO --> Processa normalmente
    |                   |
    |                   +---> Lock key (mutex) para evitar race condition
    |                   |
    |                   +---> Executa operacao
    |                   |
    |                   +---> Armazena {key, request_hash, response, status} com TTL 24-48h
    |                   |
    |                   +---> Retorna response (Idempotent-Replayed: false)`}
          </div>
          <p style={subheadingStyle}>Implementacao Server-Side</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Recomendacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Storage</td><td style={tdStyle}>Redis com TTL de 24-48h, ou tabela dedicada no DB</td></tr>
                <tr><td style={tdStyle}>Key format</td><td style={tdStyle}>UUID v4 ou formato semantico (order_id + attempt)</td></tr>
                <tr><td style={tdStyle}>Race conditions</td><td style={tdStyle}>Distributed lock (Redis SETNX) antes de processar</td></tr>
                <tr><td style={tdStyle}>Request matching</td><td style={tdStyle}>Hash SHA-256 do body para detectar body diferente com mesma key</td></tr>
                <tr><td style={tdStyle}>Erro parcial</td><td style={tdStyle}>Se operacao falhou, NAO cachear — permitir retry</td></tr>
                <tr><td style={tdStyle}>Scope</td><td style={tdStyle}>Key e scoped por API key (merchant), nao global</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Regra de ouro
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Toda operacao mutavel (POST, PUT, DELETE) em uma API de pagamento DEVE suportar
              idempotencia. GET e naturalmente idempotente. A key deve ser gerada pelo client,
              nunca pelo server — isso garante que retries usem a mesma key.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "error-handling",
      title: "Error Handling",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Erros em APIs de pagamento precisam ser extremamente claros porque o integrador precisa
            tomar decisoes automatizadas: deve fazer retry? Deve mostrar mensagem ao usuario? O
            pagamento foi recusado pelo banco ou por validacao? Um error handling bem desenhado
            reduz tickets de suporte e acelera integracoes.
          </p>
          <p style={subheadingStyle}>HTTP Status Codes para Pagamentos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Significado</th>
                  <th style={thStyle}>Quando Usar</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>200 OK</td><td style={tdStyle}>Sucesso</td><td style={tdStyle}>GET, update bem-sucedido, idempotent replay</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>201 Created</td><td style={tdStyle}>Recurso criado</td><td style={tdStyle}>Pagamento criado, refund criado</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>400 Bad Request</td><td style={tdStyle}>Request invalido</td><td style={tdStyle}>JSON malformado, campo obrigatorio ausente</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>401 Unauthorized</td><td style={tdStyle}>Autenticacao falhou</td><td style={tdStyle}>API key invalida, token expirado</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>402 Payment Required</td><td style={tdStyle}>Pagamento recusado</td><td style={tdStyle}>Cartao recusado pelo emissor (insufficient funds, do not honor)</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>403 Forbidden</td><td style={tdStyle}>Sem permissao</td><td style={tdStyle}>API key sem scope para esta operacao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>404 Not Found</td><td style={tdStyle}>Recurso inexistente</td><td style={tdStyle}>Payment ID nao encontrado</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>409 Conflict</td><td style={tdStyle}>Conflito de estado</td><td style={tdStyle}>Tentar capturar pagamento ja capturado</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>422 Unprocessable</td><td style={tdStyle}>Semanticamente invalido</td><td style={tdStyle}>Idempotency key reusada com body diferente, amount negativo</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>429 Too Many Requests</td><td style={tdStyle}>Rate limit</td><td style={tdStyle}>Excedeu limite de requisicoes</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>500 Internal Error</td><td style={tdStyle}>Erro do server</td><td style={tdStyle}>Bug interno — client deve fazer retry com backoff</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>502/503</td><td style={tdStyle}>Servico indisponivel</td><td style={tdStyle}>PSP upstream fora, manutencao — retry seguro</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Error Response Schema</p>
          <div style={codeBlockStyle}>
{`{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined. Please try a different payment method.",
    "decline_code": "insufficient_funds",
    "param": null,
    "charge": "ch_abc123",
    "doc_url": "https://docs.psp.com/errors/card_declined"
  },
  "request_id": "req_xyz789",
  "idempotency_key": "order_12345"
}`}
          </div>
          <p style={subheadingStyle}>Tipos de Erro e Acao Recomendada</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>type</th>
                  <th style={thStyle}>code</th>
                  <th style={thStyle}>Retryable?</th>
                  <th style={thStyle}>Acao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>api_error</td><td style={tdStyle}>internal_error</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Sim</td><td style={tdStyle}>Retry com exponential backoff</td></tr>
                <tr><td style={tdStyle}>card_error</td><td style={tdStyle}>card_declined</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Depende</td><td style={tdStyle}>Verificar decline_code — insufficient_funds e retryable, stolen_card nao</td></tr>
                <tr><td style={tdStyle}>card_error</td><td style={tdStyle}>expired_card</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Nao</td><td style={tdStyle}>Pedir novo cartao ao usuario</td></tr>
                <tr><td style={tdStyle}>invalid_request_error</td><td style={tdStyle}>missing_param</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Nao</td><td style={tdStyle}>Corrigir request no codigo</td></tr>
                <tr><td style={tdStyle}>invalid_request_error</td><td style={tdStyle}>idempotency_mismatch</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Nao</td><td style={tdStyle}>Gerar nova idempotency key</td></tr>
                <tr><td style={tdStyle}>rate_limit_error</td><td style={tdStyle}>rate_limited</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Sim</td><td style={tdStyle}>Aguardar Retry-After e retransmitir</td></tr>
                <tr><td style={tdStyle}>authentication_error</td><td style={tdStyle}>invalid_api_key</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Nao</td><td style={tdStyle}>Verificar credenciais, nao fazer retry</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "payloads",
      title: "Anatomia de Payloads",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Entender a anatomia dos payloads de pagamento e essencial para uma integracao correta.
            Cada campo tem semantica precisa — um erro no campo amount (usar reais ao inves de centavos)
            pode resultar em cobrar 100x mais do que o esperado.
          </p>
          <p style={subheadingStyle}>Authorization Request</p>
          <div style={codeBlockStyle}>
{`POST /v1/payments
{
  "amount": 15000,              // Valor em minor units (centavos) — R$150,00
  "currency": "BRL",            // ISO 4217
  "payment_method": "pm_card_visa",
  "capture": false,             // false = auth-only, true = auth+capture
  "description": "Pedido #12345",
  "statement_descriptor": "LOJA*PEDIDO12345",  // Aparece na fatura (max 22 chars)
  "metadata": {                 // Key-value livre para o merchant
    "order_id": "12345",
    "customer_email": "joao@email.com"
  },
  "customer": "cus_xyz789",
  "shipping": {
    "address": {
      "line1": "Av Paulista 1000",
      "city": "Sao Paulo",
      "state": "SP",
      "postal_code": "01310-100",
      "country": "BR"
    }
  }
}`}
          </div>
          <p style={subheadingStyle}>Authorization Response</p>
          <div style={codeBlockStyle}>
{`{
  "id": "pay_abc123",
  "object": "payment",
  "status": "authorized",
  "amount": 15000,
  "amount_captured": 0,
  "amount_refunded": 0,
  "currency": "BRL",
  "payment_method": {
    "id": "pm_card_visa",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2027,
      "funding": "credit",
      "country": "BR"
    }
  },
  "authorization_code": "A12345",
  "acquirer_reference": "7890123456",
  "created_at": "2025-01-15T10:30:00Z",
  "captured_at": null,
  "metadata": { "order_id": "12345" },
  "allowed_actions": ["capture", "cancel"]
}`}
          </div>
          <p style={subheadingStyle}>Capture Request</p>
          <div style={codeBlockStyle}>
{`POST /v1/payments/pay_abc123/capture
{
  "amount": 12000    // Captura parcial — R$120 de R$150 autorizados
}`}
          </div>
          <p style={subheadingStyle}>Refund Request</p>
          <div style={codeBlockStyle}>
{`POST /v1/refunds
{
  "payment": "pay_abc123",
  "amount": 5000,         // Refund parcial — R$50
  "reason": "customer_request",
  "metadata": {
    "ticket_id": "SUP-6789"
  }
}`}
          </div>
          <p style={subheadingStyle}>Representacao de Valores</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Abordagem</th>
                  <th style={thStyle}>Exemplo R$150,00</th>
                  <th style={thStyle}>Pros</th>
                  <th style={thStyle}>Contras</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Minor units (inteiro)</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace" }}>15000</td>
                  <td style={tdStyle}>Sem floating point, universalmente usado (Stripe, Adyen)</td>
                  <td style={tdStyle}>Precisa saber expoente da moeda (JPY=0, BRL=2, BHD=3)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Decimal (string)</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace" }}>&quot;150.00&quot;</td>
                  <td style={tdStyle}>Legivel, sem ambiguidade</td>
                  <td style={tdStyle}>Parsing de string, risco de floating point se convertido</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Bug classico
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Enviar <code>amount: 150</code> quando a API espera minor units resulta em cobrar R$1,50
              ao inves de R$150,00. Sempre confirme se o PSP usa minor units ou decimal. Stripe, Adyen
              e a maioria usa minor units. PayPal e Braintree usam decimal string.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "response-codes",
      title: "Response Codes de Pagamento",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Os response codes de pagamento originam-se do ISO 8583 (protocolo de mensageria entre
            acquirers e issuers) e sao mapeados pelos PSPs para codigos mais amigaveis. Entender
            esse mapeamento e essencial para implementar retry logic, exibir mensagens ao usuario
            e diagnosticar problemas de autorizacao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ISO 8583</th>
                  <th style={thStyle}>HTTP</th>
                  <th style={thStyle}>Significado</th>
                  <th style={thStyle}>Retry?</th>
                  <th style={thStyle}>Acao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>00</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>200</td><td style={tdStyle}>Aprovada</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Sucesso — processar pedido</td></tr>
                <tr><td style={tdStyle}>01</td><td style={tdStyle}>402</td><td style={tdStyle}>Refira ao emissor</td><td style={{ ...tdStyle, color: "#f59e0b" }}>Talvez</td><td style={tdStyle}>Pedir que cliente entre em contato com banco</td></tr>
                <tr><td style={tdStyle}>04</td><td style={tdStyle}>402</td><td style={tdStyle}>Capturar cartao</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Cartao comprometido — bloquear</td></tr>
                <tr><td style={tdStyle}>05</td><td style={tdStyle}>402</td><td style={tdStyle}>Nao autorizada (Do Not Honor)</td><td style={{ ...tdStyle, color: "#f59e0b" }}>Talvez</td><td style={tdStyle}>Motivo generico — retry em 24h pode funcionar</td></tr>
                <tr><td style={tdStyle}>12</td><td style={tdStyle}>400</td><td style={tdStyle}>Transacao invalida</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Verificar parametros da transacao</td></tr>
                <tr><td style={tdStyle}>13</td><td style={tdStyle}>400</td><td style={tdStyle}>Valor invalido</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Verificar amount</td></tr>
                <tr><td style={tdStyle}>14</td><td style={tdStyle}>402</td><td style={tdStyle}>Numero de cartao invalido</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Pedir que usuario verifique numero</td></tr>
                <tr><td style={tdStyle}>41</td><td style={tdStyle}>402</td><td style={tdStyle}>Cartao perdido</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Bloquear — possivel fraude</td></tr>
                <tr><td style={tdStyle}>43</td><td style={tdStyle}>402</td><td style={tdStyle}>Cartao roubado</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Bloquear — fraude confirmada</td></tr>
                <tr><td style={tdStyle}>51</td><td style={tdStyle}>402</td><td style={tdStyle}>Saldo insuficiente</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Informar usuario, retry apos deposito</td></tr>
                <tr><td style={tdStyle}>54</td><td style={tdStyle}>402</td><td style={tdStyle}>Cartao expirado</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Pedir novo cartao</td></tr>
                <tr><td style={tdStyle}>55</td><td style={tdStyle}>402</td><td style={tdStyle}>Senha incorreta</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Pedir que usuario tente novamente</td></tr>
                <tr><td style={tdStyle}>57</td><td style={tdStyle}>402</td><td style={tdStyle}>Transacao nao permitida</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Tipo de transacao bloqueada pelo emissor</td></tr>
                <tr><td style={tdStyle}>58</td><td style={tdStyle}>402</td><td style={tdStyle}>Transacao nao permitida ao terminal</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>MCC ou canal bloqueado</td></tr>
                <tr><td style={tdStyle}>59</td><td style={tdStyle}>402</td><td style={tdStyle}>Suspeita de fraude</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Risco detectado — nao retransmitir</td></tr>
                <tr><td style={tdStyle}>61</td><td style={tdStyle}>402</td><td style={tdStyle}>Excede limite de saque</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Tentar valor menor ou aguardar reset</td></tr>
                <tr><td style={tdStyle}>62</td><td style={tdStyle}>402</td><td style={tdStyle}>Cartao restrito</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Cartao com restricao — contatar emissor</td></tr>
                <tr><td style={tdStyle}>65</td><td style={tdStyle}>402</td><td style={tdStyle}>Excede limite de frequencia</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Muitas tentativas — aguardar e retransmitir</td></tr>
                <tr><td style={tdStyle}>75</td><td style={tdStyle}>402</td><td style={tdStyle}>PIN attempts exceeded</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Cartao bloqueado por PIN errado — contatar emissor</td></tr>
                <tr><td style={tdStyle}>76</td><td style={tdStyle}>402</td><td style={tdStyle}>Conta destino invalida</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Verificar dados da conta</td></tr>
                <tr><td style={tdStyle}>78</td><td style={tdStyle}>402</td><td style={tdStyle}>Conta bloqueada</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Contatar emissor</td></tr>
                <tr><td style={tdStyle}>82</td><td style={tdStyle}>402</td><td style={tdStyle}>Politica do cartao</td><td style={{ ...tdStyle, color: "#ef4444" }}>Nao</td><td style={tdStyle}>Restricao por politica do programa</td></tr>
                <tr><td style={tdStyle}>85</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>200</td><td style={tdStyle}>Account verification (zero-auth)</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Cartao valido — nao e cobranca</td></tr>
                <tr><td style={tdStyle}>91</td><td style={tdStyle}>502</td><td style={tdStyle}>Emissor indisponivel</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Retry com backoff — problema temporario</td></tr>
                <tr><td style={tdStyle}>92</td><td style={tdStyle}>502</td><td style={tdStyle}>Rota nao encontrada</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Problema de roteamento — retry automatico</td></tr>
                <tr><td style={tdStyle}>96</td><td style={tdStyle}>500</td><td style={tdStyle}>Erro de sistema</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Erro generico — retry com backoff</td></tr>
                <tr><td style={tdStyle}>N7</td><td style={tdStyle}>402</td><td style={tdStyle}>CVV2 incorreto</td><td style={{ ...tdStyle, color: "#10b981" }}>Sim</td><td style={tdStyle}>Pedir que usuario verifique CVV</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Dica de implementacao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Classifique os response codes em 3 buckets: (1) <strong>Hard decline</strong> — nao retransmitir
              (04, 14, 41, 43, 54), (2) <strong>Soft decline</strong> — retransmitir com delay (05, 51, 65, 91),
              (3) <strong>System error</strong> — retransmitir imediatamente com backoff (96, 91, 92). Cada PSP
              mapeia esses codigos de forma ligeiramente diferente, entao consulte a documentacao especifica.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "webhooks",
      title: "Webhook Design",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Webhooks sao o mecanismo primario de notificacao assincrona em APIs de pagamento. Enquanto
            polling desperdia recursos, webhooks entregam eventos em near-real-time. O design correto
            precisa lidar com falhas de entrega, ordering, duplicacao e verificacao de autenticidade.
          </p>
          <p style={subheadingStyle}>Event Schema</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_1234567890",
  "type": "payment.captured",
  "api_version": "2024-06-20",
  "created_at": "2025-01-15T10:35:00Z",
  "data": {
    "object": {
      "id": "pay_abc123",
      "status": "captured",
      "amount": 15000,
      "currency": "BRL",
      "captured_at": "2025-01-15T10:35:00Z"
    },
    "previous_attributes": {
      "status": "authorized",
      "captured_at": null
    }
  },
  "livemode": true,
  "pending_webhooks": 2
}`}
          </div>
          <p style={subheadingStyle}>Politica de Retry (Exponential Backoff)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tentativa</th>
                  <th style={thStyle}>Delay</th>
                  <th style={thStyle}>Tempo Acumulado</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1a</td><td style={tdStyle}>Imediato</td><td style={tdStyle}>0s</td></tr>
                <tr><td style={tdStyle}>2a</td><td style={tdStyle}>1 segundo</td><td style={tdStyle}>1s</td></tr>
                <tr><td style={tdStyle}>3a</td><td style={tdStyle}>5 segundos</td><td style={tdStyle}>6s</td></tr>
                <tr><td style={tdStyle}>4a</td><td style={tdStyle}>30 segundos</td><td style={tdStyle}>36s</td></tr>
                <tr><td style={tdStyle}>5a</td><td style={tdStyle}>5 minutos</td><td style={tdStyle}>~5min</td></tr>
                <tr><td style={tdStyle}>6a</td><td style={tdStyle}>30 minutos</td><td style={tdStyle}>~35min</td></tr>
                <tr><td style={tdStyle}>7a</td><td style={tdStyle}>1 hora</td><td style={tdStyle}>~1.5h</td></tr>
                <tr><td style={tdStyle}>8a (final)</td><td style={tdStyle}>24 horas</td><td style={tdStyle}>~25.5h</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Signature Verification (Node.js)</p>
          <div style={codeBlockStyle}>
{`const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload, "utf-8");
  const expected = "sha256=" + hmac.digest("hex");

  // Timing-safe comparison to prevent timing attacks
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}

// Express middleware:
app.post("/webhooks", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["x-webhook-signature"];
  if (!verifyWebhook(req.body, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(req.body);
  // Process event...
  res.status(200).json({ received: true });
});`}
          </div>
          <p style={subheadingStyle}>Patterns Importantes</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pattern</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>At-least-once delivery</td><td style={tdStyle}>Eventos podem ser entregues mais de uma vez — o handler DEVE ser idempotente</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Event ordering</td><td style={tdStyle}>NAO garanta ordem — payment.captured pode chegar antes de payment.authorized</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Idempotent processing</td><td style={tdStyle}>Use event.id como chave de deduplicacao. Armazene IDs processados em SET/DB</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Respond fast</td><td style={tdStyle}>Retorne 200 em &lt;5s. Processe em background (queue). Timeout = retry</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Dead Letter Queue (DLQ)</td><td style={tdStyle}>Apos todas as tentativas falharem, mova para DLQ para reprocessamento manual</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Reconciliacao</td><td style={tdStyle}>Mesmo com webhooks, faca polling periodico para capturar eventos perdidos</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Armadilha comum
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Nao processe a logica de negocio dentro do handler do webhook. Aceite o evento (200),
              coloque em uma fila (SQS, RabbitMQ, Redis Streams) e processe async. Se o handler
              demora &gt;30s, o PSP vai considerar timeout e retransmitir, criando duplicatas.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "paginacao",
      title: "Paginacao e Filtragem",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            APIs de pagamento geram volumes massivos de dados — milhoes de transacoes por dia em
            operacoes de escala. A paginacao precisa ser eficiente, consistente e resiliente a
            insercoes concorrentes. Cursor-based pagination e o padrao de mercado.
          </p>
          <p style={subheadingStyle}>Cursor-based vs Offset</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Offset (LIMIT/OFFSET)</th>
                  <th style={thStyle}>Cursor (keyset)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Performance</td><td style={tdStyle}>Degrada com offset alto (scan)</td><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>Constante O(1) — sempre usa index</td></tr>
                <tr><td style={tdStyle}>Consistencia</td><td style={tdStyle}>Items podem ser pulados ou duplicados se dados mudam</td><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>Estavel — cursor aponta para posicao fixa</td></tr>
                <tr><td style={tdStyle}>Simplicidade</td><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>Simples (?page=3&amp;limit=20)</td><td style={tdStyle}>Requer cursor opaco</td></tr>
                <tr><td style={tdStyle}>Random access</td><td style={{ ...tdStyle, fontWeight: 600, color: "#10b981" }}>Sim — ir para pagina N</td><td style={tdStyle}>Nao — apenas proximo/anterior</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Request com Cursor</p>
          <div style={codeBlockStyle}>
{`GET /v1/payments?limit=20&starting_after=pay_xyz789&status=captured&created[gte]=2025-01-01T00:00:00Z&created[lte]=2025-01-31T23:59:59Z`}
          </div>
          <p style={subheadingStyle}>Response Paginada</p>
          <div style={codeBlockStyle}>
{`{
  "object": "list",
  "data": [
    { "id": "pay_abc001", "status": "captured", "amount": 15000, ... },
    { "id": "pay_abc002", "status": "captured", "amount": 8500, ... },
    ...
  ],
  "has_more": true,
  "url": "/v1/payments",
  "total_count": null  // Nao retornar count total — muito caro em datasets grandes
}`}
          </div>
          <p style={subheadingStyle}>Filtros Comuns</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Filtro</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Notas</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Date range</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>created[gte]=...&amp;created[lte]=...</td><td style={tdStyle}>Sempre UTC, ISO 8601</td></tr>
                <tr><td style={tdStyle}>Status</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>status=captured</td><td style={tdStyle}>Enum: authorized, captured, refunded, failed</td></tr>
                <tr><td style={tdStyle}>Amount range</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>amount[gte]=1000&amp;amount[lte]=50000</td><td style={tdStyle}>Em minor units</td></tr>
                <tr><td style={tdStyle}>Payment method</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>payment_method_type=card</td><td style={tdStyle}>card, pix, boleto, etc.</td></tr>
                <tr><td style={tdStyle}>Customer</td><td style={{ ...tdStyle, fontFamily: "monospace" }}>customer=cus_xyz789</td><td style={tdStyle}>Filtro por customer ID</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que nao retornar total_count?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              COUNT(*) em tabelas com milhoes de registros e extremamente caro (full table scan em
              muitos bancos). Stripe, Adyen e a maioria dos PSPs retornam apenas <code>has_more: true/false</code>.
              Se o merchant precisa do total, oferecer um endpoint de analytics separado com caching.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "rate-limiting",
      title: "Rate Limiting",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Rate limiting protege a API de abuso, garante fairness entre merchants e previne
            cascading failures. Em pagamentos, e crucial que o rate limiter nao bloqueie transacoes
            legitimas em pico de vendas (Black Friday), mas contenha integradores com bugs fazendo
            loops infinitos.
          </p>
          <p style={subheadingStyle}>Headers de Rate Limit</p>
          <div style={codeBlockStyle}>
{`HTTP/1.1 200 OK
X-RateLimit-Limit: 100          # Max requests permitidos na janela
X-RateLimit-Remaining: 73       # Requests restantes
X-RateLimit-Reset: 1705312800   # Unix timestamp do reset da janela
Retry-After: 30                 # Segundos ate poder tentar novamente (so no 429)`}
          </div>
          <p style={subheadingStyle}>Response 429</p>
          <div style={codeBlockStyle}>
{`HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{
  "error": {
    "type": "rate_limit_error",
    "code": "rate_limited",
    "message": "Too many requests. Please retry after 30 seconds.",
    "doc_url": "https://docs.psp.com/rate-limits"
  }
}`}
          </div>
          <p style={subheadingStyle}>Estrategias de Rate Limiting</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Uso</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Per-key</td><td style={tdStyle}>Cada API key tem seu proprio limite</td><td style={tdStyle}>Isolar merchants — 1 merchant com bug nao afeta outros</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Per-endpoint</td><td style={tdStyle}>Limites diferentes por endpoint</td><td style={tdStyle}>POST /payments mais restrito que GET /payments</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Sliding window</td><td style={tdStyle}>Janela movel (nao fixa) para suavizar picos</td><td style={tdStyle}>Evita burst no inicio da janela fixa</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Token bucket</td><td style={tdStyle}>Tokens recarregam continuamente, gasta 1 por request</td><td style={tdStyle}>Permite bursts curtos mantendo media</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Adaptive</td><td style={tdStyle}>Limites ajustam baseado em load do sistema</td><td style={tdStyle}>Protecao contra cascading failures</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Client-Side Handling</p>
          <div style={codeBlockStyle}>
{`async function apiCall(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
      console.warn(\`Rate limited. Retrying in \${retryAfter}s (attempt \${attempt + 1})\`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    return response;
  }
  throw new Error("Max retries exceeded due to rate limiting");
}`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Limites tipicos de mercado
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Stripe: 100 req/s em live mode, 25 req/s em test mode. Adyen: variam por contrato
              (tipicamente 50-200 req/s). Para merchants de alto volume, limites sao negociados
              individualmente. Em Black Friday, comunique antecipadamente ao PSP para provisioning.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "testing-sandbox",
      title: "Testing e Sandbox",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            Um ambiente de sandbox robusto e critico para a adocao de uma API de pagamento. Developers
            precisam testar todos os cenarios (aprovacao, recusa, 3DS, fraude, timeout) sem processar
            transacoes reais. O sandbox deve ser uma replica fiel da API de producao, com mecanismos
            para simular qualquer cenario.
          </p>
          <p style={subheadingStyle}>Arquitetura Test Mode</p>
          <div style={codeBlockStyle}>
{`# API keys determinam o ambiente:
sk_test_xxx  →  Sandbox (nenhuma transacao real processada)
sk_live_xxx  →  Producao (transacoes reais)

# Mesma URL, mesmos endpoints, mesmos payloads
# A unica diferenca e a API key usada
POST https://api.psp.com/v1/payments
Authorization: Bearer sk_test_xxx    # ← sandbox`}
          </div>
          <p style={subheadingStyle}>Cartoes de Teste</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Numero</th>
                  <th style={thStyle}>Bandeira</th>
                  <th style={thStyle}>Resultado</th>
                  <th style={thStyle}>Cenario</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4242 4242 4242 4242</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Aprovado</td><td style={tdStyle}>Pagamento bem-sucedido</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 0002</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Recusado</td><td style={tdStyle}>generic_decline</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 9995</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Recusado</td><td style={tdStyle}>insufficient_funds</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 9987</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Recusado</td><td style={tdStyle}>lost_card</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 0069</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Recusado</td><td style={tdStyle}>expired_card</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0027 6000 3184</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>3DS Required</td><td style={tdStyle}>Autenticacao 3D Secure obrigatoria</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 3220</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>3DS Required</td><td style={tdStyle}>3DS2 — challenge flow</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>4000 0000 0000 0119</td><td style={tdStyle}>Visa</td><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>Erro</td><td style={tdStyle}>processing_error (500)</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>5555 5555 5555 4444</td><td style={tdStyle}>Mastercard</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Aprovado</td><td style={tdStyle}>Pagamento bem-sucedido</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>3782 822463 10005</td><td style={tdStyle}>Amex</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Aprovado</td><td style={tdStyle}>Pagamento bem-sucedido</td></tr>
                <tr><td style={{ ...tdStyle, fontFamily: "monospace" }}>6362 9700 0000 0013</td><td style={tdStyle}>Elo</td><td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Aprovado</td><td style={tdStyle}>Pagamento bem-sucedido (Brasil)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Simulando Cenarios Especificos</p>
          <div style={codeBlockStyle}>
{`# Simular timeout do acquirer (via amount magico)
{ "amount": 9999999, "currency": "BRL", ... }  // → timeout

# Simular webhook failure (via metadata)
{ "metadata": { "_test_webhook_fail": "3" } }   // → webhook falha 3x antes de sucesso

# Simular delay na captura
{ "metadata": { "_test_capture_delay": "5000" } } // → 5s delay`}
          </div>
          <p style={subheadingStyle}>Webhook Testing</p>
          <div style={codeBlockStyle}>
{`# Stripe CLI — forward webhooks para localhost
stripe listen --forward-to localhost:3000/webhooks

# ngrok — expor localhost para a internet
ngrok http 3000
# Depois: configurar https://abc123.ngrok.io/webhooks no dashboard

# Trigger manual de eventos (Stripe CLI)
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed`}
          </div>
          <p style={subheadingStyle}>Checklist de Homologacao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fluxo feliz</td><td style={tdStyle}>Authorization + capture + settlement funciona end-to-end</td><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Critica</td></tr>
                <tr><td style={tdStyle}>Recusa de cartao</td><td style={tdStyle}>Todas as decline reasons exibem mensagem correta</td><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Critica</td></tr>
                <tr><td style={tdStyle}>Idempotencia</td><td style={tdStyle}>Retry nao cria cobranca duplicada</td><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Critica</td></tr>
                <tr><td style={tdStyle}>Webhooks</td><td style={tdStyle}>Todos os eventos processados corretamente</td><td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Critica</td></tr>
                <tr><td style={tdStyle}>3D Secure</td><td style={tdStyle}>Challenge flow e frictionless funcionam</td><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Alta</td></tr>
                <tr><td style={tdStyle}>Refund parcial</td><td style={tdStyle}>Refund parcial e total processados corretamente</td><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Alta</td></tr>
                <tr><td style={tdStyle}>Captura parcial</td><td style={tdStyle}>Captura menor que o autorizado funciona</td><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Alta</td></tr>
                <tr><td style={tdStyle}>Rate limiting</td><td style={tdStyle}>Client lida corretamente com 429</td><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Alta</td></tr>
                <tr><td style={tdStyle}>Timeout handling</td><td style={tdStyle}>Client faz retry seguro com idempotency key</td><td style={{ ...tdStyle, fontWeight: 600, color: "#f59e0b" }}>Alta</td></tr>
                <tr><td style={tdStyle}>Conciliacao</td><td style={tdStyle}>Reports batem com transacoes processadas</td><td style={{ ...tdStyle, fontWeight: 600 }}>Media</td></tr>
                <tr><td style={tdStyle}>Multi-currency</td><td style={tdStyle}>Conversao e presentment corretos</td><td style={{ ...tdStyle, fontWeight: 600 }}>Media</td></tr>
                <tr><td style={tdStyle}>Error logging</td><td style={tdStyle}>Todos os erros logados com request_id para debug</td><td style={{ ...tdStyle, fontWeight: 600 }}>Media</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Isolamento de ambiente
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O sandbox deve ter dados completamente isolados da producao — customers, payments,
              webhooks, tudo separado. Use API key prefix para determinar o ambiente (sk_test_ vs
              sk_live_). Nunca permita que uma key de teste acesse dados de producao ou vice-versa.
              Configure CI/CD para rodar integration tests automaticamente contra o sandbox antes
              de cada deploy.
            </p>
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
          API Design para Pagamentos
        </h1>
        <p className="page-description">
          Guia completo de design de APIs de pagamento: REST patterns, autenticacao, idempotencia,
          error handling, payloads, response codes, webhooks, paginacao, rate limiting e testing.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como estruturar endpoints REST para o ciclo de vida de pagamentos</li>
          <li>Implementar idempotencia para evitar cobranças duplicadas</li>
          <li>Mapear response codes ISO 8583 para retry logic inteligente</li>
          <li>Projetar webhooks resilientes com at-least-once delivery</li>
          <li>Testar integracoes em sandbox com cartoes e cenarios simulados</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>30+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Response Codes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>11</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Test Cards</div>
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
