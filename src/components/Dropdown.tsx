import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { FoundLanguageType } from '../api/language';

interface Props {
    list: FoundLanguageType[];
    loading: boolean;
    input: string;
    onChange: (value: FoundLanguageType) => void;
    revert: () => void;
}
const Dropdown: FC<Props> = ({ list, loading, input, onChange, revert }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [selected, setSelected] = useState(-1);

    const onKeyDown = useCallback(
        (e: any) => {
            if (e.key == 'ArrowDown') {
                e.preventDefault();
                setSelected((selected) => (selected == list.length ? 0 : selected + 1));
            }
            if (e.key == 'ArrowUp') {
                e.preventDefault();
                setSelected((selected) => (selected == -1 ? list.length - 1 : selected - 1));
            }
            if (e.key == 'Enter' && list[selected]) {
                onChange(list[selected]);
                (document.activeElement as HTMLInputElement).blur();
            }
            if (e.key == 'Escape') {
                revert();
                (document.activeElement as HTMLInputElement).blur();
            }
        },
        [selected, list, onChange, revert],
    );

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selected, onkeydown]);

    useEffect(() => {
        if (ref.current) {
            if (ref.current.offsetWidth > (ref.current.parentElement?.offsetWidth ?? 0)) {
                ref.current.style.borderTopRightRadius = '8px';
            } else {
                ref.current.style.borderTopRightRadius = '0px';
            }
        }
    }, [loading, list]);

    return (
        <div ref={ref} className="dropdown">
            {loading ? (
                <div key="no" className="row">
                    Загрузка…
                </div>
            ) : list.length ? (
                list.map((language, i) => {
                    const _name = input
                        ? language.title.replace(new RegExp(input, 'i'), '<mark>$&</mark>')
                        : language.title;
                    return (
                        <div
                            key={language.id}
                            className={`row ${selected == i ? 'selected' : ''}`}
                            onMouseEnter={() => setSelected(i)}
                            onMouseLeave={() => setSelected(-1)}
                            onMouseDown={() => onChange(language)}
                        >
                            <span dangerouslySetInnerHTML={{ __html: _name }} />
                        </div>
                    );
                })
            ) : (
                <div key="no" className="row">
                    Язык не найден
                </div>
            )}
        </div>
    );
};

export default Dropdown;
