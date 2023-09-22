import { cleanup, render } from '@testing-library/react';
import xmlFormat from 'xml-formatter';

import XmlDisplay from './XmlDisplay';

jest.mock('xml-formatter');

describe('XmlDisplay', () => {
  beforeEach(() => {
    jest.mocked(xmlFormat).mockReturnValue('Xml formatted input text');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<XmlDisplay>Input text</XmlDisplay>);
  });

  it('should XML format content to display', () => {
    const { container } = render(<XmlDisplay>Input text</XmlDisplay>);
    expect(jest.mocked(xmlFormat)).toHaveBeenCalledWith('Input text', {
      indentation: '  ',
      lineSeparator: '\n',
      collapseContent: true,
      whiteSpaceAtEndOfSelfclosingTag: true,
    });
    expect(container).toHaveTextContent('Xml formatted input text');
  });
});
