import { FC, useState } from 'react';
import useSWR from 'swr';

import { FoundLanguageType, getAll } from '../api/language';
import Language from './Language';

interface Props {
    type: 'prefetch' | 'search';
}
const LanguageExample: FC<Props> = ({ type }) => {
    if (type == 'prefetch') return <LanguagePrefetch />;
    return <LanguageSearch />;
};

const LanguagePrefetch: FC = () => {
    const [value, setValue] = useState<FoundLanguageType[]>([]);

    const { data, error } = useSWR('getAll', getAll);

    return (
        <div className="field_block language">
            <p className="field_title">Предзагрузка:</p>
            <Language
                dict={data}
                value={value}
                placeholder={error ? 'Ошибка' : data ? 'Язык' : 'Загрузка…'}
                disabled={error || !data}
                onChange={setValue}
            />
        </div>
    );
};

const LanguageSearch: FC = () => {
    const [value, setValue] = useState<FoundLanguageType[]>([]);

    return (
        <div className="field_block language">
            <p className="field_title">Поиск при вводе:</p>
            <Language value={value} onChange={setValue} />
        </div>
    );
};

export default LanguageExample;
