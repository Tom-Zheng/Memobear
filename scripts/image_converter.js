function To1BitBmp(img, width, height) {
  // ref: http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm
  function colorAt(img, x, y) {
    let idx = (y * width + x) * 4;
    return {
      r: img.data[idx],
      g: img.data[idx+1],
      b: img.data[idx+2],
      a: img.data[idx+3]
    };
  }
  var file = "";
  var widthPad = "\0".repeat((4 - (Math.ceil(width / 8) % 4)) % 4);

  var size = 62 + (Math.ceil(width / 8) + widthPad.length) * height;

  header = new Object();

  header["identifier"] = "BM";
  header["file_size"] = pack(size, 4);
  header["reserved"] = pack(0, 4);
  header["bitmap_data"] = pack(62, 4);
  header["header_size"] = pack(40, 4);
  header["width"] = pack(width, 4);
  header["height"] = pack(height, 4);
  header["planes"] = pack(1, 2);
  header["bits_per_pixel"] = pack(1, 2);
  header["compression"] = pack(0, 4);
  header["data_size"] = pack(0, 4);
  header["h_resolution"] = pack(0, 4);
  header["v_resolution"] = pack(0, 4);
  header["colors"] = pack(0, 4);
  header["important_colors"] = pack(0, 4);
  header["white"] = chr(255) + chr(255) + chr(255) + chr(0);
  header["black"] = chr(0) + chr(0) + chr(0) + chr(0);
  for (val of Object.values(header)) {
    file += val;
  }

  var str = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = colorAt(img, x, y);
      const gs = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
      let bit = gs > 150 ? "0" : "1";
      str = str + bit;
      if (x == width - 1) {
        str = str_pad(str, 8, "0");
      }
      if (str.length == 8) {
        file += chr(Number.parseInt(str, 2));
        str = "";
      }
    }
    file += widthPad;
  }

  return file;
}

function pack(n, nBytes) {
  var bytes = "";
  var num = Number(n);
  for (let step = 0; step < nBytes; step++) {
    bytes += String.fromCharCode(num & 0xff);
    num >>>= 8;
  }
  return bytes;
};

function chr(n) {
  return String.fromCharCode(n & 0xff);
}

function str_pad(input, len, c) {
  let rem = len - input.length;
  if (rem > 0) {
    return input + c.repeat(rem);
  } else {
    return input;
  }
}