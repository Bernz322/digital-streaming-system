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
import _ from 'lodash';
import {Movies} from '../models';
import {
  MovieCastRepository,
  MoviesRepository,
  ReviewsRepository,
} from '../repositories';
import {
  CustomResponse,
  CustomResponseSchema,
  isNotEmpty,
  isNotNull,
  isValidUrl,
  PostMovieRequest,
  PostMovieSchema,
} from '../utils';

export class MoviesController {
  constructor(
    @repository(MovieCastRepository)
    public movieCastRepository: MovieCastRepository,
    @repository(ReviewsRepository)
    public reviewsRepository: ReviewsRepository,
    @repository(MoviesRepository)
    public moviesRepository: MoviesRepository,
  ) {}

  @post('/movies')
  @response(200, {
    description: 'Returns newly created movie.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async create(
    @requestBody({
      description:
        'Create new movie. All fields are required. (Requires token and admin role authorization)',
      content: {
        'application/json': {
          schema: PostMovieSchema,
        },
      },
    })
    movies: Omit<PostMovieRequest, 'id'>,
  ): Promise<CustomResponse<{}>> {
    try {
      // Validate input fields
      isNotEmpty(movies.title, 'movie title');
      isNotEmpty(movies.description, 'movie description');
      if (movies.cost < 0 || !movies.cost)
        throw new Error('Movie budget cost cannot be less than 0.');
      if (movies.yearReleased < 0 || !movies.yearReleased)
        throw new Error('Movie year released cannot be of negative value.');
      isValidUrl(movies.image, 'movie image');
      if (movies.actors.length <= 0 || !movies.actors)
        throw new Error('Movie cannot have 0 actor.');

      const movie = await this.moviesRepository.create(
        _.omit(movies, ['actors']),
      );

      if (movies.actors && movies.actors.length > 0) {
        await this.movieCastRepository.createAll([
          ...movies.actors.map(actorId => ({actorId, movieId: movie.id})),
        ]);
      }

      return {
        status: 'success',
        data: movie,
        message: 'Movie successfully created.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Creating movie failed.',
      };
    }
  }

  @get('/movies')
  @response(200, {
    description: 'Returns an array of all movies in the database.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async find(
    @param.filter(Movies) filter?: Filter<Movies>,
  ): Promise<CustomResponse<{}>> {
    try {
      const movies = await this.moviesRepository.find({
        ...filter,
        include: [
          {
            relation: 'movieReviews',
            scope: {
              where: {isApproved: true},
            },
          },
        ],
      });

      return {
        status: 'success',
        data: movies,
        message: 'Successfully fetched all movies.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching all movies failed.',
      };
    }
  }

  @get('/movies/{id}')
  @response(200, {
    description: 'Returns movie data together with movie actors.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const movies = await this.moviesRepository.findById(id, {
        include: [
          {
            relation: 'movieCasters',
          },
          {
            relation: 'movieReviews',
            scope: {
              where: {isApproved: true},
              include: [
                {
                  relation: 'userReviewer',
                  scope: {
                    fields: {
                      role: false,
                      isActivated: false,
                      dateCreated: false,
                    },
                  },
                },
              ],
            },
          },
        ],
      });
      let sum = 0;
      let length = 0;
      movies?.movieReviews?.forEach(review => {
        if (review.isApproved) {
          sum += review?.rating;
          length++;
        }
      });
      const reviewCount = length || 1;
      return {
        status: 'success',
        data: {
          ...movies,
          rating: parseFloat((sum / reviewCount || 0).toFixed(2)),
        },
        message: 'Successfully fetched movie data.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching movie failed.',
      };
    }
  }

  @get('/search/movies/{searchKey}')
  @response(200, {
    description:
      'Returns an array of all movies based on the find filter (provide movie title as the search key).',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async searchByName(
    @param.path.string('searchKey') searchKey: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const searchParams = [{title: {like: searchKey, options: 'i'}}];
      const filterObject = {
        where: {or: searchParams},
        order: ['title ASC'],
        include: [
          {
            relation: 'movieReviews',
            scope: {
              where: {isApproved: true},
            },
          },
        ],
      };

      const moviesList = await this.moviesRepository.find(filterObject);
      return {
        status: 'success',
        data: moviesList,
        message: 'Successfully fetched movies.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: 'Fetching movies failed.',
      };
    }
  }

  @patch('/movies/{id}')
  @response(204, {
    description: 'Returns updated data of the edited movie.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description:
        'Update movie image, description and cost (provide movie id). (Requires token and admin role authorization)',
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
  ): Promise<CustomResponse<{}>> {
    try {
      // Validate input fields
      if (Object.prototype.hasOwnProperty.call(movies, 'description')) {
        isNotNull(movies.description, 'movie description');
      }

      if (Object.prototype.hasOwnProperty.call(movies, 'cost')) {
        if (movies.cost < 0 || !movies.cost)
          throw new Error('Movie budget cost cannot be less than 0.');
      }

      if (Object.prototype.hasOwnProperty.call(movies, 'image')) {
        isNotNull(movies.image, 'image');
        isValidUrl(movies.image, 'movie image');
      }

      await this.moviesRepository.updateById(id, movies);
      const updatedMovie = await this.moviesRepository.findById(id, {
        include: [{relation: 'movieReviews'}],
      });
      return {
        status: 'success',
        data: updatedMovie,
        message: 'Movie updated successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Updating movie failed.',
      };
    }
  }

  @del('/movies/{id}')
  @response(204, {
    description:
      'Returns deleted movie id. (Requires token and admin role authorization)',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const movieToDelete = await this.moviesRepository.findById(id);
      const eligibleForDeletion =
        new Date().getFullYear() - movieToDelete.yearReleased >= 1;

      if (!eligibleForDeletion)
        throw new Error('Movies only 1 year older can be deleted.');

      await this.moviesRepository.deleteById(id);
      await this.movieCastRepository.deleteAll({movieId: id});
      await this.reviewsRepository.deleteAll({movieId: id});
      return {
        status: 'success',
        data: id,
        message: 'Movie deleted successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Deleting movie failed.',
      };
    }
  }
}
