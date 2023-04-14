"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPalette = void 0;
const polished_1 = require("polished");
var ColorPalette;
(function (ColorPalette) {
    ColorPalette.BLACK = {
        strokeColor: '#212121',
        fillColor: 'transparent',
    };
    ColorPalette.RED = {
        strokeColor: '#E53935',
        fillColor: (0, polished_1.lighten)(0.35, '#E53935'),
    };
    ColorPalette.PINK = {
        strokeColor: '#EC407A',
        fillColor: (0, polished_1.lighten)(0.3, '#EC407A'),
    };
    ColorPalette.ORANGE = {
        strokeColor: '#EF6C00',
        fillColor: (0, polished_1.lighten)(0.45, '#EF6C00'),
    };
    ColorPalette.GRAY = {
        strokeColor: '#546E7A',
        fillColor: (0, polished_1.lighten)(0.45, '#546E7A'),
    };
    ColorPalette.PURPLE = {
        strokeColor: '#7B1FA2',
        fillColor: (0, polished_1.lighten)(0.5, '#7B1FA2'),
    };
    ColorPalette.GREEN = {
        strokeColor: '#2E7D32',
        fillColor: (0, polished_1.lighten)(0.55, '#2E7D32'),
    };
    ColorPalette.ANY_COLOR = {
        strokeColor: '#039BE5',
        fillColor: (0, polished_1.lighten)(0.4, '#039BE5'),
    };
    ColorPalette.BLUE = {
        strokeColor: '#3949AB',
        fillColor: (0, polished_1.lighten)(0.45, '#3949AB'),
    };
})(ColorPalette = exports.ColorPalette || (exports.ColorPalette = {}));
//# sourceMappingURL=ColorPalette.js.map