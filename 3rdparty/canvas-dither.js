// Convert image data to greyscale based on luminance.
function greyscale_luminance(image) {
  for (var i = 0; i <= image.data.length; i += 4) {
    image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(
      image.data[i] * 0.21 +
        image.data[i + 1] * 0.71 +
        image.data[i + 2] * 0.07,
      10
    );
  }

  return image;
}

// Convert image data to greyscale based on average of R, G and B values.
function greyscale_average(image) {
  for (var i = 0; i <= image.data.length; i += 4) {
    image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(
      (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3,
      10
    );
  }

  return image;
}

// Apply Atkinson Dither to Image Data
function dither_atkinson(image, imageWidth, drawColour) {
  skipPixels = 4;

  if (!drawColour) drawColour = false;

  if (drawColour == true) skipPixels = 1;

  imageLength = image.data.length;

  for (
    currentPixel = 0;
    currentPixel <= imageLength;
    currentPixel += skipPixels
  ) {
    if (image.data[currentPixel] <= 128) {
      newPixelColour = 0;
    } else {
      newPixelColour = 255;
    }

    err = parseInt((image.data[currentPixel] - newPixelColour) / 8, 10);
    image.data[currentPixel] = newPixelColour;

    image.data[currentPixel + 4] += err;
    image.data[currentPixel + 8] += err;
    image.data[currentPixel + 4 * imageWidth - 4] += err;
    image.data[currentPixel + 4 * imageWidth] += err;
    image.data[currentPixel + 4 * imageWidth + 4] += err;
    image.data[currentPixel + 8 * imageWidth] += err;

    if (drawColour == false)
      image.data[currentPixel + 1] = image.data[currentPixel + 2] =
        image.data[currentPixel];
  }

  return image.data;
}
