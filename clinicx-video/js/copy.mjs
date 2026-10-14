// Every word on screen and every contact. Plain ESM: the score imports it too (a pop per check, a chime per
// notification). Facts only from brief.md — the site clinicx.app.br and the Instagram @sistemaclinicx.
export const BRAND = "Clinicx"; // @param name
export const SLUG = "clinicx-promo"; // @param slug  (output file names)
export const DEFAULT_LANG = "pt"; // @param lang

export const COPY = {
  pt: {
    // act 1 — the problem (the pains the site names: faltosos, orçamentos esquecidos, WhatsApp, faturamento)
    hook: ['SUA CLÍNICA ESTÁ', 'PERDENDO', 'DINHEIRO'],
    daily: 'TODOS OS DIAS',
    noshow: { title: 'FALTAS', label: 'Agenda de hoje', slot: 'FALTOU', hours: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'] },
    budget: { title: 'ORÇAMENTOS', title2: 'ESQUECIDOS', card: 'Orçamento', status: 'Não aprovado', days: 'há 89 dias' },
    whats: { title: 'WHATSAPP', title2: 'SEM RESPOSTA', bubbles: ['Oi, tem horário amanhã?', 'Quanto fica a limpeza?', 'Vou precisar remarcar', 'Alguém aí?', 'Bom dia! Consigo encaixe?', 'Ainda está disponível?'] },
    broke: ['A CONTA', 'NÃO FECHA'],
    // act 2 — the turn and the reveal
    turn: ['E SE A SUA CLÍNICA', 'TRABALHASSE', 'POR VOCÊ?'],
    h24: '24H',
    h24sub: 'POR DIA',
    tag: ['Gestão inteligente', 'para clínicas e consultórios'],
    // act 3 — how it works (all from the site)
    agents: {
      title: ['AGENTES', 'AUTOMÁTICOS'],
      checks: ['Confirmam consultas', 'Recuperam faltosos', 'Recuperam orçamentos'],
      via: 'Tudo pelo WhatsApp · 24h',
    },
    flow: {
      title: ['A JORNADA', 'DO PACIENTE'],
      steps: [['Paciente', 'baixa o App'], ['Escolhe', 'a clínica'], ['Solicita', 'a consulta'], ['Atendimento', 'realizado']],
    },
    notify: { title: ['DIRETO NO', 'CELULAR'], words: ['Lembretes', 'Termos', 'Receitas', 'Pagamentos'] },
    platform: {
      modules: ['Agenda', 'Prontuário Digital', 'Financeiro', 'CRM'],
      all: ['TUDO EM', 'UM SÓ LUGAR'],
    },
    crc: { title: ['QUEM É LEMBRADO,', 'É ESCOLHIDO.'] },
    plans: {
      from: 'Planos a partir de',
      price: [79, 90],
      per: '/mês',
      badge: '7 DIAS GRÁTIS',
      best: 'MAIS VENDIDO',
      cards: [['Clinicx Smart', 79], ['Clinicx Pro', 169], ['Clinicx Infinity', 239]],
      multi: 'Clinicx MultiClínicas',
      multiPrice: 'Sob consulta',
    },
    // the end card
    cta: 'Comece agora',
    trial: 'Teste 7 dias grátis',
    contacts: [
      { icon: 'link', text: 'clinicx.app.br' },
      { icon: 'ig', text: '@sistemaclinicx' },
    ],
  },
};
