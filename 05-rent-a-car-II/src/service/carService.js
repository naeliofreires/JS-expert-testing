const BaseRepository = require("../repository/baseRepository");

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
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
}

module.exports = CarService;
