# Canvasbar
React component library for scrollbars customization (implemented using canvas API).

[![version](https://img.shields.io/npm/v/canvasbar-react.svg?style=flat-square)](http://npm.im/canvasbar-react)
[![downloads](https://img.shields.io/npm/dm/canvasbar-react.svg?style=flat-square)](http://npm-stat.com/charts.html?package=canvasbar-react&from=2021-12-01)

### Installation

**- Via npm:**
`npm install canvasbar-react --save`

**- Via Yarn:**
`yarn add canvasbar-react`

### Sample usage

```js
import { CanvasBar } from 'canvasbar-react';

const YourComponent = () => (
  <CanvasBar>
    // your content here
  </CanvasBar>
);
```

### Examples

You can check out the [examples project](https://github.com/monext/canvasbar/blob/main/examples/src/App.tsx) or [live demo](https://pj2m4.csb.app/) on codesandbox.

## Documentation

The `canvasbar-react` package exposes 3 items:
1. `CanvasBar` – react component for wrapping your content that needs to be displayed with custom scrollbars (if content overflows).
2. `useBodyCanvasBar` – react hook for displaying custom scrollbars in body element (if content overflows).
3. `CanvasBarConfigContext` - react context for styling scrollbars.

### CanvasBar component

It has 4 custom properties:
- `as` (`string`, default: `'div'`) – name of html element to use as a wrapper
- `config` (`Partial<Config>`, default: `{}`) – [config object](#config-object) object for scrollbars styling
- `wrapperRef` (`RefObject<Element>`) – ref for outer wrapper HTML element
- `scrollableRef` (`RefObject<HTMLDivElement>`) – ref for inner scrollable HTML element

The rest of properties are passed to wrapper element:

```js
// in this case wrapper element will be <div>, className and onClick will be passed to it
<CanvasBar className="my-wrapper-class" onClick={someHandler}>
  // your content here
</CanvasBar>
```

`CanvasBar` component is a generic pure function component. Generic has 1 optional argument:
- `Element` (extends `HTMLElement`, default value is `HTMLElement`) – you can specify it depending on what `as` prop value you use, so element related properties can be validated properly by TypeScript:

```tsx
// in this case wrapper element will be <form>, onSubmit will be passed to it
<CanvasBar<HTMLFormElement> as='form' onSubmit={yourHandler}>
  // your content here
</CanvasBar>
```

### useBodyCanvasBar hook

In has 1 argument:
- `config` (`Partial<Config>`, default: `{}`) – [config object](#config-object) for scrollbars styling

⚠️ It's recommended to use this hook in the top level component to make sure body scrollbars are always styled properly.

### CanvasBarConfigContext

The value of this context is `Partial<Config>` object:

```js
<CanvasBarConfigContext.Provider value={{ thumbColor: 'rgba(47, 226, 158, .8)' }}>
  // your content here
</CanvasBarConfigContext.Provider>
```

You can use `CanvasBarConfigContext` for:
1. Styling all scrollbars in your project (including body scrollbars if you use `useBodyCanvasBar` hook). In this case you need to wrap your root component with this context.
2. Styling all scrollbars inside some large component or page that contains several components that use `<CanvasBar>` component.

⚠️ If you want to style just 1 `CanvasBar` component, it's better to use `config` property of `CanvasBar`.

```js
<CanvasBar config={{ thumbColor: 'rgba(166, 56, 220, .8)' }}>
  // your content here
</CanvasBar>
```

### Config object

Fields:
- `thumbColor` (`'string'`, default: `'rgba(0, 0, 0, .5)'`) – the color of draggable scrollbar area (thumb)
- `thumbBorderRadius` (`number | 'auto'`, default: `'auto'`) – thumb's border radius in px. If `'auto'`, the actual value will be half of width for vertical scrollbar and half of height for horizontal scrollbar.
- `thumbMinSize` (`number`, default `20`) – thumb's minimum size in px. To prevent thumb size from becoming too small when the scrollable content is too large.
- `padding` (`number`, default `2`) – thumb's padding in px. To add padding between thumb and scrollbar edges.

### Changelog

See changelog here: https://github.com/monext/canvasbar/releases
