/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import { Test, TestingModule } from '@nestjs/testing';

import { DummyService } from '@/utils/test/dummy/services/dummy.service';
import { closeInMongodConnection } from '@/utils/test/test';

import { DummyModule } from '../test/dummy/dummy.module';
import { DummyRepository } from '../test/dummy/repositories/dummy.repository';

describe('BaseService', () => {
  let dummyRepository: DummyRepository;
  let dummyService: DummyService;
  let createdId: string;
  const createdPayload = {
    dummy: 'dummy test 5',
  };
  const updatedPayload = { dummy: 'updated dummy text' };
  const updatedCriteriaPayload = {
    dummy: 'updated dummy text 2',
  };
  const deletedCriteriaPayload = {
    dummy: 'dummy test 2',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DummyModule],
    }).compile();
    dummyRepository = module.get<DummyRepository>(DummyRepository);
    dummyService = module.get<DummyService>(DummyService);
  });
  afterEach(jest.clearAllMocks);
  afterAll(closeInMongodConnection);

  describe('create', () => {
    it('should create one dummy', async () => {
      jest.spyOn(dummyRepository, 'create');
      const { id, ...rest } = await dummyService.create(createdPayload);
      createdId = id;

      expect(dummyRepository.create).toHaveBeenCalledWith(createdPayload);
      expect(rest).toEqualPayload(createdPayload);
    });
  });

  describe('findOne', () => {
    it('should find by id and return one dummy data', async () => {
      jest.spyOn(dummyRepository, 'findOne');
      const result = await dummyService.findOne(createdId);

      expect(dummyRepository.findOne).toHaveBeenCalledWith(
        createdId,
        undefined,
      );
      expect(result).toEqualPayload(createdPayload);
    });

    it('should find by criteria and return one dummy data', async () => {
      jest.spyOn(dummyRepository, 'findOne');
      const result = await dummyService.findOne(createdPayload);

      expect(dummyRepository.findOne).toHaveBeenCalledWith(
        createdPayload,
        undefined,
      );
      expect(result).toEqualPayload(createdPayload);
    });
  });

  describe('updateOne', () => {
    it('should updated by id and return one dummy data', async () => {
      jest.spyOn(dummyRepository, 'updateOne');
      const result = await dummyService.updateOne(createdId, updatedPayload);

      expect(dummyRepository.updateOne).toHaveBeenCalledWith(
        createdId,
        updatedPayload,
      );
      expect(result).toEqualPayload(updatedPayload);
    });

    it('should updated by criteria and return one dummy data', async () => {
      jest.spyOn(dummyRepository, 'updateOne');
      const result = await dummyService.updateOne(
        updatedPayload,
        updatedCriteriaPayload,
      );

      expect(dummyRepository.updateOne).toHaveBeenCalledWith(
        updatedPayload,
        updatedCriteriaPayload,
      );
      expect(result).toEqualPayload(updatedCriteriaPayload);
    });
  });

  describe('deleteOne', () => {
    it('should delete by id one dummy data', async () => {
      jest.spyOn(dummyRepository, 'deleteOne');
      const result = await dummyService.deleteOne(createdId);

      expect(dummyRepository.deleteOne).toHaveBeenCalledWith(createdId);
      expect(result).toEqualPayload({ acknowledged: true, deletedCount: 1 });
    });

    it('should delete by id one dummy data', async () => {
      jest.spyOn(dummyRepository, 'deleteOne');
      const result = await dummyService.deleteOne(deletedCriteriaPayload);

      expect(dummyRepository.deleteOne).toHaveBeenCalledWith(
        deletedCriteriaPayload,
      );
      expect(result).toEqualPayload({ acknowledged: true, deletedCount: 1 });
    });
  });
});