figma.showUI(__html__, { width: 350, height: 650 });

let textInputs = document.querySelectorAll('#fHex, #bHex');
let colorInputs = document.querySelectorAll('#fHex, #bHex, #fPick, #bPick');
let colorSliders = document.querySelectorAll('#fLightness, #bLightness');

// Global variables
let f = "#000000", b = "#000000"; // default colors;
   // Focus event for text inputs
   textInputs.forEach(function(input) {
       input.addEventListener('focus', function(this: HTMLInputElement) {
           this.select();
       });
   });

   function mousemoveHandler(event: Event) {
   // Your code to handle mousemove events here
   console.log("Event Removed")
}

   // Mouse events for color sliders
   colorSliders.forEach(function(slider) {
       slider.addEventListener('mousedown', function(this: HTMLInputElement) {
           let context = this.id.charAt(0);
           this.addEventListener('mousemove', function() {
               changeHue(context);
           });
       });

       slider.addEventListener('mouseup', function(this: HTMLInputElement) {
           this.removeEventListener('mousemove', mousemoveHandler);
       });

       slider.addEventListener('mouseout', function(this: HTMLInputElement) {
           this.removeEventListener('mousemove', mousemoveHandler);
       });
   });

   // Change event for color sliders
   colorSliders.forEach(function(slider) {
       slider.addEventListener('change', function(this: HTMLInputElement) {
           let context = this.id.charAt(0);
           changeHue(context);
       });
   });

   // Change event for color inputs
   colorInputs.forEach(function(input) {
       input.addEventListener('change', function(this: HTMLInputElement) {
           let color = this.value;
           let context = this.id.charAt(0);
           let errorElement: HTMLElement | null = document.getElementById(context + 'Error');


           if (errorElement) errorElement.style.display = 'none';

           if (color.charAt(0) !== '#') {
               color = '#' + color;
           }

           if (color.length === 4) {
               color = '#' + color.charAt(1).repeat(2) + color.charAt(2).repeat(2) + color.charAt(3).repeat(2);
           }

           this.value = color;

           // Validation
           if (color.length !== 7 || isNaN(getRGB(color.substr(1)))) {
            if (errorElement) errorElement.style.display = 'block';
               this.focus();
           } else {
               if (errorElement) errorElement.style.display = 'none';
               eval(context + '= color.toUpperCase()');
               update();
           }
       });
   });

   function update() {
       let fHex = document.querySelector('#fHex') as HTMLInputElement;
       let fPick = document.querySelector('#fPick') as HTMLInputElement;
       let bHex = document.querySelector('#bHex') as HTMLInputElement;
       let bPick = document.querySelector('#bPick') as HTMLInputElement;
       let normalElements = document.querySelectorAll('#normal');

       fHex.value = f;
       fPick.value = f;
       bHex.value = b;
       bPick.value = b;

       normalElements.forEach(function (element) {
            (element as HTMLElement).style.color = f;
            (element as HTMLElement).style.backgroundColor = b;
       });

       let fHSL = RGBtoHSL(getRGB(f.substr(1, 2)), getRGB(f.substr(3, 2)), getRGB(f.substr(-2)));
       let bHSL = RGBtoHSL(getRGB(b.substr(1, 2)), getRGB(b.substr(3, 2)), getRGB(b.substr(-2)));

       let fLightness = document.querySelector('#fLightness') as HTMLInputElement;
       let bLightness = document.querySelector('#bLightness') as HTMLInputElement;
       
       fLightness.value = Math.round(fHSL[2]).toString();
       bLightness.value = Math.round(bHSL[2]).toString();
       
       let fGradient = fLightness.nextElementSibling as HTMLInputElement;;
       let bGradient = bLightness.nextElementSibling as HTMLInputElement;;

       fGradient.style.background = 'linear-gradient(to right,hsl(' + fHSL[0] + ',' + fHSL[1] + '%,0%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,50%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,100%))';
       bGradient.style.background = 'linear-gradient(to right,hsl(' + bHSL[0] + ',' + bHSL[1] + '%,0%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,50%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,100%))';

       checkContrast();
   }

//    function changeHue(context: any) {
//     var HSL = RGBtoHSL(getRGB(eval(context).substr(1, 2)), getRGB(eval(context).substr(3, 2)), getRGB(eval(context).substr(-2)));
//     const lightnessInput: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#' + context + 'Lightness');
//     var RGB = HSLtoRGB(HSL[0], HSL[1], lightnessInput);

//     for (var i = 0; i < 3; i++) {
//         RGB[i] = (RGB[i] >= 16) ? RGB[i].toString(16) : '0' + RGB[i].toString(16);
//     }

//     eval(context + '= "#" + (RGB[0] + RGB[1] + RGB[2]).toUpperCase()');
//     update();
// }

