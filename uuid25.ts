/**
 * Uuid25: 25-digit case-insensitive UUID encoding
 *
 * @packageDocumentation
 */

const assert: (cond: boolean, msg: string) => asserts cond = (cond, msg) => {
  if (!cond) {
    throw new Error("Assertion failed: " + msg);
  }
};

const newParseError = () => new SyntaxError("could not parse a UUID string");

/**
 * Primary value type containing the Uuid25 representation of a UUID.
 *
 * This class wraps a string value to provide conversion methods from/to other
 * popular UUID textual representations.
 *
 * @example
 * ```javascript
 * import { Uuid25 } from "uuid25";
 *
 * // convert from/to string
 * const a = Uuid25.parse("8da942a4-1fbe-4ca6-852c-95c473229c7d");
 * console.assert(a.value === "8dx554y5rzerz1syhqsvsdw8t");
 * console.assert(a.toHyphenated() === "8da942a4-1fbe-4ca6-852c-95c473229c7d");
 *
 * // convert from/to 128-bit byte array
 * const b = Uuid25.fromBytes(new Uint8Array(16).fill(0xff));
 * console.assert(b.value === "f5lxx1zz5pnorynqglhzmsp33");
 * console.assert(b.toBytes().every((x) => x === 0xff));
 *
 * // convert from/to other popular textual representations
 * const c = [
 *   Uuid25.parse("e7a1d63b711744238988afcf12161878"),
 *   Uuid25.parse("e7a1d63b-7117-4423-8988-afcf12161878"),
 *   Uuid25.parse("{e7a1d63b-7117-4423-8988-afcf12161878}"),
 *   Uuid25.parse("urn:uuid:e7a1d63b-7117-4423-8988-afcf12161878"),
 * ];
 * console.assert(c.every((x) => x.value === "dpoadk8izg9y4tte7vy1xt94o"));
 *
 * const d = Uuid25.parse("dpoadk8izg9y4tte7vy1xt94o");
 * console.assert(d.toHex() === "e7a1d63b711744238988afcf12161878");
 * console.assert(d.toHyphenated() === "e7a1d63b-7117-4423-8988-afcf12161878");
 * console.assert(d.toBraced() === "{e7a1d63b-7117-4423-8988-afcf12161878}");
 * console.assert(d.toUrn() === "urn:uuid:e7a1d63b-7117-4423-8988-afcf12161878");
 * ```
 */
export class Uuid25 {
  /**
   * Creates an instance from the inner string primitive.
   *
   * @param value The underlying string value of the object in the 25-digit
   *        Base36 textual representation.
   */
  private constructor(readonly value: string) {}

  /**
   * Returns the underlying string value whenever the Object-to-primitive
   * coercion occurs.
   *
   * @param _hint Ignored.
   */
  [Symbol.toPrimitive](_hint: string): string {
    return this.value;
  }

  /**
   * Returns the underlying string value whenever the Object-to-primitive
   * coercion occurs.
   */
  valueOf(): string {
    return this.value;
  }

  /**
   * Returns the underlying string value when converting `this` into a string.
   */
  toString(): string {
    return this.value;
  }

  /** Serializes `this` as the underlying string primitive. */
  toJSON(): string {
    return this.value;
  }

  /** Returns true if `this.value` equals to `other.value`. */
  equals(other: Uuid25): boolean {
    return this.value === other.value;
  }

  /**
   * The maximum value of 128-bit unsigned integer (2^128 - 1) in the Base36
   * representation.
   */
  private static readonly MAX = "f5lxx1zz5pnorynqglhzmsp33";

  /**
   * Creates an instance from an array of Base36 digit values.
   *
   * @category Conversion-from
   */
  private static fromDigitValues(digitValues: Uint8Array): Uuid25 {
    assert(digitValues.length === 25, "invalid length of digit value array");
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let buffer = "";
    for (const e of digitValues) {
      assert(e < digits.length, "invalid digit value");
      buffer += digits.charAt(e);
    }
    assert(buffer <= Uuid25.MAX, "128-bit overflow");
    return new Uuid25(buffer);
  }

  /**
   * Creates an instance from a 16-byte UUID binary representation.
   *
   * @category Conversion-from
   */
  static fromBytes(uuidBytes: Uint8Array): Uuid25 {
    if (uuidBytes.length !== 16) {
      throw new TypeError("the length of byte array must be 16");
    }
    return Uuid25.fromDigitValues(convertBase(uuidBytes, 256, 36, 25));
  }

