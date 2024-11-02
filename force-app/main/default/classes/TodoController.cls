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

  @AuraEnabled
  public static Task addTodo(
    String subject,
    Date activityDate,
    Boolean isCompleted
  ) {
    try {
      Task todo = new Task(
        Subject = subject,
        ActivityDate = activityDate,
        Status = isCompleted ? 'Completed' : 'Not Started',
        Priority = 'Normal',
        OwnerId = UserInfo.getUserId()
      );
      insert as user todo;
      return todo;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Task updateTodo(Task todo) {
    try {
      update as user todo;
      return todo;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
