var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Soithan1995",
    database: "fromjae_db"
});



var Table = require('easy-table');
var t = new Table;

connection.query("select * from fromjae_db.warehouse",function(err,res){
    res.forEach(function(product){
        t.cell("Product Id",product.item_id);
        t.cell("Product name",product.product_name);
        t.cell("Department name",product.department_name);
        t.cell("Price",product.price);
        t.cell("Quantity",product.stock_quantity);
        t.newRow();
    })
    
    console.log(t.toString());
    startUp();
})



function startUp(){
    inquirer
    .prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the product you want to buy?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many are you buying?"
    }])
    .then(function(userSelection){
        checkStock(userSelection);
    })
}

function checkStock(userSelection){
    connection.query(
        "select * from fromjae_db.warehouse where item_id=?",[userSelection.id],function(error,response){
            var remain = response[0].stock_quantity-userSelection.quantity;
            var totalCost = userSelection.quantity*response[0].price;
            if(remain < 0){
                console.log("Invalid Quantity!");
                startUp();
            } else{
                updateInventory(userSelection.id,remain);
                console.log("You bought $"+totalCost+" in total.");
                connection.query(
                    "UPDATE fromjae_db.departments SET product_sales = product_sales+? WHERE department_name = ?",[totalCost,response[0].department_name]
                )
            }
        }
    )
}

function updateInventory(id, stock) {
    connection.query(
        "UPDATE fromjae_db.warehouse SET stock_quantity = ? WHERE item_id = ?",
        [stock, id],
        function(err,res) {
        }
    );
}