import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { isAbortError } from '../utils/isAbortError';

type Loader<T> = (signal: AbortSignal) => Promise<T[]>;

export interface AsyncListReturn<T> {
    data: T[];
    setData: Dispatch<SetStateAction<T[]>>;
    loading: boolean;
    error: string;
    setError: Dispatch<SetStateAction<string>>;
    reload: () => void;
}

export function useAsyncList<T>(loader: Loader<T>): AsyncListReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => {
        setReloadToken((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const result = await loader(controller.signal);
                setData(Array.isArray(result) ? result : []);
            } catch (err) {
                if (!isAbortError(err)) {
                    setError(
                        err instanceof Error ? err.message : 'Error al cargar los datos',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            controller.abort();
        };
    }, [loader, reloadToken]);

    return {
        data,
        setData,
        loading,
        error,
        setError,
        reload,
    };
}