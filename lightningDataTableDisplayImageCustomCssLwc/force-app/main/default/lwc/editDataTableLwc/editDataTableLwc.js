import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import getContactsBasedOnAccount from '@salesforce/apex/ContactController.getContactsBasedOnAccount';

const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true},
   
];

export default class EditDataTableLwc extends LightningElement {
    @api recordId;
    contactData = [];
    columns = columns;
    draftValues=[];
    contactRefreshProp;

    @wire(getContactsBasedOnAccount, {
        accountId :  '$recordId'
    }) getContactsoutput(result){
        this.contactRefreshProp = result;
        if(result.data){
            this.contactData = result.data;
            console.log("contact data", this.contactData);
        }else if(result.error){
            console.log("Error while Loading Records", result.error);
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
}