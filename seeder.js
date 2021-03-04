const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const lineReader = require('line-reader');

const Publication = require('./models/publication');

/*
 * Original source of the following (modified) helper function:
 * https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript/11457952
 */
const splitCSVButIgnoreCommasInDoublequotes = (str) => {
  //split the str first
  //then merge the elments between two double quotes
  var delimiter = ',';
  var quotes = '"';
  var elements = str.split(delimiter);
  var newElements = [];
  for (var i = 0; i < elements.length; ++i) {
    if (elements[i].indexOf(quotes) >= 0) {
      //the left double quotes is found
      var indexOfRightQuotes = -1;
      var tmp = elements[i];
      //find the right double quotes
      for (var j = i + 1; j < elements.length; ++j) {
        if (elements[j].indexOf(quotes) >= 0) {
          indexOfRightQuotes = j;
          break;
        }
      }
      //found the right double quotes
      //merge all the elements between double quotes
      if (-1 != indexOfRightQuotes) {
        for (var j = i + 1; j <= indexOfRightQuotes; ++j) {
          tmp = tmp + delimiter + elements[j];
        }
        newElements.push(tmp.replace(/"/g, '').trim());
        i = indexOfRightQuotes;
      } else {
        //right double quotes is not found
        newElements.push(elements[i].replace(/"/g, '').trim());
      }
    } else {
      //no left double quotes is found
      newElements.push(elements[i].replace(/"/g, '').trim());
    }
  }

  return newElements;
};

(async function () {
  // Load env variables
  dotenv.config();

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB'.blue.inverse);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

const importData = async () => {
  let count = 0;
  lineReader.eachLine(
    `${__dirname}/seedData/publication-list.csv`,
    async (line, last) => {
      count++;
      const valuesArray = splitCSVButIgnoreCommasInDoublequotes(line);
      const publicationType = valuesArray[0];
      const title = valuesArray[1];
      const authors = valuesArray[2] || 'Author Unknown';
      const creationDate = valuesArray[3];

      // count === 1 implies line 1 which header row for the csv data
      // data except for (line 1) will be saved into mongodb
      if (count > 1) {
        const newPublication = new Publication({
          publicationType,
          title,
          authors,
          creationDate,
        });

        try {
          const publication = await newPublication.save();

          if (last) {
            console.log('Default Publication Data Imported!'.green.inverse);
            process.exit();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  );
};

const deleteData = async () => {
  try {
    await Publication.deleteMany();

    console.log('All Publication Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log(
    'Please provide a valid option to execute the seeder script'.red.inverse
  );
  process.exit(1);
}
