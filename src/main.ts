import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* const config = new DocumentBuilder()
    .setTitle('Todo List')
    .setDescription('Todo list API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('todo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); */


  await app.listen(3000);
}
bootstrap();
