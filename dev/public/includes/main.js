var calculatorApp = angular.module('calcApp', []);

calculatorApp.factory('calculatorFactory', function () {
  var calculator = {};
  var buffer = []; // all digits get stored here before being passed on for manipulation
  var stored_value = 0; // the sum of all operations 
  var initial_clean = true;
  var previous_operation;
  var screen = 0;


  calculator.getScreen = function () {
    // screen has to display buffer until an operation is used, then display the result of that operation
    return screen;
  };

  calculator.pushToBuffer = function (digit) {
    // every time a calculator button is pressed push its corresponding value onto the buffer
    buffer.push(digit);
  };

  calculator.setPreviousOperation = function (operation) {
    previous_operation = operation;
  };

  calculator.getPreviousOperation = function () {
    return previous_operation;
  };

  calculator.flushBuffer = function () {
    // after an operation is used (+,-,etc) flush everything from the buffer onto a stored value for later manipulation
    // flushing the buffer means turning the array into a string and then returning it as a number and clearing it
    var ready_to_use_buffer = "";
    buffer.forEach(function (value) {
        ready_to_use_buffer += value;
    });
    console.log("the ready to use buffer is: " + ready_to_use_buffer);
    buffer = [];
    return Number(ready_to_use_buffer);
  };

  calculator.performOperation = function (operation) {
    // perform the passed in operation (add/sub/div/mult) 
    if (!initial_clean) {
      // if there is something already stored, run the operation on it & whatever is in the buffer
      stored_value = operation(stored_value, calculator.flushBuffer());
      calculator.setPreviousOperation(operation);
      console.log(operation);
      console.log(stored_value);
    } else {
      // this runs when initial is clean
      console.log("should have flushed");
      // this is just to 'chamber a function'
      calculator.setPreviousOperation(operation);
      stored_value = calculator.flushBuffer();
      if (operation !== calculator.equalsOperation)
        initial_clean = false;
    }
    return stored_value;
  };

  calculator.equalsOperation = function (a, b) {
    // when you hit equals you will want to run the previous operation 
    // ex: 2 + 2 ; when you = you want the + to run
    // current bug passing this twice will cause a Maximum call stack error
    return previous_operation(a, b);
  };

  calculator.addOperation = function (a, b) {
    return a + b;
  };
  calculator.subtractOperation = function (a, b) {
    return a - b;
  };
  calculator.divideOperation = function (a, b) {
    // you can't divide by zer0 silly
    if (b !== 0)
        return a / b;
    else return null;
  };
  calculator.multiplyOperation = function (a, b) {
    return a * b;
  };

  calculator.CE = function () {
    buffer = [];
    stored_value = 0;
    initial_clean = true;
  };

  calculator.returnValue = function () {
    return stored_value;
  };


  return calculator;
});

calculatorApp.controller('evalController', [function () {
  var self = this;
  self.screen = "0";
  self.buffer = "";
  self.stored = "";
  self.initial = true; 
  self.init = function () {

  };

  self.cathValue = function (value) {
    self.buffer += value;
    self.screen += value;
  };
  self.add = function () {
    self.stored = eval(stored + buffer);
  };
  self.commitBuffer = function () {
    if (initial) {
      self.stored = buffer; 
      self.buffer = "";
    }
    self.stored = eval(stored + buffer);
    console.log("Just want the update");
  };
}]);

calculatorApp.controller('bodyController', ['calculatorFactory', function (calculatorFactory) {

  var self = this;
  self.init = function () {
  };

  self.screen = "0"; // what to display on the calc screen
  self.performing_operation = false;

  self.catchValue = function (value) {
    // verify that whats being passed is a number if so push it to the buffer it not discard it
    if (typeof value === 'number') {
      calculatorFactory.pushToBuffer(value);
      self.screenHandler(value);
    } else {
      // if the user was to edit the value being passed in the application
      console.log("Invalid type");
    }

  };

  // function for testing purposes
  self.displayTheBuffer = function () {
    calculatorFactory.flushBuffer();
  };

  self.screenHandler = function (value) {
    // if you have clicked an operation we dont want to append we want to replace the screen with a new buffer
    if (self.performing_operation) {
      self.performing_operation = false;
      self.screen = "0";
    }
    // if we are at the beggining of the oparation do not append
    if (self.screen.charAt(0) === "0") self.screen = value.toString();
    else self.screen += value.toString();
  };

  self.multiply = function (a, b) {
    console.log("screen is: " + self.screen);
    console.log("stored value is: " + calculatorFactory.returnValue());
    self.screen = calculatorFactory.performOperation(calculatorFactory.multiplyOperation).toString();
    self.performing_operation = true;
  };

  self.divide = function (a, b) {
    self.screen = calculatorFactory.performOperation(calculatorFactory.divideOperation).toString();
    self.performing_operation = true;
  };

  self.add = function () {
    self.screen = calculatorFactory.performOperation(calculatorFactory.addOperation).toString();
    self.performing_operation = true;
  };

  self.subtract = function (a, b) {
    self.screen = calculatorFactory.performOperation(calculatorFactory.subtractOperation).toString();
    self.performing_operation = true;
  };

  self.equals = function () {
    self.screen = calculatorFactory.performOperation(calculatorFactory.equalsOperation);
    self.performing_operation = false;
  };

  self.clearEverything = function () {
    calculatorFactory.CE();
    self.screen = "0";
    self.performing_operation = false;
  };

  self.init();
    
}]);


