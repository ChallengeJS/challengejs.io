const communicate = require('../communicate');

function makeTest(str, num) {
  return {test: str, expect: num};
};

var tests = {
  challenge: [
    makeTest('four', 4),
    makeTest('one hundred twenty two', 122),
    makeTest('two hundred thirty three', 233),
    makeTest('nine hundred ninety nine', 999)
  ],
  bonus: [
    makeTest('one hundred thousand', 100000),
    makeTest('four hundred twenty two thousand six', 422006),
    makeTest('nine hundred sixty two thousand eight hundred twenty seven', 962827),
    makeTest('eight hundred two million six hundred thousand nine hundred eighty four', 802600984)
  ],
  hard: [
    makeTest('one point zero two', 1.02),
    makeTest('five hundred sixty seven point two two', 567.22),
    makeTest('seven point seven', 7.7)
  ]
};

console.log('hard', tests.hard);
var results = {challenge: {}, bonus: {}, hard: {}};


try {
  Object.keys(tests).forEach(function(level) {
    var errors = [];
    results[level] = {
      pass: tests[level].every(function (item) {
        var res = transcribe(item.test);
        var match = res === item.expect;
        if (!match) {
          errors.push('With test input of "' + item.test + '" expected ' + item.expect + ' but got ' + res);
        }
        return match;
      }),
      errors: errors
    };
  });
} catch (e) {
  results.error = e;
  throw e;
}
communicate.sendToParent(results);
