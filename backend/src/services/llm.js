/**
 * LLM Service — provides AI-powered payment diagnostics and advice.
 * Supports OpenAI-compatible APIs. Falls back to rule-based responses when no API key is configured.
 */

const SYSTEM_PROMPT = `You are Payments Atlas AI, an expert in payment systems infrastructure.
You help users diagnose payment problems, understand payment architecture, and recommend improvements.
You have deep knowledge of:
- Payment rails (cards, bank transfers, wallets, crypto)
- Payment features (tokenization, 3DS, smart routing, fraud prevention)
- Payment metrics (authorization rate, conversion, fraud rate, chargebacks)
- Payment ecosystem (networks, PSPs, acquirers, issuers)
- Industry best practices from Stripe, Adyen, PayPal engineering

When diagnosing problems:
1. Identify the most likely root causes
2. Quantify the impact on key metrics
3. Recommend specific features and architectural changes
4. Prioritize by impact and implementation complexity

Be specific, data-driven, and actionable.`;

/**
 * Sends a prompt to the configured LLM API.
 * Falls back to built-in knowledge base if no API key is set.
 */
async function queryLLM(userMessage, context = {}) {
  const apiKey = process.env.LLM_API_KEY;
  const apiUrl = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  // If no API key, use built-in knowledge base
  if (!apiKey) {
    return getBuiltInResponse(userMessage, context);
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add context if available
    if (context.diagnosticInput) {
      messages.push({
        role: "system",
        content: `Current diagnostic context: ${JSON.stringify(context.diagnosticInput)}`,
      });
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 1500 }),
    });

    if (!response.ok) {
      console.error("LLM API error:", response.status);
      return getBuiltInResponse(userMessage, context);
    }

    const data = await response.json();
    return {
      response: data.choices[0].message.content,
      source: "llm",
      model,
    };
  } catch (err) {
    console.error("LLM API error:", err.message);
    return getBuiltInResponse(userMessage, context);
  }
}

/**
 * Built-in knowledge base for when LLM API is not available.
 * Matches user queries against known topics and returns expert responses.
 */
function getBuiltInResponse(message, context) {
  const msg = message.toLowerCase();

  const knowledgeBase = [
    {
      keywords: ["authorization", "approval", "decline", "auth rate"],
      response:
        "To improve authorization rates, consider: (1) **Network Tokenization** — replaces PANs with network tokens, improving auth rates by 2-5%. (2) **Smart Routing** — routes to the acquirer with highest approval probability. (3) **Retry Logic** — intelligently retries soft declines with optimized timing. (4) **Account Updater** — automatically updates expired card credentials. (5) **BIN-level routing** — routes based on issuer preferences. Industry benchmark for card authorization is 85-95% depending on region and merchant category.",
    },
    {
      keywords: ["fraud", "false positive", "risk", "chargeback"],
      response:
        "Key strategies to manage fraud: (1) **ML-based Fraud Scoring** — reduces false positives by 30-50% vs rule-based systems. (2) **3D Secure 2.x** — shifts liability and enables frictionless auth for low-risk transactions. (3) **Device Fingerprinting** — identifies returning devices to reduce friction. (4) **Velocity Checks** — detects card testing and burst fraud. (5) **Network-level fraud signals** — leverage Visa/MC fraud indicators. Target false positive rate: <5%. Industry chargeback threshold: 0.9% (Visa) / 1.0% (Mastercard).",
    },
    {
      keywords: ["3ds", "3d secure", "authentication", "sca"],
      response:
        "3D Secure 2.x improvements: (1) **Frictionless flow** — 70-85% of transactions can be authenticated without challenge. (2) **Risk-based authentication** — only challenges high-risk transactions. (3) **Data enrichment** — send 150+ data points to improve issuer decisions. (4) **Exemption management** — apply TRA, low-value, and merchant-initiated exemptions. (5) **Fallback to 3DS1** — handle issuers not supporting 2.x. Typical 3DS drop-off: 10-25%. With 2.x optimization: 3-8%.",
    },
    {
      keywords: ["cross-border", "international", "currency", "fx"],
      response:
        "Cross-border payment optimization: (1) **Local acquiring** — use in-country acquirers to avoid cross-border interchange and improve auth rates by 5-15%. (2) **Dynamic Currency Conversion** — offer payment in customer's local currency. (3) **Multi-currency pricing** — price in local currency to improve conversion. (4) **Regional PSP routing** — route to PSPs with strong local presence. (5) **Alternative payment methods** — support local methods (PIX in Brazil, iDEAL in NL, UPI in India).",
    },
    {
      keywords: ["routing", "smart routing", "cascade", "acquirer"],
      response:
        "Smart routing strategies: (1) **Cost-based routing** — route to lowest-cost acquirer per BIN/country. (2) **Performance-based routing** — route to highest-approval-rate acquirer. (3) **Cascade routing** — failover to secondary acquirer on decline. (4) **Load balancing** — distribute volume across acquirers. (5) **ML-based routing** — predict optimal acquirer per transaction. Expected impact: +3-8% authorization rate, -15-30% processing costs.",
    },
    {
      keywords: ["tokenization", "network token", "pan", "vault"],
      response:
        "Tokenization layers: (1) **Network Tokens** — issued by Visa/MC, tied to merchant+device. Improve auth by 2-5%, auto-update on card replacement. (2) **PSP Tokens** — gateway-level tokens for PCI scope reduction. (3) **PCI Vault** — secure card storage with tokenized references. (4) **Device Tokens** — Apple Pay/Google Pay device-bound tokens. Best practice: implement network tokenization for card-on-file, PSP tokenization for PCI compliance.",
    },
    {
      keywords: ["settlement", "reconciliation", "payout"],
      response:
        "Settlement optimization: (1) **Real-time settlement** — PIX (instant), Faster Payments (minutes). (2) **T+1 settlement** — move from T+2/T+3 by optimizing clearing. (3) **Automated reconciliation** — match transactions across PSP, acquirer, and bank statements. (4) **Split settlement** — automatic distribution for marketplaces. (5) **Reserve management** — optimize rolling reserves based on risk profile. Key metric: reconciliation accuracy >99.9%.",
    },
    {
      keywords: ["architecture", "design", "infrastructure", "stack"],
      response:
        "Modern payment architecture layers: (1) **Experience** — checkout UI, payment method selection, SDKs. (2) **Orchestration** — smart routing, failover, provider management. (3) **Processing** — auth, capture, refund, void operations. (4) **Network** — scheme connectivity, tokenization, 3DS. (5) **Banking** — acquiring relationships, FX, ledger. (6) **Settlement** — clearing, reconciliation, payouts. Key principle: decouple layers for independent scaling and provider flexibility.",
    },
  ];

  // Find best matching knowledge base entry
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = entry.keywords.filter((kw) => msg.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return { response: bestMatch.response, source: "knowledge_base" };
  }

  return {
    response:
      "I can help with payment system topics including: authorization rates, fraud prevention, 3D Secure, cross-border payments, smart routing, tokenization, settlement, and payment architecture. Please ask a specific question about any of these topics.",
    source: "knowledge_base",
  };
}

module.exports = { queryLLM };
