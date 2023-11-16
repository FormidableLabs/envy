# @envyjs/webui

## 0.9.1

### Patch Changes

- 0892b1f: Ensure selected row color takes precendence
  - @envyjs/core@0.9.1

## 0.9.0

### Minor Changes

- 2bc08f4: Use monaco-editor for code display

### Patch Changes

- 36b5e70: Update input element styles
- a74222e: Align styles with new design
- e9e14ae: Update tab design
  - @envyjs/core@0.9.0

## 0.8.4

### Patch Changes

- 2c194a2: Fix npm publish warnings about git syntax
- 4b1788b: Move react-json-view to peer dependency to avoid infinite loop in npm installs
- Updated dependencies [2c194a2]
  - @envyjs/core@0.8.4

## 0.8.3

### Patch Changes

- 57c4ec8: Add npm metadata to all packages
- Updated dependencies [57c4ec8]
  - @envyjs/core@0.8.3

## 0.8.2

### Patch Changes

- ceb95b0: Use repository directory fields for npm
- Updated dependencies [ceb95b0]
  - @envyjs/core@0.8.2

## 0.8.1

### Patch Changes

- cbabdf4: Publish package provenance
- Updated dependencies [cbabdf4]
  - @envyjs/core@0.8.1

## 0.8.0

### Minor Changes

- 9b61037: Handle aborted requests

### Patch Changes

- aa050d2: Add system name as system icon alt text
- 1da5680: Fix custom viewer integration deps
- Updated dependencies [9b61037]
  - @envyjs/core@0.8.0

## 0.7.1

### Patch Changes

- 899e7a5: Update to Lucid Icons
- f120476: Update style of trace detail
- 7eaf46b: Update header styling and theme
- 8ca3e39: Set default detail pane size to 66%
- a880840: Update styling of trace list footer
- 804172c: Implement tabs for payload and response
- 8c1aefb: Condense trace list and improve display when collapsed
- ee7dbd4: Cleanup requests that did not receive a response
- cf0aa79: Allow detail pane size to be adjustable
- 6067975: Collapse source and systems filter into button
- f224ee6: Add dark mode theme switcher behind feature flag
  - @envyjs/core@0.7.1

## 0.7.0

### Patch Changes

- 3950d87: Fix peer dependency warnings
- ac4b953: Improve anonymous graphql query display
- 4fdf849: Add http request state for tracking
- Updated dependencies [3950d87]
- Updated dependencies [340d1e8]
- Updated dependencies [ac4b953]
- Updated dependencies [4fdf849]
- Updated dependencies [82dbfaf]
- Updated dependencies [065023c]
  - @envyjs/core@0.7.0

## 0.6.0

### Minor Changes

- 4dfd580: Connection status of senders (sources) exposed in @envyjs/webui viewer
- 38b8c39: Link package versions

### Patch Changes

- Updated dependencies [4dfd580]
- Updated dependencies [38b8c39]
  - @envyjs/core@0.6.0

## 0.5.0

### Minor Changes

- df3d275: Updated web socket message payloads to scope by type

### Patch Changes

- e49c198: Fix bug where auto-scroll would sometime not be enabled when scrolling to the bottom whilst zoomed in
- Updated dependencies [df3d275]
- Updated dependencies [429695a]
  - @envyjs/core@0.5.0

## 0.4.1

### Patch Changes

- 049b715: Add json safe parse for all usages
- 9683564: Add graphql middleware
- c5d9504: Updated column widths in KeyValueList component
- Updated dependencies [049b715]
- Updated dependencies [9683564]
  - @envyjs/core@0.4.1

## 0.4.0

### Minor Changes

- 84bf34e: Changed API of the System<T> interface
- d724eaf: Trace list now auto scrolls to bottom when new traces come in. Can be disabled.
- 917d5c5: Show timing data for web requests
- eac6083: Added ability to copy request details as a curl command
- 1b441c9: Added support for self-hosting and customization of the Envy viewer

### Patch Changes

- Updated dependencies [4c29f92]
  - @envyjs/core@0.4.0

## 0.3.2

### Patch Changes

- 10ecbbe: Fix windows startup scripts

## 0.3.1

### Patch Changes

- 8fb0d56: Updated some of the UI to better facilitate unit testing
- 81f6e01: Support HAR timing data
- Updated dependencies [81f6e01]
  - @envyjs/core@0.3.2

## 0.3.0

### Minor Changes

- c59b155: Switch to serve-handler for http

## 0.2.2

### Patch Changes

- 3db0538: Include bin folder in dist

## 0.2.1

### Patch Changes

- 58df2e5: Update distributed files and package provenance
- 03863c3: Include readme in package dist
- Updated dependencies [58df2e5]
- Updated dependencies [03863c3]
  - @envyjs/core@0.3.1

## 0.2.0

### Minor Changes

- 1b08520: Initial Release

### Patch Changes

- Updated dependencies [1b08520]
  - @envyjs/core@0.3.0

## 0.1.1

### Patch Changes

- ba5e2b9: Add changesets release management
- Updated dependencies [111807a]
- Updated dependencies [ba5e2b9]
  - @envyjs/core@0.2.0
