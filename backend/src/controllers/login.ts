import axios from 'axios';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import {
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
  JWT_SECRET,
  NODE_ENV,
} from '../util/config';

interface TokenResponse {
  id_token: string;
  access_token: string;
}

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options: Record<string, string> = {
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI ?? '',
    client_id: GOOGLE_CLIENT_ID ?? '',
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  // Returns the Google login page URL. After login, Google redirects to the /oauth endpoint.
  const queryString = new URLSearchParams(options).toString();
  const url = `${rootUrl}?${queryString.toString()}`;
  res.send(url);
});

router.get('/oauth', async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    console.error('Error from Google:', error);
    res.redirect(`${FRONTEND_URL}/`);
  }

  if (!code) {
    res.status(400).send('No authorization code provided.');
  }

  // Exchanges the code received from Google for tokens
  const { id_token, access_token } = (
    await axios.post<TokenResponse>('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code',
    })
  ).data;

  // Fetches user information (id, name, email, picture) with tokens
  const googleUser = (
    await axios.get<GoogleUser>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    )
  ).data;

  // create a user object and set it as a cookie
  const user = {
    name: googleUser.name,
    email: googleUser.email,
    picture: googleUser.picture,
    admin: false,
  };

  // Check if the user already exists in the database & admin status
  const foundUser = await User.findOne({ where: { google_id: googleUser.id } });
  user.admin = foundUser ? foundUser.admin : NODE_ENV === 'development';

  // If the user exists, update the user information. If not, create a new user.
  if (foundUser) {
    await User.update(user, { where: { google_id: googleUser.id } });
  } else {
    await User.create({ ...user, google_id: googleUser.id });
  }

  // Set JWT token and user cookies and redirect to frontend
  const token = jwt.sign({ id: googleUser.id, admin: user.admin }, JWT_SECRET);
  res.cookie('token', token);
  res.cookie('profile', JSON.stringify(user));
  res.redirect(FRONTEND_URL + '/');
});

export default router;
