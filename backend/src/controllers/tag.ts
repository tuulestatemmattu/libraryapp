import express from 'express';
import { Tag } from '../models';

const tagRouter = express.Router();

tagRouter.get('/', async (req, res) => {
    const tags = await Tag.findAll();
    const tagsData = tags.map((tag) => tag.dataValues);

    res.send(tagsData);
});

tagRouter.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const newTag = await Tag.create({ name });

    res.status(201).send(newTag);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

export default tagRouter;
