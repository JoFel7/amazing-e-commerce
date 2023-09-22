const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll();
    res.json(allCategories);
} catch (error) {
    res.status(500).json({ error: 'Failed to find categories!' });
}
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
        res.json(category);
    } else {
        res.status(404).json({ error: 'Category not found!' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to find the category!' });
}
});

router.post('/', async (req, res) => {
  try {
    const newItem = await Category.create(req.body);
    res.status(201).json(newItem);
} catch (error) {
    res.status(500).json({ error: 'Failed to create the category!' });
}
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Category.update(req.body, {
        where: { id: req.params.id },
    });
    if (updatedCount === 1) {
        res.json({ message: 'Successfully updated category!' });
    } else {
        res.status(404).json({ error: 'Category not found!' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to update the category!' });
}
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Category.destroy({
        where: { id: req.params.id },
    });
    if (deletedCount === 1) {
        res.json({ message: 'Successfully deleted category!' });
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to delete the category!' });
}
});

module.exports = router;
