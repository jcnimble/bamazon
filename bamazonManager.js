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
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Manager Application: What do you want to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.menu === "View Products for Sale") {
                totalSales();
            }
            else if (answer.menu === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.menu === "Add to Inventory") {
                addInventory();
            }
            else if (answer.menu === "Add New Product") {
                addProduct();
            }
            else {
                console.log("Have a good day!");
                connection.end();
            }
        });
}

function totalSales() {
    console.log("Current items for sale...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) { console.log(err) }
        console.table(res);
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) { console.log(err) }
        console.table(res);
        start();
    });
}

function addInventory() {
    console.log("Updating stock...\n");
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log(results)
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item would you like to update stock quantity for?"
                },
                {
                    name: "stock",
                    type: "input",
                    message: "How much would you like to add?"
                }
            ])
            .then(function (answer) {
                console.log(answer.choice);
                console.log(answer.stock);
                console.log(results)
                

                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name == answer.choice) {
                        chosenItem = results[i];
                    }
                    console.log(chosenItem);
                }
                // must be greater then 0
                if (parseInt(answer.stock) > 0) {
                    var revStock = chosenItem.stock_quantity + parseInt(answer.stock)
                    connection.query(
                        "UPDATE auctions SET ? WHERE ?",
                        [
                            {
                                stock_quantity: revStock
                            },
                            {
                                id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Bid placed successfully!");
                            start();
                        }
                    );
                }
                else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("You need to add a number greater than zero. Try again...");
                    start();
                }
            });
    });
}

function addProduct() {
    console.log("Adding a new product...\n");
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does it belong in?",
                choices: ["Apparel", "Food", "Gear", "Other"]
            },
            {
                name: "price",
                type: "input",
                message: "What is the price?",
            },
            {
                name: "stock",
                type: "input",
                message: "What quantity is available?",
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price || 0,
                    stock_quantity: answer.stock || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
}

