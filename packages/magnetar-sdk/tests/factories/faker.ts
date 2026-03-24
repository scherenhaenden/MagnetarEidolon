import { Faker, base, en } from '@faker-js/faker';

const DEFAULT_FAKER_SEED = 424242;
const DEFAULT_REFERENCE_DATE = '2026-01-01T00:00:00.000Z';

export function createTestFaker(seed = DEFAULT_FAKER_SEED): Faker {
  const faker = new Faker({ locale: [en, base] });
  faker.seed(seed);
  faker.setDefaultRefDate(DEFAULT_REFERENCE_DATE);
  return faker;
}

export function deriveTestSeed(namespace: string, offset = 0): number {
  let hash = DEFAULT_FAKER_SEED;

  for (const character of namespace) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return (hash + offset) >>> 0;
}
