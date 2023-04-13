function debounce(func: (...args: any[]) => void, wait: number, immediate: boolean = false) {
  let timeout: number | null = null;

  return function executedFunction(this: unknown) {
    const context = this;
    const args: any = arguments;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
	
    clearTimeout(Number(timeout));

    timeout = window.setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
}

export default debounce;
