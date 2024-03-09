
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
        this.ATTR_VAL__BLOCK_MINE_CLASSES = 'btn btn-light text-xs blockchain-block-mine';
        this.ATTR_VAL__BLOCK_MINE_CONTAINER_CLASSES = 'text-center mt-1';
        this.TXT__BLOCK_ID = 'Index id: ';
        this.TXT__BLOCK_NONCE = 'Nonce: ';
        this.TXT__BLOCK_DATA = 'Data: ';
        this.TXT__BLOCK_PREV_HASH = 'Prev Hash: ';
        this.TXT__BLOCK_HASH = 'Hash: ';
        this.TXT__BLOCK_TIMESTAMP = 'Created at: ';
        this.TXT__BLOCK_MINE = 'Mine';

        this.callback = null;

        //dom elements
        this.refershDomElements();

        this.btnMine.click(event => this.onMinBtnClicked(event));

        this.btnFetchBlockchain.click(() => {
            this.clear();
            this.getAll();
        });
    }

    refershDomElements() {
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
    }

    onMinBtnClicked(event) {
        console.log('Gathering input data...');
        let currBlockId = $(event.currentTarget).data('block-id');
        let currBlock = this.block.filter("[data-block-id='" + currBlockId + "']");
        let currNonce = currBlock.find('.blockchain-block-nonce');
        let currData = currBlock.find('.blockchain-block-data');
        let currPrevHash = currBlock.find('.blockchain-block-prevHash');
        let currHash = currBlock.find('.blockchain-block-hash');
        let currTimestamp = currBlock.find('.blockchain-block-timestamp');
        if(currBlockId == -1) {
            console.log('Start mining...');
            this.mine(currData.text());
        }
        else {
            console.log("Editing block...");
            console.log(currBlockId, currData.text());
            this.changeData(currBlockId, currData.text());
        }
    }

    mine(data) {
        console.log('Start mining...');
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
            this.onDataFetched();
            this.updateBlock(j.index, j.nonce, j.data, j.prevHash, j.hash, j.valid, j.created_AT);
        }).catch(err => {
            console.error('There was a problem with the mine() fetch operation:', err);
        });
    }

    changeData(index, data) {
        console.log("Editing block...");
        let postData = {
            index: index,
            data: data
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };
        let updateURL = this.blockchainAPIContext + 'update';
        console.log("Sending /POST request to Blockchain Simulator server...");
        console.log(postData);
        fetch(updateURL, options).then(response => {
            console.log('Response:', response);
            if(!response.ok)
                throw new Error('Network response was not ok. Status code: ', response.status);
            return response.json();
        }).then(b => {
            console.log(b);
            //this.callback(b);
            this.updateBlock(b.index, b.nonce, b.data, b.prevHash, b.hash, b.valid, b.created_AT);
        }).catch(err => {
            console.error('There was a problem with the update() fetch operation:', err);
        });
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
                this.updateBlock(list[i].index, list[i].nonce, list[i].data, list[i].prevHash, list[i].hash, list[i].valid, list[i].created_AT);
            this.onDataFetched();
        }).catch(err => {
            console.error('There was a problem with the getAll() fetch operation:', err);
        });
    }

    clear() {
        console.log("Clearing the blockchain from GUI");
        this.blockChain.empty();
        this.blockChain.append(this.inputBlock);
        this.btnMine.click(event => this.onMinBtnClicked(event));
        this.onDataFetched();
    }

    createBlock(id,nonce, data, prevHash, hash, isValid, timestamp) {
        console.log("Creating new block!");
        //create new block
        let newBlock = document.createElement('div');
        newBlock.setAttribute('class', this.ATTR_VAL__BLOCK_CLASSES + ((isValid) ? ' blockchain-block-valid' : ' blockchain-block-invalid'));
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
        let newBlockIdContent = document.createElement('span');
        newBlockIdContent.setAttribute('class', this.ATTR_VAL__BLOCK_ID_CLASSES);

        //create block id span
        let newBlockNonce = document.createElement('div');
        let newBlockNonceContent = document.createElement('span');
        newBlockNonceContent.setAttribute('class', this.ATTR_VAL__BLOCK_NONCE_CLASSES);

        //create block id span
        let newBlockData = document.createElement('div');
        let newBlockDataContent = document.createElement('span');
        newBlockDataContent.setAttribute('class', this.ATTR_VAL__BLOCK_DATA_CLASSES);
        newBlockDataContent.setAttribute('contenteditable', 'true');

        //create block id span
        let newBlockPrevHash = document.createElement('div');
        let newBlockPrevHashContent = document.createElement('span');
        newBlockPrevHashContent.setAttribute('class', this.ATTR_VAL__BLOCK_PREV_HASH_CLASSES);

        //create block id span
        let newBlockHash = document.createElement('div');
        let newBlockHashContent = document.createElement('span');
        newBlockHashContent.setAttribute('class', this.ATTR_VAL__BLOCK_ID_HASH_CLASSES);

        //create block id span
        let newBlockTimestamp = document.createElement('div');
        let newBlockTimestampContent = document.createElement('span');
        newBlockTimestampContent.setAttribute('class', this.ATTR_VAL__BLOCK_TIMESTAMP_CLASSES);

        //create edit button container
        let newBlockEditBtnContainer = document.createElement('div');
        newBlockEditBtnContainer.setAttribute('class', this.ATTR_VAL__BLOCK_MINE_CONTAINER_CLASSES);

        //create edit button
        let newBlockEditBtn = document.createElement('button');
        newBlockEditBtn.setAttribute('class', this.ATTR_VAL__BLOCK_MINE_CLASSES);
        newBlockEditBtn.setAttribute(this.ATTR__DATA_BLOCK_ID, id);

        //add before input block
        this.blockChain.get(0).insertBefore(newBlock, this.inputBlock.get(0));
        //add elements to block
        newBlock.appendChild(newBlockBody);
        newBlock.appendChild(newBlockEditBtnContainer);
        //add elements to block body
        newBlockBody.appendChild(newBlockContent1);
        newBlockBody.appendChild(newBlockContent2);
        newBlockBody.appendChild(newBlockContent3);

        //add elements to block content
        newBlockContent1.appendChild(newBlockId);
        newBlockContent1.appendChild(newBlockIdContent);
        newBlockContent1.appendChild(newBlockNonce);
        newBlockContent1.appendChild(newBlockNonceContent);
        newBlockContent2.appendChild(newBlockData);
        newBlockContent2.appendChild(newBlockDataContent);
        newBlockContent3.appendChild(newBlockPrevHash);
        newBlockContent3.appendChild(newBlockPrevHashContent);
        newBlockContent3.appendChild(newBlockHash);
        newBlockContent3.appendChild(newBlockHashContent);
        newBlockContent3.appendChild(newBlockTimestamp);
        newBlockContent3.appendChild(newBlockTimestampContent);
        newBlockEditBtnContainer.appendChild(newBlockEditBtn);

        //populate value in block fields
        newBlockId.innerHTML = '<b>' + this.TXT__BLOCK_ID + '</b>';
        newBlockIdContent.textContent = id;
        newBlockNonce.innerHTML = '<b>' + this.TXT__BLOCK_NONCE + '</b>';
        newBlockNonceContent.textContent = nonce;
        newBlockData.innerHTML = '<b>' + this.TXT__BLOCK_DATA + '</b>';
        newBlockDataContent.textContent = data;
        newBlockPrevHash.innerHTML = '<b>' + this.TXT__BLOCK_PREV_HASH + '</b>';
        newBlockPrevHashContent.textContent = prevHash;
        newBlockHash.innerHTML = '<b>' + this.TXT__BLOCK_HASH + '</b>';
        newBlockHashContent.textContent = hash;
        newBlockTimestamp.innerHTML = '<b>' + this.TXT__BLOCK_TIMESTAMP + '</b>';
        newBlockTimestampContent.textContent = timestamp;
        newBlockEditBtn.textContent = 'Edit';

        //add event listener to edit button
        newBlockEditBtn.addEventListener('click', (event) => this.onMinBtnClicked(event));
    }

    updateBlock(id, nonce, data, prevHash, hash, isValid, timestamp) {
        console.log("Finding block with id " + id + " to update.");
        let currBlock = this.block.filter("[data-block-id='" + id + "']");
        console.log(currBlock);
        if(currBlock == undefined || currBlock == null || currBlock.length === 0) {
            console.log("Can't find a block to update.");
            this.createBlock(id,nonce, data, prevHash, hash, isValid, timestamp);
        }
        else {
            console.log("Found block to update.");
            let currId = currBlock.find('.blockchain-block-id');
            let currNonce = currBlock.find('.blockchain-block-nonce');
            let currData = currBlock.find('.blockchain-block-data');
            let currPrevHash = currBlock.find('.blockchain-block-prevhash');
            let currHash = currBlock.find('.blockchain-block-hash');
            let currTimestamp = currBlock.find('.blockchain-block-timestamp');

            currId.text(id)
            currNonce.text(nonce)
            currData.text(data)
            currPrevHash.text(prevHash)
            currHash.text(hash)
            currTimestamp.text(timestamp)

            currBlock.addClass((isValid) ? ' blockchain-block-valid' : ' blockchain-block-invalid');
        }
    }

    onDataFetched() {
        this.refershDomElements();
    }

    setListener(listener) {
        this.callback = listener;
    }

}