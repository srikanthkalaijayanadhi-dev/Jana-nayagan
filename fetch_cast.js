const https = require('https');
const fs = require('fs');

const cast = [
    { name: 'Vijay', wikititle: 'Vijay_(actor)', role: 'IPS Thalapathy Vetri Kondan' },
    { name: 'Mamitha Baiju', wikititle: 'Mamitha_Baiju', role: 'Viji Srikanth' },
    { name: 'Pooja Hegde', wikititle: 'Pooja_Hegde', role: 'Kayal' },
    { name: 'Bobby Deol', wikititle: 'Bobby_Deol', role: '' },
    { name: 'Monisha Blessy', wikititle: 'Monisha_Blessy', role: '' },
    { name: 'Anirudh Ravichander', wikititle: 'Anirudh_Ravichander', role: '' },
    { name: 'Priyamani', wikititle: 'Priyamani', role: '' },
    { name: 'Atlee Kumar', wikititle: 'Atlee_(director)', role: '' },
    { name: 'Prakash Raj', wikititle: 'Prakash_Raj', role: '' },
    { name: 'Gautham Vasudev Menon', wikititle: 'Gautham_Vasudev_Menon', role: 'Srikanth' },
    { name: 'Shruti Haasan', wikititle: 'Shruti_Haasan', role: '' },
    { name: 'Teejay Arunasalam', wikititle: 'Teejay_Arunasalam', role: '' },
    { name: 'Nelson Dilipkumar', wikititle: 'Nelson_Dilipkumar', role: '' },
    { name: 'Nizhalgal Ravi', wikititle: 'Nizhalgal_Ravi', role: '' },
    { name: 'Narain', wikititle: 'Narain_(actor)', role: 'AI Humanoid scientist' },
    { name: 'Baba Baskar', wikititle: 'Baba_Baskar', role: '' },
    { name: 'Jaydeep Dabgar', wikititle: 'Jaydeep_Dabgar', role: '' }
];

async function fetchWiki(title) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'en.wikipedia.org',
            path: `/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|extracts&exintro&explaintext&pithumbsize=400&format=json`,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query.pages;
                    const page = Object.values(pages)[0];
                    let img = (page && page.thumbnail) ? page.thumbnail.source : '';
                    let extract = (page && page.extract) ? page.extract.split('\n')[0].substring(0, 80) + '...' : '';
                    resolve({ img, extract });
                } catch (e) {
                    resolve({ img: '', extract: '' });
                }
            });
        }).on('error', () => resolve({ img: '', extract: '' }));
    });
}

async function run() {
    const results = [];
    for (const actor of cast) {
        let { img, extract } = await fetchWiki(actor.wikititle);
        results.push({
            name: actor.name,
            role: actor.role || 'Supporting Role',
            img: img || '',
            extract: extract || 'A renowned actor.'
        });
    }
    fs.writeFileSync('cast_data.json', JSON.stringify(results, null, 2));
}
run();
