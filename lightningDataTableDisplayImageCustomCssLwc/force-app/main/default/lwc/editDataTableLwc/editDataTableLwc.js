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
const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true},
    { 
        label: 'Lead Source', 
        fieldName: 'LeadSource', 
        type: 'customPickList', 
        editable: true,
        typeAttributes : {
            options: {fieldName : 'pickListOptions'},
            value: {fieldName : 'LeadSource'},
            context: {fieldName : 'Id'},
        }
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
            console.log("contact data", this.contactData);
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
        debugger;
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
}