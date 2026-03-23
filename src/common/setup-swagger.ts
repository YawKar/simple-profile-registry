import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Simple Profile Registry')
    .setDescription('The stage 1 api')
    .setVersion('1.0')
    .addBearerAuth()
    .addBearerAuth({ type: 'http', name: 'jwt-refresh' })
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger-ui', app, documentFactory);
}
