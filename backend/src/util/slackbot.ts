import axios from 'axios';

import { SLACK_BOT_TOKEN } from './config';

interface slackUserResponse {
  user: {
    id: string;
  };
}

interface slackConversationOpenResponse {
  channel: {
    id: string;
  };
}

interface slackMessageResponse {
  ok: boolean;
}

const sendPrivateMessage = async (email: string, message: string) => {
  const slackUserIdResponse = await axios.post<slackUserResponse>(
    'https://slack.com/api/users.lookupByEmail',
    { email: email },
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const slackUserId = slackUserIdResponse.data.user.id;

  const slackConversationId = (
    await axios.post<slackConversationOpenResponse>(
      'https://slack.com/api/conversations.open',
      { users: slackUserId },
      {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    )
  ).data.channel.id;

  const _slackMessageResponse = await axios.post<slackMessageResponse>(
    'https://slack.com/api/chat.postMessage',
    { channel: slackConversationId, text: message },
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'content-type': 'application/json',
      },
    },
  );
};

export default sendPrivateMessage;
