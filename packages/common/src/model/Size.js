"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Size = void 0;
var Size;
(function (Size) {
    function model(width, height) {
        return { width, height };
    }
    Size.model = model;
    function display(width, height) {
        return { width, height };
    }
    Size.display = display;
    function toModel(camera, size) {
        return model(size.width / camera.scale, size.height / camera.scale);
    }
    Size.toModel = toModel;
    function toDisplay(camera, size) {
        return display(size.width * camera.scale, size.height * camera.scale);
    }
    Size.toDisplay = toDisplay;
})(Size = exports.Size || (exports.Size = {}));
//# sourceMappingURL=Size.js.map