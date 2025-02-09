/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Compressor } from './Compressor';

const compressor = new Compressor();

interface Handlers {
  clear: () => void;
  addEvent: (data: string) => void;
  finish: () => void;
}

const handlers: Handlers = {
  clear: () => {
    compressor.clear();
    return '';
  },

  addEvent: (data: string) => {
    return compressor.addEvent(data);
  },

  finish: () => {
    return compressor.finish();
  },
};

export function handleMessage(e: MessageEvent): void {
  const method = e.data.method as string;
  const id = e.data.id as number;
  const data = e.data.arg as string;

  // @ts-ignore this syntax is actually fine
  if (method in handlers && typeof handlers[method] === 'function') {
    try {
      // @ts-ignore this syntax is actually fine
      const response = handlers[method](data);
      // @ts-ignore this syntax is actually fine
      postMessage({
        id,
        method,
        success: true,
        response,
      });
    } catch (err) {
      // @ts-ignore this syntax is actually fine
      postMessage({
        id,
        method,
        success: false,
        response: err.message,
      });

      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
