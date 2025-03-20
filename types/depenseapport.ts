export interface DepenseApportInterface {
  //   id: string;
  amount: string;
  description: string;
  type: "depense" | "apport";
  date: { seconds: number; nanoseconds: number }; // Firestore Timestamp format or JavaScript Date
  categoryPath: string[];
  accountPath: string[];
  finance: string[];
}

export interface finance {
  financePath: string[];
  financeAmount: string;
}
