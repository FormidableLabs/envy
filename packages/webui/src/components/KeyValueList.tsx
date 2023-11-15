export type KeyValuePair = [string, React.ReactNode];

type KeyValueList = {
  values: KeyValuePair[];
};

export default function KeyValueList({ values }: KeyValueList) {
  if (!values.length) return null;

  return (
    <table className="table-fixed min-w-full font-mono text-sm">
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
              <td className="whitespace-nowrap pr-2 py-1 font-semibold align-top w-40">{k}</td>
              <td className="break-all px-2 py-1 pr-3">{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
