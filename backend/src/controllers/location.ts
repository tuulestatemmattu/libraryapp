import express from 'express';

import { officeLocations } from '../util/officeLocations';
import { NODE_ENV, STAGING } from './util/config';

const locationRouter = express.Router();

locationRouter.get('/', (_req, res) => {
  if (NODE_ENV == 'development' || NODE_ENV == 'test' || STAGING) {
    res.send(officeLocations.concat(['testing']));
  } else {
    res.send(officeLocations);
  }
});
