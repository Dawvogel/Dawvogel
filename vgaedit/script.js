// editable canvas
const canvas = document.getElementById("map");
const context = canvas.getContext("2d");

// support multiple previews
// 32x
const canvas_p32 = document.getElementById("previewCanvas32");
const context_p32 = canvas_p32.getContext("2d");
// 64x
const canvas_p64 = document.getElementById("previewCanvas64");
const context_p64 = canvas_p64.getContext("2d");
// 128x
const canvas_p128 = document.getElementById("previewCanvas128");
const context_p128 = canvas_p128.getContext("2d");

// other elements
const typeSel = document.getElementById("typeSel");
const binaryCode = document.getElementById("binary");
const vgaByteDiv = document.getElementById("vgaBytes");
const preview = document.getElementById("preview");
const fixedArraySize = document.getElementById("arraySize");

// reference to the byte spans
const byte0 = document.getElementById("byte0");
const byte1 = document.getElementById("byte1");
const byte2 = document.getElementById("byte2");
const byte3 = document.getElementById("byte3");
const byte4 = document.getElementById("byte4");
const byte5 = document.getElementById("byte5");
const byte6 = document.getElementById("byte6");
const byte7 = document.getElementById("byte7");
const byte8 = document.getElementById("byte8");
const byte9 = document.getElementById("byte9");
const byte10 = document.getElementById("byte10");
const byte11 = document.getElementById("byte11");
const byte12 = document.getElementById("byte12");
const byte13 = document.getElementById("byte13");
const byte14 = document.getElementById("byte14");
const byte15 = document.getElementById("byte15");

// lookup table for the elements (easiest way i've found so far)
const byteElementTable = new Array(16);
byteElementTable[0] = byte0;
byteElementTable[1] = byte1;
byteElementTable[2] = byte2;
byteElementTable[3] = byte3;
byteElementTable[4] = byte4;
byteElementTable[5] = byte5;
byteElementTable[6] = byte6;
byteElementTable[7] = byte7;
byteElementTable[8] = byte8;
byteElementTable[9] = byte9;
byteElementTable[10] = byte10;
byteElementTable[11] = byte11;
byteElementTable[12] = byte12;
byteElementTable[13] = byte13;
byteElementTable[14] = byte14;
byteElementTable[15] = byte15;

// mouse properties
let mouseState = false;
let mouseDownInterval = -2147;

let mX = 0;
let mY = 0;

// user configuration-2147
let numBytes = 16;

// binary array for character
let bits = new Array(128) // each char will take up 8*16 bits

// make the array have a fixed length
if(Object.seal) {
    bits.fill(0);

    Object.seal(bits);
}

for(let i = 0; i < bits.length; i++) {
    bits[i] = 0;
}

// initialize draw
draw();

// basic input handlers
document.addEventListener("mousemove", function(event) {
   //  update mouse position stats
    mX = event.clientX;
    mY = event.clientY;
});

document.addEventListener("mousedown", function(event) {
    relX = mX - canvas.getBoundingClientRect().left;
    relY = mY - canvas.getBoundingClientRect().top;

    // some math to get which pixel the mouse is in
    finX = Math.round(((relX / 265)*8)-0.5);
    finY = Math.round(((relY / 529)*16)-0.5);

    // basic bounding-box check
    if(finX > -1 && finX < 8 && finY > -1 && finY < 16) {
        mouseState = !bits[(finY*8)+finX];
    }

    // finally let user drag their mouse to draw
    if(mouseDownInterval == -2147) {
        mouseDownInterval = setInterval(MouseDown,10);
    }

});

document.addEventListener("mouseup", function(event) {
    clearInterval(mouseDownInterval);
    mouseDownInterval = -2147;
});

// handle drawing
function MouseDown() {
    // get position of cursor relative to the canvas origin
    relX = mX - canvas.getBoundingClientRect().left;
    relY = mY - canvas.getBoundingClientRect().top;

    // some math to get which pixel the mouse is in
    finX = Math.round(((relX / 265)*8)-0.5);
    finY = Math.round(((relY / 529)*16)-0.5);

    // basic bounding-box check
    if(finX > -1 && finX < 8 && finY > -1 && finY < 16) {

        if(bits[(finY*8)+finX] != mouseState) {
            bits[(finY*8)+finX] = mouseState;
            draw();
        }
    }
}

