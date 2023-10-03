import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-id' });

// JSDom does not implement scrollTo, so we just need to mock it here
Element.prototype.scrollTo = () => void 0;
