
'use strict';

class BlockchainSimulator {

    constructor() {
        this.blockchainAPIContext = 'http://localhost:8103/blockchainsimulator/';

        this.spanId = $('.blockchain-block-id');
        this.spanNonce = $('.blockchain-block-nonce');
        this.spanData = $('.blockchain-block-data');
        this.spanPrevHash = $('.blockchain-block-prevhash');
        this.spanHash = $('.blockchain-block-hash');
        this.spanTimestamp = $('.blockchain-block-timestamp');
        this.btnMine = $('.blockchain-block-mine');

        this.btnMine.click(() => {
            console.log('Start mining...');
            if(this.blockInputValid()) {
                console.log("Inputs are valid!");
                this.mine(this.spanData.text());
            }
            else {
                console.log("Inputs are not valid!");
            }
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
        console.log("Sending request to Blockchain Simulator server...");
        console.log(postData);
        fetch(mineURL, options).then(response => {
            console.log('Response:', response);
            if(!response.ok)
                throw new Error('Network response was not ok. Status code: ', response.status);
            return response.json();
        }).then(j => {
            console.log(j);
            this.updateCurrentBlock(j.index, j.nonce, j.data, j.prevHash, j.hash, j.created_AT);
        }).catch(err => {
            console.error('There was a problem with the fetch operation:', err);
        });
    }

    changeData(index, data) {

    }

    getAll() {

    }

    blockInputValid() {
        if(this.spanId == undefined || this.spanNonce == undefined || this.spanData == undefined || 
            this.spanPrevHash == undefined || this.spanHash == undefined || this.spanTimestamp == undefined)
            return false;
        let id = this.spanId.text();
        let nonce = this.spanNonce.text();
        let data = this.spanData.text();
        let prevHash = this.spanPrevHash.text();
        return !(id.length == 0 || id === '' || nonce.length == 0 || nonce === '' || data.length == 0 ||
        data === '' || prevHash.length == 0 || prevHash === '');
    }

    updateCurrentBlock(id, nonce, data, prevHash, hash, timestamp) {
        this.spanId.text(id);
        this.spanNonce.text(nonce);
        this.spanData.text(data);
        this.spanPrevHash.text(prevHash);
        this.spanHash.text(hash);
        this.spanTimestamp.text(timestamp);
    }

}