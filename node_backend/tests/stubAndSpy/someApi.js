const { someService } = require("./someService");

const someApiCall = (someFunctionThatDoesSomething = someService) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(someFunctionThatDoesSomething());
    }, 1000);
  });
};

module.exports = { someApiCall };
