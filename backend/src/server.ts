import { app } from './app';
import { env } from './config/env';
import { connectDB } from './db/connect';

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Backend server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend', error);
    process.exit(1);
  }
};

void bootstrap();
