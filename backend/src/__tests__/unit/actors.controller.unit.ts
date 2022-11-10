import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ActorsController} from '../../controllers';
import {Actors} from '../../models';
import {ActorsRepository, MovieCastRepository} from '../../repositories';
import {fetchActors, rejectedRqst} from '../helpers';

describe('ActorsController', () => {
  let actorRepository: StubbedInstanceWithSinonAccessor<ActorsRepository>;
  let movieCastRepository: StubbedInstanceWithSinonAccessor<MovieCastRepository>;
  let controller: ActorsController;

  beforeEach(resetRepositories);

  describe('Actors Controller find', () => {
    it('should return multiple actors', async () => {
      const find = actorRepository.stubs.find;
      find.resolves(fetchActors.data as Actors[]);
      expect(await controller.find()).to.eql(fetchActors);
      sinon.assert.called(find);
    });
    it('should return failed response if rejected', async () => {
      const find = actorRepository.stubs.find;
      find.rejects();
      expect(await controller.find()).to.eql(rejectedRqst);
      sinon.assert.called(find);
    });
  });

  function resetRepositories() {
    actorRepository = createStubInstance(ActorsRepository);
    movieCastRepository = createStubInstance(MovieCastRepository);

    controller = new ActorsController(movieCastRepository, actorRepository);
  }
});
