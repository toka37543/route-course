const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = 5550;

let connection;

app.use(express.json());

async function initializeDB() {
    try {
        const db = await mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "asdf@1234"
        });

        await db.execute("CREATE DATABASE IF NOT EXISTS workshop");
        await db.end();

        connection = mysql.createPool({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "asdf@1234",
            database: "workshop",
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        });

        await connection.execute("SELECT 1 + 1 AS result");

        // The referenced table must be created first.
        await connection.execute(`
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(55) NOT NULL,
    contactNumber VARCHAR(255) NOT NULL
)
`);

        await connection.execute(`
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(55) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT NOT NULL DEFAULT 0,
    supplierId INT,
    CONSTRAINT fk_products_supplier
FOREIGN KEY (supplierId)
REFERENCES suppliers(id)
ON DELETE SET NULL
)
`);

        await connection.execute(`
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantitySold INT NOT NULL,
    saleDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    productId INT NOT NULL,
    CONSTRAINT fk_sales_product
FOREIGN KEY (productId)
REFERENCES products(id)
ON DELETE CASCADE
)
`);

        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Database failed to connect:", error);
        throw error;
    }
}

const products = {
    async createProduct(product) {
        const query = `
INSERT INTO products (
    name,
    price,
    stockQuantity,
    supplierId
)
VALUES (?, ?, ?, ?)
    `;

        const [result] = await connection.execute(query, [
            product.name,
            product.price,
            product.stockQuantity ?? 0,
            product.supplierId ?? null
        ]);

        return result;
    },

    async addCategory(category) {
        const query = `INSERT INTO products (category)
VALUES (?)`;
        const [result] = await connection.execute(query, [category]);
        return result
    },



    async retrieveAll() {
        const query = `
SELECT
id,
    name,
    price,
    stockQuantity,
    supplierId
FROM products
    `;

        const [rows] = await connection.execute(query);
        return rows;
    },

    async retrieveProduct(id) {
        const query = `
SELECT
id,
    name,
    price,
    stockQuantity,
    supplierId
FROM products
WHERE id = ?
    `;

        const [rows] = await connection.execute(query, [id]);
        return rows[0] ?? null;
    },

    async updateProduct(id, product) {
        const query = `
    UPDATE products
SET
name = ?,
    price = ?,
    stockQuantity = ?,
    supplierId = ?
        WHERE id = ?
            `;

        const [result] = await connection.execute(query, [
            product.name,
            product.price,
            product.stockQuantity ?? 0,
            product.supplierId ?? null,
            id
        ]);

        return result;
    },

    async deleteProduct(id) {
        const query = `
            DELETE FROM products
WHERE id = ?
    `;
        const [result] = await connection.execute(query, [id]);
        return result;
    },

    async deleteCategory() {
        const query = `
    ALTER TABLE products DROP COLUMN category
    `;
        const [result] = await connection.execute(query);
        return result;
    }



};

app.post('/products', async (req, res) => {
   try {
       const product = req.body;
       const result = await products.createProduct(product);
       return res.status(201).json({message: "Product created"});
   } catch (error) {
       return res.status(500).json({
           message: "Failed to create product",error
   });
   }
});

app.post('/products', async (req, res) => {
    try {
        const category = req.body;
        const result = await products.addCategory(category);
        return res.status(201).json({message: "Category created"});
    }catch (e) {
        return res.status(500).json({message: "Failed to create category",error: e});
    }
})

app.get("/products", async (req, res) => {
    try {
        const result = await products.retrieveAll();
        return res.status(200).json({result});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve products",error
        });
    }
});
app.get("/products/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const result = await products.retrieveProduct(id);
        return res.status(200).json({message: "done",result});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve products", error
        })
    }
});
app.put("/products/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const product = req.body;
        const result = await products.updateProduct(id, product);
        const updatedItem = await products.retrieveProduct(id);
        return res.status(200).json({message: "product updated successfully", updatedItem});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update product", error
        })
    }
})
app.delete("/products/:id", async (req, res) => {
   try {
       const { id } = req.params;
       const result = await products.deleteProduct(id);
       return res.status(200).json({message :"product deleted successfully",result});
   }catch (error) {
       return res.status(500).json({
           message: "Failed to delete product",error
       })
   }
})

