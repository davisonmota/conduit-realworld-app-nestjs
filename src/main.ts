import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as process from 'node:process'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('RealWorld App Conduit')
    .setDescription('Conduit is a social blogging site.')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
