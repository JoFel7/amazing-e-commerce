const router = require("express").Router();
const { Tag, Product } = require("../../models");

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: Product,
    });
    res.json(tags);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: Product,
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json(tag);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tag_name } = req.body;
    const newTag = await Tag.create({ tag_name });
    res.status(201).json(newTag);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body;

    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    tag.tag_name = tag_name;
    await tag.save();

    res.json(tag);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await tag.destroy();

    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = router;
