import emergencyRules from '@/data/emergencyRules.json';
import { levelOrder } from '@/data/firstAidProtocols';

type EmergencyLevel = 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE';

type RankedLevel = {
  level: EmergencyLevel;
  score: number;
};

export interface WebEmergencyResult {
  query: string;
  level: EmergencyLevel;
  confidence: number;
  orientation: string;
  sources: string[];
  formattedResponse: string;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function countAny(text: string, terms: string[]): number {
  return terms.filter((term) => text.includes(normalizeText(term))).length;
}

function classifyFromText(query: string, webText: string): { level: EmergencyLevel; confidence: number } {
  const normalized = normalizeText(`${query} ${webText}`);

  const ranked: RankedLevel[] = [
    { level: 'CRÍTICA', score: countAny(normalized, emergencyRules.levelSignals.CRITICA) * 6 },
    { level: 'URGENTE', score: countAny(normalized, emergencyRules.levelSignals.URGENTE) * 4 },
    { level: 'MODERADA', score: countAny(normalized, emergencyRules.levelSignals.MODERADA) * 3 },
    { level: 'LEVE', score: countAny(normalized, emergencyRules.levelSignals.LEVE) * 2 },
  ];

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return levelOrder[a.level] - levelOrder[b.level];
  });

  const best = ranked[0];
  const total = ranked.reduce((acc, item) => acc + item.score, 0);

  if (!best || best.score <= 0) {
    return { level: 'LEVE', confidence: 0.35 };
  }

  const confidence = total > 0 ? Math.min(best.score / Math.max(total, 1), 0.92) : 0.5;
  return { level: best.level, confidence };
}

async function fetchDuckDuckGo(query: string): Promise<{ text: string; source?: string }> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' primeros auxilios')}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url);
    if (!response.ok) return { text: '' };
    const data = await response.json();
    const text = [data.AbstractText, data.Answer, data.Definition]
      .filter(Boolean)
      .join(' ')
      .trim();
    const source = data.AbstractURL || 'https://duckduckgo.com';
    return { text, source };
  } catch {
    return { text: '' };
  }
}

async function fetchWikipediaSnippet(query: string): Promise<{ text: string; source?: string }> {
  try {
    const url = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' primeros auxilios')}&utf8=&format=json&origin=*`;
    const response = await fetch(url);
    if (!response.ok) return { text: '' };
    const data = await response.json();
    const first = data?.query?.search?.[0];
    if (!first?.snippet) return { text: '' };
    const cleaned = String(first.snippet).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const source = `https://es.wikipedia.org/wiki/${encodeURIComponent(String(first.title || '').replace(/\s+/g, '_'))}`;
    return { text: cleaned, source };
  } catch {
    return { text: '' };
  }
}

export async function searchWebEmergency(query: string): Promise<WebEmergencyResult | null> {
  const [ddg, wiki] = await Promise.all([
    fetchDuckDuckGo(query),
    fetchWikipediaSnippet(query),
  ]);

  const mergedText = [ddg.text, wiki.text].filter(Boolean).join(' ').trim();
  const sources = [ddg.source, wiki.source].filter(Boolean) as string[];

  if (!mergedText) {
    return null;
  }

  const { level, confidence } = classifyFromText(query, mergedText);
  const orientation = mergedText.slice(0, 380);

  const formattedResponse = `[NIVEL: ${level}]\n[TIEMPO DE ESTABILIZACIÓN: ${level === 'CRÍTICA' ? 0 : level === 'URGENTE' ? 10 : level === 'MODERADA' ? 15 : 20} minutos]\n\n**Orientación médica inicial basada en consulta web:**\n${orientation}\n\n**SIGUIENTE PASO:**\nConfirma si el paciente mejora, sigue igual o empeora para ajustar la orientación.`;

  return {
    query,
    level,
    confidence,
    orientation,
    sources,
    formattedResponse,
  };
}
