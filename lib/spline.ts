/**
 * Shared Spline hero constants. Kept out of the "use client" SplineHero module
 * so the server-rendered home page can read them as plain strings for preloads.
 */

export const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Geometry wasm the viewer fetches at runtime. The URL is hardcoded inside the
 * @splinetool/viewer bundle and is pinned to the package version, so this MUST
 * be bumped together with @splinetool/viewer in package.json (currently 1.9.82)
 * or the preload becomes a wasted download.
 */
export const SPLINE_MODELLING_WASM_URL =
  "https://unpkg.com/@splinetool/modelling-wasm@1.9.82/build/process.wasm";
