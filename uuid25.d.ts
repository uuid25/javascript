/**
 * Uuid25: 25-digit case-insensitive UUID encoding
 *
 * @packageDocumentation
 */
/**
 * The primary value type containing the Uuid25 representation of a UUID.
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
export declare class Uuid25 {
    readonly value: string;
    /**
     * Creates an instance from the inner string primitive.
     *
     * @param value The underlying string value of the object in the 25-digit
     *        Base36 textual representation.
     */
    private constructor();
    /**
     * Returns the underlying string value whenever the Object-to-primitive
     * coercion occurs.
     *
     * @param _hint Ignored.
     */
    [Symbol.toPrimitive](_hint: string): string;
    /**
     * Returns the underlying string value whenever the Object-to-primitive
     * coercion occurs.
     */
    valueOf(): string;
    /**
     * Returns the underlying string value when converting `this` into a string.
     */
    toString(): string;
    /** Serializes `this` as the underlying string primitive. */
    toJSON(): string;
    /** Returns true if `this.value` equals to `other.value`. */
    equals(other: Uuid25): boolean;
    /**
     * The maximum value of 128-bit unsigned integer (2^128 - 1) in the Base36
     * representation.
     */
    private static readonly MAX;
    /**
     * Creates an instance from an array of Base36 digit values.
     *
     * @category Conversion-from
     */
    private static fromDigitValues;
    /**
     * Creates an instance from a 16-byte UUID binary representation.
     *
     * @category Conversion-from
     */
    static fromBytes(uuidBytes: Uint8Array): Uuid25;
    /**
     * Converts `this` into the 16-byte binary representation of a UUID.
     *
     * @category Conversion-to
     */
    toBytes(): Uint8Array;
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
    static parse(uuidString: string): Uuid25;
    /**
     * Creates an instance from the 25-digit Base36 Uuid25 format:
     * `3ud3gtvgolimgu9lah6aie99o`.
     *
     * @throws `SyntaxError` if the argument is not in the specified format.
     * @category Conversion-from
     */
    static parseUuid25(uuidString: string): Uuid25;
    /**
     * Creates an instance from the hexadecimal representation without checking
     * the syntax.
     *
     * @throws `SyntaxError` if the argument is `undefined`.
     * @category Conversion-from
     */
    private static parseHexImpl;
    /**
     * Creates an instance from the 32-digit hexadecimal format without hyphens:
     * `40eb9860cf3e45e2a90eb82236ac806c`.
     *
     * @throws `SyntaxError` if the argument is not in the specified format.
     * @category Conversion-from
     */
    static parseHex(uuidString: string): Uuid25;
    /**
     * Creates an instance from the 8-4-4-4-12 hyphenated format:
     * `40eb9860-cf3e-45e2-a90e-b82236ac806c`.
     *
     * @throws `SyntaxError` if the argument is not in the specified format.
     * @category Conversion-from
     */
    static parseHyphenated(uuidString: string): Uuid25;
    /**
     * Creates an instance from the hyphenated format with surrounding braces:
     * `{40eb9860-cf3e-45e2-a90e-b82236ac806c}`.
     *
     * @throws `SyntaxError` if the argument is not in the specified format.
     * @category Conversion-from
     */
    static parseBraced(uuidString: string): Uuid25;
    /**
     * Creates an instance from the RFC 4122 URN format:
     * `urn:uuid:40eb9860-cf3e-45e2-a90e-b82236ac806c`.
     *
     * @throws `SyntaxError` if the argument is not in the specified format.
     * @category Conversion-from
     */
    static parseUrn(uuidString: string): Uuid25;
    /**
     * Formats `this` in the 32-digit hexadecimal format without hyphens:
     * `40eb9860cf3e45e2a90eb82236ac806c`.
     *
     * @category Conversion-to
     */
    toHex(): string;
    /**
     * Formats `this` in the 8-4-4-4-12 hyphenated format:
     * `40eb9860-cf3e-45e2-a90e-b82236ac806c`.
     *
     * @category Conversion-to
     */
    toHyphenated(): string;
    /**
     * Formats `this` in the hyphenated format with surrounding braces:
     * `{40eb9860-cf3e-45e2-a90e-b82236ac806c}`.
     *
     * @category Conversion-to
     */
    toBraced(): string;
    /**
     * Formats `this` in the RFC 4122 URN format:
     * `urn:uuid:40eb9860-cf3e-45e2-a90e-b82236ac806c`.
     *
     * @category Conversion-to
     */
    toUrn(): string;
}
