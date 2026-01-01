import fs from 'node:fs';

async function getBalance(): Promise<number> {
    // TODO: change fs.readFileSync() to fs.promises.readFile()
    //       then make the rest of the code work using promises
    const data: string = await fs.promises.readFile('savings', { encoding: 'utf-8' });
    return parseInt(data);
}

async function main(): Promise<void> {
    console.log('you have', await getBalance(), 'dollars in your savings account');
}

main();
