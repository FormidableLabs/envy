export type KeyValuePair = [string, React.ReactNode];

type KeyValueList = {
  values: KeyValuePair[];
};

export default function KeyValueList({ values }: KeyValueList) {
  if (!values.length) return null;

  return (
    <table className="table-fixed min-w-full font-mono text-xs">
      <tbody>
        {values.map(([k, v]) => {
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
            <tr key={k} data-test-id="key-value-item">
              <td className="pr-2 py-1 font-semibold align-top w-[200px]">{k}</td>
              <td className="break-all py-1 pr-3">{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
