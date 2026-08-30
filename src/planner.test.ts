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
