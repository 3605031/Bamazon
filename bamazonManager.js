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



function startUp(){
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do? ",
        name: "cmd",
        choices: ["View Products", "View Low Stock","Add Stock","Add New Product"]
    }]).then(function(userSelection){
        doTask(userSelection.cmd);
    })
}

function viewProduct(){
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
    })
    
}

function viewLow(count){
    var t = new Table;
    
    connection.query("select * from fromjae_db.warehouse where stock_quantity<?",[count],function(err,res){
        res.forEach(function(product){
            t.cell("Product Id",product.item_id);
            t.cell("Product name",product.product_name);
            t.cell("Department name",product.department_name);
            t.cell("Price",product.price);
            t.cell("Quantity",product.stock_quantity);
            t.newRow();
        })      
        console.log(t.toString());
    })
    
}

function addStock(userSelection){
    connection.query(
        "select * from fromjae_db.warehouse where item_id=?",[userSelection.id],function(error,response){
            var newStock = response[0].stock_quantity+parseInt(userSelection.quantity);

                updateInventory(userSelection.id,newStock);
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

function addProduct(){
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "What is the name of the product you want to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What is the department of the product you want to add?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the product you want to add?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many are you adding?"
        }]).then(function(userSelection){
            connection.query(
                "INSERT INTO fromjae_db.warehouse ( product_name, department_name,price,stock_quantity) VALUES (?,?,?,?)",[userSelection.name,userSelection.department,parseFloat(userSelection.price),parseInt(userSelection.quantity)]
            )
        })

}

function doTask(task){
    switch(task){
        case "View Products":
        viewProduct();
        connection.end();
        break;
        
        case "View Low Stock":
        viewLow(5);
        connection.end();
        break;
        
        case "Add Stock":
        inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "What is the ID of the product you want to add?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many are you adding?"
        }]).then(function(userSelection){
            addStock(userSelection);
        })
        break;
        
        case "Add New Product":
        addProduct();
        break;
    }
    
}

startUp();
