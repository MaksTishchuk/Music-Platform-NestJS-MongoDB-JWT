import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Music Platform')
      .setDescription('Music Platform API description')
      .setVersion('1.0')
      .addTag('Music Platform')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-swagger', app, document)

    await app.listen(PORT, () => console.log(`Server has been started on PORT: ${PORT}!`));
  } catch (error) {
    console.log(error)
  }

}
bootstrap();
