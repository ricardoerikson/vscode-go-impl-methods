
export function sleep(miliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, miliseconds);
  });
}