const regex = /^([A-Z]{2,3})-(\d{1,3})\.([xyz])$/;

const inputs = ["AB-0.z", "ABC-99.y", "BB-789.x", "ab-999.x"];

for (const input of inputs) {
  const match = regex.exec(input);
  if (match != null) {
    console.log(`Group 1: ${match[1]}, Group 2: ${match[2]}, Group 3: ${match[3]}`);
  }
  else {
    console.log(`${input} does not match`);
  }
}
