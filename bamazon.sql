DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Jacket", "Apparel", 32.00, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Shirt", "Apparel", 16.00, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Shorts", "Apparel", 20.00, 36);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Socks", "Apparel", 8.00, 46);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Instant Coffee", "Food", 6.00, 108);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Dehydrated Ice Cream", "Food", 8.00, 42);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Trail Mix", "Food", 4.00, 84);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Sleeping Bag", "Gear", 48.00, 24);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Tent", "Gear", 96.00, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity  ) values ("Camp Stove", "Gear", 72.00, 6);