// Assuming these are global or in the current scope
function changeHue(context: 'f' | 'b'): void {
    const currentColor = context === 'f' ? f : b;
    const HSL = RGBtoHSL(
        getRGB(currentColor.substr(1, 2)),
        getRGB(currentColor.substr(3, 2)),
        getRGB(currentColor.substr(-2))
    );

    const lightnessInput = document.querySelector<HTMLInputElement>('#' + context + 'Lightness');
    if (!lightnessInput) {
        throw new Error("Couldn't find lightness input element");
    }

    let RGB: any[] = HSLtoRGB(HSL[0], HSL[1], Number(lightnessInput.value));

    for (let i = 0; i < 3; i++) {
        RGB[i] = (RGB[i] >= 16) ? RGB[i].toString(16) : '0' + RGB[i].toString(16);
    }

    const newColor = "#" + (RGB[0] + RGB[1] + RGB[2]).toUpperCase();

    if (context === 'f') {
        f = newColor;
    } else {
        b = newColor;
    }

    update();
}

function checkContrast() {
    let L1 = getL(f);
    let L2 = getL(b);
    let ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    
    // Assuming getL returns number and Dec2 is a function that takes a number and returns a string
    const ratioElement = document.querySelector('#ratio') as HTMLElement | null;
    const normalAA = document.querySelector('#normalAA') as HTMLElement | null;
    const bigAA = document.querySelector('#bigAA') as HTMLElement | null;
    const ratioContainer = document.querySelector('#ratioContainer') as HTMLElement | null;

    if (ratioElement) {
        ratioElement.innerHTML = '<b>' + Dec2((ratio * 100) / 100) + '</b>:1';
    }

    if (normalAA && ratioContainer) {
        if (ratio >= 4.5) {
            normalAA.classList.add('pass');
            normalAA.classList.remove('fail');
            ratioContainer.classList.add('pass');
            normalAA.innerHTML = "PASS";
        } else {
            normalAA.classList.remove('pass');
            normalAA.classList.add('fail');
            ratioContainer.classList.remove('pass');
            normalAA.innerHTML = "FAIL";
        }
    }

    if (bigAA) {
        if (ratio >= 3) {
            bigAA.classList.add('pass');
            bigAA.classList.remove('fail');
            bigAA.innerHTML = "PASS";
        } else {
            bigAA.classList.remove('pass');
            bigAA.classList.add('fail');
            bigAA.innerHTML = "FAIL";
        }
    }
}

function getRGB(c: string): number {
    let result: any;
    try {
        result = parseInt(c, 16);
    } catch (err) {
        result = false;
    }
    return result;
}

function HSLtoRGB(H: number, S: number, L: number): number[] {
    let p1: number, p2: number, R: number, G: number, B: number;

    L /= 100;
    S /= 100;

    if (L <= 0.5) p2 = L * (1 + S);
    else p2 = L + S - (L * S);

    p1 = 2 * L - p2;

    if (S === 0) {
        R = G = B = L;
    } else {
        R = findRGB(p1, p2, H + 120);
        G = findRGB(p1, p2, H);
        B = findRGB(p1, p2, H - 120);
    }

    return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
}

function RGBtoHSL(r: number, g: number, b: number): [number, number, number] {
    let Min: number, Max: number, H: number, S: number, L: number;

    r = (r / 51) * 0.2;
    g = (g / 51) * 0.2;
    b = (b / 51) * 0.2;

    if (r >= g) {
        Max = r;
    } else {
        Max = g;
    }

    if (b > Max) {
        Max = b;
    }

    if (r <= g) {
        Min = r;
    } else {
        Min = g;
    }

    if (b < Min) {
        Min = b;
    }

    L = (Max + Min) / 2;

    if (Max === Min) {
        S = H = 0;
    } else {
        if (L < 0.5) {
            S = (Max - Min) / (Max + Min);
        } else {
            S = (Max - Min) / (2 - Max - Min);
        }

        if (r === Max) {
            H = (g - b) / (Max - Min);
        } else if (g === Max) {
            H = 2 + ((b - r) / (Max - Min));
        } else if (b === Max) {
            H = 4 + ((r - g) / (Max - Min));
        }
    }

    H = Math.round(H * 60);
    if (H < 0) {
        H += 360;
    }
    if (H >= 360) {
        H -= 360;
    }

    return [H, Math.round(S * 100), Math.round(L * 100)];
}

function findRGB(q1: number, q2: number, hue: number): number {
    if (hue > 360) hue -= 360;
    if (hue < 0) hue += 360;
    if (hue < 60) return (q1 + (q2 - q1) * hue / 60);
    else if (hue < 180) return q2;
    else if (hue < 240) return (q1 + (q2 - q1) * (240 - hue) / 60);
    else return q1;
}

function getsRGB(c: string): number {
    let value = getRGB(c) / 255;
    return (value <= 0.03928) ? value / 12.92 : Math.pow(((value + 0.055) / 1.055), 2.4);
}

function getL(c: string): number {
    return (
        0.2126 * getsRGB(c.substr(1, 2)) +
        0.7152 * getsRGB(c.substr(3, 2)) +
        0.0722 * getsRGB(c.substr(-2))
    );
}

function Dec2(num: any) {
    num = String(num);
    if (num.indexOf('.') !== -1) {
        let numarr = num.split(".");
        if (numarr.length == 1) {
            return Number(num);
        } else {
            return Number(numarr[0] + "." + numarr[1].charAt(0) + numarr[1].charAt(1));
        }
    } else {
        return Number(num);
    }
}

let contrastForm = document.getElementById('contrastForm') as HTMLElement;
contrastForm.addEventListener('submit', function(e) {
    e.preventDefault();
});