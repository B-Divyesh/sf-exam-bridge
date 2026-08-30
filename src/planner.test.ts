import { describe, expect, it } from 'vitest';
import { createPlan, isPlan, MAX_RECOVERABLE_TOPICS, MAX_TOPICS, parseSyllabus, planToCsv, sequenceTopics, suggestPrerequisites } from './planner';

describe('syllabus parser', () => {
  it('removes common bullets and duplicates', () => {
    expect(parseSyllabus('1. Signals\n- Networks\nSignals\n; Control systems')).toEqual(['Signals', 'Networks', 'Control systems']);
  });
  it('caps imported topics', () => {
    expect(parseSyllabus(Array.from({ length: 90 }, (_, i) => `Topic ${i}`).join('\n'))).toHaveLength(MAX_TOPICS);
  });
});

describe('planning', () => {
  it('suggests concise prerequisite refreshers', () => {
    expect(suggestPrerequisites('Probability and random processes')).toContain('Counting principles');
  });
  it('puts lower confidence topics first', () => {
    const plan = createPlan('Test', '', ['Ready one', 'New one']);
    plan.topics[0].confidence = 'ready';
    expect(sequenceTopics(plan.topics).map(topic => topic.title)).toEqual(['New one', 'Ready one']);
  });
  it('exports escaped, ordered CSV', () => {
    const plan = createPlan('Test', '', ['Signals, systems']);
    expect(planToCsv(plan)).toContain('"Signals, systems"');
  });
  it('exports only selected prerequisites and preserves practice labels with links', () => {
    const plan = createPlan('Test', '', ['Control systems']);
    const [control] = plan.topics;
    // The topic wording supplies three suggestions, but only one is checked.
    control.prerequisites = ['Basic calculus', 'basic calculus'];
    control.practice = [{
      id: 'q42', label: '2025 · Q42', url: 'https://example.org/questions/42', done: false,
    }];

    const csv = planToCsv(plan);
    expect(csv).toContain('"Basic calculus"');
    expect(csv).not.toContain('Algebra and complex numbers');
    expect(csv).not.toContain('Units and dimensional analysis');
    expect(csv.match(/Basic calculus/gu)).toHaveLength(1);
    expect(csv).toContain('"2025 · Q42 (https://example.org/questions/42)"');
  });
  it('rejects incomplete backup data', () => {
    expect(isPlan({ version: 1, examName: 'Broken', topics: [{ id: '1', title: 'X', confidence: 'new' }] })).toBe(false);
  });

  it('keeps new plans within the same topic boundary as imported backups', () => {
    const titles = Array.from({ length: MAX_TOPICS + 1 }, (_, index) => `Topic ${index + 1}`);
    const plan = createPlan('Boundary', '', titles);
    expect(plan.topics).toHaveLength(MAX_TOPICS);
    expect(isPlan(plan)).toBe(true);
  });

  it('allows only existing over-limit plans through the recovery validator', () => {
    const plan = createPlan('Legacy', '', Array.from({ length: MAX_TOPICS }, (_, index) => `Topic ${index + 1}`));
    plan.topics.push({ ...plan.topics[0], id: 'legacy-topic-81', title: 'Topic 81' });
    expect(isPlan(plan)).toBe(false);
    expect(isPlan(plan, MAX_RECOVERABLE_TOPICS)).toBe(true);
  });
});
