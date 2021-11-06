import { useDispatch } from 'react-redux';
import { updateTheme } from 'src/store/reducer';
import themes, { Themes } from '../themes';

export const THEME_TOKEN = '@oku-theme';

export const fetchTheme = () => themes[localStorage.getItem(THEME_TOKEN) ?? Themes.MAIN];

const useTheme = () => {

    const dispatch = useDispatch();

    const setTheme = (t: Themes) => {
        localStorage.setItem(THEME_TOKEN, t)
        dispatch(updateTheme(themes[t]));
    };

    const nextTheme = () => {
        const names = Object.values(Themes);
        let index = names.findIndex(t => t === localStorage.getItem(THEME_TOKEN) as Themes) ?? 0;

        index++;
        index %= names.length;
        console.log(index)
        dispatch(updateTheme(themes[names[index]]));
        localStorage.setItem(THEME_TOKEN, names[index])
    };

    return { setTheme, nextTheme };
};

export default useTheme;
