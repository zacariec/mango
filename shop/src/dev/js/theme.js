

function wow() {
    return console.log('wow');
}

const somePromise = new Promise((resolve, reject) => {
    resolve(console.log('wow'));
});

somePromise;

wow();