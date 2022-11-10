import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ReviewsController} from '../../controllers';
import {Reviews} from '../../models';
import {ReviewsRepository} from '../../repositories';
import {fetchMovieReviews, rejectedRqst} from '../helpers';

describe('ReviewController', () => {
  let reviewsRepository: StubbedInstanceWithSinonAccessor<ReviewsRepository>;
  let controller: ReviewsController;

  before(resetRepositories);

  describe('Review Controller getById', () => {
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
      expect(await controller.find(movieId)).to.eql(rejectedRqst);
      sinon.assert.called(find);
    });
  });

  function resetRepositories() {
    reviewsRepository = createStubInstance(ReviewsRepository);

    controller = new ReviewsController(reviewsRepository);
  }
});
