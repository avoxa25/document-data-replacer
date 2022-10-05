import { LoopPattern } from "./loop-pattern";
import { TablePattern } from "./table-pattern";

export interface Pattern {
  variable: string,
  value: string | LoopPattern | TablePattern,
}