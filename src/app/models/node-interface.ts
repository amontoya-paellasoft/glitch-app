export interface NodePosition {
  id: string;
  label: string;
  x: number;
  y: number;
  data: { role: string; emoji: string; status: string; image?: string; realName?: string };
  w?: number;
  h?: number;
}
