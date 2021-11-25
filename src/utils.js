export const compose = (...args) => value =>
  args.reduceRight((seed, item) => item(seed), value);