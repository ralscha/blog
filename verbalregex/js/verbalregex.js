var VerEx = require('verbal-expressions');

const regex = VerEx()
                .startOfLine()
                .beginCapture()
                  .range("A", "Z").add("{2,3}")
                .endCapture()
                .then("-")
                .beginCapture()
                  .digit().add("{1,3}")
                .endCapture()
                .then(".")
                .beginCapture()
                  .anyOf("xyz")
                .endCapture()
                .endOfLine();

const inputs = ["AB-0.z", "ABC-99.y", "BB-789.x", "ab-999.x"];

for (const input of inputs) {
  regex.lastIndex = 0;
  const groups = regex.exec(input);
  if (groups != null) {
    console.log(`Group 1: ${groups[1]}, Group 2:  ${groups[2]}, Group 3: ${groups[3]}`);
  }
  else {
    console.log(`${input} does not match`);
  }
}
