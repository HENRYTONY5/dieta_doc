import emergencyCasesApi from '@/data/emergencyCasesApi.json';
import { getProtocolMatches } from '@/data/firstAidProtocols';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EmergencyLevel = 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE';

interface EmergencyCase {
  id: string;
  level: EmergencyLevel;
  stabilizationTime: number;
  patterns: string[];
  alarmExclusions: string[];
  response: string;
}

interface CachedCase {
  id: string;
  level: EmergencyLevel;
  stabilizationTime: number;
  query: string;
  response: string;
  tokens: string[];
  uses: number;
  updatedAt: string;
}

interface CacheCandidate {
  item: CachedCase;
  score: number;
}

interface SeedCandidate {
  item: EmergencyCase;
  score: number;
}

export interface WebConsultationRecord {
  id: string;
  query: string;
  level: EmergencyLevel;
  stabilizationTime: number;
  confidence: number;
  response: string;
  sources: string[];
  createdAt: string;
}

interface RegisterWebEmergencyPayload {
  query: string;
  level: EmergencyLevel;
  stabilizationTime: number;
  confidence: number;
  response: string;
  sources: string[];
}

interface EmergencyCasesApiData {
  cases?: EmergencyCase[];
  webConsultations?: WebConsultationRecord[];
}

export interface LocalEmergencyMatch {
  source: 'seed' | 'cache' | 'protocol';
  caseId: string;
  level: EmergencyLevel;
  stabilizationTime: number;
  confidence: number;
  response: string;
}

const CACHE_KEY = 'emergency_case_cache_v1';
const WEB_CONSULTATIONS_KEY = 'emergency_web_consultations_v1';
const MAX_CACHE_ITEMS = 80;
const MAX_WEB_CONSULTATIONS = 150;

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3);
}

function normalizeClinicalTypos(value: string): string {
  return normalizeText(value)
    .replace(/calosfrios|escalofrio|escalofr\w*os/g, 'escalofrios')
    .replace(/me\s+moje|me\s+moje\b|me\s+moj[eé]|mojado|empapado/g, 'exposicion al frio');
}

function buildProtocolLocalResponse(protocolTitle: string, level: EmergencyLevel, stabilizationTime: number, steps: string[]): string {
  const topSteps = steps.slice(0, 4).map((step, index) => `${index + 1}. ${step}`).join('\n');

  return `[NIVEL: ${level}]\n[TIEMPO DE ESTABILIZACIÓN: ${stabilizationTime} minutos]\n\n` +
    `**Protocolo local identificado:** ${protocolTitle}\n\n` +
    `**ORIENTACIÓN INMEDIATA:**\n${topSteps}\n\n` +
    `**SIGUIENTE REPORTE:**\n` +
    `Responde si mejora, sigue igual o empeora para continuar la guía.`;
}

function overlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection += 1;
  });
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(normalizeText(term)));
}

