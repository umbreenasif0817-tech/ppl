import { describe, it, expect } from 'vitest';
import { Interpreter } from '../core/Interpreter';

describe('Mini-Interpreter Engine', () => {
  describe('Basic Arithmetic Commands', () => {
    it('evaluates ADD 10 20 -> 30', () => {
      const res = Interpreter.execute('ADD 10 20');
      expect(res.success).toBe(true);
      expect(res.output).toBe(30);
      expect(res.formattedOutput).toBe('30');
    });

    it('evaluates SUB 20 5 -> 15', () => {
      const res = Interpreter.execute('SUB 20 5');
      expect(res.success).toBe(true);
      expect(res.output).toBe(15);
      expect(res.formattedOutput).toBe('15');
    });

    it('evaluates MUL 4 5 -> 20', () => {
      const res = Interpreter.execute('MUL 4 5');
      expect(res.success).toBe(true);
      expect(res.output).toBe(20);
      expect(res.formattedOutput).toBe('20');
    });

    it('evaluates DIV 20 4 -> 5', () => {
      const res = Interpreter.execute('DIV 20 4');
      expect(res.success).toBe(true);
      expect(res.output).toBe(5);
      expect(res.formattedOutput).toBe('5');
    });

    it('throws runtime error on division by zero: DIV 20 0', () => {
      const res = Interpreter.execute('DIV 20 0');
      expect(res.success).toBe(false);
      expect(res.error).toContain('Division by zero');
    });
  });

  describe('Study Metrics Commands', () => {
    it('evaluates STUDY_HOURS 120 60 30 -> 3.5 hours', () => {
      const res = Interpreter.execute('STUDY_HOURS 120 60 30');
      expect(res.success).toBe(true);
      expect(res.output).toBe(3.5);
      expect(res.formattedOutput).toBe('3.5 hours');
    });

    it('evaluates PROGRESS 8 10 -> 80%', () => {
      const res = Interpreter.execute('PROGRESS 8 10');
      expect(res.success).toBe(true);
      expect(res.output).toBe(80);
      expect(res.formattedOutput).toBe('80%');
    });

    it('evaluates AVERAGE(80, 70, 90) -> 80', () => {
      const res = Interpreter.execute('AVERAGE(80, 70, 90)');
      expect(res.success).toBe(true);
      expect(res.output).toBe(80);
      expect(res.formattedOutput).toBe('80');
    });

    it('evaluates PASS(65) -> True', () => {
      const res = Interpreter.execute('PASS(65)');
      expect(res.success).toBe(true);
      expect(res.output).toBe(true);
      expect(res.formattedOutput).toBe('True');
    });

    it('evaluates PASS 45 50 -> False', () => {
      const res = Interpreter.execute('PASS 45 50');
      expect(res.success).toBe(true);
      expect(res.output).toBe(false);
      expect(res.formattedOutput).toBe('False');
    });

    it('evaluates ELIGIBLE(45, TRUE) -> True', () => {
      const res = Interpreter.execute('ELIGIBLE(45, TRUE)');
      expect(res.success).toBe(true);
      expect(res.output).toBe(true);
      expect(res.formattedOutput).toBe('True');
    });

    it('evaluates ELIGIBLE 30 TRUE -> False (below attendance threshold)', () => {
      const res = Interpreter.execute('ELIGIBLE 30 TRUE');
      expect(res.success).toBe(true);
      expect(res.output).toBe(false);
      expect(res.formattedOutput).toBe('False');
    });

    it('evaluates SUM 10 20 30 40 -> 100', () => {
      const res = Interpreter.execute('SUM 10 20 30 40');
      expect(res.success).toBe(true);
      expect(res.output).toBe(100);
      expect(res.formattedOutput).toBe('100');
    });
  });

  describe('Error Handling and Safety', () => {
    it('catches empty input gracefully', () => {
      const res = Interpreter.execute('');
      expect(res.success).toBe(false);
      expect(res.error).toContain('empty');
    });

    it('catches invalid unknown commands', () => {
      const res = Interpreter.execute('FOOBAR 10 20');
      expect(res.success).toBe(false);
      expect(res.error).toContain('valid command');
    });

    it('catches arity mismatch for ADD with 1 argument', () => {
      const res = Interpreter.execute('ADD 10');
      expect(res.success).toBe(false);
      expect(res.error).toContain('requires exactly 2');
    });

    it('catches lexical error on invalid tokens', () => {
      const res = Interpreter.execute('ADD 10 @#$');
      expect(res.success).toBe(false);
      expect(res.error).toContain('Lexical Error');
    });

    it('generates tokens and AST correctly', () => {
      const res = Interpreter.execute('ADD 15 25');
      expect(res.tokens.length).toBeGreaterThan(0);
      expect(res.ast?.type).toBe('CommandExpression');
      expect(res.ast?.command).toBe('ADD');
      expect(res.ast?.args?.length).toBe(2);
    });
  });
});
