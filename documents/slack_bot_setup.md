# Setup slack integration
   
   ## Setup your own Slack App  

1.  Go to [your slack apps](https://api.slack.com/apps)
2.  Click Create New App
3.  Select 'From scratch'
4.  Select your preferred App Name and Workspace
5.  Go to OAuth & Permissions
6. Set Bot Token scopes
    * channels:manage
    * chat:write
    * groups:write
    * im:write
    * mpim:write
    * users:read
    * users:read.email
7. Scroll up to OAuth Tokens and install your app to workspace
8. Set SLACK_BOT_TOKEN envioremental variable to Bot OAuth Token given by slack.
9. Go to Incoming Webhooks
10. Activate them and add an incoming webhook for the channel where you want the bot ot post notifications.
 11. Set SLACK_WEBHOOK_URL envioremental varuable to Webhook URl