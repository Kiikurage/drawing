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
        strokeColor: '#C62828',
        fillColor: lighten(0.3, '#C62828'),
    };

    export const PINK: ColorPalette = {
        strokeColor: '#AD1457',
        fillColor: lighten(0.3, '#AD1457'),
    };

    export const ORANGE: ColorPalette = {
        strokeColor: '#EF6C00',
        fillColor: lighten(0.3, '#EF6C00'),
    };
    export const GRAY: ColorPalette = {
        strokeColor: '#546E7A',
        fillColor: lighten(0.3, '#546E7A'),
    };
    export const PURPLE: ColorPalette = {
        strokeColor: '#4527A0',
        fillColor: lighten(0.3, '#4527A0'),
    };
    export const GREEN: ColorPalette = {
        strokeColor: '#2E7D32',
        fillColor: lighten(0.3, '#2E7D32'),
    };
    export const ANY_COLOR: ColorPalette = {
        strokeColor: '#00695C',
        fillColor: lighten(0.3, '#00695C'),
    };
    export const BLUE: ColorPalette = {
        strokeColor: '#1565C0',
        fillColor: lighten(0.3, '#1565C0'),
    };
}
