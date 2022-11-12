import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {MoviesController} from '../../controllers';
import {Movies} from '../../models';
import {
  MoviesRepository,
  ReviewsRepository,
  MovieCastRepository,
} from '../../repositories';
import {fetchMovies, failedRes} from '../helpers';

describe('MoviesController', () => {
  let moviesRepository: StubbedInstanceWithSinonAccessor<MoviesRepository>;
  let reviewsRepository: StubbedInstanceWithSinonAccessor<ReviewsRepository>;
  let movieCastRepository: StubbedInstanceWithSinonAccessor<MovieCastRepository>;
  let controller: MoviesController;

  before(resetRepositories);

  describe('Movie Controller find', () => {
    it('should return multiple movies', async () => {
      const find = moviesRepository.stubs.find;
      find.resolves(fetchMovies.data as Movies[]);
      expect(await controller.find()).to.eql(fetchMovies);
      sinon.assert.called(find);
    });
    it('should return failed response if rejected', async () => {
      const find = moviesRepository.stubs.find;
      find.rejects();
      expect(await controller.find()).to.eql(failedRes('Error'));
      sinon.assert.called(find);
    });
  });

  function resetRepositories() {
    moviesRepository = createStubInstance(MoviesRepository);
    reviewsRepository = createStubInstance(ReviewsRepository);
    movieCastRepository = createStubInstance(MovieCastRepository);

    controller = new MoviesController(
      movieCastRepository,
      reviewsRepository,
      moviesRepository,
    );
  }
});
