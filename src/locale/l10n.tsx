import { Children, useEffect, useState, ReactNode } from 'react';
import { negotiateLanguages } from '@fluent/langneg';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { ReactLocalization, LocalizationProvider } from '@fluent/react';

const DEFAULT_LOCALE = 'en-US';
const AVAILABLE_LOCALES = {
  'en-US': 'English',
  it: 'Italian',
};

const en = require('./translations/en-US.ftl');
const it = require('./translations/it.ftl');
const ftl = {
  'en-US': en,
  it: it,
};

async function fetchMessages(locale: string): Promise<[string, string]> {
  let response = await fetch(ftl[locale]);
  let messages = await response.text();
  return [locale, messages];
}

function* lazilyParsedBundles(fetchedMessages: Array<[string, string]>) {
  for (let [locale, messages] of fetchedMessages) {
    let resource = new FluentResource(messages);
    let bundle = new FluentBundle(locale);
    bundle.addResource(resource);
    yield bundle;
  }
}

interface AppLocalizationProviderProps {
  children: ReactNode;
}

export function AppLocalizationProvider(props: AppLocalizationProviderProps) {
  let [currentLocales, setCurrentLocales] = useState([DEFAULT_LOCALE]);
  let [l10n, setL10n] = useState<ReactLocalization | null>(null);

  useEffect(() => {
    changeLocales(navigator.languages as Array<string>);
  }, []);

  async function changeLocales(userLocales: Array<string>) {
    let currentLocales = negotiateLanguages(
      userLocales,
      Object.keys(AVAILABLE_LOCALES),
      { defaultLocale: DEFAULT_LOCALE },
    );
    setCurrentLocales(currentLocales);

    let fetchedMessages = await Promise.all(currentLocales.map(fetchMessages));

    let bundles = lazilyParsedBundles(fetchedMessages);
    setL10n(new ReactLocalization(bundles));
  }

  if (l10n === null) {
    return <div>Loading…</div>;
  }

  return (
    <>
      <LocalizationProvider l10n={l10n}>
        {Children.only(props.children)}
      </LocalizationProvider>
      <select
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '20px',
          zIndex: 1001,
        }}
        onChange={(event) => changeLocales([event.target.value])}
        value={currentLocales[0]}
      >
        {Object.entries(AVAILABLE_LOCALES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}
