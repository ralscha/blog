const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const directory = 'www';

const keep = [
  'md-add.',
  'md-trash.',
  'ios-add.',
  'ios-trash.',
  'md-arrow-back.',
  'ios-arrow-back.'
];

async function remove() {
  try {
    const files = await readdir(directory);
    const toBeDeleted = [];
    for (const file of files) {
      if (file.endsWith('.svg') && !keep.find(k => file.startsWith(k))) {
        toBeDeleted.push(file);
      }
    }
    const unlinkPromises = toBeDeleted.map(filename => unlink(`${directory}/${filename}`));
    return await Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
}

remove();
