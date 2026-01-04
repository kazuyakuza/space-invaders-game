export class PlayerController {
  public press(keyCode: string): void {
    const keyMap: Record<string, string> = {
      'Space': ' ',
    };
    const key = keyMap[keyCode] || keyCode;
    document.dispatchEvent(new KeyboardEvent('keydown', { 
      key,
      code: keyCode,
      bubbles: true,
      cancelable: true 
    }));
  }

  public release(keyCode: string): void {
    const keyMap: Record<string, string> = {
      'Space': ' ',
    };
    const key = keyMap[keyCode] || keyCode;
    document.dispatchEvent(new KeyboardEvent('keyup', { 
      key,
      code: keyCode,
      bubbles: true,
      cancelable: true 
    }));
  }
}