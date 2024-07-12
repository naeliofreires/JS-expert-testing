class Transaction {
  constructor({ customer, car, amount, dueDate }) {
    this.car = car;
    this.customer = customer;
    this.amount = amount;
    this.dueDate = dueDate;
  }
}

module.exports = Transaction;
