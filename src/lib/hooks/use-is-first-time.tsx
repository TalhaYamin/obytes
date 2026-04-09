import { useStoredBoolean } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export function useIsFirstTime() {
  const [isFirstTime, setIsFirstTime] = useStoredBoolean(IS_FIRST_TIME);
  // No key yet = fresh install; only "false" is written after onboarding completes.
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
}
