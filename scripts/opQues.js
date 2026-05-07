function getQA(amount, operator, xMin, xMax, yMin, yMax) {
  console.log();
  let overallValid = false;
  let questions = [],
    answers = [];

  //-------------------------------------------FROM VAULT!!!!
  // ----- DATA VALIDATION
  // Min can not be lower than max (CAN be equal)
  let xValidRange = xMin <= xMax;
  let yValidRange = yMin <= yMax;

  // At least X questions must be able to exist
  let xPool = [];
  let yPool = [];
  let pool = new Set();
  for (let i = xMin; i < xMax + 1; i++) {
    pool.add(i);
    xPool.push(i);
  }
  for (let i = yMin; i < yMax + 1; i++) {
    pool.add(i);
    yPool.push(i);
  }
  let enoughRange;
  if (xMin == xMax || yMin == yMax) {
    enoughRange = pool.size >= amount;
  } else {
    enoughRange = pool.size >= amount - 1;
  }

  // Operator validation
  let operatorValid;
  let xRange = xMax - xMin + 1;
  let yRange = yMax - yMin + 1;
  let validFactors = {};

  if (operator == "-") {
    operatorValid =
      yMax <= xMax &&
      xMin >= yMin &&
      xMax >= 3 &&
      ((xRange == 1 && yRange >= 3) ||
        (xRange == 2 && yRange >= 2) ||
        (xRange >= 3 && yMin <= xMax - 2));
  } else if (operator == "÷") {
    // Default to valid
    operatorValid = true;
    let totalPossibleFactors = 0;

    // Get list of y values in range that factor into x
    for (let i = xMin; i <= xMax; i++) {
      let allFactors = factors(i);
      let possibleFactors = yPool.filter((element) =>
        allFactors.includes(element),
      );
      totalPossibleFactors += possibleFactors.length;

      validFactors[i] = possibleFactors;
    }

    // Invalid input if not enough factors overall
    if (totalPossibleFactors < amount) {
      operatorValid = false;
    }
  } else {
    operatorValid = true;
  }

  overallValid = xValidRange && yValidRange && enoughRange && operatorValid;

  if (overallValid) {
    // Generate numbers for questions
    let nums = [];
    while (nums.length < 3) {
      // INCLUSIVE INTEGER: Math.floor(Math.random() * (max - min + 1)) + min;
      let pair = [];
      // x
      let xValue = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
      // y
      let yInvalid = true;
      let yValue;
      // Subtraction
      if (operator == "-") {
        while (yInvalid) {
          yValue = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
          if (yValue <= xValue) {
            yInvalid = false;
          }
        }
      } else if (operator == "÷") {
        // Division
        // If x invalid, regenerate
        while (validFactors[xValue].length == 0) {
          xValue = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
        }

        // Get y from factors pool
        yValue =
          validFactors[xValue][
            Math.floor(Math.random() * validFactors[xValue].length)
          ];
      } else {
        // Other
        yValue = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
      }

      // Push values
      pair.push(xValue);
      pair.push(yValue);

      // If pair not already in list, add to nums, questions, and set answer
      if (
        !nums.some(
          (numsPair) =>
            JSON.stringify(numsPair) === JSON.stringify(pair) ||
            JSON.stringify(numsPair) === JSON.stringify(pair.slice().reverse()),
        )
      ) {
        // Add to nums for duplicate checking
        nums.push(pair);
        // Add to questions list
        questions.push(`${pair[0]} ${operator} ${pair[1]}`);

        // Set answer
        if (operator == "+") {
          answers.push(pair[0] + pair[1]);
        } else if (operator == "-") {
          answers.push(pair[0] - pair[1]);
        } else if (operator == "×") {
          answers.push(pair[0] * pair[1]);
        } else if (operator == "÷") {
          answers.push(pair[0] / pair[1]);
        }
      }
    }
  }
  //-------------------------------------------

  return [questions, answers];
}
