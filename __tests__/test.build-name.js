import buildName from "../src/build-name.js";

const cases = [
    {
        source: 'https://ru.hexlet.io/courses',
        expected: 'ru-hexlet-io-courses.html',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/assets/professions/nodejs.png',
        expected: 'ru-hexlet-io-assets-professions-nodejs.png',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/assets/application.css',
        expected: 'ru-hexlet-io-assets-application.css',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/packs/js/runtime.js',
        expected: 'ru-hexlet-io-packs-js-runtime.js',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/courses/',
        expected: 'ru-hexlet-io-courses.html',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/courses/file-1.png?v=3',
        expected: 'ru-hexlet-io-courses-file-1.png',
        type: 'file'
    },
    {
        source: 'https://ru.hexlet.io/courses',
        expected: 'ru-hexlet-io-courses_files',
        type: 'folder'
    },
    {
        source: 'https://ru.hexlet.io/courses/',
        expected: 'ru-hexlet-io-courses_files',
        type: 'folder'
    }
]

test.each(cases)('test $source', ({ source, expected, type }) => {
    expect(buildName[type](source)).toBe(expected);
})