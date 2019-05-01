var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Holveck1!",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

var productPick;

function start() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) { console.log(err) }
    console.table(res)
  
  inquirer
    .prompt({
      name: "purchaseChoice",
      type: "input",
      message: "What is the ID of the item you would like to purchase? [Quit with Q]"
    })
    .then(function (answer) {
      // console.log(answer.purchaseChoice)
      
      productPick = answer.purchaseChoice
      // console.log(productPick)
      // based on their answer, either call the bid or the post functions
      if (productPick === "Q"||"q") {
        buy();
        // console.log("Have a nice day!");
        // connection.end();
      } else {
        buy();
      }
    });
  });
}

function buy() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) { console.log(err) }

  inquirer
    .prompt([
      {
        name: "quantityPurchase",
        type: "input",
        message: "What quantity would you like to purchase?",
      }
    ])
    .then(function (answer) {
      // console.log(answer.quantityPurchase)
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id == productPick) {
          chosenItem = res[i];
        // console.log(chosenItem)
        }
 
      }
      if (chosenItem.stock_quantity > parseInt(answer.quantityPurchase)) {
        var revQuantity = chosenItem.stock_quantity - parseInt(answer.quantityPurchase)
        console.log("===========================================================");

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: revQuantity
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function (error) {
            if (error) throw err;
            var totalPurchase = chosenItem.price * parseInt(answer.quantityPurchase)
            console.log("Thank you for shopping!\nEnjoy your " + chosenItem.product_name +
              " purchase.\nYou purchased " + answer.quantityPurchase + " item(s) for a grand total of $" + totalPurchase);
            console.log("===========================================================")
            start();
          }
        );
      }

      else {
        console.log("Insufficient Quatity: Please select another product or quantity.");
        start();
      }

    });
  });
}