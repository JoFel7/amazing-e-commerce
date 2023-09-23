const router = require("express").Router();
const { Category, Product } = require("../../models");

// Route to get all categories
router.get("/", async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: Product,
    }
    );
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to find categories!" });
  }
});

// Route to get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to find the category!" });
  }
});

// Route to create a new category
router.post("/", async (req, res) => {
  try {
    const newItem = await Category.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the category!" });
  }
});

// Route to update a specific category by ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedCount] = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedCount === 1) {
      res.json({ message: "Successfully updated category!" });
    } else {
      res.status(404).json({ error: "Category not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the category!" });
  }
});

// Route to delete a specific category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedCount === 1) {
      res.json({ message: "Successfully deleted category!" });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the category!" });
  }
});

module.exports = router;