  /**
   * Converts `this` into the 16-byte binary representation of a UUID.
   *
   * @category Conversion-to
   */
  toBytes(): Uint8Array {
    const src = decodeDigitChars(this.value, 36);
    return convertBase(src, 36, 256, 16);
  }

  /**
   * Creates an instance from a UUID string representation.
   *
   * This method accepts the following formats:
   *
   * - 25-digit Base36 Uuid25 format: `3ud3gtvgolimgu9lah6aie99o`
   * - 32-digit hexadecimal format without hyphens: `40eb9860cf3e45e2a90eb82236ac806c`
   * - 8-4-4-4-12 hyphenated format: `40eb9860-cf3e-45e2-a90e-b82236ac806c`
   * - Hyphenated format with surrounding braces: `{40eb9860-cf3e-45e2-a90e-b82236ac806c}`
   * - RFC 4122 URN format: `urn:uuid:40eb9860-cf3e-45e2-a90e-b82236ac806c`
   *
   * @throws `SyntaxError` if the argument is not a valid UUID string.
   * @category Conversion-from
   */
  static parse(uuidString: string): Uuid25 {
    switch (uuidString.length) {
      case 25:
        return Uuid25.parseUuid25(uuidString);
      case 32:
        return Uuid25.parseHex(uuidString);
      case 36:
        return Uuid25.parseHyphenated(uuidString);
      case 38:
        return Uuid25.parseBraced(uuidString);
      case 45:
        return Uuid25.parseUrn(uuidString);
      default:
        throw newParseError();
    }
  }

  /**
   * Creates an instance from the 25-digit Base36 Uuid25 format:
   * `3ud3gtvgolimgu9lah6aie99o`.
   *
   * @throws `SyntaxError` if the argument is not in the specified format.
   * @category Conversion-from
   */
  static parseUuid25(uuidString: string): Uuid25 {
    if (/^[0-9a-z]{25}$/i.test(uuidString)) {
      const value = uuidString.toLowerCase();
      if (value <= Uuid25.MAX) {
        return new Uuid25(value);
      }
    }
    throw newParseError();
  }

  /**
   * Creates an instance from the hexadecimal representation without checking
   * the syntax.
   *
   * @throws `SyntaxError` if the argument is `undefined`.
   * @category Conversion-from
   */
  private static parseHexImpl(uuidString: string | undefined): Uuid25 {
    if (uuidString === undefined) {
      throw newParseError();
    }
    const src = decodeDigitChars(uuidString, 16);
    return Uuid25.fromDigitValues(convertBase(src, 16, 36, 25));
  }

  /**
   * Creates an instance from the 32-digit hexadecimal format without hyphens:
   * `40eb9860cf3e45e2a90eb82236ac806c`.
   *
   * @throws `SyntaxError` if the argument is not in the specified format.
   * @category Conversion-from
   */
  static parseHex(uuidString: string): Uuid25 {
    return Uuid25.parseHexImpl(
      /^[0-9a-f]{32}$/i.test(uuidString) ? uuidString : undefined
    );
  }

  /**
   * Creates an instance from the 8-4-4-4-12 hyphenated format:
   * `40eb9860-cf3e-45e2-a90e-b82236ac806c`.
   *
   * @throws `SyntaxError` if the argument is not in the specified format.
   * @category Conversion-from
   */
  static parseHyphenated(uuidString: string): Uuid25 {
    return Uuid25.parseHexImpl(
      /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
        .exec(uuidString)
        ?.slice(1, 6)
        ?.join("")
    );
  }

  /**
   * Creates an instance from the hyphenated format with surrounding braces:
   * `{40eb9860-cf3e-45e2-a90e-b82236ac806c}`.
   *
   * @throws `SyntaxError` if the argument is not in the specified format.
   * @category Conversion-from
   */
  static parseBraced(uuidString: string): Uuid25 {
    return Uuid25.parseHexImpl(
      /^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i
        .exec(uuidString)
        ?.slice(1, 6)
        ?.join("")
    );
  }

  /**
   * Creates an instance from the RFC 4122 URN format:
   * `urn:uuid:40eb9860-cf3e-45e2-a90e-b82236ac806c`.
   *
   * @throws `SyntaxError` if the argument is not in the specified format.
   * @category Conversion-from
   */
  static parseUrn(uuidString: string): Uuid25 {
    return Uuid25.parseHexImpl(
      /^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
        .exec(uuidString)
        ?.slice(1, 6)
        ?.join("")
    );
  }

