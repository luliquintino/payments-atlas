"use client";

import { useState } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

const sectionStyle: React.CSSProperties = { padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "1.25rem" };
const headingStyle: React.CSSProperties = { fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" };
const paragraphStyle: React.CSSProperties = { fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" };
const subheadingStyle: React.CSSProperties = { fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", marginTop: "1rem" };
const tableWrapperStyle: React.CSSProperties = { overflowX: "auto", marginTop: "0.75rem", marginBottom: "0.75rem" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" };
const thStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", borderBottom: "2px solid var(--border)", background: "var(--surface)" };
const tdStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--foreground)", verticalAlign: "top" };
const highlightBoxStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.06)", marginTop: "0.75rem", marginBottom: "0.75rem" };
const codeBlockStyle: React.CSSProperties = { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", fontSize: "0.8rem", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre", color: "var(--foreground)", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: "0.75rem" };
const pillarCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", marginBottom: "0.75rem" };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, background: "var(--primary-bg)", color: "var(--primary)", marginRight: "0.375rem", marginBottom: "0.25rem" };

interface Section { id: string; title: string; icon: string; content: React.ReactNode; }

export default function PaymentMethodsBRPage() {
  const quiz = getQuizForPage("/knowledge/payment-methods-br");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "ted",
      title: "TED — Transferencia Eletronica Disponivel",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A TED e uma transferencia interbancaria de alto valor processada pelo STR (Sistema de Transferencia
            de Reservas) do Banco Central. Criada em 2002, foi o principal instrumento de transferencia de
            grandes valores ate a chegada do Pix.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Caracteristica</th><th style={thStyle}>Detalhe</th></tr>
              </thead>
              <tbody>
                {[
                  { car: "Sistema", det: "STR (Sistema de Transferencia de Reservas) — LBTR (liquidacao bruta em tempo real)" },
                  { car: "Horario", det: "Dias uteis, 6h30 as 17h15 (horario pode variar por banco)" },
                  { car: "Limite minimo", det: "Sem limite minimo (historicamente era R$250, depois removido)" },
                  { car: "Limite maximo", det: "Sem limite maximo definido pelo BCB (banco pode definir)" },
                  { car: "Liquidacao", det: "Mesmo dia (D+0) se enviada dentro do horario. Tempo real no STR." },
                  { car: "Custo para PF", det: "R$ 0 a R$ 20 (varia por banco e pacote de servicos)" },
                  { car: "Custo para PJ", det: "R$ 5 a R$ 25 (varia por banco e volume)" },
                  { car: "Irrevogabilidade", det: "Irrevogavel apos efetivacao (nao pode ser cancelada)" },
                  { car: "Identificacao", det: "Dados completos de remetente e destinatario (nome, CPF/CNPJ, banco, agencia, conta)" },
                ].map((item) => (
                  <tr key={item.car}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.car}</td>
                    <td style={tdStyle}>{item.det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              TED no pos-Pix
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Com o Pix, o volume de TEDs caiu significativamente para transferencias de menor valor.
              Porem, a TED continua relevante para: transferencias de altissimo valor (acima dos limites Pix),
              operacoes que exigem liquidacao via STR (mercado interbancario), e sistemas legados que ainda
              nao migraram para Pix.
            </p>
          </div>
        </>
      ),
    },

    {
      id: "doc",
      title: "DOC — Documento de Credito",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O DOC foi um instrumento de transferencia interbancaria de menor valor, processado pelo
            sistema de compensacao COMPE. Diferente da TED (tempo real), o DOC tinha liquidacao em D+1.
            O BCB descontinuou o DOC em 15 de janeiro de 2024.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Caracteristica</th><th style={thStyle}>Detalhe</th></tr>
              </thead>
              <tbody>
                {[
                  { car: "Sistema", det: "COMPE (Centralizadora da Compensacao de Cheques) — compensacao multilateral" },
                  { car: "Limite maximo", det: "R$ 4.999,99 por transacao" },
                  { car: "Liquidacao", det: "D+1 (dia util seguinte)" },
                  { car: "Horario", det: "Dias uteis, ate 21h59 (variacoes por banco)" },
                  { car: "Custo tipico", det: "R$ 0 a R$ 15 (mais barato que TED historicamente)" },
                  { car: "Status atual", det: "DESCONTINUADO desde 15/01/2024 (substituido por Pix e TED)" },
                ].map((item) => (
                  <tr key={item.car}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.car}</td>
                    <td style={tdStyle}>{item.det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            A descontinuacao do DOC era inevitavel: o Pix oferece transferencia instantanea, 24/7,
            sem custo para PF e sem limite de valor. O DOC perdeu relevancia rapidamente apos o
            lancamento do Pix em novembro de 2020.
          </p>
        </>
      ),
    },

    {
      id: "tef",
      title: "TEF — Transferencia Eletronica de Fundos",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            TEF (Transferencia Eletronica de Fundos) e a tecnologia que conecta o ponto de venda (POS/PDV)
            ao sistema de autorizacao de pagamentos. No Brasil, TEF e amplamente usado em supermercados,
            farmacias e varejistas que possuem sistema de automacao comercial (PDV).
          </p>
          <p style={subheadingStyle}>TEF vs POS convencional</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Aspecto</th><th style={thStyle}>TEF</th><th style={thStyle}>POS convencional</th></tr>
              </thead>
              <tbody>
                {[
                  { asp: "Hardware", tef: "Pin pad conectado ao PDV (computador)", pos: "Terminal autonomo (maquininha)" },
                  { asp: "Integracao", tef: "Integrado ao sistema de automacao comercial", pos: "Independente do sistema do lojista" },
                  { asp: "Conciliacao", tef: "Automatica (dados ja no sistema)", pos: "Manual (precisa cruzar dados)" },
                  { asp: "Multi-acquirer", tef: "Roteia para melhor acquirer (Cielo, Rede, Stone...)", pos: "Vinculado a um acquirer especifico" },
                  { asp: "Custo", tef: "Software TEF + pin pad (investimento maior)", pos: "Aluguel da maquininha (menor investimento)" },
                  { asp: "Ideal para", tef: "Grande varejo (supermercados, redes, farmacias)", pos: "PMEs, comercio de rua, ambulantes" },
                ].map((item) => (
                  <tr key={item.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.asp}</td>
                    <td style={tdStyle}>{item.tef}</td>
                    <td style={tdStyle}>{item.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Provedores TEF no Brasil</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {["SiTef (Software Express)", "PayGo (Elgin)", "Cappta (Pagseguro)", "D-TEF", "Scope (Getnet)"].map((t) => (
              <span key={t} style={tagStyle}>{t}</span>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "boleto",
      title: "Boleto Bancario — Anatomia",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            O boleto bancario e um titulo de cobranca tipicamente brasileiro. Funciona como uma ordem
            de pagamento: o beneficiario (credor) emite o boleto, o pagador (devedor) paga em qualquer
            banco, loteria ou app. Os recursos sao compensados e creditados ao beneficiario.
          </p>
          <div style={codeBlockStyle}>
{`ANATOMIA DO BOLETO:

┌─────────────────────────────────────────────────────────┐
│ Banco: 237 (Bradesco)  Agencia: 1234  Conta: 56789-0   │
│                                                          │
│ Beneficiario: Empresa ABC Ltda                           │
│ CNPJ: 12.345.678/0001-90                                │
│                                                          │
│ Nosso Numero: 00001234567890                             │
│ (identificador unico gerado pelo banco/beneficiario)     │
│                                                          │
│ Valor: R$ 150,00                                         │
│ Vencimento: 15/02/2024                                   │
│ Desconto ate: 10/02/2024 (R$ 5,00)                      │
│ Juros apos vencimento: 1% a.m.                           │
│ Multa apos vencimento: 2%                                │
│                                                          │
│ Linha digitavel:                                         │
│ 23793.12340 56789.000001 23456.789001 1 95420000015000  │
│                                                          │
│ Codigo de barras:                                        │
│ ║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║║         │
└─────────────────────────────────────────────────────────┘

CAMPOS DA LINHA DIGITAVEL:
  23793.12340 → Banco (237) + moeda (9) + agencia (1234) + digito
  56789.000001 → Conta + nosso numero (parte 1)
  23456.789001 → Nosso numero (parte 2) + digito verificador
  1 → Digito verificador geral
  9542 → Fator de vencimento (dias desde 07/10/1997)
  0000015000 → Valor (R$ 150,00 em centavos)`}
          </div>
        </>
      ),
    },

    {
      id: "boleto-registrado",
      title: "Boleto Registrado — CIP e COMPE",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Desde 2018, todos os boletos emitidos no Brasil devem ser registrados — isto e, informados
            previamente ao banco antes da emissao. O registro eliminou o boleto &ldquo;sem registro&rdquo;
            que era vulneravel a fraudes e dificultava conciliacao.
          </p>
          <p style={subheadingStyle}>Fluxo do boleto registrado</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {[
              { step: "1. Registro", desc: "Beneficiario envia dados do boleto ao banco emissor via API/arquivo" },
              { step: "2. Validacao", desc: "Banco valida dados e registra na CIP (Camara Interbancaria de Pagamentos)" },
              { step: "3. Emissao", desc: "Boleto gerado com codigo de barras e linha digitavel" },
              { step: "4. Pagamento", desc: "Pagador paga em qualquer canal (banco, loteria, app)" },
              { step: "5. Compensacao", desc: "Processada pela COMPE (compensacao multilateral D+1)" },
              { step: "6. Liquidacao", desc: "Recursos creditados ao beneficiario em D+1 (ou D+2)" },
              { step: "7. Baixa", desc: "Boleto e baixado automaticamente apos pagamento. Se nao pago ate vencimento + prazo, baixa automatica." },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--primary)", fontWeight: 600, flexShrink: 0, minWidth: "5rem" }}>{item.step}</span>
                <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
              </div>
            ))}
          </div>

          <p style={subheadingStyle}>Protesto de boleto</p>
          <p style={paragraphStyle}>
            Se o boleto nao for pago, o beneficiario pode protestar o titulo em cartorio. O protesto
            e a formalizacao da inadimplencia e pode ser feito eletronicamente (e-protesto) pela CIP.
            Apos o protesto, o devedor e negativado e so pode regularizar pagando o boleto + custas
            cartorias. O prazo minimo para protesto e 1 dia apos o vencimento.
          </p>
        </>
      ),
    },

    {
      id: "pix-avancado",
      title: "Pix Avancado",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Alem do Pix basico (transferencia P2P), o ecossistema Pix possui funcionalidades avancadas
            que estao transformando pagamentos B2B e e-commerce no Brasil.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                feature: "DICT (Diretorio de Identificadores)",
                color: "#3b82f6",
                desc: "Base de dados centralizada no BCB que mapeia chaves Pix (CPF, email, telefone, EVP) para contas bancarias. Permite consulta em tempo real para validar destinatario antes do envio.",
                detalhe: "Armazena: chave, tipo de conta, ISPB, agencia, conta, nome do titular. Anti-fraude: mecanismo de trava cautelar para bloquear chaves suspeitas.",
              },
              {
                feature: "Pix Cobranca",
                color: "#22c55e",
                desc: "Substituicao digital do boleto. Permite gerar cobranças com valor definido, data de vencimento, juros, multa e desconto. Usa QR Code dinamico vinculado a cobranca especifica.",
                detalhe: "Vantagem sobre boleto: liquidacao instantanea (D+0), custo menor, sem compensacao. APIs padronizadas pelo BCB para emissao e conciliacao.",
              },
              {
                feature: "QR Code Dinamico vs Estatico",
                color: "#f59e0b",
                desc: "Estatico: mesmo QR para todas as transacoes (ex: QR na mesa do restaurante). Dinamico: QR unico por transacao, com valor e dados especificos do pagamento.",
                detalhe: "Dinamico permite: conciliacao automatica (1 QR = 1 transacao), valor pre-definido, dados adicionais (pedido, cliente). Essencial para e-commerce.",
              },
              {
                feature: "Pix Garantido (futuro)",
                color: "#8b5cf6",
                desc: "Pix com pagamento parcelado, funcionando como alternativa ao cartao de credito parcelado. Ainda em fase de regulamentacao pelo BCB.",
                detalhe: "Conceito: comprar em 3x via Pix, com garantia de pagamento ao lojista. Exige: analise de credito do pagador, garantia do PSP, registro de agenda de pagamentos futuros.",
              },
              {
                feature: "Pix Automatico",
                color: "#ec4899",
                desc: "Debito automatico via Pix. Substituicao do debito em conta (CNAB) para pagamentos recorrentes: assinaturas, mensalidades, contas de servico.",
                detalhe: "Vantagem: nao depende de convencio bancario. Funciona entre qualquer instituicao. Lancamento previsto pelo BCB para tornar pagamentos recorrentes mais acessiveis.",
              },
            ].map((item) => (
              <div key={item.feature} style={{ ...pillarCardStyle, borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {item.feature}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Detalhe tecnico:</strong> {item.detalhe}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },

    {
      id: "debito-automatico",
      title: "Debito Automatico — CNAB 240/400",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            O debito automatico e um servico onde o pagador autoriza o banco a debitar automaticamente
            valores de sua conta para pagar contas recorrentes. No Brasil, funciona via arquivos CNAB
            (Centro Nacional de Automacao Bancaria) trocados entre empresa e banco.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr><th style={thStyle}>Aspecto</th><th style={thStyle}>CNAB 240</th><th style={thStyle}>CNAB 400</th></tr>
              </thead>
              <tbody>
                {[
                  { asp: "Formato", c240: "240 posicoes por registro", c400: "400 posicoes por registro" },
                  { asp: "Padrao", c240: "FEBRABAN (mais moderno)", c400: "Legado (cada banco tem variacao)" },
                  { asp: "Servicos", c240: "Cobranca, pagamento, debito automatico, transferencia", c400: "Principalmente cobranca (boleto)" },
                  { asp: "Estrutura", c240: "Header arquivo → Header lote → Detalhes → Trailer lote → Trailer arquivo", c400: "Header → Detalhes → Trailer (mais simples)" },
                  { asp: "Tendencia", c240: "Padrao atual recomendado", c400: "Em desuso, substituido por CNAB 240 e APIs" },
                ].map((item) => (
                  <tr key={item.asp}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.asp}</td>
                    <td style={tdStyle}>{item.c240}</td>
                    <td style={tdStyle}>{item.c400}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={paragraphStyle}>
            O debito automatico exige convenio entre empresa e banco: a empresa envia arquivo de remessa
            com os debitos a serem efetuados, o banco processa e retorna arquivo de retorno com o resultado
            (debitado, rejeitado por saldo insuficiente, conta encerrada, etc.). O titular pode cancelar
            a qualquer momento no seu banco.
          </p>
        </>
      ),
    },

    {
      id: "comparativo",
      title: "Comparativo Completo de Metodos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Cada metodo de pagamento brasileiro tem caracteristicas distintas. A escolha depende do caso
            de uso: valor, urgencia, custo e reversibilidade.
          </p>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metodo</th>
                  <th style={thStyle}>Custo PF</th>
                  <th style={thStyle}>Prazo</th>
                  <th style={thStyle}>Limite</th>
                  <th style={thStyle}>Horario</th>
                  <th style={thStyle}>Reversivel?</th>
                  <th style={thStyle}>Uso ideal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { met: "Pix", custo: "Gratis", prazo: "Instantaneo", limite: "Configuravel", hor: "24/7/365", rev: "MED (devolucao)", uso: "Tudo (P2P, e-com, B2B)" },
                  { met: "TED", custo: "R$ 0-20", prazo: "D+0 (mesmo dia)", limite: "Sem limite", hor: "Dias uteis 6h-17h", rev: "Nao", uso: "Altos valores, interbancario" },
                  { met: "DOC", custo: "Descontinuado", prazo: "D+1", limite: "R$ 4.999", hor: "N/A", rev: "N/A", uso: "Descontinuado (01/2024)" },
                  { met: "Boleto", custo: "Gratis", prazo: "D+1 a D+2", limite: "Sem limite", hor: "Dias uteis", rev: "Nao (apos compensacao)", uso: "Cobranca, B2B, gov" },
                  { met: "Cartao Credito", custo: "Gratis (PF)", prazo: "D+30 (lojista)", limite: "Limite do cartao", hor: "24/7", rev: "Chargeback (ate 120d)", uso: "E-commerce, parcelado" },
                  { met: "Cartao Debito", custo: "Gratis (PF)", prazo: "D+1 (lojista)", limite: "Saldo em conta", hor: "24/7", rev: "Dificil", uso: "Presencial, dia-a-dia" },
                  { met: "Deb. automatico", custo: "Gratis", prazo: "D+0 (na data)", limite: "Saldo em conta", hor: "Agendado", rev: "Cancelavel pelo titular", uso: "Recorrencia (agua, luz)" },
                ].map((item) => (
                  <tr key={item.met}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{item.met}</td>
                    <td style={tdStyle}>{item.custo}</td>
                    <td style={tdStyle}>{item.prazo}</td>
                    <td style={tdStyle}>{item.limite}</td>
                    <td style={tdStyle}>{item.hor}</td>
                    <td style={tdStyle}>{item.rev}</td>
                    <td style={tdStyle}>{item.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },

    {
      id: "tendencias",
      title: "Tendencias — O Futuro dos Meios de Pagamento",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            O ecossistema de pagamentos brasileiro esta em rapida transformacao. O Pix acelerou mudancas
            que levariam uma decada em outros mercados. As tendencias apontam para pagamentos cada vez
            mais instantaneos, abertos e integrados.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {[
              {
                trend: "Declinio do boleto",
                desc: "Boleto perde share para Pix Cobranca. Vantagens do Pix: instantaneo, sem compensacao, menor custo. Boleto sobrevivera para B2B/governo/negativacao, mas volume cairá 40-60% ate 2027.",
                impact: "PSPs precisam migrar infraestrutura de boleto para Pix Cobranca. Reconciliacao simplificada.",
              },
              {
                trend: "Pix como plataforma",
                desc: "Pix evolui de transferencia simples para plataforma de pagamentos: Cobranca, Automatico, Garantido, NFC (Pix por aproximacao). Tende a substituir cartao de debito e boleto.",
                impact: "Merchants devem priorizar Pix. PSPs devem investir em APIs Pix avancadas. Receita de MDR de debito sera canibalizada.",
              },
              {
                trend: "Open Finance Payments",
                desc: "Iniciacao de pagamento via Open Finance: cliente autoriza pagamento direto da conta sem cartao ou boleto. A2A (Account-to-Account) payments.",
                impact: "Desintermediacao das bandeiras de cartao. Menor custo para merchants. Novas oportunidades para fintechs.",
              },
              {
                trend: "DREX (Real Digital)",
                desc: "CBDC (moeda digital do banco central) brasileira. Foco em settlement de ativos tokenizados, DvP (Delivery versus Payment), smart contracts financeiros.",
                impact: "Transformacao do settlement de titulos e ativos. Novas possibilidades de programmable money. Impacto no mercado de capitais mais que em pagamentos retail.",
              },
              {
                trend: "Tap to Pay (NFC sem maquininha)",
                desc: "Smartphone do lojista funciona como terminal de pagamento via NFC. Apple Tap to Pay, Android Tap to Pay. Elimina necessidade de POS fisico.",
                impact: "Democratizacao da aceitacao de cartao. Microempreendedores sem custo de maquininha. Disruptivo para Stone, PagSeguro no segmento PME.",
              },
            ].map((item) => (
              <div key={item.trend} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {item.trend}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.25rem" }}>
                  {item.desc}
                </p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--primary)" }}>Impacto:</strong> {item.impact}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Payment Methods Brasil — TED, DOC, TEF e Boleto</h1>
        <p className="page-description">
          Guia completo sobre os meios de pagamento brasileiros: TED, DOC, TEF, boleto bancario,
          Pix avancado, debito automatico e tendencias do mercado.
        </p>
      </header>
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>TED: como funciona via STR, horarios, limites e custo</li>
          <li>DOC: diferenca do TED, compensacao D+1 e por que foi descontinuado</li>
          <li>TEF: integracao com automacao comercial e diferenca do POS</li>
          <li>Boleto bancario: anatomia, registro obrigatorio, compensacao e protesto</li>
          <li>Pix avancado: DICT, Cobranca, QR dinamico, Pix Garantido e Automatico</li>
          <li>Debito automatico: CNAB 240/400 e fluxo operacional</li>
          <li>Tendencias: declinio do boleto, Pix como plataforma, DREX, Tap to Pay</li>
        </ul>
      </div>
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[{ val: "9", label: "Secoes" }, { val: "7", label: "Metodos" }, { val: "5", label: "Tendencias" }, { val: "5", label: "Features Pix" }].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.val}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>Teste seu Conhecimento</h2>
          <PageQuiz questions={quiz.questions} onComplete={(correct, total, xpEarned) => { recordQuiz(quiz.pageRoute, correct, total, xpEarned); setQuizCompleted(true); }} />
        </div>
      )}
      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
            { name: "Treasury & Float", href: "/knowledge/treasury-float" },
            { name: "Reconciliacao", href: "/knowledge/reconciliation-deep" },
            { name: "PLD/FT", href: "/knowledge/pld-ft" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}>{link.name}</Link>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.5 }}>
          Fontes: Banco Central do Brasil, FEBRABAN, CIP, regulamentacao Pix, documentacao CNAB.
        </p>
      </div>
    </div>
  );
}
