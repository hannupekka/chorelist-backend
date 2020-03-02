import * as choreCore from '~/core/chore';

export const getChores = async () => {
  return choreCore.getChores();
};

export const patchChoreDone = async (id: string) => {
  return choreCore.patchChoreDone(id);
};
