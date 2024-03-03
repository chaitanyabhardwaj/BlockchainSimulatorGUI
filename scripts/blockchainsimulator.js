
'use strict';

class BlockchainSimulator {

    constructor() {
        this.blockchainAPIContext = 'http://localhost:8103/blockchainsimulator/';

        //constants
        this.ATTR__DATA_BLOCK_ID = 'data-block-id';
        this.ATTR_VAL__BLOCK_CLASSES = 'blockchain-block card text-xs d-inline-block';
        this.ATTR_VAL__BLOCK_BODY_CLASSES = 'blockchain-block-body';
        this.ATTR_VAL__BLOCK_CONTENT_CLASSES = 'blockchain-block-content';
        this.ATTR_VAL__BLOCK_ID_CLASSES = 'blockchain-block-id';
        this.ATTR_VAL__BLOCK_NONCE_CLASSES = 'blockchain-block-nonce';
        this.ATTR_VAL__BLOCK_DATA_CLASSES = 'blockchain-block-data';
        this.ATTR_VAL__BLOCK_PREV_HASH_CLASSES = 'blockchain-block-prevhash';
        this.ATTR_VAL__BLOCK_ID_HASH_CLASSES = 'blockchain-block-hash';
        this.ATTR_VAL__BLOCK_TIMESTAMP_CLASSES = 'blockchain-block-timestamp';
        this.ATTR_VAL__BLOCK_MINE_CLASSES = 'blockchain-block-mine';
        this.TXT__BLOCK_ID = 'Index id: ';
        this.TXT__BLOCK_NONCE = 'Nonce: ';
        this.TXT__BLOCK_DATA = 'Data: ';
        this.TXT__BLOCK_PREV_HASH = 'Prev Hash: ';
        this.TXT__BLOCK_HASH = 'Hash: ';
        this.TXT__BLOCK_TIMESTAMP = 'Created at: ';
        this.TXT__BLOCK_MINE = 'Mine';

        this.callback = null;

        //dom elements
        this.inputBlock = $('#blockchain-block-inputblock');
        this.blockChain = $('.blockchain-chain');
        this.block = $('.blockchain-block');
        this.spanId = $('.blockchain-block-id');
        this.spanNonce = $('.blockchain-block-nonce');
        this.spanData = $('.blockchain-block-data');
        this.spanPrevHash = $('.blockchain-block-prevhash');
        this.spanHash = $('.blockchain-block-hash');
        this.spanTimestamp = $('.blockchain-block-timestamp');
        this.btnMine = $('.blockchain-block-mine');
        this.btnFetchBlockchain = $('.blockchain-getall');

        this.btnMine.click(event => {
            console.log('Gathering input data...');
            let currBlockId = $(event.currentTarget).data('block-id');
            let currBlock = this.block.filter("[data-block-id='" + currBlockId + "']");
            let currNonce = currBlock.find('.blockchain-block-nonce');
            let currData = currBlock.find('.blockchain-block-data');
            let currPrevHash = currBlock.find('.blockchain-block-prevHash');
            let currHash = currBlock.find('.blockchain-block-hash');
            let currTimestamp = currBlock.find('.blockchain-block-timestamp');
            console.log('Start mining...');
            this.mine(currData.text());
        });

        this.btnFetchBlockchain.click(() => {
            this.clear();
            this.getAll();
        });

    }

    mine(data) {
        console.log('Start mining...2');
        let postData = {
            data: data
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };
        let mineURL = this.blockchainAPIContext + 'mine';
        console.log("Sending /POST request to Blockchain Simulator server...");
        console.log(postData);
        fetch(mineURL, options).then(response => {
            console.log('Response:', response);
            if(!response.ok)
                throw new Error('Network response was not ok. Status code: ', response.status);
            return response.json();
        }).then(d => {
            //console.log(d);
            let j = d.block;
            this.callback(d);
            this.updateBlock(j.index, j.nonce, j.data, j.prevHash, j.hash, j.created_AT);
        }).catch(err => {
            console.error('There was a problem with the mine() fetch operation:', err);
        });
    }

    changeData(index, data) {

    }

    getAll() {
        console.log("Get all blocks in the blockchain.");
        let getAllURL = this.blockchainAPIContext + "getall";
        console.log("Sending /GET requrest to Blockchain Simulator");
        fetch(getAllURL, {method: 'GET'}).then(response => {
            console.log('Response: ', response);
            if(!response.ok)
                throw new Error('Network response was not ok. Status code: ', response.status);
            return response.json();
        }).then(list => {
            console.log(list);
            this.callback(list);
            for(let i = 0; i < list.length; i++)
                this.updateBlock(list[i].index, list[i].nonce, list[i].data, list[i].prevHash, list[i].hash, list[i].created_AT);
        }).catch(err => {
            console.error('There was a problem with the getAll() fetch operation:', err);
        });
    }

