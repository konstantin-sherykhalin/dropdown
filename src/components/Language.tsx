import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Dropdown from './Dropdown';

const MAX_ITEMS = 10;

type LanguageType = {
    id: number;
    name: string;
};
const languages: LanguageType[] = [
    { id: 1, name: 'Русский' },
    { id: 2, name: 'Башкирский' },
];

interface Props {
    value?: number[];
    placeholder?: string;
    error?: string;
    onChange?: (value: number[]) => void;
}
const Language: FC<Props> = ({ value, placeholder = 'Язык', error = '', onChange }) => {
    const [innerValue, setInnerValue] = useState<number[]>(value ?? []);
    const [list, setList] = useState<LanguageType[]>([]);
    const [input, setInput] = useState('');

    const searchLanguage = useCallback(() => {
        const lower = input.toLowerCase();

        const found: LanguageType[] = [];
        for (const e of languages) {
            if (lower == e.name.toLowerCase().substring(0, lower.length)) found.push(e);

            if (found.length == MAX_ITEMS) break;
        }
        if (found.length < MAX_ITEMS) {
            for (const e of languages)
                if (!found.find((g) => g.id == e.id)) {
                    if (e.name.toLowerCase().indexOf(lower) >= 0) found.push(e);

                    if (found.length == MAX_ITEMS) break;
                }
        }
        setList(found);
    }, [list, input]);

    const addLanguage = useCallback(
        (id: number) => {
            const newValue = [...innerValue, id];
            setInnerValue(newValue);
            onChange?.(newValue);
            setList((list) => list.filter((e) => e.id != id));
            setInput('');
        },
        [value, onChange],
    );

    const onRevert = useCallback(() => setInput(''), []);

    useEffect(() => {
        if (input.length) searchLanguage();
        else setList([]);
    }, [input]);

    const show_dropdown = !!input.length;
    const selected = useMemo(
        () => innerValue.map((id) => languages.find((e) => e.id == id)).filter((e) => e) as LanguageType[],
        [innerValue],
    );

    return (
        <div className="field_block language">
            <div>
                <p className="field_title">Язык:</p>
                <div className="field_input language">
                    {selected.map((e) => e.name).join(', ')}
                    <input
                        className="name"
                        type="text"
                        value={input}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    {show_dropdown && <Dropdown list={list} input={input} onChange={addLanguage} revert={onRevert} />}
                </div>
                {error && <p className="field_error">{error}</p>}
            </div>
        </div>
    );
};

export default Language;
