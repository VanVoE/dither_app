// Basic color palette (grayscale for simplicity)
const colors = [0, 85, 170, 255]; 

export const ditherImage = (canvasRef,algo,colorArray) => {
   
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const width = canvas.width;
    const height = canvas.height;

    for(var i = 0; i < colors.length; i++){
      colors[i] = colorArray[i]
    }
   

    switch (algo) {
      case '0':
        floydSteinberg(width,height,data)
        break;
      case '1':
        jjnDithering(width,height,data)
        break;
      case '2':
        stuckiDithering(width,height,data)
        break;
      case '3':
        atkinsonDithering(width,height,data)
        break;
      case '4':
        burkesDithering(width,height,data)
      default:
        break;
    }

   

    // Put the modified image data back to the canvas
    ctx.putImageData(imgData, 0, 0);
  };

  const findNearestColor = (r, g, b) => {
    const gray = Math.round((r + g + b) / 3);
    let closestColor = 0;
    let minDistance = Infinity;
    
    colors.forEach((color) => {
      const distance = Math.abs(color - gray);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    });

    return closestColor;
  };

  // Floyd-Steinberg dithering
  const floydSteinberg = (width,height,data) => {
    

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4; // Get the index of the pixel in the data array
          const r = data[index];     
          const g = data[index + 1]; 
          const b = data[index + 2]; 
  
          // Find the closest color from the palette
          const newColor = findNearestColor(r, g, b);
  
          // Calculate the quantization error
          const error = r - newColor;
  
          // Set the pixel to the new color (grayscale)
          data[index] = newColor;        // Red channel
          data[index + 1] = newColor;    // Green channel
          data[index + 2] = newColor;    // Blue channel
  
          // Distribute the error to neighboring pixels
          // Right
          if (x + 1 < width) {
            const rightIndex = (y * width + (x + 1)) * 4;
            data[rightIndex] += error * 7 / 16;
          }
  
          // Bottom Left
          if (x - 1 >= 0 && y + 1 < height) {
            const bottomLeftIndex = ((y + 1) * width + (x - 1)) * 4;
            data[bottomLeftIndex] += error * 3 / 16;
          }
  
          // Bottom
          if (y + 1 < height) {
            const bottomIndex = ((y + 1) * width + x) * 4;
            data[bottomIndex] += error * 5 / 16;
          }
  
          // Bottom Right
          if (x + 1 < width && y + 1 < height) {
            const bottomRightIndex = ((y + 1) * width + (x + 1)) * 4;
            data[bottomRightIndex] += error * 1 / 16;
          }
        }
      }

      return data

  }

// Jarvis, Judice, and Ninke dithering
  const jjnDithering = (width,height,data) => {

  // Error diffusion matrix for JJN Dithering
   const errorMatrix = [
    [0, 0, 7 / 48, 5 / 48, 3 / 48],
    [3 / 48, 5 / 48, 7 / 48, 5 / 48, 3 / 48],
    [3 / 48, 5 / 48, 7 / 48, 5 / 48, 3 / 48],
  ];


  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4; // Get the index of the pixel in the data array
      const r = data[index];     
      const g = data[index + 1]; 
      const b = data[index + 2]; 

      // Find the nearest color from the palette
      const newColor = findNearestColor(r, g, b);

      // Calculate the quantization error
      const error = r - newColor;

      // Set the pixel to the new color (grayscale)
      data[index] = newColor;        // Red channel
      data[index + 1] = newColor;    // Green channel
      data[index + 2] = newColor;    // Blue channel

      // Distribute the error to neighboring pixels
      // Loop through the error matrix to distribute the error
      for (let dy = 0; dy < errorMatrix.length; dy++) {
        for (let dx = 0; dx < errorMatrix[dy].length; dx++) {
          const nx = x + dx - 2;  // Offset relative to current pixel
          const ny = y + dy - 1;  // Offset relative to current pixel
          const weight = errorMatrix[dy][dx];

          // Only distribute to pixels within the bounds of the canvas
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborIndex = (ny * width + nx) * 4;
            data[neighborIndex] += error * weight;
          }
        }
      }
    }
  }
  return data
}


 // Stucki dithering
