const jsToDB = {
    author: 'a',
    description: 'd',
    dmzj_detailLink: 'dL',
    dmzj_mainChapter: 'dM',
    dmzj_otherChapter: 'dO',
    icon: 'i',
    last: 'l',
    lastUpdate: 'lU',
    name: 'n',
    state: 's',
    type: 't',
};

const dbToJs = Object.keys(jsToDB).reduce((total, current) => {
    const value = jsToDB[current];
    total[value] = current;
    return total;
}, {});

module.exports = {
    jsToDB,
    dbToJs,
};