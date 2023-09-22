import { cleanup, render, within } from '@testing-library/react';

import { numberFormat } from '@/utils';

import TimingsDiagram from './TimingsDiagram';

const timings = {
  blocked: 10,
  dns: 20,
  connect: 100,
  ssl: 70,
  send: 30,
  wait: 30,
  receive: 10,
};

const timingsWithoutSsl = {
  blocked: 10,
  dns: 20,
  connect: 100,
  ssl: -1,
  send: 30,
  wait: 30,
  receive: 10,
};

describe('TimingsDiagram', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<TimingsDiagram timings={timings} />);
  });

  it('should not render anything if timings are `undefined`', () => {
    const { container } = render(<TimingsDiagram timings={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render anything if timings are `undefined`', () => {
    const { container } = render(<TimingsDiagram timings={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render a row for each timing showing the correct value', () => {
    const expectations = [
      { label: 'Blocked', value: 10 },
      { label: 'DNS', value: 20 },
      { label: 'Connecting', value: 30 },
      { label: 'TLS setup', value: 70 },
      { label: 'Sending', value: 30 },
      { label: 'Waiting', value: 30 },
      { label: 'Receiving', value: 10 },
    ];

    const { getByTestId } = render(<TimingsDiagram timings={timings} />);
    const tableBody = getByTestId('timings-table-body');

    let row = tableBody.firstElementChild;
    for (const { label, value } of expectations) {
      if (!row) break;

      const heading = row.querySelector('th');
      const timing = row.querySelector('td');
      expect(heading).toHaveTextContent(label);
      expect(timing).toHaveTextContent(numberFormat(value));

      row = row.nextElementSibling;
    }
  });

  it('should render a row for each timing showing the correct value when there is no SSL involved', () => {
    const expectations = [
      { label: 'Blocked', value: 10 },
      { label: 'DNS', value: 20 },
      { label: 'Connecting', value: 100 },
      { label: 'Sending', value: 30 },
      { label: 'Waiting', value: 30 },
      { label: 'Receiving', value: 10 },
    ];

    const { getByTestId } = render(<TimingsDiagram timings={timingsWithoutSsl} />);
    const tableBody = getByTestId('timings-table-body');

    let row = tableBody.firstElementChild;
    for (const { label, value } of expectations) {
      if (!row) break;

      const heading = row.querySelector('th');
      const timing = row.querySelector('td');
      expect(heading).toHaveTextContent(label);
      expect(timing).toHaveTextContent(numberFormat(value));

      row = row.nextElementSibling;
    }
  });
});
