import { describe, expect, it } from 'vitest';
import { createPlan, isPlan, parseSyllabus, planToCsv, sequenceTopics, suggestPrerequisites } from './planner';

describe('syllabus parser', () => {
  it('removes common bullets and duplicates', () => {
    expect(parseSyllabus('1. Signals\n- Networks\nSignals\n; Control systems')).toEqual(['Signals', 'Networks', 'Control systems']);
  });
  it('caps imported topics', () => {
    expect(parseSyllabus(Array.from({ length: 90 }, (_, i) => `Topic ${i}`).join('\n'))).toHaveLength(80);
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
});
