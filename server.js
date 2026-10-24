const express = require("express");
const cors = require('cors');
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dataFile = path.join(__dirname, "data", "items.json");


// Read items from JSON file
function readItems() {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
}


// GET all items
app.get("/api/items", (req, res) => {

    try {

        const items = readItems();

        res.json({
            success: true,
            count: items.length,
            items: items
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load items."
        });

    }

});


// GET a single item by ID
app.get("/api/items/:id", (req, res) => {

    try {

        const items = readItems();

        const id = Number(req.params.id);

        const item = items.find(item => item.id === id);

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Item not found."
            });

        }

        res.json({
            success: true,
            item: item
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load item."
        });

    }

});


// Search and category filtering
app.get("/api/search", (req, res) => {

    try {

        const items = readItems();

        const search =
            (req.query.search || "").toLowerCase().trim();

        const category =
            (req.query.category || "").toLowerCase().trim();


        const filteredItems = items.filter(item => {

            const matchesSearch =
                !search ||
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search);

            const matchesCategory =
                !category ||
                item.category.toLowerCase() === category;

            return matchesSearch && matchesCategory;

        });


        res.json({
            success: true,
            count: filteredItems.length,
            items: filteredItems
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to search items."
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});