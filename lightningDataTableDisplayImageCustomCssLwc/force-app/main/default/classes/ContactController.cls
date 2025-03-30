public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactListForDataTable(){
        List<Contact> contactList= [SELECT Id, Name, Title, Phone, Email, Picture__c, Rank__c, AccountId, Account.Name From Contact WHERE Rank__c != null];
        return contactList;
    }
}