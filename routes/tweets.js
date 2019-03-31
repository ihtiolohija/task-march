const express = require('express');
const router = express.Router();
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
const async = require('async');

const fetchTweets = word =>{
    return new Promise((resolve, reject)=>{
        request(`https://api.datamuse.com/words?ml=${word}`, function (err, response, body) {
            if (err) return reject(err);
            try{
                resolve({word, result: JSON.parse(body)});
            }
            catch(e) {
                reject(e);
            }
        });
    });
};

const promiseAllFinished = arr=>{
    const resultArray = arr.map(el=>{
        return el.then(res=> {return {word: res.word, result: res.result}})
            .catch(err=> {
                //todo throw error
                console.log(err);
            });
    });

    return Promise.all(resultArray);
};

router.get('/fetch-tweets', function(req, res, next) {
    const tweetFetchArray = [fetchTweets('affiliate'), fetchTweets('influencer'), fetchTweets('marketing')];
    promiseAllFinished(tweetFetchArray).then(result=>{
        let db = new sqlite3.Database('test-task.db', (err)=>{
            if (err) {
                res.send('dddfsdf');
            }
            db.serialize(()=>{
                    async.each(result, (fetchElement, outerCallback)=>{
                        async.each(fetchElement.result, (el, callback) => {
                            db.run(`INSERT INTO ${fetchElement.word}(word, score, tags) VALUES (?,?,?)`,
                                [ el.word, el.score, el.tags.join(' ,') ], (err, data) => {
                                    if (err) return callback(err);
                                    callback();
                                });
                        }, outerCallback);
                    }, err=>{
                        db.close();
                        if (err){
                            return res.send('error');
                        }
                        res.send('success');
                    });
            });
        });
    });
});

router.get('/tweet-report', function(req, res, next) {
    let db = new sqlite3.Database('test-task.db', (err)=> {
        if (err) {
            res.send('dddfsdf');
        }
        const tables = ['affiliate', 'marketing', 'influencer'];
        db.serialize(() => {
            async.map(tables, (table, cb)=>{
                db.get(`SELECT count(*) FROM ${table};`, [],
                    (err, data) => {
                    if (err) return cb(err);
                    cb(null, {word: table, data: data['count(*)']});
                });
            }, (err, data)=>{
                db.close();
                if (err){
                    return res.send('error');
                }
                res.send({result: data});
            });
        });
    });
});


module.exports = router;