app.delete("/products/category", async (req, res) => {
    try{
        const result = await products.deleteCategory();
        return res.status(200).json({message : "category deleted successfully",result});
    } catch (e) {
        return res.status(500).json({message: "Failed to delete category", error: e});
    }
})


const suppliers = {
    async createSupplier(product) {
        const query = `
INSERT INTO  suppliers (
    name,
    contentNumber
)
VALUES (?, ?)
    `;

        const [result] = await connection.execute(query, [
            supplier.name,
            supplier.contentNumber
        ]);

        return result;
    },

    async retrieveAll() {
        const query = `
SELECT
id,
    name,
    contentNumber,

    FROM suppliers
    `;

        const [rows] = await connection.execute(query);
        return rows;
    },

    async updateSupplier(id, supplier) {
        const query = `
UPDATe suppliers
SET
name = ?,
    contentNumber = ?,

    WHERE id = ?
    `;

        const [result] = await connection.execute(query, [
            supplier.name,
            supplier. contentNumber,

        ]);

        return result;
    },

    async deleteSupplier(id) {
        const query = `
    DELETE FROM suppliers
WHERE id = ?
    `;
        const [result] = await connection.execute(query, [id]);
        return result;
    }
};



app.post('/suppliers', async (req, res) => {
    try {
        const supplier = req.body;
        const result = await suppliers.createSupplier(supplier);
        return res.status(201).json({message: "supplier created"});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create supplier",error
        });
    }
});
app.get("/suppliers", async (req, res) => {
    try {
        const result = await suppliers.retrieveAll();
        return res.status(200).json({result});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve supplier",error
        });
    }
});
app.put("/suppliers/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const supplier = req.body;
        const result = await suppliers.updateSupplier(id, supplier);
        const updatedItem = await suppliers.retrieveSupplier(id);
        return res.status(200).json({message: "supplier updated successfully", updatedItem});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update supplier", error
        })
    }
})
app.delete("/suppliers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await suppliers.deleteProduct(id);
        return res.status(200).json({message :"supplier deleted successfully",result});
    }catch (error) {
        return res.status(500).json({
            message: "Failed to delete supplier",error
        })
    }
})




const sales = {
    async createSale(sale) {
        const query = `
    INSERT INTO sales (saleDate,
    QuantitySold,
    productId)
VALUES (?, ?, ?)
    `;

        const [result] = await connection.execute(query, [
            sale.saleDate,
            sale.QuantitySold ?? 0,
            sale.productId
        ]);

        return result;
    },

    async retrieveAll() {
        const query = `
SELECT id,
    saleDate,
    QuantitySold,
    productId
FROM sales
    `;

        const [rows] = await connection.execute(query);
        return rows;
    },

    async retrieveSale(id) {
        const query = `
SELECT id,
    saleDate,
    QuantitySold,
    productId
FROM sales
WHERE id = ?
    `;

        const [rows] = await connection.execute(query, [id]);
        return rows[0] ?? null;
    },
}

app.post('/sales', async (req, res) => {
    try {
        const sale = req.body;
        const result = await sales.createSale(sale);
        return res.status(201).json({message: "sale created"});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create sale",error
        });
    }
});
app.get("/sales", async (req, res) => {
    try {
        const result = await sales.retrieveAll();
        return res.status(200).json({result});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve sales",error
        });
    }
});
app.get("/sales/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const result = await sales.retrieveSale(id);
        return res.status(200).json({message: "done",result});
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve sales", error
        })
    }
});









