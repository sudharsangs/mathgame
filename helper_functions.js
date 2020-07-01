function createQuestion() {
  const num1 = getRandomNumber();
  const num2 = getRandomNumber();
  const operators = ["*", "+", "-", "/"];

  let operator = operators[Math.floor(Math.random() * 4)];

  const expression = `${num1} ${operator} ${num2}`;

  return {
    expression: expression,
    answer: Math.floor(eval(expression)),
  };
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

module.exports = {
  createQuestion,
  getRandomNumber,
};
