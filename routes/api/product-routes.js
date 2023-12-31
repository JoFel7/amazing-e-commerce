const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Error handling function
const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};

// Route to get all products with associated Category and Tag data
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Tag],
    });
    res.json(products);
  } catch (error) {
    handleServerError(res, error);
  }
});

// Route to get a specific product by ID with associated Category and Tag data
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId, {
      include: [Category, Tag],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    handleServerError(res, error);
  }
});

// Route to create a new product
router.post("/", async (req, res) => {
  try {
    const { product_name, price, description, tagIds } = req.body;
    console.log('Name:', product_name); // Correct variable name
    
    const newProduct = await Product.create({
      product_name,  // Use the correct variable name
      price,
      description,
    });

    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    handleServerError(res, error);
  }
});

// Route to update a specific product by ID
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { product_name, price, stock, tagIds } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.product_name = product_name;
    product.price = price;
    product.stock = stock;

    await product.save();

    if (tagIds && tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: productId },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: productId,
          tag_id,
        }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.json(product);
  } catch (error) {
    handleServerError(res, error);
  }
});

// Route to delete a specific product by ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;
