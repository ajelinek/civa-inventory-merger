// Augmenting react's intrinsic JSX attributes to add optional "path" prop
//
// See Module Augmentation:
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
// eslint-disable-next-line
import React from 'react'

declare module 'react' {
  interface Attributes {
    path?: string;
    default?: boolean
  }
}