async function getCachedCases(): Promise<CachedCase[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CachedCase[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function setCachedCases(cases: CachedCase[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cases.slice(0, MAX_CACHE_ITEMS)));
}

async function getWebConsultations(): Promise<WebConsultationRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(WEB_CONSULTATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WebConsultationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function setWebConsultations(records: WebConsultationRecord[]): Promise<void> {
  await AsyncStorage.setItem(
    WEB_CONSULTATIONS_KEY,
    JSON.stringify(records.slice(0, MAX_WEB_CONSULTATIONS))
  );
}

export async function findLocalEmergencyMatch(query: string): Promise<LocalEmergencyMatch | null> {
  const normalizedQuery = normalizeClinicalTypos(query);
  const queryTokens = tokenize(normalizedQuery);

  if (queryTokens.length === 0) return null;

  const cachedCases = await getCachedCases();
  let bestCache: CacheCandidate | undefined;

  cachedCases.forEach((item) => {
    const score = overlapScore(queryTokens, item.tokens);
    if (!bestCache || score > bestCache.score) {
      bestCache = { item, score };
    }
  });

  if (bestCache && bestCache.score >= 0.66) {
    return {
      source: 'cache',
      caseId: bestCache.item.id,
      level: bestCache.item.level,
      stabilizationTime: bestCache.item.stabilizationTime,
      confidence: bestCache.score,
      response: bestCache.item.response,
    };
  }

  const apiData = emergencyCasesApi as EmergencyCasesApiData;
  const jsonWebConsultations = Array.isArray(apiData.webConsultations) ? apiData.webConsultations : [];
  let bestWebJson: CacheCandidate | undefined;

  jsonWebConsultations.forEach((item) => {
    const itemTokens = tokenize(item.query);
    const score = overlapScore(queryTokens, itemTokens);
    if (!bestWebJson || score > bestWebJson.score) {
      bestWebJson = {
        item: {
          id: item.id,
          level: item.level,
          stabilizationTime: item.stabilizationTime,
          query: item.query,
          response: item.response,
          tokens: itemTokens,
          uses: 1,
          updatedAt: item.createdAt,
        },
        score,
      };
    }
  });

  if (bestWebJson && bestWebJson.score >= 0.62) {
    return {
      source: 'cache',
      caseId: bestWebJson.item.id,
      level: bestWebJson.item.level,
      stabilizationTime: bestWebJson.item.stabilizationTime,
      confidence: bestWebJson.score,
      response: bestWebJson.item.response,
    };
  }

  const seedCases = (apiData.cases || []) as EmergencyCase[];
  let bestSeed: SeedCandidate | undefined;

  seedCases.forEach((item) => {
    if (item.alarmExclusions?.length > 0 && containsAny(normalizedQuery, item.alarmExclusions)) {
      return;
    }

    const patternTokens = tokenize(item.patterns.join(' '));
    const score = overlapScore(queryTokens, patternTokens);

    if (!bestSeed || score > bestSeed.score) {
      bestSeed = { item, score };
    }
  });

  if (!bestSeed || bestSeed.score < 0.48) {
    const protocolMatches = getProtocolMatches(normalizedQuery);
    const topProtocol = protocolMatches[0];

    if (!topProtocol || topProtocol.score < 7) {
      return null;
    }

    const protocol = topProtocol.protocol;
    const confidence = Math.max(0.6, Math.min(topProtocol.score / 14, 0.96));
    const response = buildProtocolLocalResponse(
      protocol.title,
      protocol.level,
      protocol.stabilizationTime,
      protocol.steps
    );

    return {
      source: 'protocol',
      caseId: `protocol-${protocol.id}`,
      level: protocol.level,
      stabilizationTime: protocol.stabilizationTime,
      confidence,
      response,
    };
  }

  return {
    source: 'seed',
    caseId: bestSeed.item.id,
    level: bestSeed.item.level,
    stabilizationTime: bestSeed.item.stabilizationTime,
    confidence: bestSeed.score,
    response: bestSeed.item.response,
  };
}

export async function cacheResolvedEmergencyCase(
  query: string,
  level: EmergencyLevel,
  stabilizationTime: number,
  response: string
): Promise<void> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return;

  const existing = await getCachedCases();
  const now = new Date().toISOString();

  const newItem: CachedCase = {
    id: `case-${Date.now()}`,
    level,
    stabilizationTime,
    query,
    response,
    tokens,
    uses: 1,
    updatedAt: now,
  };

  const bestMatchIndex = existing.findIndex((item) => overlapScore(tokens, item.tokens) >= 0.78);

  if (bestMatchIndex >= 0) {
    existing[bestMatchIndex] = {
      ...existing[bestMatchIndex],
      level,
      stabilizationTime,
      response,
      tokens,
      uses: existing[bestMatchIndex].uses + 1,
      updatedAt: now,
    };
  } else {
    existing.unshift(newItem);
  }

  existing.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  await setCachedCases(existing);
}

export async function registerWebEmergencyConsultation(
  payload: RegisterWebEmergencyPayload
): Promise<void> {
  const query = payload.query.trim();
  if (!query) return;

  const existing = await getWebConsultations();
  const now = new Date().toISOString();

  const record: WebConsultationRecord = {
    id: `web-${Date.now()}`,
    query,
    level: payload.level,
    stabilizationTime: payload.stabilizationTime,
    confidence: Number(payload.confidence.toFixed(3)),
    response: payload.response,
    sources: payload.sources,
    createdAt: now,
  };

  existing.unshift(record);
  existing.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  await setWebConsultations(existing);

  const apiData = emergencyCasesApi as EmergencyCasesApiData;
  if (!Array.isArray(apiData.webConsultations)) {
    apiData.webConsultations = [];
  }
  apiData.webConsultations.unshift(record);
  apiData.webConsultations = apiData.webConsultations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_WEB_CONSULTATIONS);
}
