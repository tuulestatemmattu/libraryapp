import axios from 'axios';

import { SLACK_BOT_TOKEN, SLACK_WEBHOOK_URL } from './config';

interface slackUserResponse {
  ok: boolean;
  error: string;
  user: {
    id: string;
  };
}

interface slackConversationOpenResponse {
  ok: boolean;
  error: string;
  channel: {
    id: string;
  };
}

interface slackMessageResponse {
  ok: boolean;
  error: string;
}

export const sendPrivateMessage = async (email: string, message: string) => {
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

  if (!slackUserIdResponse.data.ok) {
    throw new Error(`Slack error: ${slackUserIdResponse.data.error}`);
  }

  const slackUserId = slackUserIdResponse.data.user.id;

  const slackConversationIdResponse = await axios.post<slackConversationOpenResponse>(
    'https://slack.com/api/conversations.open',
    { users: slackUserId },
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );

  if (!slackConversationIdResponse.data.ok) {
    throw new Error(`Slack error: ${slackConversationIdResponse.data.error}`);
  }

  const slackConversationId = slackConversationIdResponse.data.channel.id;

  const slackMessageResponse = await axios.post<slackMessageResponse>(
    'https://slack.com/api/chat.postMessage',
    { channel: slackConversationId, text: message },
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'content-type': 'application/json',
      },
    },
  );
  if (!slackMessageResponse.data.ok) {
    throw new Error(`Slack error: ${slackMessageResponse.data.error}`);
  }
};
interface SlackAttachment {
  author_name?: string;
  fallback: string;
  image_url?: string;
  fields?: { title: string; value: string; short?: boolean }[];
}

export const sendNotificationToChannel = async (payload: {
  text: string;
  attachments: SlackAttachment[];
}) => {
  try {
    const slackMessageResponse = await axios.post(SLACK_WEBHOOK_URL, payload);
    if (slackMessageResponse.status !== 200) {
      throw new Error(`Slack error: ${slackMessageResponse.statusText}`);
    }
  } catch (err) {
    console.error('Failed to send Slack notification:', err);
  }
};
