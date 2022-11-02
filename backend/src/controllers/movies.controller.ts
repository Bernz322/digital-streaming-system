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
        'Create new movie. Actors and image properties can be left blank. (Requires token and admin role authorization)',
      content: {
        'application/json': {
          schema: PostMovieSchema,
        },
      },
    })
    movies: Omit<PostMovieRequest, 'id'>,
  ): Promise<CustomResponse<{}>> {
    try {
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
        include: [{relation: 'movieReviews'}],
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
      movies?.movieReviews?.forEach(review => {
        if (review.isApproved) {
          sum += review?.rating;
        }
      });
      const reviewCount = movies?.movieReviews?.length || 1;

      return {
        status: 'success',
        data: {...movies, rating: sum / reviewCount},
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
      const searchParam = searchKey || '';
      const moviesList = await this.moviesRepository.find({
        where: {title: {like: searchParam}},
        include: [{relation: 'movieReviews'}],
      });
      return {
        status: 'success',
        data: moviesList,
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
        'Update movie image and cost (provide movie id). (Requires token and admin role authorization)',
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
      await this.moviesRepository.updateById(id, movies);
      const updatedMovie = await this.moviesRepository.findById(id);
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
    description: 'Returns deleted movie id.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
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
