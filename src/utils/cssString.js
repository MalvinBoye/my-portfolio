// Converts a CSS-string (as used in the original design import) into a React
// style object, so page markup can stay a near-literal port of the source
// design file instead of a hand re-typed object per element.
export function css(str) {
  const out = {};
  str.split(';').forEach(rule => {
    const i = rule.indexOf(':');
    if (i === -1) return;
    const prop = rule.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[prop] = rule.slice(i + 1).trim();
  });
  return out;
}

// Tiling fractal-noise grain texture used over the paper background on every
// "Classical" design-system page.
export const GRAIN = `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjQyIi8+PC9zdmc+")`;
