import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProgramacionTareas} from '../models';
import {ProgramacionTareasRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class ProgramacionTareasController {
  constructor(
    @repository(ProgramacionTareasRepository)
    public programacionTareasRepository : ProgramacionTareasRepository,
  ) {}

  @post('/programacion-tareas')
  @response(200, {
    description: 'ProgramacionTareas model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProgramacionTareas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramacionTareas, {
            title: 'NewProgramacionTareas',
            exclude: ['id'],
          }),
        },
      },
    })
    programacionTareas: Omit<ProgramacionTareas, 'id'>,
  ): Promise<ProgramacionTareas> {
    return this.programacionTareasRepository.create(programacionTareas);
  }

  @get('/programacion-tareas/count')
  @response(200, {
    description: 'ProgramacionTareas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProgramacionTareas) where?: Where<ProgramacionTareas>,
  ): Promise<Count> {
    return this.programacionTareasRepository.count(where);
  }

  @get('/programacion-tareas')
  @response(200, {
    description: 'Array of ProgramacionTareas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProgramacionTareas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProgramacionTareas) filter?: Filter<ProgramacionTareas>,
  ): Promise<ProgramacionTareas[]> {
    return this.programacionTareasRepository.find(filter);
  }

  @patch('/programacion-tareas')
  @response(200, {
    description: 'ProgramacionTareas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramacionTareas, {partial: true}),
        },
      },
    })
    programacionTareas: ProgramacionTareas,
    @param.where(ProgramacionTareas) where?: Where<ProgramacionTareas>,
  ): Promise<Count> {
    return this.programacionTareasRepository.updateAll(programacionTareas, where);
  }

  @get('/programacion-tareas/{id}')
  @response(200, {
    description: 'ProgramacionTareas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProgramacionTareas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProgramacionTareas, {exclude: 'where'}) filter?: FilterExcludingWhere<ProgramacionTareas>
  ): Promise<ProgramacionTareas> {
    return this.programacionTareasRepository.findById(id, filter);
  }

  @patch('/programacion-tareas/{id}')
  @response(204, {
    description: 'ProgramacionTareas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramacionTareas, {partial: true}),
        },
      },
    })
    programacionTareas: ProgramacionTareas,
  ): Promise<void> {
    await this.programacionTareasRepository.updateById(id, programacionTareas);
  }

  @put('/programacion-tareas/{id}')
  @response(204, {
    description: 'ProgramacionTareas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() programacionTareas: ProgramacionTareas,
  ): Promise<void> {
    await this.programacionTareasRepository.replaceById(id, programacionTareas);
  }

  @del('/programacion-tareas/{id}')
  @response(204, {
    description: 'ProgramacionTareas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.programacionTareasRepository.deleteById(id);
  }
}
