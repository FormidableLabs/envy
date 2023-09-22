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
          <span data-test-id="key-value-item" key={k} className="w-full flex flex-row pt-2 first:pt-0">
            <span className="flex-[1] font-semibold">{k}: </span>
            <span className="group flex-[3] break-all overflow-x-visible">{value}</span>
          </span>
        );
      })}
    </Field>
  );
}
