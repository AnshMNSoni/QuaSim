export class Complex {
  real: number
  imag: number

  constructor(real: number, imag = 0) {
    this.real = real
    this.imag = imag
  }

  static zero(): Complex {
    return new Complex(0, 0)
  }

  static one(): Complex {
    return new Complex(1, 0)
  }

  static i(): Complex {
    return new Complex(0, 1)
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag)
  }

  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag)
  }

  multiply(other: Complex): Complex {
    return new Complex(this.real * other.real - this.imag * other.imag, this.real * other.imag + this.imag * other.real)
  }

  scale(scalar: number): Complex {
    return new Complex(this.real * scalar, this.imag * scalar)
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag)
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag)
  }

  phase(): number {
    return Math.atan2(this.imag, this.real)
  }

  toString(): string {
    if (this.imag === 0) return `${this.real}`
    if (this.real === 0) return `${this.imag}i`
    if (this.imag < 0) return `${this.real} - ${-this.imag}i`
    return `${this.real} + ${this.imag}i`
  }
}
