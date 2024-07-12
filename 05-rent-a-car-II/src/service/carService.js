const BaseRepository = require("../repository/baseRepository");
const Tax = require("../entities/tax");
const Transaction = require("../entities/transaction");
const { fi } = require("@faker-js/faker");

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  getRandomPositionFromArray(list) {
    const length = list.length;
    return Math.floor(Math.random() * length);
  }

  getRandomCard(carCategory) {
    const randomIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carID = carCategory.carIds[randomIndex];
    return carID;
  }

  async getAvailableCar(carCategory) {
    const randomCarID = this.getRandomCard(carCategory);
    const car = await this.carRepository.find(randomCarID);
    return car;
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;

    const { then: percentValue } = this.taxesBasedOnAge.find(
      (item) => age >= item.from && age <= item.to
    );

    const value = percentValue * price * numberOfDays;
    const formattedValue = this.currencyFormat.format(value);
    return formattedValue;
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = await this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dueDate = today.toLocaleDateString("pt-br", options);

    return new Transaction({
      customer,
      car,
      dueDate,
      amount: finalPrice,
    });
  }
}

module.exports = CarService;
