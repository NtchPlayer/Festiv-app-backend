import { Module } from '@nestjs/common';

// Service
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication])],
  providers: [PublicationsService],
  controllers: [PublicationsController],
  exports: [PublicationsService],
})
export class PublicationsModule {}
