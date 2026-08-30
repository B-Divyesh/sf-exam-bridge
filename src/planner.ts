export type Confidence = 'new' | 'shaky' | 'practising' | 'ready';

/** The largest plan the editor and backup importer accept. */
export const MAX_TOPICS = 80;

/**
 * Old releases could write one extra topic through the editor. Keep those
 * affected plans recoverable on this device, while refusing new oversized
 * imports and mutations. This ceiling prevents malformed local storage from
 * creating an unbounded render workload.
 */
export const MAX_RECOVERABLE_TOPICS = 500;

export interface PracticeRef {
  id: string;
  label: string;
  url: string;
  done: boolean;
}

export interface Topic {
  id: string;
  title: string;
  confidence: Confidence;
  suggested: string[];
  prerequisites: string[];
  practice: PracticeRef[];
}

export interface Plan {
  version: 1;
  examName: string;
  sourceUrl: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export const confidenceOrder: Confidence[] = ['new', 'shaky', 'practising', 'ready'];

const prerequisiteRules: Array<[RegExp, string[]]> = [
  [/signal|system|circuit|network|electronics|control/i, ['Algebra and complex numbers', 'Basic calculus', 'Units and dimensional analysis']],
  [/algorithm|data structure|program|computer|database|operating/i, ['Logic and set notation', 'Basic programming fluency', 'Asymptotic reasoning']],
  [/probab|statistic|random|distribution/i, ['Fractions and algebra', 'Functions and graphs', 'Counting principles']],
  [/calculus|differential|integral|transform/i, ['Algebraic manipulation', 'Functions and graphs', 'Trigonometry basics']],
  [/mechanic|thermo|fluid|physics/i, ['Units and dimensional analysis', 'Algebra and vectors', 'Free-body reasoning']],
  [/econom|account|finance/i, ['Percentages and ratios', 'Reading tables and graphs', 'Algebra basics']],
  [/logic|reasoning|aptitude/i, ['Set notation', 'Ratios and percentages', 'Reading constraints carefully']],
  [/language|grammar|verbal|reading/i, ['Sentence structure', 'Active reading', 'Vocabulary in context']],
];

export function cleanTopicLine(line: string): string {
  return line.trim().replace(/^\s*(?:[-*•]+|\d+[.)]|[A-Za-z][.)])\s*/, '').replace(/\s+/g, ' ').trim();
}

export function parseSyllabus(input: string): string[] {
  const seen = new Set<string>();
  return input.split(/\r?\n|;/).map(cleanTopicLine).filter(topic => {
    const key = topic.toLocaleLowerCase();
    if (topic.length < 2 || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, MAX_TOPICS);
}

export function suggestPrerequisites(title: string): string[] {
  const found = prerequisiteRules.filter(([rule]) => rule.test(title)).flatMap(([, items]) => items);
  return [...new Set(found)].slice(0, 4);
}

export function createPlan(examName: string, sourceUrl: string, titles: string[], now = new Date()): Plan {
  const stamp = now.toISOString();
  return {
    version: 1,
    examName: examName.trim() || 'My exam',
    sourceUrl: sourceUrl.trim(),
    createdAt: stamp,
    updatedAt: stamp,
    topics: titles.slice(0, MAX_TOPICS).map((title, index) => ({
      id: `${now.getTime().toString(36)}-${index}`,
      title,
      confidence: 'new',
      suggested: suggestPrerequisites(title),
      prerequisites: [],
      practice: [],
    })),
  };
}

export function sequenceTopics(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => {
    const confidence = confidenceOrder.indexOf(a.confidence) - confidenceOrder.indexOf(b.confidence);
    if (confidence) return confidence;
    const practiceA = a.practice.filter(ref => ref.done).length;
    const practiceB = b.practice.filter(ref => ref.done).length;
    return practiceA - practiceB;
  });
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function uniqueSelectedPrerequisites(prerequisites: string[]): string[] {
  const seen = new Set<string>();
  return prerequisites.filter(prerequisite => {
    const key = prerequisite.trim().toLocaleLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function practiceReferenceForCsv(ref: PracticeRef): string {
  if (ref.label && ref.url) return `${ref.label} (${ref.url})`;
  return ref.label || ref.url;
}

export function planToCsv(plan: Plan): string {
  const header = ['Order', 'Topic', 'Confidence', 'Prerequisites', 'Practice references', 'Completed references'];
  const rows = sequenceTopics(plan.topics).map((topic, index) => [
    String(index + 1), topic.title, topic.confidence,
    uniqueSelectedPrerequisites(topic.prerequisites).join('; '),
    topic.practice.map(practiceReferenceForCsv).join('; '),
    String(topic.practice.filter(ref => ref.done).length),
  ]);
  return [header, ...rows].map(row => row.map(csvCell).join(',')).join('\n');
}

export function isPlan(value: unknown, maximumTopics = MAX_TOPICS): value is Plan {
  if (!value || typeof value !== 'object') return false;
  const plan = value as Partial<Plan>;
  return plan.version === 1 && typeof plan.examName === 'string' && typeof plan.sourceUrl === 'string' &&
    typeof plan.createdAt === 'string' && typeof plan.updatedAt === 'string' && Array.isArray(plan.topics) &&
    plan.topics.length <= maximumTopics && plan.topics.every(topic => topic && typeof topic.id === 'string' &&
      typeof topic.title === 'string' && confidenceOrder.includes(topic.confidence) &&
      Array.isArray(topic.suggested) && topic.suggested.every(item => typeof item === 'string') &&
      Array.isArray(topic.prerequisites) && topic.prerequisites.every(item => typeof item === 'string') &&
      Array.isArray(topic.practice) && topic.practice.every(ref => ref && typeof ref.id === 'string' &&
        typeof ref.label === 'string' && typeof ref.url === 'string' && typeof ref.done === 'boolean'));
}
