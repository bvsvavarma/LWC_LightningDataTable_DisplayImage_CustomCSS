public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<ContactWrapper> getContactsBasedOnAccount(String accountId){
        List<Contact> conList =[SELECT 
                                Id, Name, FirstName, LastName, Title, Phone, Email, Picture__c, Rank__c, AccountId, Account.Name, LeadSource,
                                (SELECT Id from Cases)
                                FROM Contact
                                WHERE AccountId = :accountId
                                WITH USER_MODE
                                LIMIT 10
                               ];

        List<ContactWrapper> contactWrapper = new List<ContactWrapper>();

        for(Contact con : conList){
            ContactWrapper wrapper = new ContactWrapper();
            wrapper.Id = con.Id;
            wrapper.FirstName = con.FirstName;
            wrapper.LastName = con.LastName;
            wrapper.Phone = con.Phone;
            wrapper.Email = con.Email;
            wrapper.LeadSource = con.LeadSource;
            wrapper.numberOfCases = con.Cases.size();
            if(con.LeadSource == 'Phone Inquiry' && String.isBlank(con.Phone)){
                wrapper.isBadContact = true;
            } else{
                wrapper.isBadContact = false;
            }
            contactWrapper.add(wrapper);
        }                      
        return ContactWrapper;
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactListForDataTable(){
        List<Contact> contactList= [SELECT Id, Name, Title, Phone, Email, Picture__c, Rank__c, AccountId, Account.Name From Contact WHERE Rank__c != null];
        return contactList;
    }

    public class ContactWrapper{
        @AuraEnabled
        public String FirstName;
        @AuraEnabled
        public String LastName;
        @AuraEnabled
        public String Title;
        @AuraEnabled
        public String Email;
        @AuraEnabled
        public String Phone;
        @AuraEnabled
        public String LeadSource;
        @AuraEnabled
        public Integer numberOfCases;
        @AuraEnabled
        public Boolean isBadContact;
        @AuraEnabled
        public String Id;
    }
}