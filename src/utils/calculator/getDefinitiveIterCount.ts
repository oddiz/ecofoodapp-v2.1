export default function getDefinitiveIterCount(
  activeFoodCount: number,
  menuSize: number
): number {
  return Math.round(
    factorial(activeFoodCount + menuSize - 1) /
      (factorial(activeFoodCount) * factorial(menuSize - 1))
  );
}

function factorial(n: number): number {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
