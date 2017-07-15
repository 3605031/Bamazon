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

connection.query("select * from fromjae_db.departments",function(err,res){
    res.forEach(function(product){
        t.cell("Department Id",product.department_id);
        t.cell("Department name",product.department_name);
        t.cell("OverHead Cost",product.over_head_costs);
        t.cell("Product Sales",product.product_sales);
        t.cell("Profit",product.product_sales-product.over_head_costs)
        t.newRow();
    })
    
    console.log(t.toString());
})