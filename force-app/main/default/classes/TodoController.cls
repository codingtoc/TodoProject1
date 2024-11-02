public with sharing class TodoController {
  @AuraEnabled
  public static List<Task> getTodos() {
    try {
      return [
        SELECT Id, Subject, Status, ActivityDate
        FROM Task
        WHERE OwnerId = :UserInfo.getUserId()
        WITH SECURITY_ENFORCED
        ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
