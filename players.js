const PLAYERS = [
  {
    "id": 1,
    "name": "Scottie Scheffler"
  },
  {
    "id": 2,
    "name": "Matt Fitzpatrick"
  },
  {
    "id": 3,
    "name": "Wyndham Clark"
  },
  {
    "id": 4,
    "name": "Cameron Young"
  },
  {
    "id": 5,
    "name": "Si Woo Kim"
  },
  {
    "id": 6,
    "name": "Chris Gotterup"
  },
  {
    "id": 7,
    "name": "Collin Morikawa"
  },
  {
    "id": 8,
    "name": "Sam Burns"
  },
  {
    "id": 9,
    "name": "Tommy Fleetwood"
  },
  {
    "id": 10,
    "name": "Ludvig Åberg"
  },
  {
    "id": 11,
    "name": "Rory McIlroy"
  },
  {
    "id": 12,
    "name": "Xander Schauffele"
  },
  {
    "id": 13,
    "name": "Jacob Bridgeman"
  },
  {
    "id": 14,
    "name": "Russell Henley"
  },
  {
    "id": 15,
    "name": "Akshay Bhatia"
  },
  {
    "id": 16,
    "name": "Hideki Matsuyama"
  },
  {
    "id": 17,
    "name": "Ryan Gerard"
  },
  {
    "id": 18,
    "name": "Gary Woodland"
  },
  {
    "id": 19,
    "name": "Patrick Cantlay"
  },
  {
    "id": 20,
    "name": "Kristoffer Reitan"
  },
  {
    "id": 21,
    "name": "Min Woo Lee"
  },
  {
    "id": 22,
    "name": "J.J. Spaun"
  },
  {
    "id": 23,
    "name": "Alex Smalley"
  },
  {
    "id": 24,
    "name": "Alex Fitzpatrick"
  },
  {
    "id": 25,
    "name": "Robert MacIntyre"
  },
  {
    "id": 26,
    "name": "Viktor Hovland"
  },
  {
    "id": 27,
    "name": "Justin Rose"
  },
  {
    "id": 28,
    "name": "Adam Scott"
  },
  {
    "id": 29,
    "name": "Tom Kim"
  },
  {
    "id": 30,
    "name": "Ryan Fox"
  },
  {
    "id": 31,
    "name": "Kurt Kitayama"
  },
  {
    "id": 32,
    "name": "J.T. Poston"
  },
  {
    "id": 33,
    "name": "Rickie Fowler"
  },
  {
    "id": 34,
    "name": "Bud Cauley"
  },
  {
    "id": 35,
    "name": "Nicolai Højgaard"
  },
  {
    "id": 36,
    "name": "Alex Noren"
  },
  {
    "id": 37,
    "name": "Sungjae Im"
  },
  {
    "id": 38,
    "name": "Jake Knapp"
  },
  {
    "id": 39,
    "name": "Aaron Rai"
  },
  {
    "id": 40,
    "name": "Sepp Straka"
  },
  {
    "id": 41,
    "name": "Ben Griffin"
  },
  {
    "id": 42,
    "name": "Maverick McNealy"
  },
  {
    "id": 43,
    "name": "Justin Thomas"
  },
  {
    "id": 44,
    "name": "Michael Thorbjornsen"
  },
  {
    "id": 45,
    "name": "Nico Echavarria"
  },
  {
    "id": 46,
    "name": "Michael Brennan"
  },
  {
    "id": 47,
    "name": "Ryo Hisatsune"
  },
  {
    "id": 48,
    "name": "Sahith Theegala"
  },
  {
    "id": 49,
    "name": "Eric Cole"
  },
  {
    "id": 50,
    "name": "Matt McCarty"
  },
  {
    "id": 51,
    "name": "Austin Smotherman"
  },
  {
    "id": 52,
    "name": "Max Homa"
  },
  {
    "id": 53,
    "name": "Keith Mitchell"
  },
  {
    "id": 54,
    "name": "Harry Hall"
  },
  {
    "id": 55,
    "name": "Jordan Spieth"
  },
  {
    "id": 56,
    "name": "Pierceson Coody"
  },
  {
    "id": 57,
    "name": "Harris English"
  },
  {
    "id": 58,
    "name": "Doug Ghim"
  },
  {
    "id": 59,
    "name": "Ben James"
  },
  {
    "id": 60,
    "name": "Sudarshan Yellamaraju"
  },
  {
    "id": 61,
    "name": "Ricky Castillo"
  },
  {
    "id": 62,
    "name": "Sam Stevens"
  },
  {
    "id": 63,
    "name": "Corey Conners"
  },
  {
    "id": 64,
    "name": "Michael Kim"
  },
  {
    "id": 65,
    "name": "Jackson Koivun"
  },
  {
    "id": 66,
    "name": "Daniel Berger"
  },
  {
    "id": 67,
    "name": "Steven Fisk"
  },
  {
    "id": 68,
    "name": "Shane Lowry"
  },
  {
    "id": 69,
    "name": "Nick Taylor"
  },
  {
    "id": 70,
    "name": "Jordan Smith"
  },
  {
    "id": 71,
    "name": "Patrick Rodgers"
  },
  {
    "id": 72,
    "name": "Johnny Keefer"
  },
  {
    "id": 73,
    "name": "Brian Harman"
  },
  {
    "id": 74,
    "name": "Aldrich Potgieter"
  },
  {
    "id": 75,
    "name": "Matti Schmid"
  },
  {
    "id": 76,
    "name": "Jackson Suber"
  },
  {
    "id": 77,
    "name": "Beau Hossler"
  },
  {
    "id": 78,
    "name": "Matt Wallace"
  },
  {
    "id": 79,
    "name": "Keegan Bradley"
  },
  {
    "id": 80,
    "name": "Mac Meissner"
  },
  {
    "id": 81,
    "name": "Zach Bauchou"
  },
  {
    "id": 82,
    "name": "Andrew Putnam"
  },
  {
    "id": 83,
    "name": "Andrew Novak"
  },
  {
    "id": 84,
    "name": "Ben Kohles"
  },
  {
    "id": 85,
    "name": "Stephan Jaeger"
  },
  {
    "id": 86,
    "name": "Davis Thompson"
  },
  {
    "id": 87,
    "name": "David Lipsky"
  },
  {
    "id": 88,
    "name": "Kevin Roy"
  },
  {
    "id": 89,
    "name": "Tom Hoge"
  },
  {
    "id": 90,
    "name": "Jason Day"
  },
  {
    "id": 91,
    "name": "Kevin Yu"
  },
  {
    "id": 92,
    "name": "John Parry"
  },
  {
    "id": 93,
    "name": "Denny McCarthy"
  },
  {
    "id": 94,
    "name": "Billy Horschel"
  },
  {
    "id": 95,
    "name": "Brandt Snedeker"
  },
  {
    "id": 96,
    "name": "Taylor Pendrith"
  },
  {
    "id": 97,
    "name": "Chandler Phillips"
  },
  {
    "id": 98,
    "name": "Max Greyserman"
  },
  {
    "id": 99,
    "name": "Christiaan Bezuidenhout"
  },
  {
    "id": 100,
    "name": "Brooks Koepka"
  }
];
