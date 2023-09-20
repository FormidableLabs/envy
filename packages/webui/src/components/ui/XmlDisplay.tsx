import xmlFormat from 'xml-formatter';

import Code from './Code';

type XmlDisplayProps = React.HTMLAttributes<HTMLElement> & {
  children: string;
};

export default function XmlDisplay({ children, ...props }: XmlDisplayProps) {
  const formattedXml = xmlFormat(children, {
    indentation: '  ',
    lineSeparator: '\n',
    collapseContent: true,
    whiteSpaceAtEndOfSelfclosingTag: true,
  });

  return (
    <Code prettify={false} {...props}>
      {formattedXml}
    </Code>
  );
}
