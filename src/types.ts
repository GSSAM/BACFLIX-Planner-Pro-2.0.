export interface Subject {
  name: string;
  coeff: number;
  lvl: 'low' | 'med' | 'high';
}

export interface Task {
  id: string;
  subj: string;
  done: boolean;
  conf: number;
  time: string;
  day: number;
  slot: number;
}

export interface Branch {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Flashcard {
  q: string;
  a: string;
  category: string;
}
