import * as choreCore from '~/core/chore';

export const getChores = async () => {
  return choreCore.getChores();
};

export const patchChoreDone = async (id: string) => {
  return choreCore.patchChoreDone(id);
};

export const patchChoreSnoozed = async (id: string, weeks: number) => {
  return choreCore.patchChoreSnoozed(id, weeks);
};
