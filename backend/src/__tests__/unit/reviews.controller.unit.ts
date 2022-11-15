import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ReviewsController} from '../../controllers';
import {Reviews} from '../../models';
import {ReviewsRepository} from '../../repositories';
import {
  fetchMovieReviews,
  failedRes,
  mockReview,
  newReviewBody,
  newReviewResponse,
  mockUsers,
} from '../helpers';

describe('Reviews Controller Unit', () => {
  let reviewsRepository: StubbedInstanceWithSinonAccessor<ReviewsRepository>;
  let controller: ReviewsController;

  before(resetRepositories);

  describe('Reviews Controller create', () => {
    it('should successfully create movie Review', async () => {
      const create = reviewsRepository.stubs.create;

      const review = newReviewBody(mockReview);
      const reviewer = mockUsers[1]; // not admin
      const expectedResponse = newReviewResponse();

      create.resolves();
      const result = await controller.create(reviewer, review);
      expect(result.message).to.eql(expectedResponse.message);
      expect(result.status).to.eql(expectedResponse.status);
      sinon.assert.called(create);
    });
    it('should return failed response if admin is the reviewer', async () => {
      const create = reviewsRepository.stubs.create;

      const review = newReviewBody(mockReview);
      const reviewer = mockUsers[0]; // admin

      create.resolves();
      const result = await controller.create(reviewer, review);

      expect(result.message).to.eql('As an admin, you cannot add reviews.');
      expect(result.status).to.eql('fail');
    });
    it('should return failed response if description is empty', async () => {
      const create = reviewsRepository.stubs.create;
      const review = newReviewBody({...mockReview, description: ''});
      const reviewer = mockUsers[1]; // not admin
      const expectedMessage = 'Description is required.';

      create.resolves(review);
      const result = await controller.create(reviewer, review);

      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if movie ID is empty', async () => {
      const create = reviewsRepository.stubs.create;
      const review = newReviewBody({...mockReview, movieId: ''});
      const reviewer = mockUsers[1]; // not admin
      const expectedMessage = 'Movie ID to review is required.';

      create.resolves(review);
      const result = await controller.create(reviewer, review);

      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if rating is not between 1 - 5', async () => {
      const create = reviewsRepository.stubs.create;
      const review = newReviewBody({...mockReview, rating: 0});
      const reviewer = mockUsers[1]; // not admin
      const expectedMessage = 'Rating can only be between 1 - 5.';

      create.resolves(review);
      const result = await controller.create(reviewer, review);

      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return custom message failed response if rejected', async () => {
      const create = reviewsRepository.stubs.create;
      const review = newReviewBody(mockReview);
      const reviewer = mockUsers[1]; // not admin
      const expectedMessage = 'Adding movie review failed.';

      create.rejects({message: expectedMessage});
      const result = await controller.create(reviewer, review);
      expect(result).to.eql(failedRes(expectedMessage));
    });
  });

  describe('Reviews Controller find', () => {
    it('should return reviews of a movie', async () => {
      const movieId = '6365ced2e303fc6228363ba3';
      const find = reviewsRepository.stubs.find;
      find.resolves(fetchMovieReviews.data as Reviews[]);
      expect(await controller.find(movieId)).to.eql(fetchMovieReviews);
      sinon.assert.called(find);
    });
    it('should return failed response if rejected', async () => {
      const movieId = 'randomId';
      const find = reviewsRepository.stubs.find;
      find.rejects();
      expect(await controller.find(movieId)).to.eql(failedRes('Error'));
      sinon.assert.called(find);
    });
  });

  describe('Reviews Controller updateById', () => {
    it('should successfully update review', async () => {
      const updateById = reviewsRepository.stubs.updateById;
      const review = newReviewBody({...mockReview, isApproved: true});
      const reviewId = '6362ced2e303fc6228363ba4';

      updateById.resolves();
      await controller.updateById(reviewId, review);

      sinon.assert.calledWith(updateById, reviewId, review);
    });

    it('should return custom message failed response if rejected', async () => {
      const updateById = reviewsRepository.stubs.updateById;
      const review = newReviewBody({...mockReview, isApproved: true});
      const reviewId = 'invalidId';
      const expectedMessage = 'Updating review failed.';

      updateById.rejects({message: expectedMessage});
      await controller.updateById(reviewId, review);

      expect(await controller.updateById(reviewId, review)).to.eql(
        failedRes(expectedMessage),
      );
    });
  });

  function resetRepositories() {
    reviewsRepository = createStubInstance(ReviewsRepository);

    controller = new ReviewsController(reviewsRepository);
  }
});
