import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('RealWorld App Conduit')
    .setDescription('Conduit is a social blogging site')
    .setVersion('1.0')
    .build()

  const docmentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, docmentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
