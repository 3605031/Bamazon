DROP DATABASE IF EXISTS fromJae_DB;
CREATE DATABASE fromJae_DB;
USE fromJae_DB;
CREATE TABLE warehouse(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price double(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

select * from fromJae_DB.warehouse;