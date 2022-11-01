import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Filter, repository} from '@loopback/repository';
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
import {Actors} from '../models';
import {ActorsRepository, MovieCastRepository} from '../repositories';
import {CustomResponse, CustomResponseSchema, validateName} from '../utils';

export class ActorsController {
  constructor(
    @repository(MovieCastRepository)
    public movieCastRepository: MovieCastRepository,
    @repository(ActorsRepository)
    public actorsRepository: ActorsRepository,
  ) {}

  @post('/actors')
  @response(200, {
    description: 'Returns newly added actor data',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async create(
    @requestBody({
      description:
        'Add new actor. Image and link fields is not required. Enter valid name fields. Gender must only be male or female and age should be greater than 0. (Requires token and admin role authorization)',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actors, {
            title: 'NewActors',
            exclude: ['id'],
          }),
        },
      },
    })
    actors: Omit<Actors, 'id'>,
  ): Promise<CustomResponse<{}>> {
    try {
      validateName(actors.firstName, 'firstName');
      validateName(actors.lastName, 'lastName');
      if (actors.gender !== 'male' && actors.gender !== 'female')
        throw new Error('Gender should only be either male or female');
      if (actors.age < 1)
        throw new Error('Actor age cannot be less than a year.');

      const actorCreated = await this.actorsRepository.create(actors);
      return {
        status: 'success',
        data: actorCreated,
        message: 'Successfully added a new actor.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Adding new Actor failed.',
      };
    }
  }

  @get('/actors')
  @response(200, {
    description: 'Returns array of all actors in the database.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async find(
    @param.filter(Actors) filter?: Filter<Actors>,
  ): Promise<CustomResponse<{}>> {
    try {
      const actors = await this.actorsRepository.find(filter);
      return {
        status: 'success',
        data: actors,
        message: 'Successfully fetched all actors in the database.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching all actors failed.',
      };
    }
  }

  @get('/actors/{id}')
  @response(200, {
    description:
      'Return all data of an actor together with the movies he/she casted (provide actor id).',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const actorData = await this.actorsRepository.findById(id, {
        include: ['moviesCasted'],
      });
      return {
        status: 'success',
        data: actorData,
        message: 'Successfully fetched actor data.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: 'Fetching actor data failed.',
      };
    }
  }

  @get('/search/actors/{searchKey}')
  @response(200, {
    description:
      'Returns an array of all actors based on the find filter (provide actor first name or last name as the search key).',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async searchByName(
    @param.path.string('searchKey') searchKey: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const searchParam = searchKey || '';
      const searchParams = [
        {firstName: {like: searchParam, options: 'i'}},
        {lastName: {like: searchParam, options: 'i'}},
      ];
      const filterObject = {
        where: {or: searchParams},
        order: ['firstName ASC'],
      };
      const actorsList = await this.actorsRepository.find(filterObject);
      return {
        status: 'success',
        data: actorsList,
        message: 'Successfully fetched actor data.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: 'Fetching actor data failed.',
      };
    }
  }

  @patch('/actors/{id}')
  @response(204, {
    description: 'Returns updated data of the edited actor.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description:
        'Update actor (provide actor id). (Requires token and admin role authorization)',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actors, {
            title: 'Update actor',
            exclude: ['id'],
            partial: true,
          }),
        },
      },
    })
    actors: Actors,
  ): Promise<CustomResponse<{}>> {
    // TODO: Populate actor casted movies and return it also.
    try {
      validateName(actors.firstName, 'firstName');
      validateName(actors.lastName, 'lastName');
      if (actors.gender !== 'male' && actors.gender !== 'female')
        throw new Error('Gender should only be either male or female');
      if (actors.age < 1)
        throw new Error('Actor age cannot be less than a year.');

      await this.actorsRepository.updateById(id, actors);
      const updatedActor = await this.actorsRepository.findById(id);

      return {
        status: 'success',
        data: updatedActor,
        message: 'Actor updated successfully',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Updating actor failed.',
      };
    }
  }

  @del('/actors/{id}')
  @response(204, {
    description: 'Returns deleted actor id.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const {count} = await this.movieCastRepository.count({
        actorId: id,
      });
      if (count > 0) {
        return {
          status: 'fail',
          data: null,
          message: `Actor cannot be deleted as he/she is casting ${count} movie/s.`,
        };
      } else {
        await this.actorsRepository.deleteById(id);
        return {
          status: 'success',
          data: id,
          message: 'Actor deleted successfully.',
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Deleting actor failed.',
      };
    }
  }
}