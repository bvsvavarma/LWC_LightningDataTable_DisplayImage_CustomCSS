import { LightningElement } from 'lwc';
import loadDataById from '@salesforce/apex/InfiniteLoadController.loadDataById';
import loadMoreData from '@salesforce/apex/InfiniteLoadController.loadMoreData';
import countOfAccount from '@salesforce/apex/InfiniteLoadController.countOfAccount';

const columns= [
    {label: 'Name', fieldName : 'Name'},
    {label: 'Industry', fieldName : 'Industry'},
    {label: 'Rating', fieldName : 'Rating'},
];

export default class InfineLoadingDataTable extends LightningElement {
    data = [];
    columns = columns;
    totalRecords = 0;
    recordsLoaded = 0;
    connectedCallback(){
       this.loadData();
    }

    async loadData(){
        try{
            this.totalRecords = await countOfAccount();
            this.data = await loadDataById();
            this.recordsLoaded = this.data.length;
        } catch(error){
            console.log("Error while loading", error);
        }
    }

    async loadMoreData(event){
        try{
            const {target} = event;
            target.isLoading = true;
            let currentRecords = this.data;
            let lastRecord = currentRecords[currentRecords.length -1];
            let newRecords = await loadMoreData({
                lastName : lastRecord.Name,
                lastId : lastRecord.Id
            });
            console.log("newRecords", newRecords);
            this.data = [...currentRecords, ...newRecords]; 
            console.log("data", this.data);
            target.isLoading = false;
            this.recordsLoaded = this.data.length;
        }catch(error){
            console.log("Error while loading", error);
        }
    }
}