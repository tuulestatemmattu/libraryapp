import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import axios from 'axios';

const { PORT, NODE_ENV, DATABASE_URL } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { User } = require('./models/user');

dotenv.config();

const app = express();
app.use(cors());

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('/api/ping', (_, res) => {
  res.send('pong');
});

app.get('/api/redirectUrl', async (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options: Record<string, any> = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
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

app.get('/oauth', async (req, res): Promise<any> => {
  try {
    const { code, error } = req.query;

    if (error) {
      console.error('Error from Google:', error);
      return res.status(400).send('OAuth Error');
    }

    if (code) {
      // Vaihtaa Googlelta saadun koodin tokeneihin
      const { id_token, access_token } = (
        await axios.post('https://oauth2.googleapis.com/token', {
          code: code,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
          grant_type: 'authorization_code',
        })
      ).data;
      //hakee tokeneilla käyttäjätiedot
      const googleUser = (
        await axios.get(
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

      await User.create({ ...user, google_id: googleUser.id });
      res.redirect('http://localhost:5173/profile');
    } else {
      res.status(400).send('No authorization code provided.');
    }
  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const start = async () => {
  if (!DATABASE_URL.includes('TODO')) {
    await connectToDatabase();
    User.sync();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
