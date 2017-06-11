let express = require('express');
let request = require('request');
let app = express();
let port = 3000

let dummyAwards = [
  {
    dateAwarded: 1496894400,
    awardedTo: 'Idinaorki',
    itemId: 140866,
    itemBonuses: [1808]
  },
  {
    dateAwarded: 1496894400,
    awardedTo: 'Ashaimed',
    itemId: 140796,
    itemBonuses: [1808]
  },
  {
    dateAwarded: 1496894400,
    awardedTo: 'Cakey',
    itemId: 140878,
    itemBonuses: []
  },
  {
    dateAwarded: 1496894400,
    awardedTo: 'Judgengavel',
    itemId: 140870,
    itemBonuses: []
  },
  {
    dateAwarded: 1496894400,
    awardedTo: 'Vivimonster',
    itemId: 140866,
    itemBonuses: []
  },
  {
    dateAwarded: 1496894400,
    awardedTo: 'Archstorm',
    itemId: 140905,
    itemBonuses: [1808]
  }
];

let awardsCount = null;

app.use(express.static('dist'));

app.get('/item/awards', function (req, res) {
  let awards = [];
  let theseAwards = JSON.parse(JSON.stringify(dummyAwards));

  awardsCount = theseAwards.length;

  while (theseAwards.length) {
    let thisAward = theseAwards.shift();

    request.get({
        url: 'http://www.wowdb.com/api/item/' + thisAward.itemId
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          let resArray = body.split('');
          resArray = resArray.splice(1);
          resArray = resArray.splice(0, resArray.length - 1);
          thisAward.itemName = JSON.parse(resArray.join('')).Name;
          awards.push(thisAward);
          awardsCount -= 1;
          if (awardsCount === 0) {
            console.log('final awards', awards);
            res.send({awards:awards})
          }
        }
      });
  }
});

app.get('/item/:id', function (req, res) {
  request.get({
      url: 'http://www.wowdb.com/api/item/' + req.params.id
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let resArray = body.split('');
        resArray = resArray.splice(1);
        resArray = resArray.splice(0, resArray.length - 1);
        res.send(JSON.parse(resArray.join('')));
      }
    });
});

app.listen(port);
