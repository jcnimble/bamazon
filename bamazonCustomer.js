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


function start() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) { console.log(err) }
    console.table(res)
    inquirer
      .prompt([
        {
          name: "purchaseChoice",
          type: "input",
          message: "What is the ID of the item you would like to purchase? [Quit with Q]"
        },
        {
          name: "quantityPurchase",
          type: "input",
          message: "What quantity would you like to purchase?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        if (err) throw err;
        if (answer.choice === "Q") {
          console.log("Have a nice day!");
          connection.end();
        }
        else {

          var chosenItem;
          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.purchaseChoice) {
              chosenItem = res[i];
            }
          }
          // determine quantity purchased and stock quantity
          if (chosenItem.stock_quantity > parseInt(answer.quantityPurchase)) {
            var revQuantity = chosenItem.stock_quantity - parseInt(answer.quantityPurchase)
            console.log(revQuantity);

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
        }
      });
  });
}


