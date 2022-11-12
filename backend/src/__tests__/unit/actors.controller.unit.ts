import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ActorsController} from '../../controllers';
import {Actors} from '../../models';
import {ActorsRepository, MovieCastRepository} from '../../repositories';
import {
  failedRes,
  fetchActorById,
  fetchActors,
  mockActor,
  newActorBody,
  newActorResponse,
  searchActorByName,
} from '../helpers';

describe('Actors Controller', () => {
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

      expect(await controller.find()).to.eql(failedRes('Error'));
      sinon.assert.called(find);
    });
  });

  describe('Actors Controller create', () => {
    it('should return created Actor', async () => {
      const create = actorRepository.stubs.create;

      const actor = newActorBody(mockActor);
      const expected = newActorResponse({
        ...actor,
        id: '636da2be886fb224fc3b2fd1',
      });

      create.resolves(expected.data);
      const result = await controller.create(actor);

      expect(result).to.eql(expected);
      sinon.assert.called(create);
    });
    it('should return failed response if first name is empty', async () => {
      const actor = newActorBody({...mockActor, firstName: ''});
      const message = 'Field firstName name is required.';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);

      expect(result).to.eql(failedRes(message));
    });
    it('should return failed response if gender is not valid', async () => {
      const actor = newActorBody({...mockActor, gender: 'notAGender'});
      const message = 'Gender should only be either male or female';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);

      expect(result).to.eql(failedRes(message));
    });
    it('should return failed response if age is less than 1', async () => {
      const actor = newActorBody({...mockActor, age: 0});
      const message = 'Actor age cannot be less than a year.';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);
      expect(result).to.eql(failedRes(message));
    });
  });

  describe('Actors Controller findById', () => {
    it('should return Actor data by ID', async () => {
      const findById = actorRepository.stubs.findById;
      const actorId = '6365cd4ee303fc6228363b9f';
      findById.resolves(fetchActorById.data as Actors);
      expect(await controller.findById(actorId)).to.eql(fetchActorById);

      sinon.assert.called(findById);
    });

    it('should return failed response if rejected', async () => {
      const findById = actorRepository.stubs.findById;
      const actorId = '6365cd4ee303fc6228363b9f';
      findById.rejects();
      expect(await controller.findById(actorId)).to.eql(failedRes('Error'));

      sinon.assert.called(findById);
    });
  });

  describe('Actors Controller searchByName', () => {
    it('should return Keanu Actor after search', async () => {
      const searchByName = actorRepository.stubs.find;
      const searchKey = 'Keanu';
      searchByName.resolves(searchActorByName.data as Actors[]);
      expect(await controller.searchByName(searchKey)).to.eql(
        searchActorByName,
      );

      sinon.assert.called(searchByName);
    });
  });

  function resetRepositories() {
    actorRepository = createStubInstance(ActorsRepository);
    movieCastRepository = createStubInstance(MovieCastRepository);
    controller = new ActorsController(movieCastRepository, actorRepository);
  }
});
