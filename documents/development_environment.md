# Setting up a development environment
1. Install docker. For Ubuntu/Cubbli, [this guide](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) seems to work well.
2. Clone the project repository.
3. Set up Google OAuth API
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
4. Create a .env file to backend-directory
    * Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from previous step
    * Set GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3001/api/login/oauth
5. Open repository root on command line and run "docker compose up" to start the application in development environment.