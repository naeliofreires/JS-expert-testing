const { join } = require("path");
const { expect } = require("chai");
const { describe, it, before, beforeEach, afterEach } = require("mocha");
const sinon = require("sinon");
/** locals import */
const Transaction = require("../../src/entities/transaction.js");
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

  it("Use Case 02: Given a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
    const numberOfDays = 5;
    /**
     * Estamos criando uma nova instacia aqui para não "sujar" nosso valor base.
     */
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    /**
     * adicionando um stub, para que nosso teste não fique dependente da class
     */
    sandbox
      .stub(carService, "taxesBasedOnAge")
      .get(() => [{ from: 40, to: 50, then: 1.3 }]);

    const expectedValue = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    expect(result).to.be.deep.equal(expectedValue);
  });

  it("Use Case 03: Given a customer, and a car category it should return a transaction receipt", async () => {
    const numberOfDays = 5;
    const dueDate = "10 de novembro de 2020";
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      prince: 37.6,
      carIds: [car.id],
    };

    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;

    /**
     * Estamos dizendo para o JS, que sempre que um new Date() for chamado
     * ele irá retorna a seguinte a data, isso irá ocorrer apenas dentro desse teste.
     */
    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());
    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    const expectedAmount = carService.currencyFormat.format(540.6);
    const result = await carService.rent(customer, carCategory, numberOfDays);
    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).to.be.deep.equal(expected);
  });
});
