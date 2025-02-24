# Setting up a development environment
1. Install docker.
   * If you are using Cubbli, read [these instructions](https://version.helsinki.fi/cubbli/cubbli-help/-/wikis/sudo) carefully. Then, follow [these steps](https://version.helsinki.fi/cubbli/cubbli-help/-/wikis/Docker). Finally, run
     
      ```
         sudo apt install docker-compose-plugin
      ```
      or you can install docker compose plugin manually by following instructions from [here](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually)
   * For Ubuntu, [this guide](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) seems to work well. After installation, add your user to docker group:
     
      ```
         sudo groupadd docker
         sudo usermod -aG docker $USER
         newgrp docker
      ```
3. Clone the project repository.
4. Set up Google OAuth API
    * Go to [Google API Console](https://console.cloud.google.com/apis/dashboard)
    * Create a new project
    * Go to *OAuth consent screen*
        * Select "External" user type, App name, Support email and Developer email
        * Select ".../auth/userinfo.email", ".../auth/userinfo.profile" and "openid" scopes
        * Save and continue -> Save and continue -> Back to dashboard
    * Go to *Credentials*
        * Press  Create credentials -> OAuth client ID
        * Select "Web application"
        * Select App bname
        * Add "http://localhost:3001" as Authorized JavaScript origin
        * Add "http://localhost:3001/api/login/oauth" as Authorized redirect URL
    * Now you should have a Client ID and Client secret
5. Create a .env file to backend-directory
    * Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from previous step
    * Set GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/api/login/oauth
    * Set JWT_SECRET to some value
6. Open repository root on command line and run "docker compose up" to start the application in development environment.
