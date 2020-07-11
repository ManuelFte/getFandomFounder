
(async () => {
  /* eslint-env browser */
  /* global wgCityId wgContentLanguage */
  'use strict';

  const getJSON = async (url) => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/hal+json'
      }
    });

    if (!response.ok) {
      return console.log('HTTP Error: ' + response.status);
    }

    const json = await response.json();

    return json;
  };

  const wikiInfo = await getJSON(`https://community.fandom.com/api/v1/Wikis/Details?ids=${wgCityId}`);
  const founderID = wikiInfo?.items?.[wgCityId]?.founding_user_id;

  if (!founderID || founderID === '0') {
    return console.log('Founder not found.');
  }

  const lang = wgContentLanguage === 'en' ? null : wgContentLanguage;
  const founderInfo = await getJSON('/' + [lang, `api/v1/User/Details?ids=${founderID}`].filter(Boolean).join('/'));
  const founderName = founderInfo.items?.[0]?.title;

  if (!founderName) {
    return console.log('Founder not found.');
  }

  const founderProfileURL = [`https://${window.location.hostname}`, lang, `wiki/User:${founderName}`].filter(Boolean).join('/');

  console.log('Founder found!');
  console.log('Username: ' + founderName);
  console.log('Profile: ' + founderProfileURL);
})();
