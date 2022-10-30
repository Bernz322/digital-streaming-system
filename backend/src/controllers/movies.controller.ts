import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Movies} from '../models';
import {MoviesRepository} from '../repositories';

export class MoviesController {
  constructor(
    @repository(MoviesRepository)
    public moviesRepository: MoviesRepository,
  ) {}

  // TODO: Add search movie by title endpoint

  @post('/movies')
  @response(200, {
    description: 'Movies model instance',
    content: {'application/json': {schema: getModelSchemaRef(Movies)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movies, {
            title: 'NewMovies',
          }),
        },
      },
    })
    movies: Movies,
  ): Promise<Movies> {
    return this.moviesRepository.create(movies);
  }

  @get('/movies')
  @response(200, {
    description: 'Array of Movies model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Movies, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Movies) filter?: Filter<Movies>): Promise<Movies[]> {
    return this.moviesRepository.find(filter);
  }

  @get('/movies/{id}')
  @response(200, {
    description: 'Movies model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Movies, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Movies, {exclude: 'where'})
    filter?: FilterExcludingWhere<Movies>,
  ): Promise<Movies> {
    return this.moviesRepository.findById(id, filter);
  }

  @patch('/movies/{id}')
  @response(204, {
    description: 'Movies PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movies, {
            title: 'Update movie',
            exclude: ['id', 'title', 'yearReleased'],
            partial: true,
          }),
        },
      },
    })
    movies: Movies,
  ): Promise<void> {
    await this.moviesRepository.updateById(id, movies);
  }

  @del('/movies/{id}')
  @response(204, {
    description: 'Movies DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.moviesRepository.deleteById(id);
  }
}
