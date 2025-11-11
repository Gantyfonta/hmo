
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

interface DrawingCanvasHandles {
  getImageData: () => string;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandles>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // For high-DPI displays
    const scale = window.devicePixelRatio;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.strokeStyle = 'white';
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);

  const getCoords = (event: MouseEvent | TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (window.TouchEvent && event instanceof TouchEvent) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top,
        };
    }
    const mouseEvent = event as MouseEvent;
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
    };
  };

  const startDrawing = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const { x, y } = getCoords(event);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    isDrawing.current = true;
  };

  const finishDrawing = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    contextRef.current?.closePath();
    isDrawing.current = false;
  };

  const draw = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;
    event.preventDefault();
    const { x, y } = getCoords(event);
    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if(canvas && context) {
      context.fillStyle = '#1e293b'; // slate-800
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  useImperativeHandle(ref, () => ({
    getImageData: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : '';
    },
  }));

  return (
    <div className='relative w-full aspect-square bg-slate-700 rounded-md overflow-hidden touch-none'>
      <canvas
        ref={canvasRef}
        className='absolute top-0 left-0 w-full h-full'
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
      />
      <button onClick={clearCanvas} className='absolute bottom-2 right-2 bg-slate-600 hover:bg-slate-500 text-white text-xs px-2 py-1 rounded'>
        Clear
      </button>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
