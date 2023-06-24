export class RandomWithSeed {
  public static seed = 1;

  public static init(seed: number): void {
    this.seed = seed;
  }

  public static generate(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}
