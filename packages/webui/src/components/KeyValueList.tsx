import { Field } from './Fields';

export type KeyValuePair = [string, any];

type KeyValueListProps = {
  label: string;
  keyValuePairs: [string, any][];
};

export default function KeyValueList({ label, keyValuePairs }: KeyValueListProps) {
  if (!keyValuePairs.length) return null;

  return (
    <Field label={label}>
      <div className="table w-full">
        {keyValuePairs.map(([k, v]) => {
          let value: React.ReactNode = v;
          switch (typeof v) {
            case 'string': {
              value = decodeURIComponent(v);
              break;
            }
            case 'number':
            case 'boolean': {
              value = v.toString();
              break;
            }
          }

          return (
            <span data-test-id="key-value-item" key={k} className="w-full table-row pt-2 first:pt-0">
              <span className="table-cell whitespace-nowrap font-semibold py-1 pr-4 min-w-[12rem]">{k}: </span>
              <span className="group table-cell w-full break-all overflow-x-visible py-1">{value}</span>
            </span>
          );
        })}
      </div>
    </Field>
  );
}
