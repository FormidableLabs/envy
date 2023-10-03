import { CatFact } from '@/utils/types';

type Props = {
  fact?: CatFact;
  children?: React.ReactNode;
};

export function CatFactWidget({ fact, children }: Props) {
  return (
    <div className="thingy">
      <h2>Random cat fact:</h2>
      <p>{fact?.text}</p>
      {children}
    </div>
  );
}
