import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { findInDict, FoundLanguageType, getLanguage, LanguageType } from '../api/language';
import { useDebounce } from '../hooks/useDebounce';
import Dropdown from './Dropdown';

type UsingLanguageType = LanguageType & { title?: string };

interface Props {
    dict?: UsingLanguageType[];
    value?: FoundLanguageType[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    onChange?: (value: FoundLanguageType[]) => void;
}
const Language: FC<Props> = ({ dict, value, placeholder = 'Язык', disabled, error = '', onChange }) => {
    const [innerValue, setInnerValue] = useState<FoundLanguageType[]>(value ?? []);
    const [innerError, setInnerError] = useState<string>(error ?? '');

    const [list, setList] = useState<FoundLanguageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    const searchLanguage = useCallback(async () => {
        if (dict) {
            const lower = input.toLowerCase();
            const found = findInDict(dict, lower);
            setList(found);
        } else {
            setInnerError('');
            try {
                const found = await getLanguage(input);
                setList(found);
            } catch (err) {
                setInnerError(`${err}`);
            } finally {
                setLoading(false);
            }
        }
    }, [dict, list, input]);

    const addLanguage = useCallback(
        (language: FoundLanguageType) => {
            const newValue = [...innerValue, language];
            setInnerValue(newValue);
            if (onChange) onChange(newValue);
            setInput('');
        },
        [value, onChange],
    );
    const removeLanguage = useCallback(
        (id: number) => () => {
            const newValue = innerValue.filter((e) => e.id != id);
            setInnerValue(newValue);
            if (onChange) onChange(newValue);
        },
        [value, onChange],
    );

    const onRevert = useCallback(() => setInput(''), []);

    const debouncedInput = useDebounce(input, 700);
    useEffect(() => {
        if (dict) {
            if (input.length) searchLanguage();
            else setList([]);
        } else {
            setLoading(!!input.length);
        }
    }, [dict, input]);
    useEffect(() => {
        if (!dict) {
            if (debouncedInput.length) searchLanguage();
            else setList([]);
        }
    }, [dict, debouncedInput]);

    const listWithoutSelected = useMemo(
        () => list.filter((e) => !innerValue.map((g) => g.id).includes(e.id)),
        [list, innerValue],
    );

    return (
        <>
            <div className={`field_input ${input.length ? 'dropdown' : ''}`}>
                {innerValue.map((e) => (
                    <div key={e.id} className="item">
                        {e.title ?? e.name_ru} <button onClick={removeLanguage(e.id)}>&times;</button>
                    </div>
                ))}
                <input
                    className="name"
                    type="text"
                    value={input}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    onChange={(e) => setInput(e.target.value)}
                />
                {!!input.length && (
                    <Dropdown
                        list={listWithoutSelected}
                        loading={loading}
                        input={input}
                        onChange={addLanguage}
                        revert={onRevert}
                    />
                )}
            </div>
            {error ? <p className="field_error">{error}</p> : innerError && <p className="field_error">{innerError}</p>}
        </>
    );
};

export default Language;
