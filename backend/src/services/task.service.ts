import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import * as cron from 'node-cron';
import {Task} from '../core/interfaces/models/task.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private apiBaseUrl: string;
  private readonly timezone: string = 'America/Tegucigalpa';

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async start() {
    //console.log(
    //   'Iniciando el servicio de programación de tareas para Honduras...',
    // );
    // await this.loadTasks();
    this.scheduleFetchJob();
  }

  // private async loadTasks() {
  //   try {
  //     const response = await axios.get(`${this.apiBaseUrl}/tasks`);
  //     const tasks: Task[] = response.data;
  //     tasks.forEach(task => this.scheduleTask(task));
  //   } catch (error) {
  //     console.error('Error al cargar tareas:', error);
  //   }
  // }

  // private scheduleTask(task: Task) {
  //   const now = new Date();
  //   const executionDate = new Date(task.executionDate);

  //   if (executionDate > now) {
  //     const cronExpression = this.dateToCron(executionDate);
  //     const scheduledTask = cron.schedule(
  //       cronExpression,
  //       () => {
  //         this.executeTask(task);
  //         this.tasks.delete(task.id);
  //       },
  //       {
  //         scheduled: true,
  //         timezone: this.timezone,
  //       },
  //     );

  //     this.tasks.set(task.id, scheduledTask);
  //     //console.log(
  //       `Tarea programada: ${task.nombre} para ${executionDate.toLocaleString('es-HN', {timeZone: this.timezone})}`,
  //     );
  //   } else {
  //     //console.log(`La tarea ${task.nombre} ya ha pasado y no será programada.`);
  //   }
  // }

  private executeTask(task: Task) {
    //console.log(`Ejecutando tarea: ${task.nombre}`);
    //console.log('Datos de la tarea:', task.data);
    //console.log(
    //   `Hora de ejecución: ${new Date().toLocaleString('es-HN', {timeZone: this.timezone})}`,
    // );
    // Aquí puedes agregar lógica adicional para manejar la tarea
  }

  private dateToCron(date: Date): string {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  }

  private scheduleFetchJob() {
    // Programar una tarea para buscar nuevas tareas cada hora
    cron.schedule(
      '0 * * * *',
      async () => {
        //console.log('Buscando nuevas tareas...');
        // await this.loadTasks();
      },
      {
        timezone: this.timezone,
      },
    );
  }
}
