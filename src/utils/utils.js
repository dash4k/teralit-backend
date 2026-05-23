export const formatClassificationResult = (result) => {
  if (!result) return 'Not available';
  return `
        - Diagnosis: ${result.diagnosis}
        - Confidence: ${(result.confidence * 100).toFixed(2)}%
        - Risk Level: ${result.riskLevel}
        - Predicted Class: ${result.details.predictedClass}
    `.trim();
};

export const INJECTION_PATTERNS = [
  /ignore (the |all )?(previous|above|prior|system)? ?(rules|instructions|prompt|constraints)/i,
  /forget (everything|your instructions|the rules)/i,
  /pretend (you are|to be|you're)/i,
  /act as (a |an )?(?!medical|doctor|assistant)/i,
  /you are now/i,
  /override (your )?(rules|instructions|system)/i,
  /disregard (the |your )?(previous|above|prior|system)? ?(rules|instructions|prompt)/i,
  /do anything now/i,
  /jailbreak/i,
];

export const detectInjection = (input) => {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
};
