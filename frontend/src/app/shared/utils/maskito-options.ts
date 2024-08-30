import type { MaskitoOptions } from "@maskito/core";
import {
  maskitoAddOnFocusPlugin,
  maskitoCaretGuard,
  maskitoPostfixPostprocessorGenerator,
  maskitoPrefixPostprocessorGenerator,
  maskitoRemoveOnBlurPlugin,
} from "@maskito/kit";

export const maskDni: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
} as MaskitoOptions;

export const maskPercentage: MaskitoOptions = {
  mask: ({ value }) => {
    const digitsMask = Array.from(value.replace("%", "")).map(() => /\d/);

    if (!digitsMask.length) {
      return [/\d/];
    }

    return [...digitsMask, "%"];
  },
} as MaskitoOptions;
