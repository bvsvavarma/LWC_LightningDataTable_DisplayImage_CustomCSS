import { LightningElement, api, wire } from 'lwc';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LEAD_SOURCE from '@salesforce/schema/Contact.LeadSource';
import getContactsBasedOnAccount from '@salesforce/apex/ContactController.getContactsBasedOnAccount';
import IsDisplayed from '@salesforce/schema/CalendarView.IsDisplayed';

const actions = [ 
                    {label:'View', name : 'view'},
                    {label:'Edit', name : 'edit'},
                    {label:'Delete', name : 'delete'}
                ];

const DEFAULT_ACTION = [ 
                    {label:'All', checked: true, name : 'all'}
                ];

const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable: true, hideDefaultActions: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true, hideDefaultActions: true },
    { label: 'Title', fieldName: 'Title', editable: true, hideDefaultActions: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true, hideDefaultActions: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true, hideDefaultActions: true},
    { 
        label: 'Lead Source', 
        fieldName: 'LeadSource', 
        type: 'customPickList', 
        editable: true,
        typeAttributes : {
            options: {fieldName : 'pickListOptions'},
            value: {fieldName : 'LeadSource'},
            context: {fieldName : 'Id'},
        },
        hideDefaultActions: true,
        actions: DEFAULT_ACTION
    },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];

export default class EditDataTableLwc extends LightningElement {
    @api recordId;
    contactData = [];
    columns = columns;
    draftValues=[];
    contactRefreshProp;
    leadSourceOptions = [];
    viewMode = false;
    editMode = false;
    showModal = false;
    selectedRecordId;
    loadActionCompleted= false;
    loadSourceActions;
    contactAllData = [];
    @wire(getContactsBasedOnAccount, {
        accountId :  '$recordId',
        pickList : '$leadSourceOptions'
    }) getContactsOutput(result){
        this.contactRefreshProp = result;
        if(result.data){
            //this.contactData = result.data;
            this.contactData = result.data.map((currItem) =>{
                console.log("currItem", currItem);
                let pickListOptions = this.leadSourceOptions;
                return {
                    ...currItem,
                    pickListOptions: pickListOptions
                };
            });
            this.contactAllData = [...this.contactData];
        }else if(result.error){
            console.log("Error while Loading Records", result.error);
        }
    }

    @wire(getObjectInfo, { 
        objectApiName: CONTACT_OBJECT 
    }) objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: LEAD_SOURCE
    }) wirePickList({data,error}){
        if(data){
            this.leadSourceOptions = data.values;
             this.loadSourceActions = [];
             data.values.forEach((currItem) => {
                this.loadSourceActions.push({
                    label: currItem.label,
                    checked: false,
                    name: currItem.name
                });
            });
            this.columns.forEach((currItem) => {
                if(currItem.fieldName === 'LeadSource'){
                    currItem.actions = [...currItem.actions, ...this.leadSourceOptions];
                }
            });
            this.loadActionCompleted = true;
        }else if(error){
            console.log("Error While Loading Data", error);
        }
    }

    async saveHandler(event){
        //updateRecord or Apex class
        //Access the draft values
        let records =  event.detail.draftValues; //array of modified records
        console.log("draft Values:", records);
        let updateRecordsArray = records.map((currItem) => {
            let fieldInput = { ...currItem};
            return {
                fields: fieldInput
            };
        });
        
        this.draftValues = [];
        let updatedRecordsArrayPromise = updateRecordsArray.map((currItem) => 
                                            updateRecord(currItem)
                                        );
        await Promise.all(updatedRecordsArrayPromise);

       
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message:
                    'Records Updated Successfully.',
                variant : "Success"
            });
            this.dispatchEvent(toastEvent);

            await refreshApex(this.contactRefreshProp);
    }
    rowActionHandler(event){
        let action = event.detail.action;
        let row = event.detail.row;
        this.selectedRecordId = row.Id;
        console.log("selectedRecordId",this.selectedRecordId);
        this.viewMode = false;
        this.editMode = false;
        this.showModal = false;

        if(action.name === 'view'){
            this.viewMode = true;
            this.showModal = true;
        }else if(action.name === 'edit'){
            this.editMode = true;
            this.showModal = true;
        }else if(action.name === 'delete'){
            this.deleteHandler();
        }
    }

    async deleteHandler(){
        //deleteRecordAdapter or Apex class
        await deleteRecord(this.selectedRecordId);
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message:
                'Records Deleted Successfully.',
            variant : "Success"
        });
        this.dispatchEvent(toastEvent);

        await refreshApex(this.contactRefreshProp);
    }
    async closeModal(event){
        this.showModal = false; 
        if(this.editMode){
            await refreshApex(this.contactRefreshProp);
        }
    }

    handleHeaderAction(event){
        debugger;
          // Retrieves the name of the selected filter
        const detail = event.detail;
        const action = event.detail.action;
        let actionName = action.name;
        // Retrieves the current column definition
        // based on the selected filter
        const colDef = event.detail.columnDefinition;
        const cols = this.columns;

        console.log("action", action);
        console.log("actionName", actionName);
        console.log("colDef", colDef);
        console.log("cols", cols);
        
        /*if(actionName === 'all'){
            this.contactData = this.contactAllData;
        }else{
            this.contactAllData.filter((currItem) => {
                actionName === currItem["LeadSource"]
            })
        }
        cols
            .find((currItem) => (currItem.fieldName === "LeadSource")
            .actions.forEach((currItem) => {
                if(currItem.name === actionName){
                    currItem.checked = true;
                }
            })
        );
        this.columns = [...cols];*/
    }

    get displayData(){
        if(this.contactData && this.loadActionCompleted === true){
            return true;
        } else{
            return false;
        }
    }
}