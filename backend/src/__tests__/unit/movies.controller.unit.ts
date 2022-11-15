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
import {
  fetchMovies,
  failedRes,
  newMoviePostBody,
  newMovieResponse,
  mockMovie,
  fetchMovieById,
  searchMovieByName,
} from '../helpers';

describe('Movies Controller Unit', () => {
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

  describe('Movie Controller create', () => {
    it('should return created Movie', async () => {
      const create = moviesRepository.stubs.create;

      const movie = newMoviePostBody(mockMovie);
      const expected = newMovieResponse({
        ...movie,
        id: '636da2be886fb224fc3b2fd1',
      });

      create.resolves(expected.data);
      const result = await controller.create(movie);
      expect(result).to.eql(expected);
      sinon.assert.called(create);
    });
    it('should return failed response if title is empty', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, title: ''});
      const expectedMessage = 'Field movie title is required.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if description is empty', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, description: ''});
      const expectedMessage = 'Field movie description is required.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if cost is invalid', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, cost: -1000});
      const expectedMessage = 'Movie budget cost cannot be less than 0.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if year is invalid', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, yearReleased: -2020});
      const expectedMessage =
        'Movie year released cannot be of negative value.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if image is invalid', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, image: 'invalidUrl'});
      const expectedMessage = 'Invalid movie image url.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if there is no actor', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody({...mockMovie, actors: []});
      const expectedMessage = 'Movie cannot have 0 actor.';

      create.resolves(movie);
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return custom message failed response if rejected', async () => {
      const create = moviesRepository.stubs.create;
      const movie = newMoviePostBody(mockMovie);
      const expectedMessage = 'Creating movie failed.';

      create.rejects({message: expectedMessage});
      const result = await controller.create(movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
  });

  describe('Movie Controller findById', () => {
    it('should  return Movie data by ID', async () => {
      const findById = moviesRepository.stubs.findById;
      const movieId = '6365ced2e303fc6228363ba3';
      findById.resolves(fetchMovieById.data as Movies);

      expect(await controller.findById(movieId)).to.eql(fetchMovieById);
      sinon.assert.called(findById);
    });
    it('should return failed response if rejected', async () => {
      const findById = moviesRepository.stubs.findById;
      const movieId = '6365ced2e303fc6228363ba3';
      const expectedMessage = 'Fetching movie failed.';
      findById.rejects({message: expectedMessage});
      expect(await controller.findById(movieId)).to.eql(
        failedRes(expectedMessage),
      );
    });
  });

  describe('Movie Controller searchByName', () => {
    it('should return all Movies with John title after search', async () => {
      const searchByName = moviesRepository.stubs.find;
      const searchKey = 'john';
      searchByName.resolves(searchMovieByName.data as Movies[]);
      expect(await controller.searchByName(searchKey)).to.eql(
        searchMovieByName,
      );
      sinon.assert.called(searchByName);
    });
    it('should return custom message failed response if rejected', async () => {
      const searchByName = moviesRepository.stubs.find;
      const expectedMessage = 'Fetching movies failed.';
      const searchKey = 'Non-existing Movie';
      searchByName.rejects({message: expectedMessage});
      expect(await controller.searchByName(searchKey)).to.eql(
        failedRes(expectedMessage),
      );
      sinon.assert.called(searchByName);
    });
  });

  describe('Movie Controller updateById', () => {
    it('should successfully update movie', async () => {
      const movie = newMoviePostBody({
        ...mockMovie,
        description: 'Edited description',
      });
      const movieId = '636da2be886fb224fc3b2fd1';
      const updateById = moviesRepository.stubs.updateById;

      updateById.resolves(movie);
      await controller.updateById(movieId, movie);

      sinon.assert.calledWith(updateById, movieId, movie);
    });
    it('should return failed response if cost is invalid', async () => {
      const updateById = moviesRepository.stubs.updateById;
      const movie = newMoviePostBody({
        ...mockMovie,
        cost: 0,
      });
      const movieId = '636da2be886fb224fc3b2fd1';
      const expectedMessage = 'Movie budget cost cannot be less than 0.';

      updateById.resolves();
      const result = await controller.updateById(movieId, movie);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return custom message failed response if rejected', async () => {
      const movie = newMoviePostBody({
        ...mockMovie,
        description: 'Edited description',
      });
      const id = 'invalidId';
      const expectedMessage = 'Updating movie failed';
      const updateById = moviesRepository.stubs.updateById;

      updateById.rejects({message: expectedMessage});
      await controller.updateById(id, movie);

      expect(await controller.updateById(id, movie)).to.eql(
        failedRes(expectedMessage),
      );
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
