import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 4000
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () => console.log(`Server has been started on PORT: ${PORT}!`));
  } catch (error) {
    console.log(error)
  }

}
bootstrap();
