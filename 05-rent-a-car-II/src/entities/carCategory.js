const BaseEntity = require("./base");

class CarCategory extends BaseEntity {
  constructor({ id, name, cardIds, price }) {
    super({ id, name });

    this.price = price;
    this.carIds = cardIds; // an array
  }
}

module.exports = CarCategory;
