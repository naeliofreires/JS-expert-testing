const { join } = require("path");
const { expect } = require("chai");
const { describe, it, before, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
/** locals import */
const CarService = require("../../src/service/carService.js");

const carsDB = join(__dirname, "./../../database", "cars.json");

const mocks = {
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCar: require("../mocks/valid-car.json"),
  validCustomer: require("../mocks/valid-customer.json"),
};

describe("CarService Suite Tests", () => {
  let sandbox = {};
  let carService = {};

  before(() => {
    carService = new CarService({ cars: carsDB });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Util: get random position from array", () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);
    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it("Should get the first ID from carIds in CarCategory", async () => {
    const carCategory = mocks.validCarCategory;
    const cardIdx = 0;

    /**
     * Nesse caso vai ser preciso realizar um stub para a função getRandomPositionFromArray que esta
     * sendo usada dentro de getRandomCard, pois como ela sempre retorna um numero randomico, precisamos garantir
     * que para esse teste, ela retorne sempre o mesmo valor, isso não torna o teste viciado, pois estamos testando a função
     * getRandomCard, existe um teste exclusivo para a função getRandomPositionFromArray
     */

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(cardIdx);

    const result = carService.getRandomCard(carCategory);
    const expected = carCategory.carIds[cardIdx];

    expect(result).to.be.equal(expected);
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
  });

  it("Use Case 01: Should return a car if there's a car available based on the given category ", async () => {
    const validCar = mocks.validCar;
    const validCarCategory = Object.create(mocks.validCarCategory); // create a new instancy
    validCarCategory.carIds = [validCar.id];

    /**
     * Iremos adicionar um stub aqui, pensando em um caso real, onde estariamos ou fazendo uma requisição
     * para API, ou diretamente no banco, porém nossos testes não pode depender diretamente disso, possi iremos
     * fazer um stub para this.carRepository.find, que é uma propriedade de carService
     */
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(validCar);

    sandbox.spy(carService, carService.getRandomCard.name);

    const result = await carService.getAvailableCar(validCarCategory);

    expect(result).to.be.deep.equal(validCar);
    expect(carService.getRandomCard.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledOnce).to.be.ok;
  });
});
