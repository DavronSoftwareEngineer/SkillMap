export interface ModuleWorkshop {
  concept: string;
  input: string;
  answer: string;
  variation: string;
  acceptance: string;
}
export type WorkshopRow = [string, string, string, string, string, string];
export function workshops(rows: WorkshopRow[]): Record<string, ModuleWorkshop> {
  return Object.fromEntries(rows.map(([id,concept,input,answer,variation,acceptance]) =>
    [id,{concept,input,answer,variation,acceptance}]));
}
