import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

type AnyFunction<T = any> = (...args: any) => T;

export const useDebounce = <T = any>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useDebouncedCallback = <T = any>(callback: AnyFunction<T>, debounceTime: number): AnyFunction => {
    return useCallback(
        debounce((...args: any) => {
            callback(...args);
        }, debounceTime),
        [callback],
    );
};
