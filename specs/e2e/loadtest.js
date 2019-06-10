
const loadtest = require('loadtest');
const app = require('index')

let LAST_LATENCY;
function statusCallback(error, result, latency) {
    if (error) {
        return console.error(error)
    }
    LAST_LATENCY = latency
}
 
const baseOptions = {
    maxRequests: 1000,
    requestsPerSecond: 100,
    statusCallback: statusCallback,
    timeout: 5000,
    concurrency: 6
};


describe("Loadtest", function() {
    this.timeout(1000000)
    before(async () => {
        return app
    })
    
    after(async () => {
        app.then(({server, mongo}) => {
            server.close()
            mongo.close()
        })
    })


    it('perform a load test on `/playground/form`', async () => {
        return new Promise((resolve, reject) => {
            loadtest.loadTest({url: 'http://localhost:6767/playground/form', ...baseOptions}, function(error) {
                if (error) {
                    reject(error)
                }
                console.log(`
                ------------------------------------
                Total requests: ${LAST_LATENCY.totalRequests}
                RPS: ${LAST_LATENCY.rps}
                ====================================
                Total errors: ${LAST_LATENCY.totalErrors}
                Mean Latency: ${LAST_LATENCY.meanLatencyMs}ms
                Max Latency: ${LAST_LATENCY.maxLatencyMs}ms
                Min Latency: ${LAST_LATENCY.minLatencyMs}ms
                ====================================
                `)
                resolve(true)
                setTimeout(()=>{
                    process.exit()
                },100)
            });
        })
    })

})
 
