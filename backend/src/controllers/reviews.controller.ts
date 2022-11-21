import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  post,
  param,
  getModelSchemaRef,
  patch,
  get,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Reviews} from '../models';
import {ReviewsRepository} from '../repositories';
import {CustomResponse, CustomResponseSchema} from '../utils';

export class ReviewsController {
  constructor(
    @repository(ReviewsRepository)
    public reviewsRepository: ReviewsRepository,
  ) {}

  @post('/reviews')
  @response(200, {
    description: 'Returns newly added movie review.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER)
    currentLoggedUser: UserProfile,
    @requestBody({
      description:
        'Add new review to a movie. All fields are required. (Requires token).',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reviews, {
            title: 'NewReviews',
            exclude: ['id', 'datePosted', 'isApproved', 'userId'],
          }),
        },
      },
    })
    reviews: Omit<Reviews, 'id'>,
  ): Promise<CustomResponse<{}>> {
    try {
      // Validate input fields
      if (!reviews.description && reviews.description === '')
        throw new Error('Description is required.');
      if (!reviews.movieId && reviews.movieId === '')
        throw new Error('Movie ID to review is required.');
      if (reviews.rating > 5 || reviews.rating < 1)
        throw new Error('Rating can only be between 1 - 5.');

      if (currentLoggedUser.role === 'admin')
        throw new Error('As an admin, you cannot add reviews.');

      const userMovieReviewChecker = await this.reviewsRepository.find({
        where: {
          and: [{userId: currentLoggedUser.id}, {movieId: reviews.movieId}],
        },
      });
      if (userMovieReviewChecker?.length > 0)
        throw new Error('You can only review once per movie.');
      const reviewToSave = {
        ...reviews,
        userId: currentLoggedUser.id,
      };
      await this.reviewsRepository.create(reviewToSave);
      return {
        status: 'success',
        data: null,
        message: 'Movie review successfully added.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Adding movie review failed.',
      };
    }
  }

  @patch('/reviews/{id}')
  @response(204, {
    description: 'Returns updated data of the edited review.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description:
        'Update review approval status (provide movie id). (Requires token and admin role authorization)',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reviews, {
            title: 'Update review',
            exclude: [
              'id',
              'description',
              'rating',
              'datePosted',
              'userId',
              'movieId',
            ],
            partial: true,
          }),
        },
      },
    })
    reviews: Reviews,
  ): Promise<CustomResponse<{}>> {
    try {
      await this.reviewsRepository.updateById(id, reviews);
      const updatedMovie = await this.reviewsRepository.findById(id, {
        include: [
          {
            relation: 'userReviewer',
            scope: {
              fields: {
                role: false,
                isActivated: false,
                dateCreated: false,
                email: false,
              },
            },
          },
        ],
      });
      return {
        status: 'success',
        data: updatedMovie,
        message: 'Review updated successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Updating review failed.',
      };
    }
  }

  @get('/reviews/movie/{id}')
  @response(204, {
    description: 'Return all reviews of a movie.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async findMovieReviewsById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const movieReviews = await this.reviewsRepository.find({
        where: {movieId: id},
        include: [
          {
            relation: 'userReviewer',
            scope: {
              fields: {
                role: false,
                isActivated: false,
                dateCreated: false,
                email: false,
              },
            },
          },
        ],
      });
      return {
        status: 'success',
        data: movieReviews,
        message: 'Movie reviews fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching movie reviews failed.',
      };
    }
  }

  @get('/reviews')
  @response(204, {
    description: 'Return all reviews',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async findAllReviews(): Promise<CustomResponse<{}>> {
    try {
      const reviews = await this.reviewsRepository.find({
        include: [
          {
            relation: 'userReviewer',
            scope: {
              fields: {
                role: false,
                isActivated: false,
                dateCreated: false,
                email: false,
              },
            },
          },
          {
            relation: 'movieReviews',
            scope: {
              fields: ['title'],
            },
          },
        ],
      });
      return {
        status: 'success',
        data: reviews,
        message: 'All reviews fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching all reviews failed.',
      };
    }
  }

  @get('/reviews/approved')
  @response(204, {
    description: 'Return all approved reviews',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async findAllApprovedReviews(): Promise<CustomResponse<{}>> {
    try {
      const reviews = await this.reviewsRepository.find({
        where: {
          isApproved: true,
        },
        include: [
          {
            relation: 'userReviewer',
            scope: {
              fields: {
                role: false,
                isActivated: false,
                dateCreated: false,
                email: false,
              },
            },
          },
          {
            relation: 'movieReviews',
            scope: {
              fields: ['title'],
            },
          },
        ],
      });
      return {
        status: 'success',
        data: reviews,
        message: 'All approved reviews fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error
          ? error.message
          : 'Fetching all approved reviews failed.',
      };
    }
  }

  @get('/reviews/unapproved')
  @response(204, {
    description: 'Return all unapproved reviews',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async findAllUnapprovedReviews(): Promise<CustomResponse<{}>> {
    try {
      const reviews = await this.reviewsRepository.find({
        where: {
          isApproved: false,
        },
        include: [
          {
            relation: 'userReviewer',
            scope: {
              fields: {
                role: false,
                isActivated: false,
                dateCreated: false,
                email: false,
              },
            },
          },
          {
            relation: 'movieReviews',
            scope: {
              fields: ['title'],
            },
          },
        ],
      });
      return {
        status: 'success',
        data: reviews,
        message: 'All unapproved reviews fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error
          ? error.message
          : 'Fetching all unapproved reviews failed.',
      };
    }
  }
}
