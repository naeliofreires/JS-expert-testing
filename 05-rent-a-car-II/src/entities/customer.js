const BaseEntity = require("./base");

class Customer extends BaseEntity {
  constructor({ id, name, age }) {
    super({ id, name });

    this.age = age;
  }
}

module.exports = Customer;