app.get('/init', async (req, res) => {
    await seedScript();
    res.status(200).json({
        message : "Init successfully",
    })
})
app.put("/updateBreadPrice", async (req, res) => {
    const query = `UPDATE suppliers SET PRICE = 25 WHERE NAME = "Bread"`
    const [result] = await connection.execute(query)
    return res.status(200).json({message: "updating bread price"});
})
app.delete("/deleteEggs", async (req, res) => {
    const query = `DELETE FROM suppliers WHERE NAME = "Eggs"`;
    const [result] = await connection.execute(query)
    return res.status(200).json({message: " Eggs deleted successfully"});
})


app.get("/totalQuantitySold", async (req, res) => {
    const query = `
SELECT products.name, SUM(sales.quantitySold) AS totalQuantitySold
FROM products
JOIN sales ON products.id = sales.productId
GROUP BY products.id, products.name
    `
    const [result] = await connection.execute(query)
    return res.status(200).json({result});
})

app.get("/highestStockQuantity", async (req, res) => {
    const query = `
SELECT *
FROM products
ORDER BY stockQuantity DESC
LIMIT 1
    `
    const [result] = await connection.execute(query)
    return res.status(200).json({result});
})

app.get("/suppliersStartWithF", async (req, res) => {
    const query = `
SELECT *
FROM suppliers
WHERE name LIKE "F%"
    `
    const [result] = await connection.execute(query)
    return res.status(200).json({result});
})

app.get("/productsNeverSold", async (req, res) => {
    const query = `
SELECT products.*
FROM products
LEFT JOIN sales ON products.id = sales.productId
WHERE sales.id IS NULL
    `
    const [result] = await connection.execute(query)
    return res.status(200).json({result});
})

app.get("/allSalesDetails", async (req, res) => {
    const query = `
SELECT products.name AS productName,
    sales.quantitySold,
    sales.saleDate
FROM sales
JOIN products ON sales.productId = products.id
    `
    const [result] = await connection.execute(query)
    return res.status(200).json({result});
})

app.post("/createStoreManager", async (req, res) => {
    const query1 = `CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY '1234'`
    await connection.query(query1)

    const query2 = `GRANT SELECT, INSERT, UPDATE ON workshop.* TO 'store_manager'@'localhost'`
    await connection.query(query2)

    return res.status(200).json({message: "store_manager created successfully"});
})

app.delete("/revokeUpdatePermission", async (req, res) => {
    const query = `REVOKE UPDATE ON workshop.* FROM 'store_manager'@'localhost'`
    await connection.query(query)
    return res.status(200).json({message: "UPDATE permission revoked successfully"});
})

app.post("/grantDeletePermission", async (req, res) => {
    const query = `GRANT DELETE ON workshop.sales TO 'store_manager'@'localhost'`
    await connection.query(query)
    return res.status(200).json({message: "DELETE permission granted successfully"});
})


app.use((req, res) => {
    return res.status(404).json({
        message: "Invalid route"
    });
});


async function bootstrap() {
    try {
        await initializeDB();

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    } catch (error) {
        console.error("Application failed to run:", error);
    }
}
async function seedScript() {
    const query1 = `
INSERT INTO suppliers
(name, contactNumber) VALUES (?, ?)
    `;
    const supplier = await connection.execute(query1, [
        'FreshFoods', "01001234567"
    ]);
    // create Milk 15, Bread 10, Eggs 20
    const query2 = `INSERT INTO products (name, price, stockQuantity) VALUES (?, ?, ?)`
    const milk = await connection.execute(query2, [
        'Milk',15.00,50
    ])
    const bread = await connection.execute(query2, [
        'Bread',10.00,30
    ])
    const eggs = await connection.execute(query2, [
        "Eggs",20.00,40
    ])

    const query3 = `INSERT INTO sales (quantitySold, productId,saleDate) VALUES (?, ?, ?)`
    await connection.execute(query3, [
        2, milk[0].insertId, "2025-05-20"
    ])

}

bootstrap();




