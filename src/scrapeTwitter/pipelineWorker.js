import { parentPort, workerData } from 'worker_threads';
import TwitterPipeline from './twitterPipeline.js';

export const runPipeline = async (workerData) => {
  const { username, twitterUsername } = workerData;
  try {
    const pipeline = new TwitterPipeline(twitterUsername);
    await pipeline.run();

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];

    // Send completion message to the parent thread
    parentPort?.postMessage({ username, status: 'completed', createdAt: formattedDate });
  } catch (error) {
    console.error(`Error in worker for ${username} job :`, error);

    // Notify parent thread of failure
    parentPort?.postMessage({ username, status: 'failed', createdAt: formattedDate });
  }
};

runPipeline(workerData);