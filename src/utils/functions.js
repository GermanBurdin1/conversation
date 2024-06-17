import faker from 'faker';

function generateRandomMessage() {
  return faker.hacker.phrase(); // Используем фразу от "хакера" из Faker API
}

export default generateRandomMessage;
