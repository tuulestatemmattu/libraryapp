# Setup slack integration
   
   ## Setup your own Slack App  

1.  Go to [your slack apps](https://api.slack.com/apps)
    1.  Click Create New App
    2.  Select 'From scratch'
    3.  Select your preferred App Name and Workspace
    4.  Go to OAuth & Permissions
    5. Set Bot Token scopes
        * channels:manage
        * chat:write
        * groups:write
        * im:write
        * mpim:write
        * users:read
        * users:read.email
    6. Scroll up to OAuth Tokens and install your app to workspace
    7. Set SLACK_BOT_TOKEN envioremental variable to Bot OAuth Token given by slack.