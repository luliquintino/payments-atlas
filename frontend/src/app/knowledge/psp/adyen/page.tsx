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

export default function AdyenDeepDivePage() {
  const quiz = getQuizForPage("/knowledge/psp/adyen");
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
            Adyen foi fundada em 2006 em Amsterdam, Holanda, com a missao de construir uma infraestrutura
            de pagamentos unica e global. Diferente de PSPs tradicionais que dependem de terceiros, a Adyen
            construiu toda a stack internamente — do gateway ao acquiring, passando por fraud management
            e settlement.
          </p>
          <p style={paragraphStyle}>
            A empresa abriu capital na Euronext Amsterdam em 2018 (AMS:ADYEN) e processou mais de $767
            bilhoes em volume de pagamentos em 2023. Clientes incluem Netflix, Spotify, Uber, Microsoft,
            eBay, McDonalds e Magazine Luiza.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Diferencial competitivo
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Single-platform: uma unica base de codigo atende todos os paises, canais (online, in-store,
              mobile) e metodos de pagamento. Isso elimina a necessidade de integracoes multiplas e
              permite reporting unificado em tempo real.
            </p>
          </div>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fundacao</td><td style={tdStyle}>2006, Amsterdam</td></tr>
                <tr><td style={tdStyle}>IPO</td><td style={tdStyle}>2018 — Euronext Amsterdam (AMS:ADYEN)</td></tr>
                <tr><td style={tdStyle}>Volume processado (2023)</td><td style={tdStyle}>$767 bilhoes</td></tr>
                <tr><td style={tdStyle}>Licencas de acquiring</td><td style={tdStyle}>30+ paises</td></tr>
                <tr><td style={tdStyle}>Metodos de pagamento</td><td style={tdStyle}>250+</td></tr>
                <tr><td style={tdStyle}>Funcionarios</td><td style={tdStyle}>~4.200</td></tr>
              </tbody>
            </table>
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
            O modelo da Adyen e baseado em IC++ (Interchange Plus Plus), onde o merchant paga exatamente
            o interchange cobrado pelo emissor, mais a taxa do scheme (Visa/Mastercard), mais o markup
            da Adyen. Isso contrasta com modelos blended (como Stripe) onde tudo e agrupado em uma taxa unica.
          </p>
          <p style={paragraphStyle}>
            A Adyen possui licenca de acquiring propria em mais de 30 paises, o que significa que ela
            nao depende de adquirentes terceiros para processar pagamentos. Isso permite maior controle
            sobre taxas de aprovacao, settlement e gerenciamento de disputas.
          </p>
          <p style={subheadingStyle}>Pilares do modelo</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pilar</th>
                  <th style={thStyle}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>IC++ Pricing</td><td style={tdStyle}>Transparencia total: interchange + scheme fee + markup Adyen. Ideal para enterprise que quer otimizar custos.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Own Acquiring</td><td style={tdStyle}>Licencas proprias eliminam intermediarios, aumentam taxas de aprovacao e aceleram settlement.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Unified Commerce</td><td style={tdStyle}>Online, in-store (POS), mobile e omnichannel em uma unica plataforma com reporting unificado.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>RevenueProtect</td><td style={tdStyle}>Engine de fraud management integrada, baseada em ML, sem custo adicional por transacao.</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Vantagem do IC++
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Para merchants com alto volume, IC++ pode ser 30-50% mais barato que blended pricing.
              Um merchant processando R$10M/mes em cartao de debito (interchange ~0.5%) paga muito
              menos que os 3.99% blended de um modelo PayFac.
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
            A Adyen opera uma unica base de codigo global — nao ha versoes regionais ou aquisicoes
            integradas. Todo o processamento acontece na infraestrutura propria, desde o gateway ate
            o settlement. Isso resulta em latencia baixa e controle total sobre a experiencia.
          </p>
          <p style={subheadingStyle}>Fluxo de Transacao</p>
          <div style={codeBlockStyle}>
{`Merchant (API/Drop-in/Components)
    |
    v
Adyen Gateway (single global endpoint)
    |
    v
RevenueProtect (fraud scoring, risk rules)
    |
    v
Adyen Acquiring (licenca propria, 30+ paises)
    |
    v
Card Scheme (Visa/Mastercard/Elo/Amex)
    |
    v
Issuer Bank (autorizacao)
    |
    v
Response -> Adyen -> Merchant (sync)
    |
    v
Settlement (Adyen deposita direto na conta do merchant)
    |
    v
Webhooks (AUTHORISATION, CAPTURE, SETTLEMENT, etc.)`}
          </div>
          <p style={subheadingStyle}>Componentes-chave</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Funcao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>RevenueProtect</td><td style={tdStyle}>Engine de fraud com risk scoring, velocity checks, referral rules. ML treinado com dados cross-merchant.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>TokenService</td><td style={tdStyle}>Network tokenization (Visa/MC tokens) e Adyen tokens para recurring. Aumenta approval rate em 2-6%.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>3DS2 Server</td><td style={tdStyle}>Servidor 3D Secure 2 proprio, com exemption engine para otimizar conversao vs. seguranca.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Settlement Engine</td><td style={tdStyle}>Calcula net settlement, deduz interchange e scheme fees, deposita direto na conta do merchant.</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Por que single-platform importa
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Quando um merchant expande para um novo pais, nao precisa de nova integracao. A mesma
              API, as mesmas credenciais, o mesmo dashboard. Apenas configura o merchantAccount para
              o novo pais e ativa os metodos de pagamento locais.
            </p>
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
            A API da Adyen e RESTful com payloads JSON. A autenticacao usa API key no header
            (X-API-Key). Ambientes separados por prefixo: TEST- para sandbox, live- para producao.
            Base URL: <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>https://checkout-test.adyen.com/v71</code> (test)
            ou <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>https://checkout-live.adyen.com/v71</code> (live).
          </p>
          <p style={subheadingStyle}>POST /payments — Autorizacao</p>
          <div style={codeBlockStyle}>
{`// Request
POST /v71/payments
X-API-Key: TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Content-Type: application/json

{
  "merchantAccount": "MyCompanyBR",        // Obrigatorio: conta do merchant
  "amount": {
    "currency": "BRL",                     // ISO 4217
    "value": 15000                         // Em centavos: R$150,00
  },
  "reference": "order-12345",              // ID unico do merchant
  "paymentMethod": {
    "type": "scheme",                      // Cartao de credito/debito
    "encryptedCardNumber": "adyenjs_...",  // Criptografado pelo Drop-in
    "encryptedExpiryMonth": "adyenjs_...",
    "encryptedExpiryYear": "adyenjs_...",
    "encryptedSecurityCode": "adyenjs_..."
  },
  "returnUrl": "https://myshop.com/checkout/result",  // Obrigatorio para 3DS
  "shopperReference": "shopper-abc",       // ID do comprador (recurring)
  "shopperEmail": "cliente@email.com",
  "shopperIP": "192.168.1.1",
  "channel": "Web",                       // Web, iOS, Android
  "browserInfo": { ... },                 // Obrigatorio para 3DS2 Web
  "billingAddress": {
    "street": "Rua Augusta",
    "houseNumberOrName": "1234",
    "city": "Sao Paulo",
    "stateOrProvince": "SP",
    "postalCode": "01310-100",
    "country": "BR"
  },
  "metadata": {                            // Campos customizados (retornados em webhooks)
    "internal_order_id": "ORD-789"
  }
}

// Response (sucesso — authorized)
{
  "resultCode": "Authorised",
  "pspReference": "8836483726382736",      // ID unico Adyen
  "merchantReference": "order-12345",
  "amount": { "currency": "BRL", "value": 15000 },
  "additionalData": {
    "authCode": "123456",
    "avsResult": "4 AVS not supported",
    "cardBin": "411111",
    "cardSummary": "1234",
    "paymentMethod": "visa"
  }
}

// Response (3DS required — redirect)
{
  "resultCode": "RedirectShopper",
  "action": {
    "type": "redirect",
    "method": "GET",
    "url": "https://test.adyen.com/hpp/3ds/...",
    "paymentMethodType": "scheme"
  }
}`}
          </div>
          <p style={subheadingStyle}>POST /payments/&#123;pspReference&#125;/captures — Captura</p>
          <div style={codeBlockStyle}>
{`POST /v71/payments/8836483726382736/captures
{
  "merchantAccount": "MyCompanyBR",
  "amount": {
    "currency": "BRL",
    "value": 15000                         // Pode ser parcial (< valor autorizado)
  },
  "reference": "capture-order-12345"
}

// Response
{
  "status": "received",
  "pspReference": "8836483726382737",
  "paymentPspReference": "8836483726382736"
}`}
          </div>
          <p style={subheadingStyle}>POST /payments/&#123;pspReference&#125;/refunds — Reembolso</p>
          <div style={codeBlockStyle}>
{`POST /v71/payments/8836483726382736/refunds
{
  "merchantAccount": "MyCompanyBR",
  "amount": {
    "currency": "BRL",
    "value": 5000                          // Reembolso parcial: R$50,00
  },
  "reference": "refund-order-12345"
}

// Response
{
  "status": "received",
  "pspReference": "8836483726382738",
  "paymentPspReference": "8836483726382736"
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
            Webhooks da Adyen sao a forma primaria de receber atualizacoes asincronas sobre pagamentos.
            Capturas, reembolsos e chargebacks sao processados de forma assincrona — o resultado final
            vem via webhook, nao na response da API.
          </p>
          <p style={subheadingStyle}>Verificacao HMAC-SHA256</p>
          <p style={paragraphStyle}>
            Todo webhook deve ser verificado usando HMAC-SHA256 com a chave configurada no Customer Area.
            Nunca processe um webhook sem verificar a assinatura. A Adyen envia o HMAC no campo
            <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}> additionalData.hmacSignature</code>.
          </p>
          <p style={subheadingStyle}>Evento AUTHORISATION</p>
          <div style={codeBlockStyle}>
{`{
  "live": "false",
  "notificationItems": [
    {
      "NotificationRequestItem": {
        "eventCode": "AUTHORISATION",
        "success": "true",
        "pspReference": "8836483726382736",
        "merchantReference": "order-12345",
        "merchantAccountCode": "MyCompanyBR",
        "amount": {
          "currency": "BRL",
          "value": 15000
        },
        "paymentMethod": "visa",
        "operations": ["CANCEL", "CAPTURE", "REFUND"],
        "eventDate": "2024-01-15T10:30:00+01:00",
        "additionalData": {
          "hmacSignature": "kHOxo...",
          "authCode": "123456",
          "cardBin": "411111",
          "cardSummary": "1234",
          "expiryDate": "03/2030",
          "fraudResultType": "GREEN",
          "fraudManualReview": "false",
          "riskScore": "10"
        }
      }
    }
  ]
}`}
          </div>
          <p style={subheadingStyle}>Principais Event Codes</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Event Code</th>
                  <th style={thStyle}>Quando</th>
                  <th style={thStyle}>Acao recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>AUTHORISATION</td><td style={tdStyle}>Pagamento autorizado (ou recusado se success=false)</td><td style={tdStyle}>Atualizar status do pedido, enviar confirmacao</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CAPTURE</td><td style={tdStyle}>Captura processada com sucesso</td><td style={tdStyle}>Confirmar que o valor foi capturado</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>REFUND</td><td style={tdStyle}>Reembolso processado</td><td style={tdStyle}>Atualizar status, notificar cliente</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CHARGEBACK</td><td style={tdStyle}>Disputa aberta pelo portador</td><td style={tdStyle}>Iniciar processo de defesa, coletar evidencias</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>CANCEL_OR_REFUND</td><td style={tdStyle}>Cancel (pre-capture) ou refund (pos-capture)</td><td style={tdStyle}>Atualizar conforme o tipo</td></tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Armadilha critica
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Webhooks da Adyen podem chegar fora de ordem e com duplicatas. Seu endpoint deve ser
              idempotente (processar o mesmo pspReference apenas uma vez) e retornar [accepted] no body
              com status 200. Se nao retornar [accepted], a Adyen re-envia ate 4 vezes.
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
            O modelo IC++ (Interchange Plus Plus) da Adyen oferece transparencia total sobre cada componente
            do custo de uma transacao. O merchant ve exatamente quanto vai para o emissor (interchange),
            para o scheme (Visa/Mastercard) e para a Adyen.
          </p>
          <p style={subheadingStyle}>Breakdown IC++</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Componente</th>
                  <th style={thStyle}>Range Tipico (Brasil)</th>
                  <th style={thStyle}>Quem recebe</th>
                  <th style={thStyle}>Variavel?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Interchange</td>
                  <td style={tdStyle}>0.5% - 2.0%</td>
                  <td style={tdStyle}>Banco emissor do cartao</td>
                  <td style={tdStyle}>Sim — varia por tipo de cartao, MCC, parcelamento</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Scheme Fee</td>
                  <td style={tdStyle}>0.05% - 0.15%</td>
                  <td style={tdStyle}>Visa / Mastercard / Elo</td>
                  <td style={tdStyle}>Sim — varia por volume, regiao, tipo de transacao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Processing Fee (Adyen)</td>
                  <td style={tdStyle}>EUR 0.10 - 0.12 por txn + markup %</td>
                  <td style={tdStyle}>Adyen</td>
                  <td style={tdStyle}>Negociavel por volume</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>IC++ vs Blended — Comparacao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Cenario</th>
                  <th style={thStyle}>IC++ (Adyen)</th>
                  <th style={thStyle}>Blended (Stripe BR)</th>
                  <th style={thStyle}>Economia IC++</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Debito BR - R$100</td>
                  <td style={tdStyle}>~R$0.80 (0.5% IC + 0.1% scheme + 0.2% Adyen)</td>
                  <td style={tdStyle}>R$4.38 (3.99% + R$0.39)</td>
                  <td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>-82%</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Credito premium - R$500</td>
                  <td style={tdStyle}>~R$9.75 (1.8% IC + 0.1% scheme + 0.05% Adyen)</td>
                  <td style={tdStyle}>R$20.34 (3.99% + R$0.39)</td>
                  <td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>-52%</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Internacional - R$1000</td>
                  <td style={tdStyle}>~R$22.50 (2.0% IC + 0.15% scheme + 0.1% Adyen)</td>
                  <td style={tdStyle}>R$40.29 (3.99% + R$0.39)</td>
                  <td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>-44%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Quando blended faz mais sentido
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Para merchants com ticket medio baixo (abaixo de R$30), a taxa fixa por transacao do IC++
              pode tornar o custo total maior que blended. Alem disso, startups sem volume para negociar
              markup com a Adyen podem nao conseguir condicoes vantajosas.
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
            A Adyen e otimizada para merchants de medio a grande porte que operam em multiplos paises
            e canais. Sua proposta de valor cresce proporcionalmente a complexidade da operacao.
          </p>
          <p style={subheadingStyle}>Quando escolher Adyen</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Por que Adyen</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Enterprise multi-pais</td><td style={tdStyle}>Uma integracao, 30+ paises com acquiring local. Reporting unificado, settlement centralizado.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Unified Commerce</td><td style={tdStyle}>Mesma plataforma para online, POS (terminais proprios), mobile. Tokenizacao cross-channel.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Alto volume</td><td style={tdStyle}>IC++ pricing escala melhor. Merchants com +$50M/ano conseguem markups muito competitivos.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Otimizacao de aprovacao</td><td style={tdStyle}>Acquiring local + network tokenization + 3DS exemptions = approval rates 3-8% maiores.</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Retail/Hospitality</td><td style={tdStyle}>Terminais POS proprios, integracao com loyalty, tap-to-pay, split payments.</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Quando NAO escolher Adyen</p>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Cenarios onde Adyen nao e ideal
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              <strong>Startups early-stage:</strong> Adyen tem volume minimo para onboarding e o processo
              de aprovacao e mais lento que Stripe. <strong>Budget-conscious SMBs:</strong> Sem volume
              para negociar, as taxas podem ser maiores que alternativas blended. <strong>Developer-first
              prototyping:</strong> A DX da Adyen melhorou muito, mas Stripe ainda lidera em docs,
              SDKs e tempo para first transaction.
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
            A Adyen oferece diferentes niveis de integracao, desde o Drop-in (componente pre-construido)
            ate API-only para controle total. A escolha impacta PCI scope, tempo de integracao e flexibilidade.
          </p>
          <p style={subheadingStyle}>Opcoes de Integracao</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metodo</th>
                  <th style={thStyle}>PCI Scope</th>
                  <th style={thStyle}>Customizacao</th>
                  <th style={thStyle}>Tempo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Drop-in</td><td style={tdStyle}>SAQ A</td><td style={tdStyle}>Limitada (CSS theming)</td><td style={tdStyle}>1-2 dias</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Components</td><td style={tdStyle}>SAQ A</td><td style={tdStyle}>Alta (componentes individuais)</td><td style={tdStyle}>3-5 dias</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>API-only</td><td style={tdStyle}>SAQ D (ou A-EP com CSE)</td><td style={tdStyle}>Total</td><td style={tdStyle}>1-3 semanas</td></tr>
                <tr><td style={{ ...tdStyle, fontWeight: 600 }}>Hosted Payment Page</td><td style={tdStyle}>SAQ A</td><td style={tdStyle}>Minima</td><td style={tdStyle}>Horas</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Checklist de Integracao</p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.8 }}>
              <strong>1.</strong> Use API keys com prefixo TEST- no ambiente de sandbox — nunca use chaves live em desenvolvimento.<br />
              <strong>2.</strong> Sempre envie o campo <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>merchantAccount</code> — e obrigatorio e diferente do merchant name.<br />
              <strong>3.</strong> Sempre inclua <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>returnUrl</code> para fluxos com 3DS — sem ele, o redirect falha silenciosamente.<br />
              <strong>4.</strong> Configure HMAC verification nos webhooks antes de ir para producao.<br />
              <strong>5.</strong> Implemente idempotencia no tratamento de webhooks — duplicatas sao comuns.<br />
              <strong>6.</strong> Envie <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>browserInfo</code> para transacoes web — obrigatorio para 3DS2.<br />
              <strong>7.</strong> Use o endpoint de <code style={{ background: "var(--primary-bg)", padding: "0.125rem 0.375rem", borderRadius: 4, fontSize: "0.8rem" }}>/paymentMethods</code> para listar metodos disponiveis dinamicamente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "comparacao",
      title: "Comparacao: Adyen vs Stripe vs dLocal",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada PSP tem forcas e fraquezas distintas. A escolha depende do perfil do merchant:
            volume, geografia, canais e prioridades (custo vs. DX vs. cobertura).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Criterio</th>
                  <th style={{ ...thStyle, color: "var(--primary)" }}>Adyen</th>
                  <th style={thStyle}>Stripe</th>
                  <th style={thStyle}>dLocal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Pricing</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>IC++ (transparente, negociavel)</td>
                  <td style={tdStyle}>Blended (3.99% + R$0.39 BR)</td>
                  <td style={tdStyle}>Custom (FX spread + processing)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Acquiring</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Proprio (30+ paises)</td>
                  <td style={tdStyle}>Via parceiros regionais</td>
                  <td style={tdStyle}>Via parceiros locais</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Forca Geografica</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Europa, global enterprise</td>
                  <td style={tdStyle}>EUA, Europa, global</td>
                  <td style={tdStyle}>LatAm, Africa, Asia emergente</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>API DX</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Boa (melhorando)</td>
                  <td style={tdStyle}>Excelente (referencia do mercado)</td>
                  <td style={tdStyle}>Boa</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>POS / In-store</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Excelente (terminais proprios)</td>
                  <td style={tdStyle}>Bom (Terminal hardware)</td>
                  <td style={tdStyle}>Nao oferece</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Settlement</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Direto, multi-currency</td>
                  <td style={tdStyle}>Direto, payouts flexiveis</td>
                  <td style={tdStyle}>USD/EUR (cross-border)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Ideal para</td>
                  <td style={{ ...tdStyle, background: "rgba(59,130,246,0.04)" }}>Enterprise, retail, unified commerce</td>
                  <td style={tdStyle}>Startups, SaaS, marketplaces</td>
                  <td style={tdStyle}>Cross-border para mercados emergentes</td>
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
            Erros reais de integracao com Adyen, suas consequencias e como evitar.
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
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao verificar HMAC dos webhooks</td>
                  <td style={tdStyle}>Vulnerabilidade a webhook spoofing — atacante pode simular pagamentos aprovados e obter produtos/servicos sem pagar.</td>
                  <td style={tdStyle}>Sempre validar hmacSignature antes de processar. Use a biblioteca oficial da Adyen que inclui helper de verificacao.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Confundir merchantAccount com merchant name</td>
                  <td style={tdStyle}>Erro 403 ou transacao processada na conta errada. Em multi-account setups, pode causar settlement na entidade legal errada.</td>
                  <td style={tdStyle}>merchantAccount e o identificador tecnico visivel no Customer Area. Mantenha um mapping claro por pais/entidade.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao enviar returnUrl para 3DS</td>
                  <td style={tdStyle}>O redirect apos autenticacao 3DS falha silenciosamente. O shopper fica preso na pagina do banco e abandona a compra.</td>
                  <td style={tdStyle}>Sempre incluir returnUrl em toda chamada /payments. Valide que a URL e acessivel e aceita query parameters.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Tratar response sincrona como final</td>
                  <td style={tdStyle}>Para captures e refunds, o resultCode pode ser &quot;received&quot; (nao &quot;success&quot;). O resultado real vem via webhook. Merchants que nao esperam o webhook marcam operacoes como concluidas prematuramente.</td>
                  <td style={tdStyle}>Use webhooks como source of truth para captures, refunds e chargebacks. A response sincrona e apenas um acknowledgment.</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#ef4444" }}>Nao implementar idempotencia em webhooks</td>
                  <td style={tdStyle}>Webhooks podem ser reenviados (retry). Sem idempotencia, refunds podem ser processados 2x no sistema interno, causando prejuizo financeiro.</td>
                  <td style={tdStyle}>Use pspReference como chave de idempotencia. Armazene webhooks processados e ignore duplicatas.</td>
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
          Adyen Deep Dive
        </h1>
        <p className="page-description">
          Guia completo da Adyen: arquitetura single-platform, IC++ pricing, API com exemplos JSON,
          webhooks HMAC, comparacao com concorrentes e armadilhas reais de integracao.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como funciona a arquitetura single-platform e o acquiring proprio da Adyen</li>
          <li>Anatomia completa da API com exemplos JSON para payments, captures e refunds</li>
          <li>IC++ pricing: como funciona, quando compensa e comparacao com blended</li>
          <li>Webhooks com verificacao HMAC e armadilhas criticas de integracao</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$767B</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Volume 2023</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>30+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises Acquiring</div>
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
