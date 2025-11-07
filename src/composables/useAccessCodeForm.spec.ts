import { describe, it, expect, beforeEach } from 'vitest';
import { useAccessCodeForm } from './useAccessCodeForm';

describe('useAccessCodeForm', () => {
  let form: ReturnType<typeof useAccessCodeForm>;

  beforeEach(() => {
    form = useAccessCodeForm();
  });

  describe('initialization', () => {
    it('should initialize with empty code', () => {
      expect(form.code.value).toBe('');
    });

    it('should initialize as not validated', () => {
      expect(form.isValidated.value).toBe(false);
    });

    it('should initialize as valid (no validation run yet)', () => {
      expect(form.isValid.value).toBe(true);
    });
  });

  describe('validation', () => {
    it('should be invalid when code is empty', () => {
      form.code.value = '';
      const result = form.submit();

      expect(result.valid).toBe(false);
      expect(form.isValid.value).toBe(false);
      expect(form.isValidated.value).toBe(true);
    });

    it('should be invalid when code is only whitespace', () => {
      form.code.value = '   ';
      const result = form.submit();

      expect(result.valid).toBe(false);
      expect(form.isValid.value).toBe(false);
      expect(form.isValidated.value).toBe(true);
    });

    it('should be valid when code has content after trimming', () => {
      form.code.value = ' ABC ';
      const result = form.submit();

      expect(result.valid).toBe(true);
      expect(result.normalizedCode).toBe('ABC');
      expect(form.isValid.value).toBe(true);
      expect(form.isValidated.value).toBe(true);
    });

    it('should normalize code by trimming whitespace', () => {
      form.code.value = '  TEST123  ';
      const result = form.submit();

      expect(result.valid).toBe(true);
      expect(result.normalizedCode).toBe('TEST123');
    });
  });

  describe('reset functionality', () => {
    it('should reset form to initial state', () => {
      form.code.value = 'test';
      form.submit(); // trigger validation

      form.reset();

      expect(form.code.value).toBe('');
      expect(form.isValidated.value).toBe(false);
      expect(form.isValid.value).toBe(true);
    });
  });
});
