export type BoxKind = "key" | "gap" | "risk" | "exec" | "bill" | "src" | "ask";

export type Block =
  | { k: "h"; t: string }
  | { k: "p"; t: string }
  | { k: "q"; t: string }
  | { k: "d"; who: "doctor" | "soldier"; t: string }
  | { k: "box"; kind: BoxKind; title: string; items: string[] };

export type Chapter = {
  id: string;
  part: string;
  title: string;
  blocks: Block[];
};

export const boxOrder: BoxKind[] = ["key", "gap", "risk", "exec", "bill", "src", "ask"];
