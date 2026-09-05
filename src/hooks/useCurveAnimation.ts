/**
 * The loader core lives in `packages/cluster-loaders` so the docs site and the
 * published npm package can never drift apart. This re-export keeps the
 * familiar `@/hooks/useCurveAnimation` import path working across the app.
 */
export { useCurveAnimation } from "../../packages/cluster-loaders/src/useCurveAnimation";
export type {
  CurveConfig,
  CurveParams,
  CurveCategory,
  CurveType,
  ResolvedCurveConfig,
  Point,
} from "../../packages/cluster-loaders/src/useCurveAnimation";
