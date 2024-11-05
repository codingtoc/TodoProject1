public with sharing class TodoController {
  @AuraEnabled
  public static List<Task> getTodos(String searchText, String status) {
    try {
      if (String.isEmpty(searchText)) {
        if (status == 'All') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE OwnerId = :UserInfo.getUserId()
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        } else if (status == 'Open') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE OwnerId = :UserInfo.getUserId() AND Status != 'Completed'
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        } else if (status == 'Completed') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE OwnerId = :UserInfo.getUserId() AND Status = 'Completed'
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        }
      } else {
        searchText = '%' + searchText + '%';
        if (status == 'All') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE OwnerId = :UserInfo.getUserId() AND Subject LIKE :searchText
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        } else if (status == 'Open') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE
              OwnerId = :UserInfo.getUserId()
              AND Status != 'Completed'
              AND Subject LIKE :searchText
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        } else if (status == 'Completed') {
          return [
            SELECT Id, Subject, Status, ActivityDate
            FROM Task
            WHERE
              OwnerId = :UserInfo.getUserId()
              AND Status = 'Completed'
              AND Subject LIKE :searchText
            WITH SECURITY_ENFORCED
            ORDER BY ActivityDate DESC NULLS LAST, CreatedDate DESC
          ];
        }
      }
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return null;
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
      System.debug(e.getMessage());
    }
    return null;
  }

  @AuraEnabled
  public static Task updateTodo(Task todo) {
    try {
      update as user todo;
      return todo;
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return null;
  }

  @AuraEnabled
  public static Boolean deleteTodo(Id recordId) {
    try {
      Database.delete(recordId, AccessLevel.USER_MODE);
      return true;
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return false;
  }
}
