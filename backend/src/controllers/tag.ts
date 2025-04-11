import express from 'express';

import { Tag } from '../models';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';

const tagRouter = express.Router();
tagRouter.use(requireLogin);

tagRouter.get('/', async (req, res) => {
  const tags = await Tag.findAll();
  const tagsData = tags.map((tag) => tag.dataValues);
  res.send(tagsData);
});

tagRouter.post('/', requireAdmin, async (req, res) => {
  const { name } = req.body;
  const newTag = await Tag.create({ name });
  res.status(201).send(newTag);
});

tagRouter.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const tagToEdit = await Tag.findOne({ where: { id } });
  if (!tagToEdit) {
    res.status(404).send({ message: `Tag with id ${id} does not exist` });
    return;
  }

  tagToEdit.set({
    name: name,
  });
  await tagToEdit.save();
  res.status(200).send(tagToEdit);
});

tagRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findByPk(id);
  if (!tag) {
    res.status(404).send({ message: 'Tag not found' });
    return;
  }

  await tag.destroy();
  res.status(204).send();
});

export default tagRouter;
