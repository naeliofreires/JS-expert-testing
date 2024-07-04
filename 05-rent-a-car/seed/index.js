const { faker } = require("@faker-js/faker");

const Card = require("../src/entities/car");
const CardCategory = require("../src/entities/carCategory");
const Customer = require("../src/entities/customer");

const { join } = require("path");
const { writeFile } = require("fs/promises");

const seederBaseFolder = join(__dirname, "../", "database");

const carCategory = new CardCategory({
  id: faker.string.uuid(),
  name: faker.vehicle.type(),
  cardIds: [],
  price: faker.finance.amount(20, 100),
});

const lisOfCars = [];
const listOfCustomers = [];

for (let index = 0; index < 10; index++) {
  const car = new Card({
    id: faker.string.uuid(),
    name: faker.vehicle.type(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear(),
  });

  carCategory.carIds.push(car.id);
  lisOfCars.push(car);

  const customer = new Customer({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
  });

  listOfCustomers.push(customer);
}

function write(filename, data) {
  const normalizedPath = join(seederBaseFolder, filename);
  return writeFile(normalizedPath, JSON.stringify(data), { encoding: "utf8" });
}

(async () => {
  await write("cars.json", lisOfCars);
  await write("carCategories.json", [carCategory]);
  await write("curstomers.json", listOfCustomers);
})();
