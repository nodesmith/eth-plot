import { ActionTypes } from '../constants/ActionTypes';
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';
import * as Enums from '../constants/Enums';
import * as AccountActions from './AccountActions';
var Web3 = require('web3');
var hexy = require('hexy');
var PromisePool = require('es6-promise-pool');
export function addPlot(newPlot) {
    return {
        type: ActionTypes.ADD_PLOT,
        newPlot: newPlot
    };
}
export function loadPlots() {
    return {
        type: ActionTypes.LOAD_PLOTS
    };
}
export function listPlot() {
    return {
        type: ActionTypes.LIST_PLOT
    };
}
export function plotListed(txHash, zoneIndex) {
    return {
        type: ActionTypes.PLOT_LISTED,
        txHash: txHash,
        zoneIndex: zoneIndex
    };
}
export function doneLoadingPlots() {
    return {
        type: ActionTypes.LOAD_PLOTS_DONE
    };
}
export function initializeContract(contractInfo) {
    var web3 = getWeb3(contractInfo);
    var contract = web3.eth.contract(contractInfo.abi);
    var contractInstance = contract.at(contractInfo.contractAddress);
    return contractInstance;
}
export function determineTxStatus(tx) {
    // TODO couldn't find docs here for other types, this is fragile, doesn't have FAILED type yet.
    if (tx.type === 'mined') {
        return Enums.TxStatus.SUCCESS;
    }
    else {
        return Enums.TxStatus.PENDING;
    }
}
export function getWeb3(contractInfo) {
    var window;
    if (!window) {
        // This is only used to run the setup purchase scripts
        return new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
    }
    else if (typeof window.web3 !== 'undefined') {
        return window.web3;
    }
    else {
        throw 'no web3 provided';
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// This is gonna be a thunk action!
export function fetchPlotsFromWeb3(contractInfo) {
    return function (dispatch) {
        dispatch(loadPlots());
        // We need to get a handle to the actual instance of our running contract and figure out the current ownership info
        var contract = initializeContract(contractInfo);
        // First make a call to figure out the length of the ownership and data array to iterate through them
        return new Promise(function (resolve, reject) {
            contract.ownershipLength.call(function (error, ownershipLengthString) {
                if (error) {
                    return reject(error);
                }
                resolve(ownershipLengthString);
            });
        }).then(function (ownershipLengthString) {
            var ownershipLength = parseInt(ownershipLengthString);
            var currentIndex = 0;
            var ownershipLoadFn = function () {
                if (currentIndex >= ownershipLength) {
                    // We're done loading here
                    return null;
                }
                return new Promise(function (resolve, reject) {
                    // Call get plot which returns an array type object which we can get properties from
                    contract.getPlot.call(currentIndex, function (error, plotInfo) {
                        if (error)
                            reject(error);
                        var plot = {
                            rect: {
                                x: parseInt(plotInfo['0']),
                                y: parseInt(plotInfo['1']),
                                w: parseInt(plotInfo['2']),
                                h: parseInt(plotInfo['3']),
                                x2: 0,
                                y2: 0
                            },
                            owner: plotInfo['4'],
                            buyoutPrice: parseInt(plotInfo['5']),
                            data: {
                                url: plotInfo['6'],
                                ipfsHash: plotInfo['7']
                            },
                            color: getRandomColor(),
                            zoneIndex: currentIndex
                        };
                        plot.rect.x2 = plot.rect.x + plot.rect.w;
                        plot.rect.y2 = plot.rect.y + plot.rect.h;
                        dispatch(addPlot(plot));
                        currentIndex++;
                        resolve(plot);
                    });
                });
            };
            // Create a pool.
            var pool = new PromisePool(ownershipLoadFn, 1);
            // Start the pool. 
            return pool.start().then(function () {
                dispatch(doneLoadingPlots());
            });
        });
    };
}
// thunk for updating price of plot
export function updateAuction(contractInfo, zoneIndex, newPrice) {
    return function (dispatch) {
        var web3 = getWeb3(contractInfo);
        return new Promise(function (resolve, reject) {
            web3.eth.getCoinbase(function (error, coinbase) {
                if (error)
                    reject(error);
                resolve(coinbase);
            });
        }).then(function (coinbase) {
            var gasEstimate = 2000000;
            var contract = initializeContract(contractInfo);
            var param1 = zoneIndex;
            var param2 = newPrice;
            var param3 = false; // this flag indicates to smart contract that this is not a new purchase
            var txObject = {
                from: coinbase,
                gasPrice: '3000000000',
                gas: gasEstimate * 2
            };
            return new Promise(function (resolve, reject) {
                contract.updateAuction.sendTransaction(param1, param2, param3, txObject, function (error, transactionReceipt) {
                    if (error)
                        reject(error);
                    var txStatus = determineTxStatus(transactionReceipt);
                    dispatch(AccountActions.addTransaction(transactionReceipt, Enums.TxType.AUCTION, txStatus, Number.MAX_SAFE_INTEGER, true));
                    resolve(transactionReceipt);
                });
            });
        });
    };
}
// Converts a rect into the format that our contract is expecting
function buildArrayFromRectangles(rects) {
    var result = new Array();
    for (var _i = 0, rects_1 = rects; _i < rects_1.length; _i++) {
        var rect = rects_1[_i];
        result.push(rect.x);
        result.push(rect.y);
        result.push(rect.w);
        result.push(rect.h);
    }
    return result;
}
// This is the actual purchase function which will be a thunk
export function purchasePlot(contractInfo, plots, rectToPurchase, url, ipfsHash, changePurchaseStep) {
    return function (dispatch) {
        var purchaseInfo = computePurchaseInfo(rectToPurchase, plots);
        var web3 = getWeb3(contractInfo);
        dispatch(changePurchaseStep(Enums.PurchaseStage.WAITING_FOR_UNLOCK));
        return new Promise(function (resolve, reject) {
            web3.eth.getCoinbase(function (error, coinbase) {
                if (error)
                    reject(error);
                dispatch(changePurchaseStep(Enums.PurchaseStage.SUBMITTING_TO_BLOCKCHAIN));
                resolve(coinbase);
            });
        }).then(function (coinbase) {
            var contract = initializeContract(contractInfo);
            var param1 = buildArrayFromRectangles([rectToPurchase]);
            var param2 = buildArrayFromRectangles(purchaseInfo.chunksToPurchase);
            var param3 = purchaseInfo.chunksToPurchaseAreaIndices;
            var param4 = hexy.hexy(ipfsHash);
            var param5 = url;
            var param6 = 10;
            var gasEstimate = 2000000;
            var txObject = {
                from: coinbase,
                gasPrice: '3000000000',
                gas: gasEstimate * 2
            };
            return new Promise(function (resolve, reject) {
                contract.purchaseAreaWithData.sendTransaction(param1, param2, param3, param4, param5, param6, txObject, function (error, transactionReceipt) {
                    if (error)
                        reject(error);
                    var txStatus = determineTxStatus(transactionReceipt);
                    dispatch(AccountActions.addTransaction(transactionReceipt, Enums.TxType.PURCHASE, txStatus, Number.MAX_SAFE_INTEGER, true));
                    dispatch(changePurchaseStep(Enums.PurchaseStage.WAITING_FOR_CONFIRMATIONS));
                    // We need to update the ownership and data arrays with the newly purchased plot
                    var ownershipInfo = Object.assign({}, rectToPurchase);
                    // TODO - Lots of stuff
                    resolve(transactionReceipt);
                });
            });
        });
    };
}
//# sourceMappingURL=DataActions.js.map