    clear() {
        console.log("Clearing the blockchain from GUI");
        this.blockChain.empty();
        this.blockChain.append(this.inputBlock);
        this.btnMine.click(event => {
            console.log('Gathering input data...');
            let currBlockId = $(event.currentTarget).data('block-id');
            let currBlock = this.block.filter("[data-block-id='" + currBlockId + "']");
            let currNonce = currBlock.find('.blockchain-block-nonce');
            let currData = currBlock.find('.blockchain-block-data');
            let currPrevHash = currBlock.find('.blockchain-block-prevHash');
            let currHash = currBlock.find('.blockchain-block-hash');
            let currTimestamp = currBlock.find('.blockchain-block-timestamp');
            console.log('Start mining...');
            this.mine(currData.text());
        });
    }

    createBlock(id,nonce, data, prevHash, hash, timestamp) {
        console.log("Creating new block!");
        //create new block
        let newBlock = document.createElement('div');
        newBlock.setAttribute('class', this.ATTR_VAL__BLOCK_CLASSES);
        newBlock.setAttribute(this.ATTR__DATA_BLOCK_ID, id);

        //create block body
        let newBlockBody = document.createElement('div');
        newBlockBody.setAttribute('class', this.ATTR_VAL__BLOCK_BODY_CLASSES);

        //create block content 1
        let newBlockContent1 = document.createElement('div');
        newBlockContent1.setAttribute('class', this.ATTR_VAL__BLOCK_CONTENT_CLASSES);

        //create block content 2
        let newBlockContent2 = document.createElement('div');
        newBlockContent2.setAttribute('class', this.ATTR_VAL__BLOCK_CONTENT_CLASSES);

        //create block content 3
        let newBlockContent3 = document.createElement('div');
        newBlockContent3.setAttribute('class', this.ATTR_VAL__BLOCK_CONTENT_CLASSES);

        //create block id span
        let newBlockId = document.createElement('div');
        newBlockId.setAttribute('class', this.ATTR_VAL__BLOCK_ID_CLASSES);

        //create block id span
        let newBlockNonce = document.createElement('div');
        newBlockNonce.setAttribute('class', this.ATTR_VAL__BLOCK_NONCE_CLASSES);

        //create block id span
        let newBlockData = document.createElement('div');
        newBlockData.setAttribute('class', this.ATTR_VAL__BLOCK_DATA_CLASSES);

        //create block id span
        let newBlockPrevHash = document.createElement('div');
        newBlockPrevHash.setAttribute('class', this.ATTR_VAL__BLOCK_PREV_HASH_CLASSES);

        //create block id span
        let newBlockHash = document.createElement('div');
        newBlockHash.setAttribute('class', this.ATTR_VAL__BLOCK_ID_HASH_CLASSES);

        //create block id span
        let newBlockTimestamp = document.createElement('div');
        newBlockTimestamp.setAttribute('class', this.ATTR_VAL__BLOCK_TIMESTAMP_CLASSES);

        //add before input block
        this.blockChain.get(0).insertBefore(newBlock, this.inputBlock.get(0));
        //add elements to block
        newBlock.appendChild(newBlockBody);
        //add elements to block body
        newBlockBody.appendChild(newBlockContent1);
        newBlockBody.appendChild(newBlockContent2);
        newBlockBody.appendChild(newBlockContent3);

        //add elements to block content
        newBlockContent1.appendChild(newBlockId);
        newBlockContent1.appendChild(newBlockNonce);
        newBlockContent2.appendChild(newBlockData);
        newBlockContent3.appendChild(newBlockPrevHash);
        newBlockContent3.appendChild(newBlockHash);
        newBlockContent3.appendChild(newBlockTimestamp);

        //populate value in block fields
        newBlockId.innerHTML = '<b>' + this.TXT__BLOCK_ID + '</b>' + id;
        newBlockNonce.innerHTML = '<b>' + this.TXT__BLOCK_NONCE + '</b>' + nonce;
        newBlockData.innerHTML = '<b>' + this.TXT__BLOCK_DATA + '</b>' + data;
        newBlockPrevHash.innerHTML = '<b>' + this.TXT__BLOCK_PREV_HASH + '</b>' + prevHash;
        newBlockHash.innerHTML = '<b>' + this.TXT__BLOCK_HASH + '</b>' + hash;
        newBlockTimestamp.innerHTML = '<b>' + this.TXT__BLOCK_TIMESTAMP + '</b>' + timestamp;
    }

    updateBlock(id, nonce, data, prevHash, hash, timestamp) {
        console.log("Finding block with id " + id + " to update.");
        let currBlock = this.block.filter("[data-block-id='" + id + "']");
        console.log(currBlock);
        if(currBlock == undefined || currBlock == null || currBlock.length === 0) {
            console.log("Can't find a block to update.");
            this.createBlock(id,nonce, data, prevHash, hash, timestamp);
        }
        else {
            console.log("Found block to update.");
            let currNonce = currBlock.find('.blockchain-block-nonce');
            let currData = currBlock.find('.blockchain-block-data');
            let currPrevHash = currBlock.find('.blockchain-block-prevHash');
            let currHash = currBlock.find('.blockchain-block-hash');
            let currTimestamp = currBlock.find('.blockchain-block-timestamp');
        }
    }

    setListener(listener) {
        this.callback = listener;
    }

}