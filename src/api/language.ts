export type LanguageType = {
    id: number;
    name_ru: string;
    name_en: string;
    name_native: string;
    iso1: string;
    iso2: string;
    iso3: string;
    gost_lat: string;
    gost_cyr: string;
    gost_num: number;
};
export type FoundLanguageType = LanguageType & { title: string };

const MAX_ITEMS = 10;

export async function getAll() {
    await new Promise((res) => setTimeout(res, (1 + Math.random()) * 500));
    const data: LanguageType[] = await fetch('http://gonki.me/api/v1/language.php?all').then((e) => e.json());
    return data.slice(1);
}

export async function getLanguage(name: string) {
    const lower = name.toLowerCase();
    // Метода поиска по названию языка у меня пока нет
    // Поэтому сделаем вид, что он делается на сервере
    const data: LanguageType[] = await getAll();
    return findInDict(data, lower);
}

export function findInDict(dict: LanguageType[], name: string) {
    const found: FoundLanguageType[] = [];
    for (const e of dict)
        if (e.name_native || e.name_ru || e.name_en) {
            if (name == e.name_native.toLowerCase().substring(0, name.length)) {
                found.push({ ...e, title: e.name_native });
            } else if (name == e.name_ru.toLowerCase().substring(0, name.length)) {
                found.push({ ...e, title: e.name_ru });
            } else if (name == e.name_en.toLowerCase().substring(0, name.length)) {
                found.push({ ...e, title: e.name_en });
            }
            if (found.length == MAX_ITEMS) break;
        }
    if (found.length < MAX_ITEMS) {
        for (const e of dict) {
            if ((e.name_native || e.name_ru || e.name_en) && !found.find((g) => g.id == e.id)) {
                if (e.name_native.toLowerCase().indexOf(name) >= 0) {
                    found.push({ ...e, title: e.name_native });
                } else if (e.name_ru.toLowerCase().indexOf(name) >= 0) {
                    found.push({ ...e, title: e.name_ru });
                } else if (e.name_en.toLowerCase().indexOf(name) >= 0) {
                    found.push({ ...e, title: e.name_en });
                }
                if (found.length == MAX_ITEMS) break;
            }
        }
    }
    return found;
}
