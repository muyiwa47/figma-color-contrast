"use strict";
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    if (msg.type === 'check-contrast') {
        const contrastRatio = getContrastRatio(msg.color1, msg.color2);
        figma.ui.postMessage({ type: 'contrast-result', ratio: contrastRatio });
    }
    function getContrastRatio(color1, color2) {
        const luminance1 = getRelativeLuminance(color1);
        const luminance2 = getRelativeLuminance(color2);
        if (luminance1 > luminance2) {
            return (luminance1 + 0.05) / (luminance2 + 0.05);
        }
        else {
            return (luminance2 + 0.05) / (luminance1 + 0.05);
        }
    }
    function getRelativeLuminance(hexColor) {
        const r = sRGBtoLinear(hexToRgb(hexColor).r / 255);
        const g = sRGBtoLinear(hexToRgb(hexColor).g / 255);
        const b = sRGBtoLinear(hexToRgb(hexColor).b / 255);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function sRGBtoLinear(value) {
        if (value <= 0.04045) {
            return value / 12.92;
        }
        else {
            return Math.pow((value + 0.055) / 1.055, 2.4);
        }
    }
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }
    // Example usage:
    const ratio = getContrastRatio("#FFFFFF", "#000000");
    console.log(ratio); // Should be around 21 for black and white
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
