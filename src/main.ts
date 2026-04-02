import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RootConfigService } from './configs/root-config.service';
import setupGlobals from './common/setup-globals';
import setupSwagger from './common/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  setupGlobals(app);
  const config = app.get(RootConfigService);
  await app.listen(config.server.port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
