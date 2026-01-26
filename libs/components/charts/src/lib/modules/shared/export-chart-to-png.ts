import { ElementRef } from '@angular/core';

import { Chart } from 'chart.js';

/**
 * Exports a Chart.js chart to a PNG image.
 * @param chart
 * @param canvasRef
 * @returns
 */
export function exportChartToPng(
  chart: Chart,
  canvasRef: ElementRef<HTMLCanvasElement>,
): void {
  if (!chart) {
    return;
  }

  const sourceCanvas = canvasRef.nativeElement;

  // Create a temporary canvas with white background
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sourceCanvas.width;
  tempCanvas.height = sourceCanvas.height;

  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) {
    return;
  }

  // Fill with white background
  tempContext.fillStyle = '#ffffff';
  tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the chart on top of the white background
  tempContext.drawImage(sourceCanvas, 0, 0);

  // Export the temporary canvas
  const imageBase64 = tempCanvas.toDataURL('image/png');
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = imageBase64;
  link.download = 'chart.png';
  link.click();
}
