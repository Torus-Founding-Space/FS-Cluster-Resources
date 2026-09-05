/**
 * React-free entry point.
 *
 * The CLI imports this to enumerate and serialise presets; keeping it separate
 * from `index.ts` means `npx cluster-loaders` never has to resolve React.
 */
export { curves, curveById, loaderIds } from './curves';
export type { CurveConfig, CurveParams, CurveCategory, CurveType, ResolvedCurveConfig, Point } from './useCurveAnimation';
