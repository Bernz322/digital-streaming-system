import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {repository} from '@loopback/repository';
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
import {
  CustomResponse,
  CustomResponseSchema,
  isValidUrl,
  isValidName,
  isNotNull,
} from '../utils';

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
        'Add new actor. Enter valid name fields. Gender must only be male or female and age should be greater than 0. (Requires token and admin role authorization)',
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
      // Validate input fields
      isValidName(actors.firstName, 'firstName');
      isValidName(actors.lastName, 'lastName');
      if (actors.gender !== 'male' && actors.gender !== 'female')
        throw new Error('Gender should only be either male or female');
      if (actors.age < 1 || !actors.age)
        throw new Error('Actor age cannot be less than a year.');
      isValidUrl(actors.image, 'actor image');
      isValidUrl(actors.link, 'actor link');

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
  async find(): Promise<CustomResponse<{}>> {
    try {
      const actors = await this.actorsRepository.find({
        include: ['moviesCasted'],
      });
      const toReturn = actors.map(actor => {
        return {...actor, moviesCasted: actor?.moviesCasted?.length};
      });
      return {
        status: 'success',
        data: toReturn,
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
        include: [
          {
            relation: 'moviesCasted',
            scope: {
              include: [{relation: 'movieReviews'}],
            },
          },
        ],
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
        message: error ? error.message : 'Fetching actor data failed.',
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
        include: ['moviesCasted'],
      };
      const actorsList = await this.actorsRepository.find(filterObject);
      const toReturn = actorsList.map(actor => {
        return {...actor, moviesCasted: actor?.moviesCasted?.length};
      });
      return {
        status: 'success',
        data: toReturn,
        message: 'Successfully fetched actor data.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching actor data failed.',
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
    try {
      // Validate input fields
      if (actors.hasOwnProperty('firstName')) {
        isNotNull(actors.firstName, 'firstName');
        isValidName(actors.firstName, 'firstName');
      }
      if (actors.hasOwnProperty('lastName')) {
        isNotNull(actors.lastName, 'lastName');
        isValidName(actors.lastName, 'lastName');
      }
      if (actors.hasOwnProperty('gender')) {
        if (actors.gender !== 'male' && actors.gender !== 'female')
          throw new Error('Gender should only be either male or female');
      }
      if (actors.hasOwnProperty('age')) {
        if (actors.age < 1 || !actors.age)
          throw new Error('Actor age cannot be less than a year.');
      }
      if (actors.hasOwnProperty('image')) {
        isNotNull(actors.image, 'image');
        isValidUrl(actors.image, 'actor image');
      }
      if (actors.hasOwnProperty('link')) {
        isNotNull(actors.link, 'link');
        isValidUrl(actors.link, 'actor link');
      }

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
    description:
      'Returns deleted actor id. (Requires token and admin role authorization)',
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
