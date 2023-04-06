import { lighten } from 'polished';

export interface ColorPalette {
    strokeColor: string;
    fillColor: string;
}

export module ColorPalette {
    export const BLACK: ColorPalette = {
        strokeColor: '#212121',
        fillColor: 'transparent',
    };
    export const RED: ColorPalette = {
        strokeColor: '#E53935',
        fillColor: lighten(0.35, '#E53935'),
    };

    export const PINK: ColorPalette = {
        strokeColor: '#EC407A',
        fillColor: lighten(0.3, '#EC407A'),
    };

    export const ORANGE: ColorPalette = {
        strokeColor: '#EF6C00',
        fillColor: lighten(0.45, '#EF6C00'),
    };
    export const GRAY: ColorPalette = {
        strokeColor: '#546E7A',
        fillColor: lighten(0.45, '#546E7A'),
    };
    export const PURPLE: ColorPalette = {
        strokeColor: '#7B1FA2',
        fillColor: lighten(0.5, '#7B1FA2'),
    };
    export const GREEN: ColorPalette = {
        strokeColor: '#2E7D32',
        fillColor: lighten(0.55, '#2E7D32'),
    };
    export const ANY_COLOR: ColorPalette = {
        strokeColor: '#039BE5',
        fillColor: lighten(0.4, '#039BE5'),
    };
    export const BLUE: ColorPalette = {
        strokeColor: '#3949AB',
        fillColor: lighten(0.45, '#3949AB'),
    };
}

export type ColorPaletteKey = keyof typeof ColorPalette;
