import { LightningElement, wire } from 'lwc';
import getContactListForDataTable from '@salesforce/apex/ContactController.getContactListForDataTable';

const columns = [
    { 
        label: 'Name', 
        type: 'customNameType',  
        typeAttributes: {
            contactName: {
                fieldName: 'Name'
            }
        }

    },
    { label: 'Title', fieldName: 'Title', 
         cellAttributes: {
            class: {
                fieldName: 'titleColor'
            }
         }
    },
    { 
        label: 'Account Name', 
        fieldName: 'accountLink',
        type: 'url',
        typeAttributes: { 
            label: { 
                fieldName: 'accountName' 
            }, 
            target: '_blank' //open record in separate tab
        }
    },
    { 
        label: 'Rank', 
        fieldName: 'Rank__c',
        type: 'customRank',
        typeAttributes: {
            rankIcon: {
                fieldName: 'rankIcon'
            }
        }
    },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    {   
        label: 'Picture', 
        type: 'customPicture',
        typeAttributes: {
            pictureUrl: {
                fieldName : 'Picture__c'
            }
        },
        cellAttributes : {
            alignment: 'center'
        }
    },
];

export default class LightningDataTableDisplayImageCustomCssLwc extends LightningElement {

    contacts;
    contact;
    columns = columns;
    @wire(getContactListForDataTable) wiredContact({data, error}){
        if(data){
            //this.contacts = data;
            this.contacts = data.map((currItem) => {
                let accountLink = "/" + currItem.AccountId;
                let accountName = currItem.Account.Name;
                let titleColor = "slds-text-color_success";
                let rankIcon = currItem.Rank__c > 5 ? "utility:ribbon" : "";
                return {
                    ...currItem,
                    accountLink : accountLink,
                    accountName : accountName,
                    titleColor: titleColor,
                    rankIcon: rankIcon
                };
            })
            //console.log("data", data);
            //console.log("contacts", this.contacts);
        }else if(error){
            console.log("error", error);
        }
    }
}