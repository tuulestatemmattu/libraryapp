
import { Request, Response, Router } from 'express';
import axios from 'axios';

import User from '../models/user';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI 
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

router.get('/', async (req: Request, res: Response) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options: Record<string, any> = {
    redirect_uri:GOOGLE_OAUTH_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    response_type: 'code',

    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const queryString = new URLSearchParams(options).toString();

  const url = `${rootUrl}?${queryString.toString()}`;

  res.send(url);
  //palauttaa Googlen kirjautumissivun renderöivän url:n. Kun käyttäjä kirjautuu google lähettää tiedot /oauth endpointtiin
});

router.get('/oauth', async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, error } = req.query;

    if (error) {
      console.error('Error from Google:', error);
      return res.status(400).send('OAuth Error');
    }

    if (code) {
      // Vaihtaa Googlelta saadun koodin tokeneihin
      const { id_token, access_token } = (
        await axios.post<TokenResponse>('https://oauth2.googleapis.com/token', {
          code: code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
          grant_type: 'authorization_code',
        })
      ).data;

      //hakee tokeneilla käyttäjätiedot
      const googleUser = (
        await axios.get<GoogleUser>(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        )
      ).data;

      // luo käyttäjä olion ja asettaa sen keksiksi
      const user = {
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      };
      console.log(user);
      res.cookie('user', JSON.stringify(user));
      
      try {
        await User.create({ ...user, google_id: googleUser.id });
      } catch {
        (error: any) => {
          console.log(error);
        };
      }
      res.redirect('http://localhost:5173/profile');
    } else {
      res.status(400).send('No authorization code provided.');
    }
  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;