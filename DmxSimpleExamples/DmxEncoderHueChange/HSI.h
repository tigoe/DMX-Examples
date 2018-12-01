
unsigned long hsiToRgbw(float hue, float saturation, float intensity) {
  unsigned long result = 0;                  // the RGBW result you'll return
  unsigned long r, g, b, w;                  // red, green, blue, white
  hue = constrain(hue, 0, 360);              // constrain hue to 0-360
  hue = hue * PI / 180;                      // Convert to radians.
  saturation = constrain(saturation / 100, 0, 1); // constrain to 0-1
  intensity = constrain(intensity / 100, 0, 1);   // constrain to 0-1

  // if hue is in the red/green sector:
  if (hue < 2 * PI / 3) {
    r = saturation * 255 * intensity / 3 * (1L + cos(hue) / cos((PI / 3) - hue));
    g = saturation * 255 * intensity / 3 * (1L + (1 - cos(hue) / cos((PI / 3) - hue)));
    b = 0;
    // if hue is in the green/blue sector:
  } else if (hue < 4 * PI / 3) {
    hue = hue - (2 * PI / 3);
    g = saturation * 255 * intensity / 3 * (1L + cos(hue) / cos((PI / 3) - hue));
    b = saturation * 255 * intensity / 3 * (1L + (1 - cos(hue) / cos((PI / 3) - hue)));
    r = 0;
    // if hue is in the red/blue sector:
  } else {
    hue = hue - (4 * PI / 3);
    b = saturation * 255 * intensity / 3 * (1L + cos(hue) / cos((PI / 3) - hue));
    r = saturation * 255 * intensity / 3 * (1L + (1 - cos(hue) / cos((PI / 3) - hue)));
    g = 0;
  }
  // white is a function of saturation and intensity regardless of hue:
  w = 255 * (1 - saturation) * intensity;

  // assemble the results into a single 4-byte number:
  result = (w << 24) | (r << 16) | (g << 8) | b;
  // return result:
  return result;
}


unsigned long hsiToRgb(float hue, float saturation, float intensity) {
  unsigned long result = 0;                  // the RGB result you'll return
  byte r, g, b;                              // red, green, blue
  hue = constrain(hue, 0, 360);              // constrain hue to 0-360
  hue = hue * PI / 180;                      // Convert to radians.
  saturation = constrain(saturation / 100, 0, 1); // constrain to 0-1
  intensity = constrain(intensity / 100, 0, 1);   // constrain to 0-1

  // if hue is in the red/green sector:
  if (hue < 2 * PI / 3) {
    r = 255 * intensity / 3 * (1 + saturation * cos(hue) / cos((PI / 3) - hue));
    g = 255 * intensity / 3 * (1 + saturation * (1 - cos(hue) / cos((PI / 3) - hue)));
    b = 255 * intensity / 3 * (1 - saturation);
    // if hue is in the green/blue sector:
  } else if (hue < 4 * PI / 3) {
    hue = hue - (2 * PI / 3);
    g = 255 * intensity / 3 * (1 + saturation * cos(hue) / cos((PI / 3) - hue));
    b = 255 * intensity / 3 * (1 + saturation * (1 - cos(hue) / cos((PI / 3) - hue)));
    r = 255 * intensity / 3 * (1 - saturation);
    // if hue is in the red/blue sector:
  } else {
    hue = hue - (4 * PI / 3);
    b = 255 * intensity / 3 * (1 + saturation * cos(hue) / cos((PI / 3) - hue));
    r = 255 * intensity / 3 * (1 + saturation * (1 - cos(hue) / cos((PI / 3) - hue)));
    g = 255 * intensity / 3 * (1 - saturation);
  }

  // assemble the results into a single 3-byte number:
  result =  (r << 16) | (g << 8) | b;

  // return result:
  return result;
}

