import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [DatabaseModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
