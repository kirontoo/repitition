type Workout = {
  id: string;
  name: string;
  description: string | null;
  reps: number;
  createdAt: string;
  exercises: Exercise[]
};

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
}
