public with sharing class InfiniteLoadController {
    @AuraEnabled(cacheable=true)
    public static List<Account> loadDataById(){
        return [SELECT Id, Name, Industry, Rating FROM Account
                ORDER BY Name, Id
                LIMIT 500];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> loadMoreData(String lastName, String lastId){
        return [
            SELECT Id, Name, Industry, Rating FROM Account
            WHERE (Name > :lastName) OR (Name = :lastName AND Id > :lastId)
            ORDER BY Name, Id
            LIMIT 500
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer countOfAccount(){
        AggregateResult agr = [SELECT Count(Id) recordCount from Account];
        return (Integer) agr.get('recordCount');
    }
}