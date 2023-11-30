# Uuid25: 25-digit case-insensitive UUID encoding

[![npm](https://img.shields.io/npm/v/uuid25)](https://www.npmjs.com/package/uuid25)
[![License](https://img.shields.io/npm/l/uuid25)](https://github.com/uuid25/javascript/blob/main/LICENSE)

Uuid25 is an alternative UUID representation that shortens a UUID string to just
25 digits using the case-insensitive Base36 encoding. This library provides
functionality to convert from the conventional UUID formats to Uuid25 and vice
versa.

```javascript
import { Uuid25 } from "uuid25";

// convert from/to string
const a = Uuid25.parse("8da942a4-1fbe-4ca6-852c-95c473229c7d");
console.assert(a.value === "8dx554y5rzerz1syhqsvsdw8t");
console.assert(a.toHyphenated() === "8da942a4-1fbe-4ca6-852c-95c473229c7d");

// convert from/to 128-bit byte array
const b = Uuid25.fromBytes(new Uint8Array(16).fill(0xff));
console.assert(b.value === "f5lxx1zz5pnorynqglhzmsp33");
console.assert(b.toBytes().every((x) => x === 0xff));

// convert from/to other popular textual representations
const c = [
  Uuid25.parse("e7a1d63b711744238988afcf12161878"),
  Uuid25.parse("e7a1d63b-7117-4423-8988-afcf12161878"),
  Uuid25.parse("{e7a1d63b-7117-4423-8988-afcf12161878}"),
  Uuid25.parse("urn:uuid:e7a1d63b-7117-4423-8988-afcf12161878"),
];
console.assert(c.every((x) => x.value === "dpoadk8izg9y4tte7vy1xt94o"));

const d = Uuid25.parse("dpoadk8izg9y4tte7vy1xt94o");
console.assert(d.toHex() === "e7a1d63b711744238988afcf12161878");
console.assert(d.toHyphenated() === "e7a1d63b-7117-4423-8988-afcf12161878");
console.assert(d.toBraced() === "{e7a1d63b-7117-4423-8988-afcf12161878}");
console.assert(d.toUrn() === "urn:uuid:e7a1d63b-7117-4423-8988-afcf12161878");
```

## CommonJS support

The CommonJS entry point is deprecated and provided for backward compatibility
purposes only. The entry point is no longer tested and will be removed in the
future.

## License

Licensed under the Apache License, Version 2.0.

## See also

- [API Documentation](https://uuid25.github.io/javascript/docs/)