  /**
   * Formats `this` in the 32-digit hexadecimal format without hyphens:
   * `40eb9860cf3e45e2a90eb82236ac806c`.
   *
   * @category Conversion-to
   */
  toHex(): string {
    const src = decodeDigitChars(this.value, 36);
    const digitValues = convertBase(src, 36, 16, 32);
    const digits = "0123456789abcdef";
    let buffer = "";
    for (const e of digitValues) {
      assert(e < digits.length, "invalid digit value");
      buffer += digits.charAt(e);
    }
    return buffer;
  }

  /**
   * Formats `this` in the 8-4-4-4-12 hyphenated format:
   * `40eb9860-cf3e-45e2-a90e-b82236ac806c`.
   *
   * @category Conversion-to
   */
  toHyphenated(): string {
    const src = decodeDigitChars(this.value, 36);
    const digitValues = convertBase(src, 36, 16, 32);
    const digits = "0123456789abcdef";
    let buffer = "";
    for (let i = 0; i < 32; i++) {
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        buffer += "-";
      }
      const e = digitValues[i];
      assert(e < digits.length, "invalid digit value");
      buffer += digits.charAt(e);
    }
    return buffer;
  }

  /**
   * Formats `this` in the hyphenated format with surrounding braces:
   * `{40eb9860-cf3e-45e2-a90e-b82236ac806c}`.
   *
   * @category Conversion-to
   */
  toBraced(): string {
    return "{" + this.toHyphenated() + "}";
  }

  /**
   * Formats `this` in the RFC 4122 URN format:
   * `urn:uuid:40eb9860-cf3e-45e2-a90e-b82236ac806c`.
   *
   * @category Conversion-to
   */
  toUrn(): string {
    return "urn:uuid:" + this.toHyphenated();
  }
}

/** Converts a digit value array in `srcBase` to that in `dstBase`. */
const convertBase = (
  src: Uint8Array,
  srcBase: number,
  dstBase: number,
  dstSize: number
): Uint8Array => {
  assert(
    2 <= srcBase && srcBase <= 256 && 2 <= dstBase && dstBase <= 256,
    "invalid base"
  );

  // determine the number of `src` digits to read for each outer loop
  let wordLen = 1;
  let wordBase = srcBase;
  while (wordBase <= Number.MAX_SAFE_INTEGER / (srcBase * dstBase)) {
    wordLen++;
    wordBase *= srcBase;
  }

  const dst = new Uint8Array(dstSize);

  const srcSize = src.length;
  if (srcSize === 0) {
    return dst;
  } else {
    assert(dstSize > 0, "too small dst");
  }

  let dstUsed = dstSize - 1; // storage to memorize range of `dst` filled

  // read `wordLen` digits from `src` for each outer loop
  let wordHead = srcSize % wordLen;
  if (wordHead > 0) {
    wordHead -= wordLen;
  }
  for (; wordHead < srcSize; wordHead += wordLen) {
    let carry = 0;
    for (let i = wordHead < 0 ? 0 : wordHead; i < wordHead + wordLen; i++) {
      assert(src[i] < srcBase, "invalid src digit");
      carry = carry * srcBase + src[i];
    }

    // fill in `dst` from right to left, while carrying up prior result to left
    for (let i = dstSize - 1; i >= 0; i--) {
      carry += dst[i] * wordBase;
      const quo = Math.trunc(carry / dstBase);
      dst[i] = carry - quo * dstBase; // remainder
      carry = quo;

      // break inner loop when `carry` and remaining `dst` digits are all zero
      if (carry === 0 && i <= dstUsed) {
        dstUsed = i;
        break;
      }
    }
    assert(carry === 0, "too small dst");
  }

  return dst;
};

/** Converts from a string of digit characters to an array of digit values. */
const decodeDigitChars = (digitChars: string, base: number): Uint8Array => {
  // O(1) map from ASCII code points to Base36 digit values
  const DECODE_MAP = [
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c,
    0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14,
    0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
    0x21, 0x22, 0x23, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
  ];

  assert(2 <= base && base <= 36, "invalid base");
  const len = digitChars.length;
  const digitValues = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    digitValues[i] = DECODE_MAP[digitChars.charCodeAt(i)] ?? 0x7f;
    assert(digitValues[i] < base, "invalid digit character");
  }
  return digitValues;
};
