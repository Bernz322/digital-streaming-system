import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  post,
  param,
  getModelSchemaRef,
  patch,
  del,
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
  @authorize({allowedRoles: ['user']})
  async create(
    @inject(SecurityBindings.USER)
    currentLoggedUser: UserProfile,
    @requestBody({
      description:
        'Add new review to a movie. (Requires token and user only role authorization).',
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
      if (!reviews.description && reviews.description === '')
        throw new Error('Description is required.');
      if (!reviews.movieId && reviews.movieId === '')
        throw new Error('Movie ID to review is required.');
      if (!reviews.rating || reviews.rating > 5 || reviews.rating < 0)
        throw new Error('Rating can only be between 0 - 5.');
      const userMovieReviewChecker = await this.reviewsRepository.find({
        where: {
          and: [{userId: currentLoggedUser.id}, {movieId: reviews.movieId}],
        },
      });
      if (userMovieReviewChecker.length > 0)
        throw new Error('You can only review once per movie.');
      const reviewToSave = {
        ...reviews,
        userId: currentLoggedUser.id,
      };
      const review = await this.reviewsRepository.create(reviewToSave);
      return {
        status: 'success',
        data: review,
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
      if (typeof reviews.isApproved !== 'boolean')
        throw new Error('isApproved should only be a boolean type.');

      await this.reviewsRepository.updateById(id, reviews);
      const updatedMovie = await this.reviewsRepository.findById(id);
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

  @del('/reviews/{id}')
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @response(204, {
    description: 'Returns deleted movie id.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      await this.reviewsRepository.deleteById(id);
      return {
        status: 'success',
        data: id,
        message: 'Review deleted successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Deleting review failed.',
      };
    }
  }
}
