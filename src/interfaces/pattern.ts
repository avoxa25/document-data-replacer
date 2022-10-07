import { LoopPattern } from "./loop-pattern";

export interface Pattern {
  variable: string,
  value: string | LoopPattern,
}