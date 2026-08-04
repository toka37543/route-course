const events = require('node:events');
const fsPromise = require("node:fs/promises");

const emitter = new events.EventEmitter();

const listener = (...nums) => {
    console.log('Sum Event triggered - on', nums);
};

emitter.on('sumEvent-on', listener);
emitter.once('sumEvent-once', (...nums) => {
    console.log('Sum Event triggered - once', nums);
});

emitter.prependListener('sumEvent-prepend', (...nums) => {
    console.log('Sum Event triggered - prepend', nums);
});

emitter.on('sumEvent-prepend', (...nums) => {
    console.log('Sum Event triggered - prepend-on', nums);
});

emitter.emit('sumEvent-on', 1, 2, 5, 6);
emitter.emit('sumEvent-once', 1, 2, 5, 6);
emitter.emit('sumEvent-prepend', 1, 2, 5, 6);

console.log(emitter.eventNames())

// Remove listeners
emitter.removeListener('sumEvent-on', listener);
emitter.off('sumEvent-on', listener);
emitter.removeAllListeners();

console.log(emitter.eventNames());


//it is a new pakedge to make code asynch

try {
    await fsPromise.unlink(filePath);
    console.log("File deleted");
} catch (err) {
    console.log("File deleted");
}
