export const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOneByEmail: jest.fn(),
  softDelete: jest.fn(),
};