// redraw the canvas to display the bits
function draw() {
    // make the outlines noticable
    context.fillStyle = "rgb(128,128,128)";
    context.fillRect(0,0,265,529);

    // draw squares
    for(let i = 0; i < 128; i++) {
        x = ((i % 8)*33)+1;
        y = (((i / 8)*33)+1);

        if(bits[i] > 0) {
            context.fillStyle = "rgb(255,255,255)";
        }
        else {
            context.fillStyle = "rgb(0,0,0)";
    }


        context.fillRect(x,y-(y%33)+1,32,32);

        //context.fillStyle = "rgb(128,128,128)";
        //context.fillText(i,x+2 ,(y-(y%33))+30);
    }

    updateBinary();
    updatePreviews();
}

// update the previews to show the char at different sizes
function updatePreviews() {
    // 32x
    for(let i = 0; i < 128; i++) {
        x = ((i % 8)*4);
        y = (((i / 8)*4));

        if(bits[i] > 0) {
            context_p32.fillStyle = "rgb(255,255,255)";
        }
        else {
            context_p32.fillStyle = "rgb(0,0,0)";
        }

        context_p32.fillRect(x,y-(y%4),4,4);
    }

    // 64x
    for(let i = 0; i < 128; i++) {
        x = ((i % 8)*8);
        y = (((i / 8)*8));

        if(bits[i] > 0) {
            context_p64.fillStyle = "rgb(255,255,255)";
        }
        else {
            context_p64.fillStyle = "rgb(0,0,0)";
        }

        context_p64.fillRect(x,y-(y%8),8,8);
    }

    // 128x
    for(let i = 0; i < 128; i++) {
        x = ((i % 8)*16);
        y = (((i / 8)*16));

        if(bits[i] > 0) {
            context_p128.fillStyle = "rgb(255,255,255)";
        }
        else {
            context_p128.fillStyle = "rgb(0,0,0)";
        }

        context_p128.fillRect(x,y-(y%16),16,16);
    }
}

// update the binary to correspond to the bit map
function updateBinary() {
    for(let i = 0; i < 16; i++) {
        let binary = ['0','0','0','0','0','0','0','0'];

        index = 8*i;

        binary[0] = +bits[index+0];
        binary[1] = +bits[index+1];
        binary[2] = +bits[index+2];
        binary[3] = +bits[index+3];
        binary[4] = +bits[index+4];
        binary[5] = +bits[index+5];
        binary[6] = +bits[index+6];
        binary[7] = +bits[index+7];

        byteElementTable[i].textContent = binary.join("") + ",";
    }
}

// clear button
function clearMap() {
    bits.fill(0);
    draw();

    // fix issues with console
    clearInterval(mouseDownInterval);
}

// invert button
function invertMap() {
    for(let i = 0; i < 128; i++) {
        bits[i] = !bits[i];
    }
    draw();

    // fix issues with console
    clearInterval(mouseDownInterval);
}

// allow user to change modes with dropdown
function changeMode() {
    if(typeSel.value == 0) {
        // vga
        canvas.height = 529;
        binary.style.height = "529px";
        preview.style.height = "529px";
        vgaByteDiv.style.display = "block";
        numBytes = 16;
        fixedArraySize.textContent = 16;

        // also set previews
        canvas_p32.height = 64;
        canvas_p64.height = 128;
        canvas_p128.height = 256;

        // reset
        bits.fill(0);
        draw();
    }
    if(typeSel.value == 1) {
        // petscii
        canvas.height = 265;
        binary.style.height = "265px";
        preview.style.height = "265px";
        vgaByteDiv.style.display = "none";
        numBytes = 8;
        fixedArraySize.textContent = 8;

        // also set previews
        canvas_p32.height = 32;
        canvas_p64.height = 64;
        canvas_p128.height = 128;

        // reset
        bits.fill(0);
        draw();
    }
}

// allow user to copy the character
async function copyChar() {
    let text = ("");
    for(let ii = 0; ii < numBytes; ii++) {
        binStr = new Array(8);

        for(let i = 0; i < 8; i++) {
            binStr[i] = +bits[(ii*8)+i];
        }

        text += "0b" + binStr.join("") + ",\n    ";
    }

    navigator.clipboard.writeText("static uint8_t _CHARAC[8] = {\n    " + text + "\n};");
}
