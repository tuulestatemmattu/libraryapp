import express from 'express';

import { NODE_ENV, STAGING } from '../util/config';
import { officeLocations } from '../util/officeLocations';

const locationRouter = express.Router();

locationRouter.get('/', (_req, res) => {
  if (NODE_ENV == 'development' || NODE_ENV == 'test' || STAGING) {
    const officeLocationsTesting = officeLocations.concat(['testing']);
    res.send(officeLocationsTesting);
  } else {
    res.send(officeLocations);
  }
});
