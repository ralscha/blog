
const regex = /^([A-Z]{2,3})-(\d{1,3})\.([xyz])$/g;

const inputs = ["AB-0.z", "ABC-99.y", "BB-789.x", "ab-999.x"];

for (const input of inputs) {
    regex.lastIndex = 0;
    const groups = regex.exec(input);
    if (groups != null) {
        console.log(`Group 1: ${groups[1]}, Group 2:  ${groups[1]}, Group 3: ${groups[1]}`);
    }
    else {
        console.log(`${input} does not match`);
    }
}
		
		