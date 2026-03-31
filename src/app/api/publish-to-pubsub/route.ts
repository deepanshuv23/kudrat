import { NextRequest, NextResponse } from 'next/server';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub({
    projectId: 'nightjar-425308',
    keyFilename: 'ServiceKey_GoogleCloud.json',
  });
const topicName = 'your-topic';

export async function POST(request: NextRequest) {
  const { fileName, fileContent } = await request.json();

  if (!fileName || !fileContent) {
    return NextResponse.json({ error: 'Missing fileName or fileContent' }, { status: 400 });
  }

  const messageData = JSON.stringify({
    fileName,
    fileContent
  });

  try {
    console.log(` publishing`);

    const messageId = await pubSubClient.topic(topicName).publish(Buffer.from(messageData));
    console.log(`Message ${messageId} published.`);
    return NextResponse.json({ message: 'File published successfully', messageId });
  } catch (error) {
    console.error('Error publishing message:', error);
    return NextResponse.json({ error: 'Failed to publish message' }, { status: 500 });
  }
}