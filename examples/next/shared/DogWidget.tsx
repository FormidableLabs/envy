import { Dog } from '@/utils/types';

type Props = {
  dogo?: Dog;
  children?: React.ReactNode;
};

export function DogWidget({ dogo, children }: Props) {
  return (
    <div className="thingy">
      <h2>Random Dog Image:</h2>
      <div>
        <img src={dogo?.imageUrl} />
      </div>
      {children}
    </div>
  );
}
