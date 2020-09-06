import * as healthCore from '~/core/health';

export const getHealth = async () => {
  try {
    await healthCore.getHealth();
    return { status: 'OK' };
  } catch (error) {
    return error;
  }
};
