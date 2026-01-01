
/**
 * @param url URL to download
 * @returns promise of the URL's page content
 * @throws Error (in a rejected promise) if download fails because of a network error
 */
async function download(url: string): Promise<string> {
    console.log(url, 'started');
    const response: Response = await fetch(url);
    console.log(url, 'connected');
    const page: string = await response.text();
    console.log(url, 'fetched');
    return page;
}


const urls = [
    'http://student.mit.edu/catalog/m6a.html',
    'http://student.mit.edu/catalog/m6b.html',
    'http://student.mit.edu/catalog/m6c.html'
];

// TODO: refactor this code so that the page downloads interleave
//  ** change only the code below, don't change download() **
console.time('downloading');
let text = '';
const pages : Array<string> = await Promise.all(urls.map(url => download(url)));
for (const page of pages) {
    text += page;
}
console.log(text.split('\n').length, 'lines total');
console.timeEnd('downloading');
