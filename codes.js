const canvas = document.getElementById('designer');
const begin_btn = document.getElementById('begin');
const ctx = canvas.getContext('2d');
let defined_padding_horizontal = 100;
let defined_padding_vertical = 100;
let img_width = 1920;
let img_height = 1080;
let img_count = 2;
let loadingImage = 0;
let started = false;
let npre = "picture (";
let nsur = ").png";
let exnpre = "Tagged";
let exnsur = ".jpg";

// Template Image
let img_tag = new Image();
let img = new Image();

img_tag.src = 'Image Template/Tag-Template.png'

const tagLocation = {
    "top-left": function () { return tagLocations[0] },
    "top-right": function () { return tagLocations[1] },
    "middle-left": function () { return tagLocations[2] },
    "middle-right": function () { return tagLocations[3] },
    "bottom-left": function () { return tagLocations[4] },
    "bottom-right": function () { return tagLocations[5] },
};

const tagLocations = [
    {
        name: "top-left",
        v_method: "additive",
        h_method: "additive",
        x: function () { return 0 },
        y: function () { return 0 },
        middle: false,
    },
    {
        name: "top-right",
        v_method: "additive",
        h_method: "subtractive",
        x: function () { return img.width },
        y: function () { return 0 },
        middle: false,
    },
    {
        name: "middle-left",
        v_method: "none",
        h_method: "additive",
        x: function () { return 0 },
        y: function () { return  (img.height/2) },
        middle: true,
    },
    {
        name: "middle-right",
        v_method: "none",
        h_method: "subtractive",
        x: function () { return img.width },
        y: function () { return (img.height/2) },
        middle: true,
    },
    {
        name: "bottom-left",
        v_method: "subtractive",
        h_method: "additive",
        x: function () { return 0 },
        y: function () { return img.height },
        middle: false,
    },
    {
        name: "bottom-right",
        v_method: "subtractive",
        h_method: "subtractive",
        x: function () { return img.width },
        y: function () { return img.height },
        middle: false,
    }
]

function offset(a, b, method, sub, middle) {
    if(middle){
        a = a - (sub/2);
    }

    if (method == "additive") {
        return (a + b);
    }
    else if (method == "subtractive") {
        return (a - (b + sub));
    } else {
        return a;
    }
}

function placeAnImage(img) {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    console.log('Drawn the image.');
}

function placeTag(temp_img, loc) {
    const ctx = canvas.getContext('2d');
    // debugger
    ctx.drawImage(
        temp_img,
        offset(loc.x(), defined_padding_horizontal, loc.h_method, img_tag.width, loc.middle),
        offset(loc.y(), defined_padding_vertical, loc.v_method, img_tag.height, loc.middle)
        );
}

function exportCurrent(count) {
    // Set The Canvas To A URL And Cause it To download
    const dataURI = canvas.toDataURL('image/jpeg');
    let link = document.createElement("a");
    link.href = dataURI;
    link.download = exnpre + "-" + count + exnsur;
    link.innerHTML = "Click here to download the file";
    link.click();
}

function recursiveProcess(count) {
    if (count > img_count) {
        return
    }

    const img_name = npre + count + nsur;
    img.src = 'Images/' + img_name;
    img_width = img.width;
    img_height = img.height;

    loadingImage = setInterval(function () {
        console.log("Started Interval");
        if (img.complete) {
            clearInterval(loadingImage);

            console.log("Interval Done");

            placeAnImage(img);

            placeTag(img_tag, tagLocation[selectedLocation]())

            exportCurrent(count);

            count++;

            recursiveProcess(count);

            console.log("Something");
        } else {
            console.log("Yet Nothing");
        }
    }, 1000);
}

function startTheProcess() {
    if(started) return;
    // loadSequence();
    npre = document.getElementById('fileNamePrefix').value;
    nsur = document.getElementById('fileNameSurfix').value;
    exnpre = document.getElementById('exNamePrefix').value;
    img_count = Number(document.getElementById('image_count').value);
    selectedLocation = document.getElementById('selectedLocation').value;
    defined_padding_vertical = Number(document.getElementById('vertical_offset').value);
    defined_padding_horizontal = Number(document.getElementById('horizontal_offset').value);

    // Start
    recursiveProcess(1);
}

window.onload = function () {
    //Set Button To Start Operation
    begin_btn.addEventListener('click', startTheProcess, false);
};