const stuckiDithering = (width,height,data) => {

    // Error diffusion matrix for Stucki Dithering
    const errorMatrix = [
        [0,    0,   8 / 42,  4 / 42,  2 / 42],
        [2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
        [2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
        [2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
        [0,    0,   8 / 42,  4 / 42,  2 / 42],
      ];
  
     
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4; // Get the index of the pixel in the data array
          const r = data[index];     // Red channel
          const g = data[index + 1]; // Green channel
          const b = data[index + 2]; // Blue channel
  
          // Find the nearest color from the palette
          const newColor = findNearestColor(r, g, b);
  
          // Calculate the quantization error
          const error = r - newColor;
  
          // Set the pixel to the new color (grayscale)
          data[index] = newColor;        // Red channel
          data[index + 1] = newColor;    // Green channel
          data[index + 2] = newColor;    // Blue channel
  
          // Distribute the error to neighboring pixels
          for (let dy = 0; dy < errorMatrix.length; dy++) {
            for (let dx = 0; dx < errorMatrix[dy].length; dx++) {
              const nx = x + dx - 2;  // Offset relative to current pixel
              const ny = y + dy - 2;  // Offset relative to current pixel
              const weight = errorMatrix[dy][dx];
  
              // Only distribute to pixels within the bounds of the canvas
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = (ny * width + nx) * 4;
                data[neighborIndex] += error * weight;
              }
            }
          }
        }
      }


    return data
}

// Atkinson dithering
const atkinsonDithering = (width, height, data) => {

     // Error diffusion matrix for Atkinson Dithering
     const errorMatrix = [
        [0, 0, 1 / 8, 1 / 8],   // Row 1: right and bottom-right pixels get error
        [1 / 8, 1 / 8, 1 / 8, 0], // Row 2: bottom-left and bottom pixels get error
        [0, 1 / 8, 1 / 8, 0]    // Row 3: bottom-left and bottom pixels get error
      ];
  
    
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4; // Get the index of the pixel in the data array
          const r = data[index];     // Red channel
          const g = data[index + 1]; // Green channel
          const b = data[index + 2]; // Blue channel
  
          // Find the nearest color from the palette
          const newColor = findNearestColor(r, g, b);
  
          // Calculate the quantization error
          const error = r - newColor;
  
          // Set the pixel to the new color (grayscale)
          data[index] = newColor;        // Red channel
          data[index + 1] = newColor;    // Green channel
          data[index + 2] = newColor;    // Blue channel
  
          // Distribute the error to neighboring pixels
          for (let dy = 0; dy < errorMatrix.length; dy++) {
            for (let dx = 0; dx < errorMatrix[dy].length; dx++) {
              const nx = x + dx - 2;  // Offset relative to current pixel
              const ny = y + dy - 1;  // Offset relative to current pixel
              const weight = errorMatrix[dy][dx];
  
              // Only distribute to pixels within the bounds of the canvas
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = (ny * width + nx) * 4;
                data[neighborIndex] += error * weight;
              }
            }
          }
        }
      }


    return data
}

// Burkes Dithering

const burkesDithering = (width, height, data) => {

    // Error diffusion matrix for Burkes Dithering
    const errorMatrix = [
        [0,    0,    8 / 32,  4 / 32,  2 / 32],
        [2 / 32,  4 / 32,  8 / 32,  4 / 32,  2 / 32],
        [2 / 32,  4 / 32,  8 / 32,  4 / 32,  2 / 32],
        [2 / 32,  4 / 32,  8 / 32,  4 / 32,  2 / 32],
        [0,    0,    8 / 32,  4 / 32,  2 / 32],
      ];
  
     
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4; // Get the index of the pixel in the data array
          const r = data[index];     // Red channel
          const g = data[index + 1]; // Green channel
          const b = data[index + 2]; // Blue channel
  
          // Find the nearest color from the palette
          const newColor = findNearestColor(r, g, b);
  
          // Calculate the quantization error
          const error = r - newColor;
  
          // Set the pixel to the new color (grayscale)
          data[index] = newColor;        // Red channel
          data[index + 1] = newColor;    // Green channel
          data[index + 2] = newColor;    // Blue channel
  
          // Distribute the error to neighboring pixels
          for (let dy = 0; dy < errorMatrix.length; dy++) {
            for (let dx = 0; dx < errorMatrix[dy].length; dx++) {
              const nx = x + dx - 2;  // Offset relative to current pixel
              const ny = y + dy - 2;  // Offset relative to current pixel
              const weight = errorMatrix[dy][dx];
  
              // Only distribute to pixels within the bounds of the canvas
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = (ny * width + nx) * 4;
                data[neighborIndex] += error * weight;
              }
            }
          }
        }
      }


    return data
}