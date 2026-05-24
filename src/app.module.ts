import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextProcessingModule } from './text-processing/text-processing.module';
import { ClassificationModule } from './text-classification/classification.module';
import { IRModule } from './information-retrieval/information-retrieval.module';
import { CFModule } from './collaborative-filtering/collaborative-filtering.module';

@Module({
  imports: [
    TextProcessingModule,
    ClassificationModule,
    IRModule,
    CFModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
