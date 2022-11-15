import { FC, useCallback, useEffect, useState } from 'react';

type LanguageType = {
    id: number;
    name: string;
};

interface Props {
    list: LanguageType[];
    input: string;
    onChange: (value: number) => void;
    revert: () => void;
}
const Dropdown: FC<Props> = ({ list, input, onChange, revert }) => {
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
                onChange(list[selected].id);
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

    return (
        <div className="dropdown">
            {list.length ? (
                list.map(({ id, name }, i) => {
                    const _name = input ? name.replace(new RegExp(input, 'i'), '<mark>$&</mark>') : name;
                    return (
                        <div
                            key={id}
                            className={`row ${selected == i ? 'selected' : ''}`}
                            onMouseEnter={() => setSelected(i)}
                            onMouseLeave={() => setSelected(-1)}
                            onMouseDown={() => onChange(id)}
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
