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

describe('Actors Controller Unit', () => {
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
      const expectedMessage = 'Field firstName name is required.';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);

      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if gender is not valid', async () => {
      const actor = newActorBody({...mockActor, gender: 'notAGender'});
      const expectedMessage = 'Gender should only be either male or female';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);

      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if age is less than 1', async () => {
      const actor = newActorBody({...mockActor, age: 0});
      const expectedMessage = 'Actor age cannot be less than a year.';
      const create = actorRepository.stubs.create;

      create.resolves(actor);
      const result = await controller.create(actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return custom message failed response if rejected', async () => {
      const actor = newActorBody(mockActor);
      const expectedMessage = 'Adding new Actor failed.';
      const create = actorRepository.stubs.create;

      create.rejects({message: expectedMessage});
      const result = await controller.create(actor);
      expect(result).to.eql(failedRes(expectedMessage));
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
    it('should return custom message failed response if rejected', async () => {
      const searchByName = actorRepository.stubs.find;
      const searchKey = 'Non existing';
      searchByName.rejects({message: 'Fetching actor data failed.'});
      expect(await controller.searchByName(searchKey)).to.eql(
        failedRes('Fetching actor data failed.'),
      );

      sinon.assert.called(searchByName);
    });
  });

  describe('Actors Controller updateById', () => {
    it('should return failed response if first name is null', async () => {
      const actor = newActorBody({...mockActor, firstName: ''});
      const expectedMessage = 'Field firstName should not be empty.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if first name is invalid', async () => {
      const actor = newActorBody({...mockActor, firstName: 'N4me-1s-1nval1d'});
      const expectedMessage = 'Invalid name in field firstName';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if last name is null', async () => {
      const actor = newActorBody({...mockActor, lastName: ''});
      const expectedMessage = 'Field lastName should not be empty.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if last name is invalid', async () => {
      const actor = newActorBody({...mockActor, lastName: 'N4me-1s-1nval1d'});
      const expectedMessage = 'Invalid name in field lastName';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if gender is neither male or female', async () => {
      const actor = newActorBody({...mockActor, gender: 'notAGender'});
      const expectedMessage = 'Gender should only be either male or female';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if age is less than 1', async () => {
      const actor = newActorBody({...mockActor, age: 0});
      const expectedMessage = 'Actor age cannot be less than a year.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if image is null', async () => {
      const actor = newActorBody({...mockActor, image: ''});
      const expectedMessage = 'Field image should not be empty.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if image is invalid', async () => {
      const actor = newActorBody({...mockActor, image: 'invalid-url'});
      const expectedMessage = 'Invalid actor image url.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should return failed response if actor link is invalid', async () => {
      const actor = newActorBody({...mockActor, link: 'invalid-url'});
      const expectedMessage = 'Invalid actor link url.';
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      const result = await controller.updateById(actorId, actor);
      expect(result).to.eql(failedRes(expectedMessage));
    });
    it('should successfully update actor', async () => {
      const actor = newActorBody({...mockActor, firstName: 'Edited Name'});
      const actorId = '636da2be886fb224fc3b2fd1';
      const updateById = actorRepository.stubs.updateById;

      updateById.resolves();
      await controller.updateById(actorId, actor);

      sinon.assert.calledWith(updateById, actorId, actor);
    });
    it('should return custom message failed response if rejected', async () => {
      const actor = newActorBody({...mockActor, firstName: 'Edited Name'});
      const id = 'invalidId';
      const expectedMessage = 'Updating actor failed';
      const updateById = actorRepository.stubs.updateById;

      updateById.rejects({message: expectedMessage});
      await controller.updateById(id, actor);

      expect(await controller.updateById(id, actor)).to.eql(
        failedRes(expectedMessage),
      );
    });
  });

  describe('Actors Controller deleteById', () => {
    it('should successfully delete actor', async () => {
      const deleteById = actorRepository.stubs.deleteById;
      const actorId = '636da2be886fb224fc3b2fd1';

      deleteById.resolves();
      await controller.deleteById(actorId);
    });
  });

  function resetRepositories() {
    actorRepository = createStubInstance(ActorsRepository);
    movieCastRepository = createStubInstance(MovieCastRepository);
    controller = new ActorsController(movieCastRepository, actorRepository);
  }
});
