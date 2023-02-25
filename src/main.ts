import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as session from "express-session";
import * as passport from "passport";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000
    app.setGlobalPrefix('api')
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())
    // app.use(
    //   session({
    //     secret: 'maks-session-secret',
    //     saveUninitialized: false,
    //     resave: false,
    //     cookie: {
    //       maxAge: 60000
    //     }
    //   })
    // )
    // app.use(passport.initialize())
    // app.use(passport.session())

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
